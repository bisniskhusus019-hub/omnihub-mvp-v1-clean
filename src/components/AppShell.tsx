import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  ShoppingCart,
  MessageSquare,
  Download,
  FileText,
  Kanban,
  ChevronRight,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  ToggleLeft,
  ToggleRight,
  Bot,
  Lock,
  LogIn,
  Sparkles,
  Handshake,
  Database,
} from 'lucide-react';

interface AppShellProps {
  activeView: string;
  setActiveView: (view: string) => void;
  modules: Record<string, boolean>;
  toggleModule: (key: string) => void;
  isAuthenticated?: boolean;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

const navItems = [
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag, access: 'public' },
  { key: 'ai-hub', label: 'AI Hub', icon: Sparkles, access: 'public' },
  { key: 'affiliates', label: 'Affiliates', icon: Handshake, access: 'public' },
  { key: 'community', label: 'Community', icon: MessageSquare, access: 'public' },
  { key: 'checkout', label: 'Checkout', icon: ShoppingCart, access: 'public' },
  { key: 'fulfillment', label: 'Fulfillment', icon: Download, access: 'public' },
  { key: 'profile', label: 'Profile', icon: User, access: 'public' },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, access: 'seller' },
  { key: 'storage', label: 'Storage Vault', icon: Database, access: 'seller' },
  { key: 'invoice', label: 'Invoice', icon: FileText, access: 'seller' },
  { key: 'kanban', label: 'Kanban', icon: Kanban, access: 'seller' },
];

const moduleKeys = [
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'aiHub', label: 'AI Hub' },
  { key: 'affiliates', label: 'Affiliates' },
  { key: 'community', label: 'Community' },
  { key: 'storage', label: 'Storage Vault' },
  { key: 'kanban', label: 'Kanban' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'aiSupport', label: 'AI Support' },
];

export default function AppShell({
  activeView,
  setActiveView,
  modules,
  toggleModule,
  isAuthenticated = false,
  onSignInClick,
  onSignOut,
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sovereignMode, setSovereignMode] = useState(false);

  const handleNav = (key: string, access?: string) => {
    if (access === 'seller' && !isAuthenticated) {
      onSignInClick?.();
      setSidebarOpen(false);
      return;
    }

    setActiveView(key);
    setSidebarOpen(false);
  };

  const isDisabled = (key: string) => {
    if (key === 'ai-hub') return modules.aiHub === false;
    return modules[key] === false;
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:self-start
      `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-slate-900" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-wide">OmniHub</div>
            <div className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">AI Marketplace MVP</div>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto py-4">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">
              Navigation
            </p>
          </div>

          {navItems.map(({ key, label, icon: Icon, access }) => {
            const isModuleDisabled = isDisabled(key);
            const isActive = activeView === key;
            const isLocked = access === 'seller' && !isAuthenticated;

            return (
              <button
                key={key}
                onClick={() => handleNav(key, access)}
                className={`
                  w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 relative
                  ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-cyan-400'
                      : isModuleDisabled
                      ? 'text-slate-600 cursor-default'
                      : isLocked
                      ? 'text-slate-500 hover:text-cyan-300 hover:bg-slate-800/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }
                `}
              >
                <Icon size={16} />
                <span>{label}</span>
                {isLocked && <Lock size={11} className="ml-auto text-slate-600" />}
                {isModuleDisabled && (
                  <span className="ml-auto text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                    OFF
                  </span>
                )}
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </button>
            );
          })}

          <div className="px-3 mt-6 mb-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">
              Modules
            </p>
          </div>
          {moduleKeys.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between px-5 py-2">
              <span className="text-xs text-slate-400">{label}</span>
              <button
                onClick={() => toggleModule(key)}
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {modules[key] ? <ToggleRight size={18} className="text-cyan-400" /> : <ToggleLeft size={18} />}
              </button>
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-slate-800 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
              Access Mode
            </div>
            <div className="text-xs text-slate-300 leading-5">
              {isAuthenticated ? 'Seller workspace unlocked.' : 'Public browsing enabled. Seller tools are locked.'}
            </div>
          </div>

          <button
            onClick={() => setSovereignMode(!sovereignMode)}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
              ${
                sovereignMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }
            `}
          >
            <Zap size={12} />
            <span>Sovereign Mode</span>
            <div className={`ml-auto w-2 h-2 rounded-full ${sovereignMode ? 'bg-cyan-400' : 'bg-slate-600'}`} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Bot size={14} className="text-cyan-400" />
            <span>Marketplace + AI Hub + Affiliates + Community are public. Seller dashboard requires login.</span>
          </div>

          <div className="flex-1" />

          <button className="relative text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full" />
          </button>

          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80"
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-none">Seller</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">workspace active</div>
                </div>
                <ChevronDown size={12} className="text-slate-500 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={onSignInClick}
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                <LogIn size={14} />
                Seller Login
              </button>
            )}

            {userMenuOpen && isAuthenticated && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                <button
                  onClick={() => {
                    handleNav('profile', 'public');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <User size={12} /> View Public Profile
                </button>
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Settings size={12} /> Settings
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSignOut?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
