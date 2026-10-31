// Customer & Payment module. Shares the starter app's localStorage data key.
const $=id=>document.getElementById(id), KEY="subscriptly-data";
const today=()=>new Date().toISOString().slice(0,10);
const sample={products:[{id:1,name:"Business Software",type:"Software",price:999}],plans:[{id:1,name:"Pro Monthly",productId:1,price:999,cycle:"Monthly"}],subscriptions:[{id:1,customer:"Rahul Sharma",email:"rahul@example.com",planId:1,start:today(),status:"Active",amount:999}],invoices:[{id:1,subscriptionId:1,customer:"Rahul Sharma",date:today(),amount:999,status:"Pending"}],payments:[]};
let data;try{data=JSON.parse(localStorage.getItem(KEY))||sample}catch{data=sample}
let email="",invoiceToPay=null;
const money=n=>"₹"+Number(n||0).toLocaleString("en-IN"),code=(p,n)=>p+"-"+String(n).padStart(3,"0");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function subs(){return data.subscriptions.filter(s=>s.email.toLowerCase()===email.toLowerCase())}
function invs(){let ids=subs().map(s=>s.id);return data.invoices.filter(i=>ids.includes(Number(i.subscriptionId)))}
function pays(){let ids=invs().map(i=>i.id);return data.payments.filter(p=>ids.includes(Number(p.invoiceId)))}
function plan(s){return data.plans.find(p=>p.id===Number(s?.planId))}
function renew(s){if(!s)return "—";let d=new Date((s.start||today())+"T12:00:00"),c=(plan(s)?.cycle||"Monthly").toLowerCase();if(c==="yearly")d.setFullYear(d.getFullYear()+1);else if(c==="weekly")d.setDate(d.getDate()+7);else if(c==="daily")d.setDate(d.getDate()+1);else d.setMonth(d.getMonth()+1);return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
function go(tab){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab));$(tab).classList.add("active");$("title").textContent=({overview:"Customer overview",profile:"My profile",subscription:"My subscription",invoices:"My invoices",payments:"Payment history"})[tab]}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.tab));
function render(){
 let people=[...new Map(data.subscriptions.map(s=>[s.email.toLowerCase(),{email:s.email,name:s.customer}])).values()];
 if(!people.length){$("customer").innerHTML="<option>No customers available</option>";return}
 if(!people.some(p=>p.email.toLowerCase()===email.toLowerCase()))email=people[0].email;
 $("customer").innerHTML=people.map(p=>`<option value="${esc(p.email)}">${esc(p.name)} (${esc(p.email)})</option>`).join("");$("customer").value=email;
 let s=subs().slice().sort((a,b)=>b.id-a.id)[0],p=plan(s),all=invs(),payments=pays(),name=s.customer,first=name.trim()[0]||"C",due=all.filter(i=>i.status!=="Paid").reduce((a,i)=>a+i.amount,0);
 $("header-name").textContent=name;$("welcome").textContent=name.split(" ")[0];$("current-plan").textContent=p?.name||"No plan";$("cycle").textContent=p?"Billed "+p.cycle.toLowerCase():"";
 $("sub-status").textContent=s.status;$("due").textContent=money(due);$("sum-name").textContent=name;$("sum-email").textContent=s.email;$("sum-sub").textContent=code("SUB",s.id);$("sum-renewal").textContent=renew(s);
 $("avatar").textContent=first;$("profile-name").textContent=name;$("profile-email").textContent=s.email;$("detail-name").textContent=name;$("detail-email").textContent=s.email;$("detail-id").textContent=code("CUS",s.id);
 $("plan-name").textContent=p?.name||"No plan";$("product-name").textContent=data.products.find(x=>x.id===Number(p?.productId))?.name||"Product";$("plan-price").textContent=money(s.amount);$("plan-status").textContent=s.status;$("plan-id").textContent=code("SUB",s.id);$("plan-start").textContent=s.start;$("plan-cycle").textContent=p?.cycle||"—";$("plan-renewal").textContent=renew(s);
 const invoiceRows=all.map(i=>`<tr><td>${code("INV",i.id)}</td><td>${esc(i.date)}</td><td>${money(i.amount)}</td><td><span class="status ${i.status==="Paid"?"paid":"pending"}">${esc(i.status)}</span></td><td>${i.status==="Paid"?"—":`<button class="pay" data-pay="${i.id}">Pay now</button>`}</td></tr>`).join("")||'<tr><td colspan="5" class="empty">No invoices found.</td></tr>';
 $("invoice-list").innerHTML=invoiceRows;$("recent-invoices").innerHTML=all.slice(-4).reverse().map(i=>`<tr><td>${code("INV",i.id)}</td><td>${esc(i.date)}</td><td>${money(i.amount)}</td><td><span class="status ${i.status==="Paid"?"paid":"pending"}">${esc(i.status)}</span></td></tr>`).join("")||'<tr><td colspan="4" class="empty">No invoices found.</td></tr>';
 $("payment-list").innerHTML=payments.map(x=>`<tr><td>${code("PAY",x.id)}</td><td>${code("INV",x.invoiceId)}</td><td>${esc(x.date)}</td><td>${esc(x.method)}</td><td>${money(x.amount)}</td><td><span class="status paid">Success</span></td></tr>`).join("")||'<tr><td colspan="6" class="empty">No payments recorded yet.</td></tr>';
 document.querySelectorAll("[data-pay]").forEach(b=>b.onclick=()=>openPayment(Number(b.dataset.pay)));
}
function openPayment(id){let i=invs().find(x=>x.id===id);if(!i||i.status==="Paid")return;invoiceToPay=id;$("amount").textContent=money(i.amount);$("modal").classList.add("open")}
function closeModal(){$("modal").classList.remove("open");invoiceToPay=null}
$("customer").onchange=e=>{email=e.target.value;render()};
$("close").onclick=closeModal;$("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
$("confirm").onclick=()=>{let i=invs().find(x=>x.id===invoiceToPay);if(!i||i.status==="Paid"){closeModal();return}let id=data.payments.length?Math.max(...data.payments.map(p=>p.id))+1:1;data.payments.push({id,invoiceId:i.id,method:$("method").value,date:today(),amount:Number(i.amount)});i.status="Paid";localStorage.setItem(KEY,JSON.stringify(data));closeModal();render();toast("Demo payment successful. Invoice marked Paid.")};
render();
