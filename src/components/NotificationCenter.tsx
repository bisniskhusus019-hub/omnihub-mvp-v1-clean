import { useState } from 'react';
import { Bell, CheckCircle2, Clock, CreditCard, Megaphone, MessageSquare, Package, ShieldCheck, ShoppingBag, Users } from 'lucide-react';

type NotificationType = 'order' | 'affiliate' | 'community' | 'trust' | 'plan';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  { id: 'n1', type: 'order', title: 'New order requires review', body: 'A manual checkout order is waiting for seller and owner review.', time: '2m ago', read: false },
  { id: 'n2', type: 'affiliate', title: 'Affiliate link copied', body: 'A marketplace visitor copied an affiliate-ready product link.', time: '18m ago', read: false },
  { id: 'n3', type: 'community', title: 'Product discussion started', body: 'A community member created a product/service discussion post.', time: '1h ago', read: true },
  { id: 'n4', type: 'trust', title: 'Trust signal received', body: 'A buyer used a review/report/save action on a marketplace listing.', time: '3h ago', read: false },
  { id: 'n5', type: 'plan', title: 'Seller plan ladder updated', body: 'Starter, Pro, and Business seller plan structure is available in Owner Control.', time: 'today', read: true },
];

const notificationConfig = {
  order: { icon: ShoppingBag, label: 'Order', color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20' },
  affiliate: { icon: Megaphone, label: 'Affiliate', color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
  community: { icon: MessageSquare, label: 'Community', color: 'text-violet-300 bg-violet-500/10 border-violet-500/20' },
  trust: { icon: ShieldCheck, label: 'Trust', color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
  plan: { icon: CreditCard, label: 'Plan', color: 'text-blue-300 bg-blue-500/10 border-blue-500/20' },
};

export default function NotificationCenter() {
  const [items, setItems] = useState(initialNotifications);
  const unreadCount = items.filter((item) => !item.read).length;

  const markRead = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="min-h-full bg-slate-950 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-4"><Bell size={13} /> Notification Center</div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Central activity inbox for OmniHub.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Track order reviews, affiliate activity, community replies, trust signals, and plan updates from one place.</p></div>
            <button onClick={markAllRead} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400"><CheckCircle2 size={15} />Mark all read</button>
          </div>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><Bell size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Unread</p><p className="mt-1 text-2xl font-black text-white">{unreadCount}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><Package size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total</p><p className="mt-1 text-2xl font-black text-white">{items.length}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><Users size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Channels</p><p className="mt-1 text-2xl font-black text-white">5</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><Clock size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mode</p><p className="mt-1 text-2xl font-black text-white">Live</p></div>
          </div>
        </section>

        <section className="space-y-3">
          {items.map((item) => {
            const config = notificationConfig[item.type];
            const Icon = config.icon;
            return (
              <div key={item.id} className={`rounded-3xl border p-5 transition-all ${item.read ? 'border-slate-800 bg-slate-900/70' : 'border-cyan-500/20 bg-slate-900'}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-2xl border p-3 ${config.color}`}><Icon size={18} /></div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-black text-white">{item.title}</h3><span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${config.color}`}>{config.label}</span>{!item.read && <span className="rounded-full bg-cyan-500 px-2 py-1 text-[10px] font-black text-slate-950">NEW</span>}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                      <p className="mt-1 text-xs text-slate-600">{item.time}</p>
                    </div>
                  </div>
                  <button onClick={() => markRead(item.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"><CheckCircle2 size={13} />{item.read ? 'Read' : 'Mark read'}</button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
