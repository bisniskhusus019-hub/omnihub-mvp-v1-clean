import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Plus, Rocket, Workflow } from 'lucide-react';
import { addCalendar, addWorkflow, getCalendar, getFeedback, getTickets, getWorkflows } from '../lib/growthData';
import { supabase } from '../lib/supabaseStub';

export default function GrowthSuiteLive() {
  const [seller, setSeller] = useState<any>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [workflowName, setWorkflowName] = useState('');
  const [saving, setSaving] = useState(false);
  const sellerId = seller?.id || null;

  const loadRows = async () => {
    const [w, c, t, f] = await Promise.all([getWorkflows(), getCalendar(), getTickets(), getFeedback()]);
    setWorkflows(w);
    setCalendar(c);
    setTickets(t);
    setFeedback(f);
  };

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const accountId = sessionData.session?.user?.id;
      if (accountId) {
        const { data } = await supabase.from('users').select('*').eq('auth_user_id', accountId).maybeSingle();
        setSeller(data || null);
      }
      await loadRows();
    };
    load();
  }, []);

  const saveCampaign = async () => {
    if (!sellerId || !campaignTitle.trim()) return;
    setSaving(true);
    await addCalendar({ seller_id: sellerId, title: campaignTitle.trim(), channel: 'social', content_body: 'Created from Growth Suite.', status: 'draft', campaign_name: 'Seller Campaign' });
    setCampaignTitle('');
    await loadRows();
    setSaving(false);
  };

  const saveWorkflow = async () => {
    if (!sellerId || !workflowName.trim()) return;
    setSaving(true);
    await addWorkflow({ seller_id: sellerId, name: workflowName.trim(), trigger_type: 'manual', ai_action: 'generate_text', output_target: 'draft', is_active: false });
    setWorkflowName('');
    await loadRows();
    setSaving(false);
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-4"><Rocket size={13} /> Live Growth Suite</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Growth Suite</h1>
          <p className="mt-3 text-sm text-slate-400">Connected to Supabase records for growth, support, calendar, and feedback testing.</p>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Automation rows</p><p className="text-2xl font-black text-white">{workflows.length}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Calendar rows</p><p className="text-2xl font-black text-white">{calendar.length}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Support rows</p><p className="text-2xl font-black text-white">{tickets.length}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Feedback rows</p><p className="text-2xl font-black text-white">{feedback.length}</p></div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-black text-white flex items-center gap-2"><CalendarDays size={16} className="text-cyan-300" /> Add campaign</h3>
            <div className="mt-4 flex gap-2"><input value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} placeholder="Campaign title" className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400" /><button disabled={saving || !sellerId} onClick={saveCampaign} className="rounded-2xl bg-cyan-500 px-4 py-3 text-slate-950 font-black disabled:bg-slate-700"><Plus size={16} /></button></div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-black text-white flex items-center gap-2"><Workflow size={16} className="text-cyan-300" /> Add workflow</h3>
            <div className="mt-4 flex gap-2"><input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} placeholder="Workflow name" className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400" /><button disabled={saving || !sellerId} onClick={saveWorkflow} className="rounded-2xl bg-cyan-500 px-4 py-3 text-slate-950 font-black disabled:bg-slate-700"><Plus size={16} /></button></div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-sm font-black text-white">Calendar records</h3>
          <div className="mt-4 space-y-2">
            {(calendar.length ? calendar : [{ title: 'No calendar rows visible yet', status: 'empty' }]).slice(0, 8).map((item) => (
              <div key={item.id || item.title} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"><CheckCircle2 size={14} className="text-emerald-300" /> {item.title} <span className="ml-auto text-xs text-slate-500">{item.status}</span></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
