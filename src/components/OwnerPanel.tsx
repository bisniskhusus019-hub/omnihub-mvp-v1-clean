import { useState } from 'react';
import { Activity, BarChart3, Bell, BriefcaseBusiness, CheckCircle2, CreditCard, Database, FileText, Gauge, Globe2, HardDrive, Package, Search, ServerCog, Settings, ShieldCheck, Store, TicketCheck, Users, Wallet, Workflow } from 'lucide-react';

const sections = [
  { id: 'overview', title: 'Platform Overview', icon: Gauge, status: 'Core', items: ['Total users', 'Active sellers', 'Published products', 'Platform revenue'] },
  { id: 'users', title: 'User & Seller Management', icon: Users, status: 'Core', items: ['Buyers', 'Sellers', 'Owner roles', 'Verification queue'] },
  { id: 'products', title: 'Product Review Center', icon: Package, status: 'Core', items: ['Pending review', 'Published', 'Rejected', 'Reported listings'] },
  { id: 'orders', title: 'Orders & Fulfillment Control', icon: TicketCheck, status: 'Core', items: ['Orders', 'Pending payment', 'Fulfilled', 'Refund requests'] },
  { id: 'money', title: 'Revenue, Payout & Billing', icon: Wallet, status: 'Core', items: ['Gross revenue', 'Seller payout', 'Affiliate payout', 'Subscription MRR'] },
  { id: 'plans', title: 'Subscription Plan Control', icon: CreditCard, status: 'Blueprint', items: ['Free users', 'Paid users', 'Usage limits', 'Upgrade conversion'] },
  { id: 'automation', title: 'AI Usage Monitor', icon: Workflow, status: 'Blueprint', items: ['AI requests', 'Workflow runs', 'Failed runs', 'Usage meter'] },
  { id: 'support', title: 'Support Queue', icon: Bell, status: 'Core', items: ['Open tickets', 'Cases', 'Priority items', 'Resolved issues'] },
  { id: 'trust', title: 'Trust & Verification', icon: ShieldCheck, status: 'Blueprint', items: ['Verified sellers', 'Review queue', 'Policy checks', 'Trust badges'] },
  { id: 'storage', title: 'Storage & Asset Control', icon: HardDrive, status: 'Core', items: ['Storage used', 'Private files', 'Public assets', 'Failed uploads'] },
  { id: 'settings', title: 'Platform Settings Center', icon: Settings, status: 'Blueprint', items: ['Enabled modules', 'Fee rate', 'Currencies', 'Categories'] },
  { id: 'legal', title: 'Legal & Policy Center', icon: FileText, status: 'Blueprint', items: ['Policy pages', 'Last update', 'Required acceptances', 'Policy alerts'] },
  { id: 'onboarding', title: 'Seller Onboarding Control', icon: BriefcaseBusiness, status: 'Blueprint', items: ['New sellers', 'Setup complete', 'First product', 'First sale'] },
  { id: 'public', title: 'Landing, Pricing & Public Pages', icon: Globe2, status: 'Blueprint', items: ['Landing sections', 'Pricing plans', 'Help pages', 'Public copy'] },
];

const stats = [
  ['Platform Revenue', 'Rp 2.450.000'],
  ['Active Sellers', '12'],
  ['Published Products', '38'],
  ['System Health', '92%'],
];

export default function OwnerPanel() {
  const [query, setQuery] = useState('');
  const filtered = sections.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/20 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-300 mb-4">
            <ServerCog size={13} /> Owner Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Super Owner Panel</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Complete platform dashboard to monitor growth, users, sellers, products, orders, revenue, subscriptions, AI usage, storage, support, settings, legal pages, and system health.</p>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <Activity size={16} className="text-red-300" />
                <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
                <p className="mt-1 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search owner area..." className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-red-400" />
          </label>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center"><Icon size={18} className="text-red-300" /></div>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-black text-slate-300">{section.status}</span>
                </div>
                <h3 className="mt-4 text-sm font-black text-white">{section.title}</h3>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {section.items.map((item) => <div key={item} className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={13} className="text-emerald-300" />{item}</div>)}
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5"><h3 className="text-sm font-black text-white flex items-center gap-2"><Database size={16} className="text-red-300" /> Next Data Layer</h3><p className="mt-3 text-sm leading-6 text-slate-400">Real tables later: platform metrics, audit events, plans, alerts, seller onboarding, and policy pages.</p></div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5"><h3 className="text-sm font-black text-white flex items-center gap-2"><BarChart3 size={16} className="text-red-300" /> Test Priority</h3><p className="mt-3 text-sm leading-6 text-slate-400">After all blueprint modules are added, test one module at a time in Bolt, then strengthen with Supabase database tables.</p></div>
        </section>
      </div>
    </div>
  );
}
