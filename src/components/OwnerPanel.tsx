import { useEffect, useState } from 'react';
import { Activity, Bell, CheckCircle2, CreditCard, Database, Gauge, Search, ServerCog, ClipboardList } from 'lucide-react';
import { getOwnerAlerts, getOwnerLogs, getOwnerMetrics, getOwnerOrders, getOwnerPlans } from '../lib/ownerData';

const areas = [
  'Platform Overview',
  'User & Seller Management',
  'Product Review Center',
  'Orders & Fulfillment Control',
  'Revenue, Payout & Billing',
  'Subscription Plan Control',
  'AI Usage Monitor',
  'Support Queue',
  'Trust & Verification',
  'Storage & Asset Control',
  'Legal & Policy Center',
  'Landing, Pricing & Public Pages',
];

export default function OwnerPanel() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([getOwnerMetrics(), getOwnerAlerts(), getOwnerLogs(), getOwnerPlans(), getOwnerOrders()]).then(([m, a, l, p, o]) => {
      if (!alive) return;
      setMetrics(m);
      setAlerts(a);
      setLogs(l);
      setPlans(p);
      setOrders(o);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const visibleAreas = areas.filter((area) => area.toLowerCase().includes(query.toLowerCase()));
  const pendingOrders = orders.filter((order) => order.order_status !== 'fulfilled');
  const statCards = metrics.length
    ? metrics.map((item) => [item.metric_label, item.metric_text || String(item.metric_value || 0)])
    : [['Live metrics', loading ? 'Loading' : '0'], ['Order review', String(pendingOrders.length)], ['Plans', String(plans.length)], ['Logs', String(logs.length)]];

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/20 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-300 mb-4">
            <ServerCog size={13} /> Owner Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Super Owner Panel</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Live owner control for platform metrics, alerts, plans, logs, and order review.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-black text-emerald-300">
            <CheckCircle2 size={13} /> {loading ? 'Loading live data...' : 'Live data connected'}
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.slice(0, 4).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <Activity size={16} className="text-red-300" />
                <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
                <p className="mt-1 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-black text-white flex items-center gap-2"><ClipboardList size={16} className="text-red-300" /> Order Review Queue</h2>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-black text-amber-300">{pendingOrders.length} pending</span>
          </div>
          <div className="space-y-2">
            {(orders.length ? orders : [{ id: 'empty', buyer_name: 'No order rows yet', order_status: 'empty', amount: 0, currency: 'IDR' }]).slice(0, 8).map((order) => {
              const productTitle = order.products?.title || order.product_title || 'OmniHub Product';
              return (
                <div key={order.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{productTitle}</p>
                      <p className="text-xs text-slate-500 truncate">{order.buyer_name || 'Guest Buyer'} · {order.buyer_email || 'no email'}</p>
                    </div>
                    <div className="text-xs text-slate-300 font-mono">{order.currency || 'IDR'} {Number(order.amount || 0).toLocaleString('id-ID')}</div>
                    <span className={`text-[10px] font-black rounded-full px-2 py-1 border ${order.order_status === 'fulfilled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>{order.order_status || 'review'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search owner area..." className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-red-400" />
          </label>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleAreas.map((area) => (
            <div key={area} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center"><Gauge size={18} className="text-red-300" /></div>
              <h3 className="mt-4 text-sm font-black text-white">{area}</h3>
              <div className="mt-4 grid grid-cols-1 gap-2">{['Connected', 'Ready to test', 'Owner-only'].map((item) => <div key={item} className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={13} className="text-emerald-300" />{item}</div>)}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5"><h3 className="text-sm font-black text-white flex items-center gap-2"><Bell size={16} className="text-red-300" /> Alerts</h3><p className="mt-3 text-2xl font-black text-white">{alerts.length}</p></div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5"><h3 className="text-sm font-black text-white flex items-center gap-2"><CreditCard size={16} className="text-red-300" /> Plans</h3><p className="mt-3 text-2xl font-black text-white">{plans.length}</p></div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5"><h3 className="text-sm font-black text-white flex items-center gap-2"><Database size={16} className="text-red-300" /> Logs</h3><p className="mt-3 text-2xl font-black text-white">{logs.length}</p></div>
        </section>
      </div>
    </div>
  );
}
