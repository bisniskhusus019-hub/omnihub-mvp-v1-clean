import { useMemo, useState } from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  FolderKanban,
  Handshake,
  LineChart,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
} from 'lucide-react';

const businessFeatures = [
  {
    id: 'crm',
    title: 'Client CRM',
    icon: Users,
    status: 'MVP Ready',
    description: 'Central place for leads, clients, status, notes, source, and next follow-up.',
    items: ['Lead profile', 'Client status', 'Follow-up reminder', 'Source tracking'],
  },
  {
    id: 'pipeline',
    title: 'Sales Pipeline',
    icon: FolderKanban,
    status: 'MVP Ready',
    description: 'Track deals from new inquiry to closed sale so business flow is not messy.',
    items: ['New lead', 'Contacted', 'Proposal sent', 'Closed won/lost'],
  },
  {
    id: 'finance',
    title: 'Finance Tracker',
    icon: WalletCards,
    status: 'MVP Ready',
    description: 'Simple income, expense, profit, payout, and monthly cash movement view.',
    items: ['Revenue', 'Expense', 'Profit', 'Payout queue'],
  },
  {
    id: 'inventory',
    title: 'Inventory & Asset Control',
    icon: PackageCheck,
    status: 'MVP Ready',
    description: 'Manage digital products, stock, delivery assets, licenses, and product status.',
    items: ['Digital asset list', 'Stock warning', 'License notes', 'Delivery status'],
  },
  {
    id: 'sop',
    title: 'SOP Library',
    icon: ClipboardList,
    status: 'MVP Ready',
    description: 'Reusable business process templates so a seller can run operations consistently.',
    items: ['Order SOP', 'Refund SOP', 'Support SOP', 'Launch SOP'],
  },
  {
    id: 'documents',
    title: 'Documents & Contracts',
    icon: FileSignature,
    status: 'MVP Ready',
    description: 'Business documents for proposals, briefs, agreements, invoices, and client notes.',
    items: ['Proposal draft', 'Client brief', 'Agreement checklist', 'Invoice note'],
  },
  {
    id: 'analytics',
    title: 'KPI Analytics',
    icon: BarChart3,
    status: 'MVP Ready',
    description: 'Simple scorecard for sales, conversion, leads, delivery speed, and growth health.',
    items: ['Conversion rate', 'Revenue growth', 'Order health', 'Lead quality'],
  },
  {
    id: 'partners',
    title: 'Partner & Vendor Hub',
    icon: Handshake,
    status: 'Next Layer',
    description: 'Manage collaborators, vendors, affiliate partners, and service providers.',
    items: ['Partner list', 'Commission note', 'Vendor status', 'Collaboration terms'],
  },
  {
    id: 'risk',
    title: 'Risk & Compliance Desk',
    icon: ShieldCheck,
    status: 'Next Layer',
    description: 'Keep refunds, disputes, policy notes, product risk, and manual review organized.',
    items: ['Refund log', 'Policy checklist', 'Risk level', 'Manual review queue'],
  },
];

const sampleClients = [
  { name: 'Raka Studio', type: 'Design service buyer', stage: 'Proposal sent', value: 'Rp 750.000', next: 'Send revised bundle offer' },
  { name: 'Maya Digital', type: 'Template buyer', stage: 'New lead', value: 'Rp 150.000', next: 'Explain delivery and license' },
  { name: 'Omni Partner', type: 'Affiliate candidate', stage: 'Contacted', value: '20% commission', next: 'Approve partner profile' },
];

const sampleFinance = [
  { label: 'This Month Revenue', value: 'Rp 2.450.000', trend: '+18%' },
  { label: 'Pending Payout', value: 'Rp 350.000', trend: 'Affiliate' },
  { label: 'Manual Expense', value: 'Rp 0', trend: 'Lean mode' },
  { label: 'Estimated Profit', value: 'Rp 2.100.000', trend: 'Healthy' },
];

const sampleSops = [
  'New order fulfillment checklist',
  'Buyer support response flow',
  'Affiliate approval flow',
  'Digital product launch checklist',
];

export default function BusinessOS() {
  const [query, setQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState(businessFeatures[0].id);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([
    'Review new affiliate application',
    'Prepare product thumbnail assets',
    'Create buyer support template',
  ]);

  const filteredFeatures = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return businessFeatures;
    return businessFeatures.filter((feature) => {
      return (
        feature.title.toLowerCase().includes(clean) ||
        feature.description.toLowerCase().includes(clean) ||
        feature.items.some((item) => item.toLowerCase().includes(clean))
      );
    });
  }, [query]);

  const current = businessFeatures.find((feature) => feature.id === activeFeature) || businessFeatures[0];
  const CurrentIcon = current.icon;

  const addTask = () => {
    const clean = newTask.trim();
    if (!clean) return;
    setTasks((currentTasks) => [clean, ...currentTasks]);
    setNewTask('');
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 p-6 sm:p-8 shadow-2xl shadow-cyan-950/10">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-4">
                <BriefcaseBusiness size={13} /> Business Operating System
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Business OS</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                A business command center for sellers and solopreneurs: organize clients, sales, money, SOPs, documents, tasks, analytics, partners, and risk in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-full xl:min-w-[520px]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Features</p>
                <p className="mt-1 text-xl font-black text-white">9</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">MVP Ready</p>
                <p className="mt-1 text-xl font-black text-cyan-300">7</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tasks</p>
                <p className="mt-1 text-xl font-black text-white">{tasks.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mode</p>
                <p className="mt-1 text-xl font-black text-emerald-300">Lean</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <label className="relative block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search business feature..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFeatures.map((feature) => {
                const Icon = feature.icon;
                const active = feature.id === activeFeature;
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => setActiveFeature(feature.id)}
                    className={`text-left rounded-3xl border p-4 transition-all ${
                      active
                        ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-950/20'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                        <Icon size={17} className={active ? 'text-cyan-300' : 'text-slate-400'} />
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-black ${
                        feature.status === 'MVP Ready'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-amber-500/10 text-amber-300'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-black text-white">{feature.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{feature.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                    <CurrentIcon size={20} className="text-cyan-300" />
                  </div>
                  <h2 className="text-xl font-black text-white">{current.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{current.description}</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[11px] font-black text-cyan-300">
                  {current.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
                    <CheckCircle2 size={15} className="text-emerald-300 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Target size={16} className="text-cyan-300" /> Client Pipeline Snapshot
                </h3>
                <div className="mt-4 space-y-3">
                  {sampleClients.map((client) => (
                    <div key={client.name} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{client.name}</h4>
                          <p className="mt-1 text-xs text-slate-500">{client.type}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">{client.stage}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>{client.value}</span>
                        <span>{client.next}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <LineChart size={16} className="text-cyan-300" /> Finance & KPI Snapshot
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleFinance.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{item.label}</p>
                      <p className="mt-2 text-lg font-black text-white">{item.value}</p>
                      <p className="mt-1 text-xs text-cyan-300">{item.trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ClipboardList size={16} className="text-cyan-300" /> Operations Task Pad
                </h3>
                <div className="mt-4 flex gap-2">
                  <input
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                    placeholder="Add quick business task..."
                    className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    className="rounded-2xl bg-cyan-500 px-4 py-3 text-slate-950 font-black hover:bg-cyan-400"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {tasks.map((task) => (
                    <div key={task} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-300 flex-shrink-0" /> {task}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ReceiptText size={16} className="text-cyan-300" /> SOP Starter Library
                </h3>
                <div className="mt-4 space-y-3">
                  {sampleSops.map((sop) => (
                    <div key={sop} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Sparkles size={14} className="text-cyan-300" /> {sop}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Draft template ready for future AI generation and seller customization.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
