import { useEffect, useState } from 'react';
import { CheckCircle2, Rocket } from 'lucide-react';
import { getCalendar, getFeedback, getTickets, getWorkflows } from '../lib/growthData';

export default function GrowthSuiteLive() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getWorkflows(), getCalendar(), getTickets(), getFeedback()]).then(([w, c, t, f]) => {
      setWorkflows(w);
      setCalendar(c);
      setTickets(t);
      setFeedback(f);
    });
  }, []);

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
