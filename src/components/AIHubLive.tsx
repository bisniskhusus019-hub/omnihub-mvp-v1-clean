import { useState } from 'react';
import { Bot, Copy, Sparkles, Wand2 } from 'lucide-react';

const starterPrompt = 'Create a premium marketplace listing for a digital product that helps small businesses save time.';

function fallbackDraft(input: string) {
  const goal = input.trim() || starterPrompt;
  return `OmniHub AI Draft\n\nGoal: ${goal}\n\n1. Clear offer angle:\nTurn the idea into one specific buyer outcome.\n\n2. Marketplace-ready positioning:\nExplain who it is for, what problem it solves, and what the buyer receives.\n\n3. Suggested output:\nCreate a concise title, benefit-led description, 3 features, 3 use cases, and one call-to-action.\n\nLive AI will activate after OPENAI_API_KEY is added in Vercel.`;
}

export default function AIHubLive() {
  const [input, setInput] = useState(starterPrompt);
  const [output, setOutput] = useState(fallbackDraft(starterPrompt));
  const [mode, setMode] = useState('local');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, toolTitle: 'OmniHub AI Hub' }),
      });
      const data = await response.json();
      setOutput(data.output || fallbackDraft(input));
      setMode(data.mode || 'fallback');
    } catch {
      setOutput(fallbackDraft(input));
      setMode('fallback');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => navigator.clipboard.writeText(output);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-3"><Sparkles size={12} /> OmniHub AI Engine</div>
        <h1 className="text-2xl font-black text-white">Live AI Hub</h1>
        <p className="mt-2 text-sm text-slate-400">Secure backend endpoint is active. Frontend never stores private AI keys.</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-300"><Bot size={14} className="text-cyan-300" /> Mode: {mode}</div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Prompt</label>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-200 outline-none focus:border-cyan-500" />
        <div className="flex flex-wrap gap-2">
          <button onClick={generate} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400 disabled:bg-slate-700"><Wand2 size={15} /> {loading ? 'Generating...' : 'Generate'}</button>
          <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-300 hover:border-cyan-500"><Copy size={15} /> Copy</button>
        </div>
        <pre className="whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300 font-sans">{output}</pre>
      </section>
    </div>
  );
}
