import { useEffect, useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, Clock, MessageSquare, Plus, Search, Send, Sparkles, Tag, Users } from 'lucide-react';
import { createServiceOffer, createServiceRequest, fetchServiceRequests, updateServiceRequestOfferCount } from '../lib/growthData';

type RequestStatus = 'open' | 'reviewing' | 'matched';

type ServiceRequest = {
  id: string;
  title: string;
  category: string;
  budget: string;
  timeline: string;
  description: string;
  status: RequestStatus;
  offers: number;
};

const starterRequests: ServiceRequest[] = [
  { id: 'req-1', title: 'Need a landing page for a digital product launch', category: 'Web Design', budget: '$100 - $300', timeline: '7 days', description: 'Looking for a clean landing page with offer section, testimonials, FAQ, and checkout CTA.', status: 'open', offers: 4 },
  { id: 'req-2', title: 'Need help packaging an ebook into a premium product', category: 'Digital Product', budget: '$50 - $150', timeline: '3 days', description: 'Need cover, bundle structure, bonus idea, and sales page copy for a digital ebook.', status: 'reviewing', offers: 2 },
  { id: 'req-3', title: 'Looking for affiliate partners for a template bundle', category: 'Affiliate Promo', budget: 'Commission based', timeline: 'Ongoing', description: 'Need creators who can promote a productivity template bundle to freelancers and solopreneurs.', status: 'matched', offers: 8 },
];

const statusStyles: Record<RequestStatus, string> = {
  open: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  reviewing: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  matched: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
};

function normalizeRequest(row: any): ServiceRequest {
  return {
    id: row.id,
    title: row.title,
    category: row.category || 'Service',
    budget: row.budget_label || row.budget || 'Flexible',
    timeline: row.timeline_label || row.timeline || 'Flexible',
    description: row.description || 'Buyer is looking for seller offers from OmniHub members.',
    status: (row.status || 'open') as RequestStatus,
    offers: Number(row.offer_count ?? row.offers ?? 0),
  };
}

export default function ServiceRequestBoard() {
  const [requests, setRequests] = useState<ServiceRequest[]>(starterRequests);
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Service');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('Supabase loading...');

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await fetchServiceRequests();
        if (rows.length > 0) {
          setRequests(rows.map(normalizeRequest));
          setSyncStatus('Live Supabase data');
        } else {
          setSyncStatus('Supabase ready, using demo starters until first request');
        }
      } catch (error) {
        console.warn('[ServiceRequestBoard] fallback mode:', error);
        setSyncStatus('Local fallback mode');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return requests.filter((item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [query, requests]);

  const createRequest = async () => {
    if (!title.trim()) return;
    const localRequest: ServiceRequest = { id: `req-${Date.now()}`, title: title.trim(), category: category.trim() || 'Service', budget: budget.trim() || 'Flexible', timeline: timeline.trim() || 'Flexible', description: description.trim() || 'Buyer is looking for seller offers from OmniHub members.', status: 'open', offers: 0 };
    setTitle('');
    setCategory('Service');
    setBudget('');
    setTimeline('');
    setDescription('');

    try {
      const saved = await createServiceRequest({ title: localRequest.title, category: localRequest.category, budget_label: localRequest.budget, timeline_label: localRequest.timeline, description: localRequest.description });
      setRequests((current) => [normalizeRequest(saved), ...current.filter((item) => item.id !== localRequest.id)]);
      setSyncStatus('Saved to Supabase');
    } catch (error) {
      console.warn('[ServiceRequestBoard] create fallback:', error);
      setRequests((current) => [localRequest, ...current]);
      setSyncStatus('Saved locally; Supabase policy needs review');
    }
  };

  const sendOffer = async (id: string) => {
    const target = requests.find((item) => item.id === id);
    if (!target) return;
    const nextOffers = target.offers + 1;
    const nextStatus = target.status === 'open' ? 'reviewing' : target.status;
    setRequests((current) => current.map((item) => item.id === id ? { ...item, offers: nextOffers, status: nextStatus } : item));
    try {
      await createServiceOffer({ request_id: id, offer_title: `Offer for ${target.title}`, offer_message: 'Seller is interested in this request.' });
      await updateServiceRequestOfferCount(id, nextOffers, nextStatus);
      setSyncStatus('Offer synced to Supabase');
    } catch (error) {
      console.warn('[ServiceRequestBoard] offer fallback:', error);
      setSyncStatus('Offer saved locally; Supabase policy needs review');
    }
  };

  return (
    <div className="min-h-full bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-4"><Briefcase size={13} /> Service Request Board</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Let buyers post what they need, then sellers respond with offers.</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">This turns OmniHub into more than a product marketplace: buyers can request services, sellers can pitch, affiliates can promote requests, and the community can discuss needs.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold text-slate-400"><CheckCircle2 size={12} className="text-emerald-300" />{loading ? 'Loading...' : syncStatus}</div>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">{[['Open Requests', requests.filter((item) => item.status === 'open').length], ['Seller Offers', requests.reduce((sum, item) => sum + item.offers, 0)], ['Categories', new Set(requests.map((item) => item.category)).size], ['Matched', requests.filter((item) => item.status === 'matched').length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><Sparkles size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p><p className="mt-1 text-2xl font-black text-white">{value}</p></div>)}</div>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-black text-white flex items-center gap-2"><Plus size={16} className="text-cyan-300" /> New Buyer Request</h2>
            <div className="mt-4 space-y-3"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you need?" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><div className="grid grid-cols-2 gap-2"><input value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Budget" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><input value={timeline} onChange={(event) => setTimeline(event.target.value)} placeholder="Timeline" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /></div><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the request..." rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><button onClick={createRequest} disabled={!title.trim()} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"><Send size={15} />Post Request</button></div>
          </div>
          <div className="lg:col-span-2 space-y-4"><label className="relative block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests, categories, buyer needs..." className="w-full rounded-2xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400" /></label>{filtered.map((request) => <div key={request.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><div className="flex flex-wrap items-center gap-2 mb-2"><span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-slate-400"><Tag size={11} />{request.category}</span><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black uppercase ${statusStyles[request.status]}`}><Clock size={11} />{request.status}</span></div><h3 className="text-lg font-black text-white">{request.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{request.description}</p></div><div className="min-w-[180px] rounded-2xl border border-slate-800 bg-slate-950 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Budget</p><p className="mt-1 text-sm font-black text-cyan-300">{request.budget}</p><p className="mt-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Timeline</p><p className="mt-1 text-sm font-black text-white">{request.timeline}</p></div></div><div className="mt-4 flex flex-wrap items-center gap-2"><button onClick={() => sendOffer(request.id)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-3 py-2 text-xs font-black text-slate-950 hover:bg-cyan-400"><Briefcase size={13} />Send Seller Offer</button><button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"><MessageSquare size={13} />Discuss</button><span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500"><Users size={13} />{request.offers} seller offers</span></div></div>)}</div>
        </section>
      </div>
    </div>
  );
}
