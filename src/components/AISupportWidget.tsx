import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { mockAIMessages } from '../data/mockData';

const aiResponses = [
  "Great question! I am here to help you get the most out of OmniHub. What would you like to know more about?",
  "Sure! You can manage all your digital products from the Merchant Dashboard. Click 'Add New Product' to get started.",
  "For payment issues, make sure your QRIS or Stripe integration is set up correctly in your settings.",
  "Your OmniHub profile works like a bio-link page combined with a shop. Share your @username link anywhere to drive traffic.",
  "The Community module lets you build your audience directly on your platform — no third-party tools needed!",
  "Need help with something specific? I can walk you through any feature of OmniHub step by step.",
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface AISupportWidgetProps {
  enabled: boolean;
}

export default function AISupportWidget({ enabled }: AISupportWidgetProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockAIMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized]);

  if (!enabled) return null;

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: 'm_' + Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { id: 'm_' + (Date.now() + 1), role: 'assistant', text: reply }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <Bot size={22} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`
          fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden transition-all
          ${minimized ? 'h-14' : 'h-[480px]'}
        `}>
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex-shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Bot size={15} className="text-cyan-400" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-800 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">OmniHub AI Assistant</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                Online
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-700 transition-all"
              >
                {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-700 transition-all"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={11} className="text-cyan-400" />
                      </div>
                    )}
                    <div className={`
                      max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-cyan-500 text-slate-900 font-medium rounded-tr-sm'
                        : 'bg-slate-800 text-slate-300 rounded-tl-sm'
                      }
                    `}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot size={11} className="text-cyan-400" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-3 py-2">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 p-3 border-t border-slate-800 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-8 h-8 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
