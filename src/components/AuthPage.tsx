import { useState } from 'react';
import { Lock, Mail, User, UserPlus, LogIn, ArrowLeft } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../lib/supabaseStub';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

function makeUsername(email: string) {
  return email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '')
    .slice(0, 28);
}

export default function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const isRegister = mode === 'register';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isRegister) {
        await signUpWithEmail({
          email: form.email,
          password: form.password,
          displayName: form.displayName || makeUsername(form.email),
          username: makeUsername(form.email),
        });
      } else {
        await signInWithEmail({
          email: form.email,
          password: form.password,
        });
      }

      onSuccess();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to public marketplace
        </button>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-5">
            {isRegister ? (
              <UserPlus size={22} className="text-cyan-300" />
            ) : (
              <Lock size={22} className="text-cyan-300" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-white">
            {isRegister ? 'Create seller account' : 'Seller login'}
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-6">
            Buyers can browse marketplace, community, and checkout without login. Seller tools are protected.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Display Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, displayName: event.target.value }))
                    }
                    placeholder="Rangga Adhitya"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="seller@email.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold px-4 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
              {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            {isRegister ? 'Already have an account?' : 'Need a seller account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
