"""Brightloop backend - REST API (Flask + SQLite).
Run: pip install flask && python app.py   -> http://127.0.0.1:5000  (also serves ../frontend)
"""
import sqlite3, calendar, os
from datetime import date, timedelta
from flask import Flask, g, request, jsonify, send_from_directory

FRONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")
app = Flask(__name__, static_folder=None)
DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "brightloop.db")
TAX_RATE = 0.18

SCHEMA = """
CREATE TABLE IF NOT EXISTS plans(
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, product TEXT, price REAL NOT NULL,
 period TEXT NOT NULL CHECK(period IN('daily','weekly','monthly','yearly')),
 min_qty INTEGER DEFAULT 1, start_date TEXT, end_date TEXT,
 auto_close INTEGER DEFAULT 0, allow_pause INTEGER DEFAULT 1,
 allow_close INTEGER DEFAULT 1, allow_renew INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS subscriptions(
 id INTEGER PRIMARY KEY, number TEXT UNIQUE, customer TEXT NOT NULL,
 plan_id INTEGER REFERENCES plans(id), qty INTEGER DEFAULT 1,
 start_date TEXT, expiry_date TEXT, next_billing TEXT,
 payment_terms TEXT DEFAULT 'Net 15', discount_pct REAL DEFAULT 0,
 status TEXT DEFAULT 'Draft'
   CHECK(status IN('Draft','Quotation','Confirmed','Active','Paused','Closed')));
CREATE TABLE IF NOT EXISTS invoices(
 id INTEGER PRIMARY KEY, number TEXT UNIQUE, sub_id INTEGER REFERENCES subscriptions(id),
 period_start TEXT, period_end TEXT, subtotal REAL, discount REAL, tax REAL, total REAL,
 due_date TEXT, status TEXT DEFAULT 'Draft'
   CHECK(status IN('Draft','Confirmed','Paid','Cancelled')),
 UNIQUE(sub_id, period_start));
CREATE TABLE IF NOT EXISTS payments(
 id INTEGER PRIMARY KEY, invoice_id INTEGER REFERENCES invoices(id),
 method TEXT, amount REAL, paid_on TEXT, note TEXT);
CREATE INDEX IF NOT EXISTS ix_sub_next ON subscriptions(status, next_billing);
CREATE INDEX IF NOT EXISTS ix_inv_status ON invoices(status, due_date);
"""

def db():
    if "db" not in g:
        g.db = sqlite3.connect(DB); g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close(_):
    d = g.pop("db", None)
    if d: d.close()

def init():
    c = sqlite3.connect(DB); c.executescript(SCHEMA); c.commit(); c.close()

def rows(sql, *a): return [dict(r) for r in db().execute(sql, a).fetchall()]
def err(msg, code=400): return jsonify(error=msg), code
def today(): return date.today()

def add_period(d, period, n=1):
    if period == "daily":  return d + timedelta(days=n)
    if period == "weekly": return d + timedelta(weeks=n)
    months = n if period == "monthly" else 12 * n
    m = d.month - 1 + months
    y, m = d.year + m // 12, m % 12 + 1
    return date(y, m, min(d.day, calendar.monthrange(y, m)[1]))

# ---------------- business logic ----------------
def generate_invoices(run_date=None):
    run_date = run_date or today()
    d = db(); created = closed = 0
    subs = d.execute("""SELECT s.*, p.price, p.period, p.auto_close FROM subscriptions s
        JOIN plans p ON p.id=s.plan_id
        WHERE s.status='Active' AND s.next_billing<=?""", (run_date.isoformat(),)).fetchall()
    for s in subs:
        nb = date.fromisoformat(s["next_billing"])
        while nb <= run_date:
            if s["expiry_date"] and nb > date.fromisoformat(s["expiry_date"]):
                if s["auto_close"]:
                    d.execute("UPDATE subscriptions SET status='Closed' WHERE id=?", (s["id"],)); closed += 1
                break
            end = add_period(nb, s["period"])
            sub = s["price"] * s["qty"]
            disc = round(sub * s["discount_pct"] / 100, 2)
            tax = round((sub - disc) * TAX_RATE, 2)
            term = int("".join(c for c in s["payment_terms"] if c.isdigit()) or 0)
            cur = d.execute("""INSERT OR IGNORE INTO invoices
              (sub_id,period_start,period_end,subtotal,discount,tax,total,due_date)
              VALUES(?,?,?,?,?,?,?,?)""",
              (s["id"], nb.isoformat(), end.isoformat(), sub, disc, tax,
               round(sub - disc + tax, 2), (nb + timedelta(days=term)).isoformat()))
            if cur.rowcount:
                d.execute("UPDATE invoices SET number=? WHERE id=?", (f"INV/{nb.year}/{cur.lastrowid:05d}", cur.lastrowid))
                created += 1
            nb = end
            d.execute("UPDATE subscriptions SET next_billing=? WHERE id=?", (nb.isoformat(), s["id"]))
    d.commit()
    return created, closed

# ---------------- API ----------------
@app.get("/api/dashboard")
def dashboard():
    d = db(); t = today().isoformat()
    q = lambda sql, *a: d.execute(sql, a).fetchone()[0] or 0
    return jsonify(
        active=q("SELECT COUNT(*) FROM subscriptions WHERE status='Active'"),
        mrr=round(q("""SELECT SUM(CASE p.period WHEN 'daily' THEN p.price*30 WHEN 'weekly' THEN p.price*4.33
             WHEN 'yearly' THEN p.price/12.0 ELSE p.price END * s.qty) FROM subscriptions s
             JOIN plans p ON p.id=s.plan_id WHERE s.status='Active'"""), 2),
        collected=q("SELECT SUM(amount) FROM payments"),
        outstanding=q("SELECT SUM(total) FROM invoices WHERE status='Confirmed'"),
        overdue_count=q("SELECT COUNT(*) FROM invoices WHERE status='Confirmed' AND due_date<?", t),
        overdue=rows("""SELECT i.*, s.customer FROM invoices i JOIN subscriptions s ON s.id=i.sub_id
             WHERE i.status='Confirmed' AND i.due_date<? ORDER BY i.due_date LIMIT 20""", t))

@app.get("/api/plans")
def list_plans(): return jsonify(rows("SELECT * FROM plans ORDER BY id DESC"))

@app.post("/api/plans")
def create_plan():
    f = request.get_json(force=True)
    if not f.get("name") or float(f.get("price", 0)) <= 0: return err("Name and positive price required")
    if f.get("period") not in ("daily", "weekly", "monthly", "yearly"): return err("Invalid billing period")
    d = db()
    cur = d.execute("""INSERT INTO plans(name,product,price,period,min_qty,start_date,end_date,auto_close,allow_pause,allow_close,allow_renew)
      VALUES(?,?,?,?,?,?,?,?,?,?,?)""", (f["name"], f.get("product", ""), float(f["price"]), f["period"],
      int(f.get("min_qty") or 1), f.get("start_date"), f.get("end_date"),
      int(bool(f.get("auto_close"))), int(bool(f.get("allow_pause", True))),
      int(bool(f.get("allow_close", True))), int(bool(f.get("allow_renew", True)))))
    d.commit(); return jsonify(id=cur.lastrowid), 201

@app.get("/api/subscriptions")
def list_subs():
    return jsonify(rows("""SELECT s.*, p.name plan_name FROM subscriptions s JOIN plans p ON p.id=s.plan_id
                           ORDER BY s.id DESC LIMIT 200"""))

@app.post("/api/subscriptions")
def create_sub():
    f = request.get_json(force=True); d = db()
    p = d.execute("SELECT * FROM plans WHERE id=?", (f.get("plan_id"),)).fetchone()
    if not p: return err("Plan not found", 404)
    qty = int(f.get("qty") or 1)
    if qty < p["min_qty"]: return err(f"Minimum quantity for this plan is {p['min_qty']}")
    if not f.get("customer"): return err("Customer required")
    start = date.fromisoformat(f.get("start_date") or today().isoformat())
    cur = d.execute("""INSERT INTO subscriptions(customer,plan_id,qty,start_date,expiry_date,next_billing,payment_terms,discount_pct)
       VALUES(?,?,?,?,?,?,?,?)""", (f["customer"], p["id"], qty, start.isoformat(),
       add_period(start, "yearly").isoformat(), start.isoformat(),
       f.get("payment_terms", "Net 15"), float(f.get("discount_pct") or 0)))
    d.execute("UPDATE subscriptions SET number=? WHERE id=?", (f"SUB{cur.lastrowid:05d}", cur.lastrowid))
    d.commit(); return jsonify(id=cur.lastrowid), 201

@app.post("/api/subscriptions/<int:i>/status")
def sub_status(i):
    st = request.get_json(force=True).get("status"); d = db()
    p = d.execute("SELECT p.* FROM plans p JOIN subscriptions s ON s.plan_id=p.id WHERE s.id=?", (i,)).fetchone()
    if not p: return err("Not found", 404)
    if st not in ("Draft", "Quotation", "Confirmed", "Active", "Paused", "Closed"): return err("Invalid status")
    if st == "Paused" and not p["allow_pause"]: return err("This plan cannot be paused")
    if st == "Closed" and not p["allow_close"]: return err("This plan cannot be closed early")
    d.execute("UPDATE subscriptions SET status=? WHERE id=?", (st, i)); d.commit()
    return jsonify(ok=True)

@app.post("/api/subscriptions/<int:i>/renew")
def sub_renew(i):
    d = db()
    s = d.execute("""SELECT s.*, p.allow_renew FROM subscriptions s JOIN plans p ON p.id=s.plan_id
                     WHERE s.id=?""", (i,)).fetchone()
    if not s: return err("Not found", 404)
    if not s["allow_renew"]: return err("Plan does not allow renewal")
    base = max(date.fromisoformat(s["expiry_date"]), today())
    d.execute("UPDATE subscriptions SET expiry_date=?, status='Active' WHERE id=?",
              (add_period(base, "yearly").isoformat(), i))
    d.commit(); return jsonify(ok=True)

@app.post("/api/billing/run")
def billing_run():
    c, x = generate_invoices(); return jsonify(created=c, closed=x)

@app.get("/api/invoices")
def list_invoices():
    st = request.args.get("status", ""); t = today().isoformat()
    sql = "SELECT i.*, s.customer FROM invoices i JOIN subscriptions s ON s.id=i.sub_id"
    args = ()
    if st == "Overdue": sql += " WHERE i.status='Confirmed' AND i.due_date<?"; args = (t,)
    elif st: sql += " WHERE i.status=?"; args = (st,)
    return jsonify(rows(sql + " ORDER BY i.id DESC LIMIT 300", *args))

@app.get("/api/invoices/<int:i>")
def get_invoice(i):
    r = rows("""SELECT i.*, s.customer, s.number sub_no FROM invoices i
                JOIN subscriptions s ON s.id=i.sub_id WHERE i.id=?""", i)
    if not r: return err("Not found", 404)
    r[0]["payments"] = rows("SELECT * FROM payments WHERE invoice_id=?", i)
    return jsonify(r[0])

@app.post("/api/invoices/<int:i>/status")
def inv_status(i):
    st = request.get_json(force=True).get("status")
    allowed = {"Confirmed": ("Draft",), "Cancelled": ("Draft", "Confirmed")}
    d = db(); cur = d.execute("SELECT status FROM invoices WHERE id=?", (i,)).fetchone()
    if not cur: return err("Not found", 404)
    if st not in allowed or cur["status"] not in allowed[st]: return err("Invalid status transition")
    d.execute("UPDATE invoices SET status=? WHERE id=?", (st, i)); d.commit()
    return jsonify(ok=True)

@app.post("/api/invoices/<int:i>/payments")
def add_payment(i):
    f = request.get_json(force=True); d = db()
    inv = d.execute("SELECT * FROM invoices WHERE id=?", (i,)).fetchone()
    if not inv: return err("Not found", 404)
    if inv["status"] != "Confirmed": return err("Only confirmed invoices can receive payments")
    amt = float(f.get("amount") or 0)
    if amt <= 0: return err("Amount must be positive")
    d.execute("INSERT INTO payments(invoice_id,method,amount,paid_on,note) VALUES(?,?,?,?,?)",
              (i, f.get("method", "UPI"), amt, f.get("paid_on") or today().isoformat(), f.get("note", "")))
    paid = d.execute("SELECT SUM(amount) FROM payments WHERE invoice_id=?", (i,)).fetchone()[0]
    if paid >= inv["total"] - 0.005:
        d.execute("UPDATE invoices SET status='Paid' WHERE id=?", (i,))
    d.commit(); return jsonify(ok=True), 201

# ---------------- serve frontend ----------------
@app.get("/")
def index(): return send_from_directory(FRONT, "index.html")

init()
if __name__ == "__main__":
    app.run(debug=True)
