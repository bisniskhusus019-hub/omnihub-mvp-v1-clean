import { useMemo, useState } from 'react';
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Globe2,
  HelpCircle,
  Mail,
  Megaphone,
  MessageCircle,
  PackageOpen,
  PenTool,
  PlugZap,
  Plus,
  Rocket,
  Search,
  Send,
  ShieldQuestion,
  Sparkles,
  Star,
  Workflow,
} from 'lucide-react';

const growthModules = [
  {
    id: 'automation-agent',
    title: 'Automation Agent Builder',
    icon: Workflow,
    stage: 'Blueprint',
    purpose: 'Create simple when-this-happens AI workflows for seller operations.',
    outputs: ['Trigger library', 'AI action blocks', 'Manual run test', 'Saved workflow drafts'],
  },
  {
    id: 'content-calendar',
    title: 'Content Calendar',
    icon: CalendarDays,
    stage: 'Blueprint',
    purpose: 'Plan posts, campaigns, launches, product promos, and affiliate content.',
    outputs: ['Weekly plan', 'Campaign status', 'Post ideas', 'Launch calendar'],
  },
  {
    id: 'proposal-builder',
    title: 'Proposal Builder',
    icon: PenTool,
    stage: 'Blueprint',
    purpose: 'Turn client needs into proposals, packages, scope, and pricing blocks.',
    outputs: ['Proposal draft', 'Scope table', 'Offer stack', 'Client summary'],
  },
  {
    id: 'client-portal',
    title: 'Client Portal',
    icon: Globe2,
    stage: 'Blueprint',
    purpose: 'Give buyers and service clients a clean place to see deliverables and updates.',
    outputs: ['Project status', 'Files', 'Messages', 'Approvals'],
  },
  {
    id: 'support-inbox',
    title: 'Support Inbox',
    icon: MessageCircle,
    stage: 'Blueprint',
    purpose: 'Collect buyer questions, order issues, and support conversations.',
    outputs: ['Ticket queue', 'Priority tag', 'AI reply draft', 'Resolution status'],
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    icon: HelpCircle,
    stage: 'Blueprint',
    purpose: 'Store FAQs, product guides, refund rules, and customer education pages.',
    outputs: ['FAQ section', 'Guide pages', 'Policy library', 'Search-ready content'],
  },
  {
    id: 'email-campaigns',
    title: 'Email Campaigns',
    icon: Mail,
    stage: 'Blueprint',
    purpose: 'Prepare launch emails, buyer follow-up, abandoned checkout, and partner outreach.',
    outputs: ['Email sequence', 'Subject lines', 'Buyer follow-up', 'Affiliate outreach'],
  },
  {
    id: 'subscription-billing',
    title: 'Subscription Billing',
    icon: CreditCard,
    stage: 'Blueprint',
    purpose: 'Prepare recurring plans for tools, templates, services, memberships, or AI credits.',
    outputs: ['Plan tiers', 'Usage limits', 'Billing status', 'Upgrade prompts'],
  },
  {
    id: 'launchpad',
    title: 'Product Launchpad',
    icon: Rocket,
    stage: 'Blueprint',
    purpose: 'Organize every product launch from idea, validation, assets, page, promo, and review.',
    outputs: ['Launch checklist', 'Asset readiness', 'Promo plan', 'Post-launch review'],
  },
  {
    id: 'feedback',
    title: 'Feedback & Review Hub',
    icon: Star,
    stage: 'Blueprint',
    purpose: 'Collect testimonials, bug reports, feature requests, and customer improvement ideas.',
    outputs: ['Review cards', 'Feature requests', 'Bug list', 'Customer proof'],
  },
  {
    id: 'integrations',
    title: 'Integration Center',
    icon: PlugZap,
    stage: 'Blueprint',
    purpose: 'Prepare future connections to email, webhook, Google Sheets, payment, AI, and WhatsApp-like flows.',
    outputs: ['Connector list', 'Webhook draft', 'API status', 'Safe secret checklist'],
  },
  {
    id: 'trust-center',
    title: 'Trust Center',
    icon: ShieldQuestion,
    stage: 'Blueprint',
    purpose: 'Show buyer trust assets: policies, seller verification, dispute rules, and safety notes.',
    outputs: ['Refund rules', 'Seller verification', 'Dispute flow', 'Buyer protection note'],
  },
];

const workflowTemplates = [
  { trigger: 'New product added', action: 'AI writes launch copy', output: 'Save to Content Calendar' },
  { trigger: 'Buyer asks question', action: 'AI drafts support reply', output: 'Add to Support Inbox' },
  { trigger: 'Affiliate applies', action: 'AI scores partner fit', output: 'Send to Partner Review' },
  { trigger: 'Client fills brief', action: 'AI creates proposal outline', output: 'Save Proposal Draft' },
];

const launchChecklist = [
  'Define customer pain and offer promise',
  'Prepare product file and thumbnail',
  'Write marketplace description',
  'Create launch posts and email sequence',
  'Recruit 3 affiliate partners',
  'Check checkout and fulfillment flow',
  'Collect first review after delivery',
];

export default function GrowthSuite() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(growthModules[0].id);
  const [campaignIdea, setCampaignIdea] = useState('Launch a new digital product bundle for beginner sellers');

  const filtered = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return growthModules;
    return growthModules.filter((item) =>
      item.title.toLowerCase().includes(clean) ||
      item.purpose.toLowerCase().includes(clean) ||
      item.outputs.some((output) => output.toLowerCase().includes(clean))
    );
  }, [query]);

  const active = growthModules.find((item) => item.id === selected) || growthModules[0];
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-8 shadow-2xl shadow-cyan-950/10">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-4">
                <Sparkles size={13} /> Growth & Automation Suite
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Growth Suite</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Extra business features for growth, automation, marketing, client delivery, trust, support, and subscriptions. This is the expansion layer before each feature gets a real database and workflow engine.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-full xl:min-w-[520px]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">New Modules</p>
                <p className="mt-1 text-xl font-black text-white">12</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Workflows</p>
                <p className="mt-1 text-xl font-black text-cyan-300">4</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Launch Steps</p>
                <p className="mt-1 text-xl font-black text-white">7</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</p>
                <p className="mt-1 text-xl font-black text-amber-300">Blueprint</p>
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
                  placeholder="Search growth feature..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((module) => {
                const Icon = module.icon;
                const activeState = module.id === selected;
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setSelected(module.id)}
                    className={`text-left rounded-3xl border p-4 transition-all ${
                      activeState
                        ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-950/20'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                        <Icon size={17} className={activeState ? 'text-cyan-300' : 'text-slate-400'} />
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-black text-amber-300">
                        {module.stage}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-black text-white">{module.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{module.purpose}</p>
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
                    <ActiveIcon size={20} className="text-cyan-300" />
                  </div>
                  <h2 className="text-xl font-black text-white">{active.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{active.purpose}</p>
                </div>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-black text-amber-300">
                  {active.stage}
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.outputs.map((output) => (
                  <div key={output} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
                    <CheckCircle2 size={15} className="text-emerald-300 flex-shrink-0" /> {output}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Workflow size={16} className="text-cyan-300" /> Automation Templates
                </h3>
                <div className="mt-4 space-y-3">
                  {workflowTemplates.map((flow) => (
                    <div key={flow.trigger} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">When</div>
                      <div className="text-sm font-bold text-white mt-1">{flow.trigger}</div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3"><Bot size={13} className="inline text-cyan-300 mr-1" /> {flow.action}</div>
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3"><Send size={13} className="inline text-emerald-300 mr-1" /> {flow.output}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Rocket size={16} className="text-cyan-300" /> Launchpad Checklist
                </h3>
                <div className="mt-4 space-y-2">
                  {launchChecklist.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-300 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Megaphone size={16} className="text-cyan-300" /> Campaign Draft Pad
              </h3>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <textarea
                  value={campaignIdea}
                  onChange={(event) => setCampaignIdea(event.target.value)}
                  className="lg:col-span-2 min-h-[150px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
                />
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs leading-5 text-slate-400">
                  <div className="font-black text-white mb-2">AI-ready prompt</div>
                  Turn this campaign idea into: 5 content posts, 3 email subjects, 1 affiliate invitation, 1 marketplace headline, and 1 launch checklist.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <PackageOpen size={18} className="text-cyan-300" />
                <h4 className="mt-3 text-sm font-black text-white">Offer Packs</h4>
                <p className="mt-2 text-xs leading-5 text-slate-500">Bundle templates for selling services, digital products, and subscriptions.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <Mail size={18} className="text-cyan-300" />
                <h4 className="mt-3 text-sm font-black text-white">Message Library</h4>
                <p className="mt-2 text-xs leading-5 text-slate-500">Reusable outreach, support, onboarding, and retention messages.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <CreditCard size={18} className="text-cyan-300" />
                <h4 className="mt-3 text-sm font-black text-white">Plan Matrix</h4>
                <p className="mt-2 text-xs leading-5 text-slate-500">Subscription tier planning for future SaaS and seller tools.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
