import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

type LedgerType = 'seller_sale' | 'affiliate_credit' | 'platform_fee' | 'refund_hold';
type DisputeStatus = 'open' | 'reviewing' | 'resolved';

type LedgerItem = {
  id: string;
  type: LedgerType;
  title: string;
  amount: number;
  currency: string;
  status: 'pending' | 'cleared' | 'held';
  party: string;
};

type DisputeItem = {
  id: string;
  title: string;
  orderRef: string;
  buyer: string;
  seller: string;
  status: DisputeStatus;
  reason: string;
};

const initialLedger: LedgerItem[] = [
  { id: 'l1', type: 'seller_sale', title: 'Digital product sale', amount: 150000, currency: 'IDR', status: 'pending', party: 'Seller' },
  { id: 'l2', type: 'affiliate_credit', title: 'Affiliate referral credit', amount: 25000, currency: 'IDR', status: 'pending', party: 'Affiliate' },
  { id: 'l3', type: 'platform_fee', title: 'Platform fee reserve', amount: 10000, currency: 'IDR', status: 'cleared', party: 'Owner' },
  { id: 'l4', type: 'refund_hold', title: 'Manual review hold', amount: 75000, currency: 'IDR', status: 'held', party: 'Buyer/Seller' },
];

const initialDisputes: DisputeItem[] = [
  { id: 'd1', title: 'Buyer says file access is not available', orderRef: 'ORD-1001', buyer: 'Guest Buyer', seller: 'OmniHub Seller', status: 'open', reason: 'Digital delivery issue' },
  { id: 'd2', title: 'Service scope needs owner review', orderRef: 'ORD-1002', buyer: 'Business Buyer', seller: 'Service Seller', status: 'reviewing', reason: 'Scope mismatch' },
  { id: 'd3', title: 'Refund request resolved manually', orderRef: 'ORD-1003', buyer: 'Creator Buyer', seller: 'Template Seller', status: 'resolved', reason: 'Refund completed' },
];

const statusStyle = {
  pending: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  cleared: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  held: 'border-red-500/20 bg-red-500/10 text-red-300',
  open: 'border-red-500/20 bg-red-500/10 text-red-300',
  reviewing: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  resolved: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
};

function formatMoney(amount: number, currency: string) {
  if (currency === 'IDR') return `Rp ${amount.toLocaleString('id-ID')}`;
  return `${currency} ${amount.toLocaleString()}`;
}

export default function FinanceTrustCenter() {
  const [ledger, setLedger] = useState(initialLedger);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [query, setQuery] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');

  const filteredLedger = useMemo(() => {
    const q = query.toLowerCase();
    return ledger.filter((item) => `${item.title} ${item.party} ${item.type}`.toLowerCase().includes(q));
  }, [ledger, query]);

  const filteredDisputes = useMemo(() => {
    const q = query.toLowerCase();
    return disputes.filter((item) => `${item.title} ${item.orderRef} ${item.buyer} ${item.seller}`.toLowerCase().includes(q));
  }, [disputes, query]);

  const pendingBalance = ledger.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  const heldBalance = ledger.filter((item) => item.status === 'held').reduce((sum, item) => sum + item.amount, 0);
  const ownerRevenue = ledger.filter((item) => item.type === 'platform_fee').reduce((sum, item) => sum + item.amount, 0);

  const createDispute = () => {
    if (!newCaseTitle.trim()) return;
    setDisputes((current) => [
      {
        id: `d-${Date.now()}`,
        title: newCaseTitle.trim(),
        orderRef: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
        buyer: 'New Buyer',
        seller: 'Seller Review Needed',
        status: 'open',
        reason: 'Manual owner review needed',
      },
      ...current,
    ]);
    setNewCaseTitle('');
  };

  const advanceDispute = (id: string) => {
    setDisputes((current) => current.map((item) => {
      if (item.id !== id) return item;
      if (item.status === 'open') return { ...item, status: 'reviewing' };
      if (item.status === 'reviewing') return { ...item, status: 'resolved' };
      return item;
    }));
  };

  return (
    <div className="min-h-full bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-4">
            <Wallet size={13} /> Finance & Trust Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Credit ledger, payout review, and dispute control.</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
            Track pending seller earnings, affiliate credit, platform fees, held balances, manual refunds, buyer issues, seller responses, and owner decisions before real payment automation is enabled.
          </p>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><Clock size={15} className="text-amber-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Pending</p><p className="mt-1 text-xl font-black text-white">{formatMoney(pendingBalance, 'IDR')}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><ShieldCheck size={15} className="text-red-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Held</p><p className="mt-1 text-xl font-black text-white">{formatMoney(heldBalance, 'IDR')}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><CreditCard size={15} className="text-emerald-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Owner Fee</p><p className="mt-1 text-xl font-black text-white">{formatMoney(ownerRevenue, 'IDR')}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><AlertTriangle size={15} className="text-cyan-300" /><p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cases</p><p className="mt-1 text-xl font-black text-white">{disputes.length}</p></div>
          </div>
        </section>

        <label className="relative block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ledger, cases, orders, sellers..." className="w-full rounded-2xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400" /></label>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-black text-white flex items-center gap-2 mb-4"><FileText size={16} className="text-cyan-300" /> Credit Ledger</h2>
            <div className="space-y-3">
              {filteredLedger.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.party} · {item.type.replace('_', ' ')}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${statusStyle[item.status]}`}>{item.status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-cyan-300">{formatMoney(item.amount, item.currency)}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">{item.type === 'platform_fee' ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />} ledger entry</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-black text-white flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-300" /> Dispute / Issue Center</h2>
            <div className="mt-4 flex gap-2"><input value={newCaseTitle} onChange={(event) => setNewCaseTitle(event.target.value)} placeholder="Create a buyer/seller issue case..." className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60" /><button onClick={createDispute} className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-400"><Plus size={15} /></button></div>
            <div className="mt-4 space-y-3">
              {filteredDisputes.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.orderRef} · {item.buyer} → {item.seller}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase ${statusStyle[item.status]}`}>{item.status}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-400">{item.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => advanceDispute(item.id)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-3 py-2 text-xs font-black text-slate-950 hover:bg-cyan-400"><CheckCircle2 size={13} />Advance status</button><button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"><MessageSquare size={13} />Add note</button></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
