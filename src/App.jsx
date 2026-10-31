import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  TrendingUp,
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Download,
  Edit,
  Trash2,
  IndianRupee,
  UserCheck,
  UserMinus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Key,
  Webhook,
  CreditCard,
  X,
  Check,
  RefreshCw,
  Mail,
  ChevronRight,
  Eye,
  Sliders,
  Copy,
  SlidersHorizontal,
  Sparkles,
  QrCode
} from 'lucide-react';

// --- INITIAL MOCK DATA (PRICES IN INDIAN RUPEES - ₹) ---
const INITIAL_PLANS = [
  {
    id: 'p1',
    name: 'Starter Tier',
    code: 'starter',
    priceMonthly: 499,
    priceYearly: 4999,
    trialDays: 14,
    status: 'Active',
    subscribersCount: 1420,
    features: ['Up to 5 Users', 'Basic Analytics', 'Email Support', '10GB Storage', 'GST Compliance'],
    badge: 'Popular for Beginners'
  },
  {
    id: 'p2',
    name: 'Professional Pro',
    code: 'pro',
    priceMonthly: 1999,
    priceYearly: 19990,
    trialDays: 7,
    status: 'Active',
    subscribersCount: 3890,
    features: ['Unlimited Users', 'Advanced Analytics', '24/7 Priority Support', '100GB Storage', 'Custom Razorpay Webhooks', 'Automated GST Invoices'],
    badge: 'Most Popular'
  },
  {
    id: 'p3',
    name: 'Enterprise Ultra',
    code: 'enterprise',
    priceMonthly: 7999,
    priceYearly: 79990,
    trialDays: 0,
    status: 'Active',
    subscribersCount: 424,
    features: ['Dedicated Account Manager', 'Custom SLA', 'Unlimited Storage', 'White-labeling', 'SAML SSO Integration', 'Dedicated Account Executive'],
    badge: 'Custom Terms'
  },
  {
    id: 'p4',
    name: 'Basic Micro',
    code: 'micro',
    priceMonthly: 199,
    priceYearly: 1990,
    trialDays: 0,
    status: 'Archived',
    subscribersCount: 85,
    features: ['Single User', 'Community Support', '1GB Storage'],
    badge: 'Archived'
  }
];

const INITIAL_SUBSCRIBERS = [
  {
    id: 'sub-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techcorp.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    planId: 'p2',
    planName: 'Professional Pro',
    billingCycle: 'Monthly',
    status: 'Active',
    amount: 1999,
    startDate: '2024-01-15',
    nextBilling: '2026-11-15',
    paymentMethod: 'UPI (aarav@okaxis)'
  },
  {
    id: 'sub-102',
    name: 'Priya Patel',
    email: 'priya@designhub.co.in',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    planId: 'p3',
    planName: 'Enterprise Ultra',
    billingCycle: 'Yearly',
    status: 'Active',
    amount: 79990,
    startDate: '2023-11-01',
    nextBilling: '2026-11-01',
    paymentMethod: 'HDFC Corporate Card •••• 8892'
  },
  {
    id: 'sub-103',
    name: 'Rohan Mehta',
    email: 'rohan.m@cloudscale.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    planId: 'p1',
    planName: 'Starter Tier',
    billingCycle: 'Monthly',
    status: 'Past Due',
    amount: 499,
    startDate: '2024-04-10',
    nextBilling: '2026-10-10',
    paymentMethod: 'ICICI NetBanking'
  },
  {
    id: 'sub-104',
    name: 'Neha Verma',
    email: 'neha@growthlabs.org',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    planId: 'p2',
    planName: 'Professional Pro',
    billingCycle: 'Monthly',
    status: 'Canceled',
    amount: 1999,
    startDate: '2023-08-20',
    nextBilling: 'N/A',
    paymentMethod: 'Razorpay Autopay'
  },
  {
    id: 'sub-105',
    name: 'Vikram Malhotra',
    email: 'v.malhotra@fintech.net',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    planId: 'p3',
    planName: 'Enterprise Ultra',
    billingCycle: 'Monthly',
    status: 'Active',
    amount: 7999,
    startDate: '2024-02-01',
    nextBilling: '2026-11-01',
    paymentMethod: 'Visa Debit •••• 3001'
  },
  {
    id: 'sub-106',
    name: 'Ananya Roy',
    email: 'ananya@creatives.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    planId: 'p1',
    planName: 'Starter Tier',
    billingCycle: 'Yearly',
    status: 'Active',
    amount: 4999,
    startDate: '2024-06-18',
    nextBilling: '2027-06-18',
    paymentMethod: 'Paytm UPI'
  }
];

const INITIAL_INVOICES = [
  { id: 'INV-2026-001', customer: 'Aarav Sharma', email: 'aarav.sharma@techcorp.in', plan: 'Professional Pro', baseAmount: 1999, status: 'Paid', date: '2026-10-15', dueDate: '2026-10-15', gstin: '07AAAAA0000A1Z5' },
  { id: 'INV-2026-002', customer: 'Priya Patel', email: 'priya@designhub.co.in', plan: 'Enterprise Ultra', baseAmount: 79990, status: 'Paid', date: '2026-10-01', dueDate: '2026-10-01', gstin: '27BBBMP1234C1Z2' },
  { id: 'INV-2026-003', customer: 'Rohan Mehta', email: 'rohan.m@cloudscale.in', plan: 'Starter Tier', baseAmount: 499, status: 'Failed', date: '2026-10-10', dueDate: '2026-10-10', gstin: '29AAACH7412E1Z8' },
  { id: 'INV-2026-004', customer: 'Vikram Malhotra', email: 'v.malhotra@fintech.net', plan: 'Enterprise Ultra', baseAmount: 7999, status: 'Paid', date: '2026-10-01', dueDate: '2026-10-01', gstin: '09AAACG1122F1Z1' },
  { id: 'INV-2026-005', customer: 'Ananya Roy', email: 'ananya@creatives.in', plan: 'Starter Tier', baseAmount: 4999, status: 'Paid', date: '2026-06-18', dueDate: '2026-06-18', gstin: '19AAACB9988G1Z4' },
  { id: 'INV-2026-006', customer: 'Karan Joshi', email: 'karan@nextgen.in', plan: 'Professional Pro', baseAmount: 1999, status: 'Unpaid', date: '2026-10-28', dueDate: '2026-11-05', gstin: '33AAAAB5544H1Z0' },
  { id: 'INV-2026-007', customer: 'Sanya Gupta', email: 'sanya@pixelperfect.in', plan: 'Starter Tier', baseAmount: 499, status: 'Refunded', date: '2026-09-12', dueDate: '2026-09-12', gstin: '06AAAAA1111I1Z9' }
];

export default function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic Data State
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);

  // Modals & Active Selections
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [invoicePreview, setInvoicePreview] = useState(null);

  // Filter States
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState('All');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');

  // Settings State
  const [gatewaySettings, setGatewaySettings] = useState({
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_live_K8901238910IN',
    razorpayKeySecret: 'rzp_sec_998120391203_IND',
    stripeEnabled: true,
    stripePublishableKey: 'pk_live_51Nx902X88123901923019238',
    stripeSecretKey: 'sk_live_51Nx902X88123901923019238_SEC',
    webhookUrl: 'https://api.yourbrand.in/v1/webhooks/razorpay',
    currency: 'INR (₹)',
    gstPercentage: '18'
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);

  // Helper function for INR formatting
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper for formatting lakhs and crores
  const formatLakhs = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return formatINR(val);
  };

  // Trigger Toast Notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Computations
  const stats = useMemo(() => {
    const totalRevenueMRR = subscribers
      .filter((s) => s.status === 'Active')
      .reduce((sum, s) => {
        const monthlyVal = s.billingCycle === 'Yearly' ? Math.round(s.amount / 12) : s.amount;
        return sum + monthlyVal;
      }, 0);

    const activeSubs = subscribers.filter((s) => s.status === 'Active').length;
    const canceledSubs = subscribers.filter((s) => s.status === 'Canceled').length;
    const pastDueSubs = subscribers.filter((s) => s.status === 'Past Due').length;
    const churnRate = subscribers.length ? ((canceledSubs / subscribers.length) * 100).toFixed(1) : 0;

    return {
      mrr: totalRevenueMRR,
      arr: totalRevenueMRR * 12,
      activeSubs,
      churnRate,
      pastDueSubs,
      pendingInvoicesCount: invoices.filter((i) => i.status === 'Unpaid' || i.status === 'Failed').length
    };
  }, [subscribers, invoices]);

  // Handle Save Plan (Add or Edit)
  const handleSavePlan = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const planData = {
      id: editingPlan ? editingPlan.id : `p-${Date.now()}`,
      name: formData.get('name'),
      code: formData.get('code') || formData.get('name').toLowerCase().replace(/\s+/g, '-'),
      priceMonthly: Number(formData.get('priceMonthly')),
      priceYearly: Number(formData.get('priceYearly')),
      trialDays: Number(formData.get('trialDays')),
      status: formData.get('status'),
      subscribersCount: editingPlan ? editingPlan.subscribersCount : 0,
      badge: formData.get('badge') || 'Standard',
      features: formData
        .get('features')
        .split('\n')
        .filter((f) => f.trim() !== '')
    };

    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === editingPlan.id ? planData : p)));
      showToast(`Plan "${planData.name}" update ho gaya!`);
    } else {
      setPlans([...plans, planData]);
      showToast(`Naya Plan "${planData.name}" create ho gaya!`);
    }
    setIsPlanModalOpen(false);
    setEditingPlan(null);
  };

  // Handle Subscriber Status Actions
  const handleUpdateSubscriberStatus = (subId, newStatus) => {
    setSubscribers(
      subscribers.map((s) => {
        if (s.id === subId) {
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
    showToast(`Subscriber status ko "${newStatus}" par set kiya gaya`);
    if (selectedSubscriber) {
      setSelectedSubscriber((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Test Webhook Simulation
  const handleTestWebhook = () => {
    setPingStatus('pinging');
    setTimeout(() => {
      setPingStatus('success');
      showToast('Razorpay Webhook Ping Succeeded: HTTP 200 OK (payment.captured)');
    }, 1200);
  };

  // Filtered Lists
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
      sub.email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
      sub.planName.toLowerCase().includes(subscriberSearch.toLowerCase());
    const matchesStatus = subscriberStatusFilter === 'All' || sub.status === subscriberStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.customer.toLowerCase().includes(globalSearch.toLowerCase()) ||
      inv.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      inv.email.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 flex flex-col md:flex-row`}>
      {/* --- TOAST ALERT --- */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-500/30 animate-bounce">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } border-r flex flex-col justify-between transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } transition-transform duration-200 ease-in-out`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-inherit">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 font-bold text-lg">
                ₹
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight leading-none bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                  SubScribeOS
                </h1>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">India Admin Panel</span>
              </div>
            </div>
            <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'plans', label: 'Plans & Pricing (₹)', icon: Package, badge: plans.length },
              { id: 'subscribers', label: 'Subscribers', icon: Users, badge: subscribers.length },
              { id: 'invoices', label: 'Invoices & GST Billing', icon: Receipt },
              { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Razorpay / Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : darkMode
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${isActive
                        ? 'bg-indigo-700 text-indigo-100'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-200 text-slate-600'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-inherit">
          <div className={`p-3 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin User"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Vikramaditya (Super Admin)</p>
              <p className="text-[11px] text-slate-400 truncate">admin@subscribeos.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN MAIN WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* --- HEADER --- */}
        <header
          className={`h-16 px-4 md:px-8 border-b flex items-center justify-between sticky top-0 z-30 ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'
            } backdrop-blur-md`}
        >
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Global Search */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subscribers, GST details, invoices..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border outline-none transition ${darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                  }`}
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition ${darkMode
                ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800'
                : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationCount(0);
                  showToast('Sabhi notifications update ho gaye!');
                }}
                className={`p-2 rounded-xl border transition ${darkMode
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Add Plan Quick Action */}
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsPlanModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Naya Plan</span>
            </button>
          </div>
        </header>

        {/* --- DYNAMIC CONTENT BODY --- */}
        <main className="p-4 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Top Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Subscription Command Center (India)</h2>
                  <p className="text-indigo-200 text-sm mt-1">
                    Real-time recurring revenue, UPI autopay telemetry, and active tier distribution across India.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Reports
                  </button>
                </div>
              </div>

              {/* KPI Stat Cards (PRICES IN INR ₹) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Monthly Recurring (MRR)',
                    value: formatLakhs(stats.mrr),
                    change: '+14.2%',
                    isPositive: true,
                    subtext: `ARR: ${formatLakhs(stats.arr)}`,
                    icon: IndianRupee,
                    color: 'indigo'
                  },
                  {
                    title: 'Active Subscribers',
                    value: stats.activeSubs.toLocaleString('en-IN'),
                    change: '+9.4%',
                    isPositive: true,
                    subtext: `${subscribers.length} total customer profiles`,
                    icon: UserCheck,
                    color: 'emerald'
                  },
                  {
                    title: 'User Churn Rate',
                    value: `${stats.churnRate}%`,
                    change: '-0.3%',
                    isPositive: true,
                    subtext: 'Target churn is < 2.5%',
                    icon: UserMinus,
                    color: 'rose'
                  },
                  {
                    title: 'Pending Invoices',
                    value: stats.pendingInvoicesCount.toString(),
                    change: stats.pendingInvoicesCount > 0 ? 'Requires Action' : 'All Clear',
                    isPositive: stats.pendingInvoicesCount === 0,
                    subtext: `${formatINR(invoices.filter((i) => i.status === 'Unpaid').reduce((acc, i) => acc + i.baseAmount, 0))} uncollected`,
                    icon: Clock,
                    color: 'amber'
                  }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition hover:shadow-lg ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {card.title}
                        </span>
                        <div className={`p-2 rounded-xl bg-${card.color}-500/10 text-${card.color}-500`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-2xl font-bold tracking-tight">{card.value}</span>
                        <span
                          className={`text-xs font-bold flex items-center gap-0.5 ${card.isPositive ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                        >
                          {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {card.change}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
                    </div>
                  );
                })}
              </div>

              {/* Graphical Overview & Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Revenue Growth Chart */}
                <div
                  className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-base">Monthly Revenue Trend (MRR in ₹)</h3>
                      <p className="text-xs text-slate-400">Recorded performance over the last 6 months</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +22.4% YoY Growth
                    </span>
                  </div>

                  {/* Clean SVG Area Chart */}
                  <div className="h-64 w-full relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke={darkMode ? '#334155' : '#e2e8f0'} strokeDasharray="4" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke={darkMode ? '#334155' : '#e2e8f0'} strokeDasharray="4" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke={darkMode ? '#334155' : '#e2e8f0'} strokeDasharray="4" />

                      {/* Area Fill */}
                      <path
                        d="M 0,120 Q 80,110 160,85 T 320,55 T 500,20 L 500,140 L 0,140 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Line */}
                      <path
                        d="M 0,120 Q 80,110 160,85 T 320,55 T 500,20"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data Dots */}
                      {[
                        { x: 0, y: 120 },
                        { x: 100, y: 105 },
                        { x: 200, y: 78 },
                        { x: 300, y: 60 },
                        { x: 400, y: 38 },
                        { x: 500, y: 20 }
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill="#6366f1" className="hover:r-7 transition-all cursor-pointer" />
                          <circle cx={pt.x} cy={pt.y} r="2" fill="#ffffff" />
                        </g>
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-4 px-1 font-medium">
                    <span>May (₹28L)</span>
                    <span>Jun (₹35L)</span>
                    <span>Jul (₹48L)</span>
                    <span>Aug (₹62L)</span>
                    <span>Sep (₹78L)</span>
                    <span>Oct (Current ₹92.5L)</span>
                  </div>
                </div>

                {/* Plan Distribution Breakdown */}
                <div
                  className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="font-bold text-base mb-1">Plan Distribution</h3>
                    <p className="text-xs text-slate-400 mb-6">Subscriber percentage per tier</p>

                    <div className="space-y-4">
                      {plans.map((p) => {
                        const totalSubs = plans.reduce((acc, curr) => acc + curr.subscribersCount, 0);
                        const percentage = totalSubs > 0 ? Math.round((p.subscribersCount / totalSubs) * 100) : 0;
                        return (
                          <div key={p.id} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{p.name}</span>
                              <span className="text-slate-400">
                                {p.subscribersCount.toLocaleString('en-IN')} ({percentage}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-xl text-xs ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'} border border-inherit`}>
                    <div className="flex items-center gap-2 font-semibold text-indigo-400 mb-1">
                      <Sparkles className="w-4 h-4" /> AI Revenue Suggestion
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      UPI Autopay has 94% successful renewal rate compared to 78% on credit cards. Promote UPI Auto-Debit on checkout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Transactions Table Preview */}
              <div
                className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Recent Payment Transactions (₹)</h3>
                    <p className="text-xs text-slate-400">Real-time payment logs & GST tax invoices</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b text-xs text-slate-400 uppercase tracking-wider ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <th className="py-3 px-4">Invoice ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Plan Tier</th>
                        <th className="py-3 px-4">Total (Inc. GST)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {invoices.slice(0, 5).map((inv) => {
                        const totalWithGST = inv.baseAmount * 1.18;
                        return (
                          <tr key={inv.id} className="hover:bg-slate-500/5 transition">
                            <td className="py-3 px-4 font-mono text-xs font-semibold">{inv.id}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-xs">{inv.customer}</p>
                                <p className="text-[11px] text-slate-400">{inv.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs">{inv.plan}</td>
                            <td className="py-3 px-4 font-semibold text-xs">{formatINR(totalWithGST)}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${inv.status === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : inv.status === 'Failed'
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : 'bg-amber-500/10 text-amber-500'
                                  }`}
                              >
                                {inv.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                                {inv.status === 'Failed' && <XCircle className="w-3 h-3" />}
                                {inv.status === 'Unpaid' && <Clock className="w-3 h-3" />}
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setInvoicePreview(inv)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="View GST Invoice"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLAN MANAGEMENT (CRUD) */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Subscription Plans & Pricing (₹)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Create and edit plans with monthly/yearly pricing in INR with customized features.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingPlan(null);
                    setIsPlanModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 self-start transition"
                >
                  <Plus className="w-4 h-4" /> Create New Plan
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between relative transition hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      } ${plan.status === 'Archived' ? 'opacity-60' : ''}`}
                  >
                    {plan.badge && (
                      <span className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">Slug: {plan.code}</p>

                      <div className="my-5">
                        <span className="text-3xl font-extrabold">{formatINR(plan.priceMonthly)}</span>
                        <span className="text-xs text-slate-400"> / month</span>
                        <p className="text-xs text-emerald-500 font-medium mt-1">
                          Annual plan at {formatINR(plan.priceYearly)}/yr (Save 17%)
                        </p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan Features:</p>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-inherit space-y-3">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Free Trial Period:</span>
                        <span className="font-medium text-slate-200">{plan.trialDays} Days</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Active Members:</span>
                        <span className="font-semibold text-indigo-400">{plan.subscribersCount.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsPlanModalOpen(true);
                          }}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold border border-inherit hover:bg-slate-500/10 transition flex items-center justify-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Plan
                        </button>
                        <button
                          onClick={() => {
                            setPlans(plans.filter((p) => p.id !== plan.id));
                            showToast(`Plan "${plan.name}" delete kar diya gaya.`);
                          }}
                          className="p-2 rounded-xl text-xs font-semibold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIBERS MANAGEMENT */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Subscriber Directory</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage Indian subscribers, active plans, billing modes (UPI/Cards), and upgrades.
                  </p>
                </div>
              </div>

              {/* Filters Bar */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
              >
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, plan..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Filter Status:
                  </span>
                  {['All', 'Active', 'Past Due', 'Canceled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSubscriberStatusFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition ${subscriberStatusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscribers Table */}
              <div
                className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b text-xs text-slate-400 uppercase tracking-wider ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <th className="py-3.5 px-4">Subscriber</th>
                        <th className="py-3.5 px-4">Plan Tier</th>
                        <th className="py-3.5 px-4">Payment Method</th>
                        <th className="py-3.5 px-4">Next Renewal</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-500/5 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={sub.avatar} alt={sub.name} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-semibold text-xs">{sub.name}</p>
                                <p className="text-[11px] text-slate-400">{sub.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-medium">{sub.planName}</span>
                            <span className="block text-[10px] text-slate-400">{formatINR(sub.amount)} / {sub.billingCycle}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-mono">{sub.paymentMethod}</td>
                          <td className="py-3.5 px-4 text-xs font-mono">{sub.nextBilling}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sub.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : sub.status === 'Past Due'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-rose-500/10 text-rose-500'
                                }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedSubscriber(sub)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-inherit hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              Details & Plan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVOICES & BILLING */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">GST Tax Invoices & Billing Log</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate & download GST compliant tax invoices with 18% GST (CGST + SGST / IGST).
                  </p>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['All', 'Paid', 'Unpaid', 'Failed', 'Refunded'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInvoiceStatusFilter(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${invoiceStatusFilter === st
                      ? 'bg-indigo-600 text-white shadow-md'
                      : darkMode
                        ? 'bg-slate-900 text-slate-400 hover:text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {st} Invoices
                  </button>
                ))}
              </div>

              {/* Invoice List */}
              <div
                className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`border-b text-xs text-slate-400 uppercase tracking-wider ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <th className="py-3.5 px-4">Invoice #</th>
                        <th className="py-3.5 px-4">Billed To (Customer)</th>
                        <th className="py-3.5 px-4">Base Amount</th>
                        <th className="py-3.5 px-4">18% GST</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">GST PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {filteredInvoices.map((inv) => {
                        const gstVal = inv.baseAmount * 0.18;
                        const totalVal = inv.baseAmount * 1.18;
                        return (
                          <tr key={inv.id} className="hover:bg-slate-500/5 transition">
                            <td className="py-3.5 px-4 font-mono text-xs font-semibold">{inv.id}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-xs">{inv.customer}</p>
                              <p className="text-[11px] text-slate-400">GSTIN: {inv.gstin}</p>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-mono">{formatINR(inv.baseAmount)}</td>
                            <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{formatINR(gstVal)}</td>
                            <td className="py-3.5 px-4 font-bold text-xs">{formatINR(totalVal)}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${inv.status === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : inv.status === 'Failed'
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : inv.status === 'Unpaid'
                                      ? 'bg-amber-500/10 text-amber-500'
                                      : 'bg-slate-500/10 text-slate-400'
                                  }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setInvoicePreview(inv)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition"
                              >
                                <Download className="w-3.5 h-3.5" /> GST Invoice
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS & REVENUE */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Revenue Analytics & Metrics (₹)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deep analytics on LTV, Average Revenue Per User (ARPU), and UPI renewal metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LTV Card */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Customer LTV</span>
                  <h3 className="text-3xl font-extrabold mt-2">{formatINR(42500)}</h3>
                  <p className="text-xs text-emerald-500 font-semibold mt-1">+16.4% growth QoQ</p>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    Average tenure per subscriber in India is 21.2 months.
                  </p>
                </div>

                {/* ARPU Card */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-xs text-slate-400 font-semibold uppercase">ARPU (Average Rev / User)</span>
                  <h3 className="text-3xl font-extrabold mt-2">{formatINR(2450)}</h3>
                  <p className="text-xs text-emerald-500 font-semibold mt-1">+8.2% expansion from upgrades</p>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    Driven by Starter customers upgrading to Professional Pro.
                  </p>
                </div>

                {/* Trial Conversion Card */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-xs text-slate-400 font-semibold uppercase">UPI Autopay Conversion</span>
                  <h3 className="text-3xl font-extrabold mt-2">29.4%</h3>
                  <p className="text-xs text-indigo-400 font-semibold mt-1">High conversion via UPI mandate</p>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    14-day free trial converts 3 out of every 10 Indian users when UPI auto-debit is bound.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & GATEWAY CONFIG */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Payment Gateways & India Compliance Settings</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure live Razorpay & Stripe keys, Webhooks, and GST Tax Rates for Indian Billing.
                </p>
              </div>

              {/* Razorpay & Stripe Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Razorpay Card (Primary for India) */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Razorpay Subscriptions (Primary)</h3>
                        <p className="text-[11px] text-slate-400">UPI Autopay, NetBanking & Indian Cards</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={gatewaySettings.razorpayEnabled}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpayEnabled: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Key ID</label>
                      <input
                        type="text"
                        value={gatewaySettings.razorpayKeyId}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpayKeyId: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Key Secret</label>
                      <input
                        type={showSecrets ? 'text' : 'password'}
                        value={gatewaySettings.razorpayKeySecret}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, razorpayKeySecret: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Stripe Card */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Stripe International</h3>
                        <p className="text-[11px] text-slate-400">USD & International Credit Card Payments</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={gatewaySettings.stripeEnabled}
                      onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripeEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Publishable Key</label>
                      <input
                        type="text"
                        value={gatewaySettings.stripePublishableKey}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripePublishableKey: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                          }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Secret Key</label>
                      <div className="relative">
                        <input
                          type={showSecrets ? 'text' : 'password'}
                          value={gatewaySettings.stripeSecretKey}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, stripeSecretKey: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none font-mono pr-10 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecrets(!showSecrets)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhooks Config */}
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Webhook className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h3 className="font-bold text-sm">Automated Razorpay Webhook Endpoint</h3>
                    <p className="text-[11px] text-slate-400">Captures subscription.charged & payment.failed events</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={gatewaySettings.webhookUrl}
                    onChange={(e) => setGatewaySettings({ ...gatewaySettings, webhookUrl: e.target.value })}
                    className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                  />
                  <button
                    onClick={handleTestWebhook}
                    disabled={pingStatus === 'pinging'}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${pingStatus === 'pinging' ? 'animate-spin' : ''}`} />
                    Test Razorpay Webhook
                  </button>
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => showToast('Gateway settings and GST tax rates saved!')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
                >
                  Save Gateway Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL 1: ADD / EDIT PLAN --- */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <h3 className="font-bold text-base">{editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Plan Name</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingPlan?.name || ''}
                    placeholder="e.g. Pro Growth"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Plan Code / Slug</label>
                  <input
                    name="code"
                    defaultValue={editingPlan?.code || ''}
                    placeholder="e.g. pro-growth"
                    className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Monthly Price (₹)</label>
                  <input
                    type="number"
                    name="priceMonthly"
                    required
                    defaultValue={editingPlan?.priceMonthly || 1499}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Yearly Price (₹)</label>
                  <input
                    type="number"
                    name="priceYearly"
                    required
                    defaultValue={editingPlan?.priceYearly || 14990}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Free Trial (Days)</label>
                  <input
                    type="number"
                    name="trialDays"
                    defaultValue={editingPlan?.trialDays || 14}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Status</label>
                  <select
                    name="status"
                    defaultValue={editingPlan?.status || 'Active'}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Badge Tag (Optional)</label>
                  <input
                    name="badge"
                    defaultValue={editingPlan?.badge || ''}
                    placeholder="e.g. Best Value"
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Included Features (One per line)</label>
                <textarea
                  name="features"
                  rows="4"
                  defaultValue={editingPlan?.features?.join('\n') || 'Full Access\nGST Tax Invoices\nUPI Autopay Support'}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold border border-inherit hover:bg-slate-500/10"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                  {editingPlan ? 'Save Changes' : 'Publish Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: SUBSCRIBER DETAILS --- */}
      {selectedSubscriber && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-3">
                <img src={selectedSubscriber.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-base">{selectedSubscriber.name}</h3>
                  <p className="text-xs text-slate-400">{selectedSubscriber.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSubscriber(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-5 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-500/5">
                <div>
                  <span className="text-slate-400 font-medium">Subscription Tier</span>
                  <p className="font-bold text-sm text-indigo-400">{selectedSubscriber.planName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Billing Amount</span>
                  <p className="font-bold text-sm">{formatINR(selectedSubscriber.amount)} / {selectedSubscriber.billingCycle}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Current Status</span>
                  <p className="font-bold text-emerald-500 mt-0.5">{selectedSubscriber.status}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Payment Mode</span>
                  <p className="font-mono text-slate-300 mt-0.5">{selectedSubscriber.paymentMethod}</p>
                </div>
              </div>

              {/* Plan Switch Option */}
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Manual Plan Upgrade/Downgrade:</label>
                <select
                  value={selectedSubscriber.planId}
                  onChange={(e) => {
                    const newP = plans.find((p) => p.id === e.target.value);
                    if (newP) {
                      setSubscribers(
                        subscribers.map((s) => (s.id === selectedSubscriber.id ? { ...s, planId: newP.id, planName: newP.name, amount: newP.priceMonthly } : s))
                      );
                      setSelectedSubscriber({ ...selectedSubscriber, planId: newP.id, planName: newP.name, amount: newP.priceMonthly });
                      showToast(`Subscriber ko ${newP.name} plan par migrate kar diya gaya!`);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatINR(p.priceMonthly)}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-400">Status Controls:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateSubscriberStatus(selectedSubscriber.id, 'Active')}
                    className="py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-500 font-semibold hover:bg-emerald-500/20 transition text-center"
                  >
                    Activate / Unfreeze
                  </button>
                  <button
                    onClick={() => handleUpdateSubscriberStatus(selectedSubscriber.id, 'Canceled')}
                    className="py-2 px-3 rounded-xl bg-rose-500/10 text-rose-500 font-semibold hover:bg-rose-500/20 transition text-center"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-inherit">
              <button
                onClick={() => setSelectedSubscriber(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: GST INVOICE PREVIEW --- */}
      {invoicePreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setInvoicePreview(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* GST Tax Invoice Header */}
            <div className="border-b pb-4 mb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg mb-1">
                  <Receipt className="w-5 h-5" /> SubScribeOS Pvt Ltd
                </div>
                <p className="text-xs text-slate-500">GSTIN: 27AABCU9603R1ZM</p>
                <p className="text-xs text-slate-500">Bangalore, Karnataka, India</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  TAX INVOICE
                </span>
                <p className="text-xs font-mono font-bold mt-2">{invoicePreview.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Billed To (Customer):</span>
                <p className="font-bold text-sm text-slate-800 mt-0.5">{invoicePreview.customer}</p>
                <p className="text-slate-500">{invoicePreview.email}</p>
                <p className="text-slate-500 font-mono mt-0.5">Customer GSTIN: {invoicePreview.gstin}</p>
              </div>

              <table className="w-full text-left mt-3">
                <thead>
                  <tr className="border-b text-[11px] text-slate-400 uppercase">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-right">Base Amount</th>
                    <th className="py-2 text-right">18% GST</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  <tr>
                    <td className="py-2 font-sans font-medium">{invoicePreview.plan}</td>
                    <td className="py-2 text-right">{formatINR(invoicePreview.baseAmount)}</td>
                    <td className="py-2 text-right">{formatINR(invoicePreview.baseAmount * 0.18)}</td>
                    <td className="py-2 text-right font-bold">{formatINR(invoicePreview.baseAmount * 1.18)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-3 border-t flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500">CGST (9%): {formatINR((invoicePreview.baseAmount * 0.18) / 2)}</span>
                  <span className="block text-xs text-slate-500">SGST (9%): {formatINR((invoicePreview.baseAmount * 0.18) / 2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Total Billed:</span>
                  <p className="text-xl font-extrabold text-indigo-600">{formatINR(invoicePreview.baseAmount * 1.18)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`GST Tax Invoice PDF (${invoicePreview.id}) download ho raha hai...`);
                setInvoicePreview(null);
              }}
              className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
            >
              <Download className="w-4 h-4" /> Download GST Invoice PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}