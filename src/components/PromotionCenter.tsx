import { useEffect, useMemo, useState } from 'react';
import { BadgePercent, Box, CalendarDays, CheckCircle2, Copy, Megaphone, PackagePlus, Plus, Rocket, Search, Sparkles, Tag, Users } from 'lucide-react';
import { createCampaignPlan, createPromotionCoupon, fetchCampaignPlans, fetchProductBundles, fetchPromotionCoupons } from '../lib/growthData';

type PromoStatus = 'draft' | 'active' | 'scheduled';
type Coupon = { id: string; code: string; discount: string; target: string; status: PromoStatus; uses: number };
type Bundle = { id: string; name: string; price: string; items: string[]; status: PromoStatus };
type Campaign = { id: string; title: string; channel: string; goal: string; status: PromoStatus; tasks: string[] };

const initialCoupons: Coupon[] = [
  { id: 'c1', code: 'LAUNCH20', discount: '20% off', target: 'Digital products', status: 'active', uses: 18 },
  { id: 'c2', code: 'PROSELLER', discount: 'Featured seller deal', target: 'Services', status: 'scheduled', uses: 3 },
  { id: 'c3', code: 'AFFILIATE10', discount: '10% partner code', target: 'Affiliate traffic', status: 'draft', uses: 0 },
];
const initialBundles: Bundle[] = [
  { id: 'b1', name: 'Starter Business Kit', price: '$49', items: ['Landing page template', 'Invoice sheet', 'Launch checklist'], status: 'active' },
  { id: 'b2', name: 'Creator Growth Pack', price: '$79', items: ['Content calendar', 'Affiliate swipe copy', 'Community promo prompts'], status: 'scheduled' },
  { id: 'b3', name: 'Seller Operations Bundle', price: '$129', items: ['Kanban board', 'Client tracker', 'SOP vault'], status: 'draft' },
];
const initialCampaigns: Campaign[] = [
  { id: 'p1', title: 'Digital Product Launch Week', channel: 'Marketplace + Community', goal: 'Promote new seller products', status: 'active', tasks: ['Feature 5 products', 'Post community thread', 'Share affiliate codes'] },
  { id: 'p2', title: 'Service Request Matchmaking', channel: 'Service Requests', goal: 'Connect buyers with sellers', status: 'scheduled', tasks: ['Highlight open requests', 'Invite sellers', 'Collect offers'] },
  { id: 'p3', title: 'Affiliate Partner Sprint', channel: 'Affiliates', goal: 'Recruit and activate promoters', status: 'draft', tasks: ['Prepare swipe copy', 'Create bonus angle', 'Track copied links'] },
];

const statusStyle: Record<PromoStatus, string> = { draft: 'border-slate-700 bg-slate-800 text-slate-300', active: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', scheduled: 'border-amber-500/20 bg-amber-500/10 text-amber-300' };

function normalizeCoupon(row: any): Coupon {
  return { id: row.id, code: row.code, discount: row.discount_label || 'Custom deal', target: row.target_type || 'Marketplace', status: (row.status || 'draft') as PromoStatus, uses: Number(row.usage_count || 0) };
}
function normalizeBundle(row: any): Bundle {
  return { id: row.id, name: row.name, price: row.price ? `${row.currency || 'IDR'} ${Number(row.price).toLocaleString('id-ID')}` : 'Flexible', items: Array.isArray(row.items) ? row.items : [], status: (row.status || 'draft') as PromoStatus };
}
function normalizeCampaign(row: any): Campaign {
  return { id: row.id, title: row.title, channel: row.channel || 'Marketplace + Community + Affiliate', goal: row.goal || 'Drive seller visibility and buyer action', status: (row.status || 'draft') as PromoStatus, tasks: Array.isArray(row.tasks) ? row.tasks : ['Prepare offer angle', 'Create promo copy', 'Track result'] };
}

export default function PromotionCenter() {
  const [query, setQuery] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [newCode, setNewCode] = useState('');
  const [newCampaign, setNewCampaign] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState('Supabase loading...');

  useEffect(() => {
    const load = async () => {
      try {
        const [couponRows, bundleRows, campaignRows] = await Promise.all([fetchPromotionCoupons(), fetchProductBundles(), fetchCampaignPlans()]);
        if (couponRows.length > 0) setCoupons(couponRows.map(normalizeCoupon));
        if (bundleRows.length > 0) setBundles(bundleRows.map(normalizeBundle));
        if (campaignRows.length > 0) setCampaigns(campaignRows.map(normalizeCampaign));
        setSyncStatus(couponRows.length + bundleRows.length + campaignRows.length > 0 ? 'Live Supabase data' : 'Supabase ready, using demo starters');
      } catch (error) {
        console.warn('[PromotionCenter] fallback mode:', error);
        setSyncStatus('Local fallback mode');
      }
    };
    load();
  }, []);

  const filteredCoupons = useMemo(() => coupons.filter((item) => `${item.code} ${item.target}`.toLowerCase().includes(query.toLowerCase())), [coupons, query]);
  const filteredBundles = useMemo(() => bundles.filter((item) => `${item.name} ${item.items.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [bundles, query]);
  const filteredCampaigns = useMemo(() => campaigns.filter((item) => `${item.title} ${item.channel} ${item.goal}`.toLowerCase().includes(query.toLowerCase())), [campaigns, query]);

  const addCoupon = async () => {
    if (!newCode.trim()) return;
    const code = newCode.trim().toUpperCase().replace(/\s+/g, '');
    setNewCode('');
    try {
      const saved = await createPromotionCoupon({ code, discount_label: 'Custom deal', target_type: 'Marketplace', status: 'draft' });
      setCoupons((current) => [normalizeCoupon(saved), ...current]);
      setSyncStatus('Coupon saved to Supabase');
    } catch (error) {
      console.warn('[PromotionCenter] coupon fallback:', error);
      setCoupons((current) => [{ id: `c-${Date.now()}`, code, discount: 'Custom deal', target: 'Marketplace', status: 'draft', uses: 0 }, ...current]);
      setSyncStatus('Coupon saved locally; Supabase policy needs review');
    }
  };

  const addCampaign = async () => {
    if (!newCampaign.trim()) return;
    const title = newCampaign.trim();
    setNewCampaign('');
    try {
      const saved = await createCampaignPlan({ title });
      setCampaigns((current) => [normalizeCampaign(saved), ...current]);
      setSyncStatus('Campaign saved to Supabase');
    } catch (error) {
      console.warn('[PromotionCenter] campaign fallback:', error);
      setCampaigns((current) => [{ id: `p-${Date.now()}`, title, channel: 'Marketplace + Community + Affiliate', goal: 'Drive seller visibility and buyer action', status: 'draft', tasks: ['Prepare offer angle', 'Create promo copy', 'Track result'] }, ...current]);
      setSyncStatus('Campaign saved locally; Supabase policy needs review');
    }
  };

  const copyPromo = async (text: string, id: string) => { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1400); };

  return (
    <div className="min-h-full bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8"><div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-4"><Megaphone size={13} /> Promotion Center</div><h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Coupons, bundles, and campaign builder for seller growth.</h1><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">Give sellers simple tools to create promos, package offers, activate affiliates, and turn marketplace traffic into revenue signals.</p><div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold text-slate-400"><CheckCircle2 size={12} className="text-emerald-300" />{syncStatus}</div><div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">{[['Coupons', coupons.length, BadgePercent], ['Bundles', bundles.length, Box], ['Campaigns', campaigns.length, Rocket], ['Active', [...coupons, ...bundles, ...campaigns].filter((item) => item.status === 'active').length, CheckCircle2]].map(([label, value, Icon]) => { const I = Icon as typeof BadgePercent; return <div key={String(label)} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><I size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">{String(label)}</p><p className="mt-1 text-2xl font-black text-white">{String(value)}</p></div>; })}</div></section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4"><div className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-black text-white flex items-center gap-2"><Plus size={16} className="text-cyan-300" /> Quick Coupon Creator</h2><div className="mt-4 flex gap-2"><input value={newCode} onChange={(event) => setNewCode(event.target.value)} placeholder="Example: LAUNCH30" className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><button onClick={addCoupon} className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-400">Create</button></div><p className="mt-3 text-xs leading-5 text-slate-500">Use this for launch discounts, affiliate coupons, featured seller promos, or bundle bonuses.</p></div><div className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-black text-white flex items-center gap-2"><Rocket size={16} className="text-cyan-300" /> Quick Campaign Creator</h2><div className="mt-4 flex gap-2"><input value={newCampaign} onChange={(event) => setNewCampaign(event.target.value)} placeholder="Example: Freelancer Launch Week" className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><button onClick={addCampaign} className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-400">Create</button></div><p className="mt-3 text-xs leading-5 text-slate-500">Campaigns connect marketplace offers, community posts, service requests, and affiliate promotion.</p></div></section>
        <label className="relative block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search coupons, bundles, campaigns..." className="w-full rounded-2xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400" /></label>
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5"><div className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-black text-white flex items-center gap-2 mb-4"><BadgePercent size={16} className="text-cyan-300" /> Coupons</h2><div className="space-y-3">{filteredCoupons.map((coupon) => <div key={coupon.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><div className="flex items-start justify-between gap-2"><div><p className="font-mono text-sm font-black text-white">{coupon.code}</p><p className="mt-1 text-xs text-slate-500">{coupon.discount} · {coupon.target}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${statusStyle[coupon.status]}`}>{coupon.status}</span></div><div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-500">{coupon.uses} uses</span><button onClick={() => copyPromo(coupon.code, coupon.id)} className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300"><Copy size={12} />{copied === coupon.id ? 'Copied' : 'Copy'}</button></div></div>)}</div></div><div className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-black text-white flex items-center gap-2 mb-4"><PackagePlus size={16} className="text-cyan-300" /> Bundles</h2><div className="space-y-3">{filteredBundles.map((bundle) => <div key={bundle.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-black text-white">{bundle.name}</p><p className="mt-1 text-xs font-black text-cyan-300">{bundle.price}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${statusStyle[bundle.status]}`}>{bundle.status}</span></div><div className="mt-3 space-y-2">{bundle.items.map((item) => <div key={item} className="flex items-start gap-2 text-xs leading-5 text-slate-400"><Tag size={12} className="mt-0.5 text-cyan-300" />{item}</div>)}</div></div>)}</div></div><div className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="text-sm font-black text-white flex items-center gap-2 mb-4"><CalendarDays size={16} className="text-cyan-300" /> Campaign Builder</h2><div className="space-y-3">{filteredCampaigns.map((campaign) => <div key={campaign.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-black text-white">{campaign.title}</p><p className="mt-1 text-xs text-slate-500">{campaign.channel}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${statusStyle[campaign.status]}`}>{campaign.status}</span></div><p className="mt-3 text-xs leading-5 text-slate-400">{campaign.goal}</p><div className="mt-3 space-y-2">{campaign.tasks.map((task) => <div key={task} className="flex items-start gap-2 text-xs leading-5 text-slate-400"><CheckCircle2 size={12} className="mt-0.5 text-emerald-300" />{task}</div>)}</div><button onClick={() => copyPromo(`${campaign.title}: ${campaign.goal}`, campaign.id)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-cyan-300"><Users size={12} />{copied === campaign.id ? 'Copied' : 'Copy promo angle'}</button></div>)}</div></div></section>
      </div>
    </div>
  );
}
