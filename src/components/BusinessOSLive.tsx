import { useEffect, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, Plus } from 'lucide-react';
import { addClient, getClients, getFinance, getSops } from '../lib/sellerData';

type Props = { currentSeller?: any };

export default function BusinessOSLive({ currentSeller }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [sops, setSops] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [saving, setSaving] = useState(false);
  const sellerId = currentSeller?.id || null;

  const load = async () => {
    const [clientRows, financeRows, sopRows] = await Promise.all([getClients(), getFinance(), getSops()]);
    setClients(clientRows);
    setFinance(financeRows);
    setSops(sopRows);
  };

  useEffect(() => {
    load();
  }, []);

  const saveClient = async () => {
    if (!sellerId || !clientName.trim()) return;
    setSaving(true);
    await addClient({ seller_id: sellerId, name: clientName.trim(), status: 'lead', value_amount: 0, currency: 'IDR', source: 'manual', next_action: 'Follow up' });
    setClientName('');
    await load();
    setSaving(false);
  };

  const totalFinance = finance.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-4">
            <BriefcaseBusiness size={13} /> Live Business OS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Business OS</h1>
          <p className="mt-3 text-sm text-slate-400">Connected to Supabase: clients, finance entries, and SOP documents.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Clients</p><p className="text-2xl font-black text-white">{clients.length}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Finance rows</p><p className="text-2xl font-black text-white">{finance.length}</p><p className="text-xs text-cyan-300">Rp {totalFinance.toLocaleString('id-ID')}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">SOPs</p><p className="text-2xl font-black text-white">{sops.length}</p></div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-black text-white">Add real client</h3>
            <div className="mt-4 flex gap-2">
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name" className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400" />
              <button disabled={saving || !sellerId} onClick={saveClient} className="rounded-2xl bg-cyan-500 px-4 py-3 text-slate-950 font-black disabled:bg-slate-700"><Plus size={16} /></button>
            </div>
            {!sellerId && <p className="mt-3 text-xs text-amber-300">Seller profile is still loading. Try again after the dashboard fully loads.</p>}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-sm font-black text-white">Client records</h3>
            <div className="mt-4 space-y-2">
              {(clients.length ? clients : [{ name: 'No client rows yet', status: 'empty' }]).slice(0, 6).map((client) => (
                <div key={client.id || client.name} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"><CheckCircle2 size={14} className="text-emerald-300" /> {client.name} <span className="ml-auto text-xs text-slate-500">{client.status}</span></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
