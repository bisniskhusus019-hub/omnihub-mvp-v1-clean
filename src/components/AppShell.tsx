import React, { useState } from 'react';
import {
  LayoutDashboard, User, ShoppingBag, ShoppingCart, MessageSquare,
  Download, FileText, Kanban, ChevronRight, Menu, X, Bell, Settings,
  LogOut, ChevronDown, Zap, ToggleLeft, ToggleRight, Bot
} from 'lucide-react';

interface AppShellProps {
  activeView: string;
  setActiveView: (view: string) => void;
  modules: Record<string, boolean>;
  toggleModule: (key: string) => void;
  children: React.ReactNode;
}

const navItems = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { key: 'checkout', label: 'Checkout', icon: ShoppingCart },
  { key: 'community', label: 'Community', icon: MessageSquare },
  { key: 'fulfillment', label: 'Fulfillment', icon: Download },
  { key: 'invoice', label: 'Invoice', icon: FileText },
  { key: 'kanban', label: 'Kanban', icon: Kanban },
];

const moduleKeys = [
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'community', label: 'Community' },
  { key: 'kanban', label: 'Kanban' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'aiSupport', label: 'AI Support' },
];

export default function AppShell({ activeView, setActiveView, modules, toggleModule, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sovereignMode, setSovereignMode] = useState(false);

  const handleNav = (key: string) => {
    setActiveView(key);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:self-start
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-slate-900" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-wide">OmniHub</div>
            <div className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">v1.0</div>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable nav + module toggles */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Navigation</p>
          </div>
          {navItems.map(({ key, label, icon: Icon }) => {
            const isModuleDisabled = modules[key] === false;
            const isActive = activeView === key;
            return (
              <button
                key={key}
                onClick={() => handleNav(key)}
                className={`
                  w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 relative
                  ${isActive
                    ? 'text-cyan-400 bg-cyan-500/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-cyan-400'
                    : isModuleDisabled
                      ? 'text-slate-600 cursor-default'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }
                `}
              >
                <Icon size={16} />
                <span>{label}</span>
                {isModuleDisabled && (
                  <span className="ml-auto text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-medium">OFF</span>
                )}
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </button>
            );
          })}

          {/* Module toggles */}
          <div className="px-3 mt-6 mb-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Modules</p>
          </div>
          {moduleKeys.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between px-5 py-2">
              <span className="text-xs text-slate-400">{label}</span>
              <button onClick={() => toggleModule(key)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                {modules[key] ? <ToggleRight size={18} className="text-cyan-400" /> : <ToggleLeft size={18} />}
              </button>
            </div>
          ))}
        </nav>

        {/* Sovereign Mode */}
        <div className="px-5 py-4 border-t border-slate-800">
          <button
            onClick={() => setSovereignMode(!sovereignMode)}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
              ${sovereignMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'}
            `}
          >
            <Zap size={12} />
            <span>Sovereign Mode</span>
            <div className={`ml-auto w-2 h-2 rounded-full ${sovereignMode ? 'bg-cyan-400' : 'bg-slate-600'}`} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Notifications */}
          <button className="relative text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full" />
          </button>

          {/* User avatar dropdown */}
          <div className="relative">
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
                <div className="text-xs font-semibold text-white leading-none">Rangga</div>
                <div className="text-[10px] text-slate-400 mt-0.5">@rangga.ai</div>
              </div>
              <ChevronDown size={12} className="text-slate-500 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                <button onClick={() => { handleNav('profile'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <User size={12} /> View Profile
                </button>
                <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <Settings size={12} /> Settings
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-slate-800 transition-colors">
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
