import { useMemo, useState } from 'react';
import { Bot, Sparkles, Store, Search, MessageSquareText, Megaphone, Wand2, Copy, CheckCircle } from 'lucide-react';

const aiTools = [
  {
    id: 'seller-assistant',
    title: 'AI Seller Assistant',
    icon: Store,
    description: 'Generate product titles, descriptions, pricing notes, and store positioning for sellers.',
    prompt: 'Create a premium marketplace listing for a digital product that helps small businesses save time.',
  },
  {
    id: 'buyer-assistant',
    title: 'AI Buyer Assistant',
    icon: Search,
    description: 'Help buyers explain what they need and find the right products or services.',
    prompt: 'I need a simple tool to help my online shop look more professional. Recommend what I should search for.',
  },
  {
    id: 'support-assistant',
    title: 'AI Support Assistant',
    icon: MessageSquareText,
    description: 'Draft friendly answers for order questions, delivery access, and seller FAQs.',
    prompt: 'Write a polite support reply for a buyer who cannot find their download link after checkout.',
  },
  {
    id: 'growth-assistant',
    title: 'AI Growth Assistant',
    icon: Megaphone,
    description: 'Create daily content ideas, promo angles, and simple launch plans for seller stores.',
    prompt: 'Give me 7 short content ideas to promote a digital template product this week.',
  },
];

function buildLocalResponse(input: string, toolTitle: string) {
  const cleanInput = input.trim() || 'Build a useful OmniHub marketplace asset.';

  return [
    `${toolTitle} Draft`,
    '',
    `Goal: ${cleanInput}`,
    '',
    '1. Clear offer angle:',
    'Turn the idea into one specific buyer outcome, not a generic product claim.',
    '',
    '2. Marketplace-ready positioning:',
    'Explain who it is for, what problem it solves, and what the buyer gets after purchase.',
    '',
    '3. Suggested output:',
    `Create a concise title, a benefit-led description, 3 key features, 3 buyer use cases, and one simple call-to-action for: ${cleanInput}`,
    '',
    'Note: This is the local MVP assistant. The live OpenAI API engine should be connected later through a secure backend or Supabase Edge Function.',
  ].join('\n');
}

export default function AIHub() {
  const [selectedTool, setSelectedTool] = useState(aiTools[0]);
  const [input, setInput] = useState(aiTools[0].prompt);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => buildLocalResponse(input, selectedTool.title), [input, selectedTool]);

  const handleSelectTool = (tool: typeof aiTools[number]) => {
    setSelectedTool(tool);
    setInput(tool.prompt);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-3">
              <Sparkles size={12} />
              OmniHub AI Engine
            </div>
            <h1 className="text-2xl font-bold text-white">AI Hub for sellers, buyers, support, and growth</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              This is the MVP AI command center. It works now as a local prompt engine and is ready for a secure OpenAI backend later.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-cyan-300">
              <Bot size={16} />
              Secure API plan
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              API keys stay outside frontend code. AI calls should go through Supabase Edge Functions or another backend.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-3">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            const active = selectedTool.id === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${active ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-xl p-2 ${active ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{tool.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{tool.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white">{selectedTool.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Create a reusable draft for OmniHub workflows.</p>
            </div>
            <Wand2 size={18} className="text-cyan-400" />
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                What do you want AI to help with?
              </label>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Generated MVP Draft</span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                >
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-300 font-sans">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
