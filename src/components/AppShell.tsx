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
  Briefcase,
  Rocket,
  ServerCog,
} from 'lucide-react';

interface AppShellProps {
  activeView: string;
  setActiveView: (view: string) => void;
  modules: Record<string, boolean>;
  toggleModule: (key: string) => void;
  isAuthenticated?: boolean;
  isPlatformOwner?: boolean;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

const navItems = [
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag, access: 'public' },
  { key: 'service-requests', label: 'Service Requests', icon: Briefcase, access: 'public' },
  { key: 'notifications', label: 'Notifications', icon: Bell, access: 'public' },
  { key: 'ai-hub', label: 'AI Hub', icon: Sparkles, access: 'public' },
  { key: 'affiliates', label: 'Affiliates', icon: Handshake, access: 'public' },
  { key: 'community', label: 'Community', icon: MessageSquare, access: 'public' },
  { key: 'checkout', label: 'Checkout', icon: ShoppingCart, access: 'public' },
  { key: 'fulfillment', label: 'Fulfillment', icon: Download, access: 'public' },
  { key: 'profile', label: 'Profile', icon: User, access: 'public' },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, access: 'seller' },
  { key: 'owner-panel', label: 'Owner Control', icon: ServerCog, access: 'owner' },
  { key: 'business-os', label: 'Business OS', icon: Briefcase, access: 'seller' },
  { key: 'growth-suite', label: 'Growth Suite', icon: Rocket, access: 'seller' },
  { key: 'storage', label: 'Storage Vault', icon: Database, access: 'seller' },
  { key: 'invoice', label: 'Invoice', icon: FileText, access: 'seller' },
  { key: 'kanban', label: 'Kanban', icon: Kanban, access: 'seller' },
];

const moduleKeys = [
  { key: 'marketplace', label: 'Marketplace', access: 'public' },
  { key: 'serviceRequests', label: 'Service Requests', access: 'public' },
  { key: 'notifications', label: 'Notifications', access: 'public' },
  { key: 'ownerPanel', label: 'Owner Control', access: 'owner' },
  { key: 'businessOS', label: 'Business OS', access: 'seller' },
  { key: 'growthSuite', label: 'Growth Suite', access: 'seller' },
  { key: 'aiHub', label: 'AI Hub', access: 'public' },
  { key: 'affiliates', label: 'Affiliates', access: 'public' },
  { key: 'community', label: 'Community', access: 'public' },
  { key: 'storage', label: 'Storage Vault', access: 'seller' },
  { key: 'kanban', label: 'Kanban', access: 'seller' },
  { key: 'invoice', label: 'Invoice', access: 'seller' },
  { key: 'aiSupport', label: 'AI Support', access: 'public' },
];

export default function AppShell({ activeView, setActiveView, modules, toggleModule, isAuthenticated = false, isPlatformOwner = false, onSignInClick, onSignOut, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sovereignMode, setSovereignMode] = useState(false);

  const handleNav = (key: string, access?: string) => {
    if ((access === 'seller' || access === 'owner') && !isAuthenticated) {
      onSignInClick?.();
      setSidebarOpen(false);
      return;
    }
    if (access === 'owner' && !isPlatformOwner) {
      setSidebarOpen(false);
      return;
    }
    setActiveView(key);
    setSidebarOpen(false);
  };

  const isDisabled = (key: string) => {
    if (key === 'ai-hub') return modules.aiHub === false;
    if (key === 'business-os') return modules.businessOS === false;
    if (key === 'growth-suite') return modules.growthSuite === false;
    if (key === 'owner-panel') return modules.ownerPanel === false;
    if (key === 'service-requests') return modules.serviceRequests === false;
    return modules[key] === false;
  };

  const visibleNavItems = navItems.filter((item) => item.access !== 'owner' || isPlatformOwner);
  const visibleModuleKeys = moduleKeys.filter((item) => item.access !== 'owner' || isPlatformOwner);

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:self-start`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800"><div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0"><Zap size={16} className="text-slate-900" /></div><div><div className="font-bold text-white text-sm tracking-wide">OmniHub</div><div className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">AI Marketplace MVP</div></div><button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
        <nav className="flex-1 min-h-0 overflow-y-auto py-4">
          <div className="px-3 mb-2"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Navigation</p></div>
          {visibleNavItems.map(({ key, label, icon: Icon, access }) => { const isModuleDisabled = isDisabled(key); const isActive = activeView === key; const isLocked = access === 'seller' && !isAuthenticated; return <button key={key} onClick={() => handleNav(key, access)} className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 relative ${isActive ? 'text-cyan-400 bg-cyan-500/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-cyan-400' : isModuleDisabled ? 'text-slate-600 cursor-default' : isLocked ? 'text-slate-500 hover:text-cyan-300 hover:bg-slate-800/50' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}><Icon size={16} /><span>{label}</span>{isLocked && <Lock size={11} className="ml-auto text-slate-600" />}{isModuleDisabled && <span className="ml-auto text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-medium">OFF</span>}{isActive && <ChevronRight size={12} className="ml-auto" />}</button>; })}
          <div className="px-3 mt-6 mb-2"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Modules</p></div>
          {visibleModuleKeys.map(({ key, label }) => <div key={key} className="flex items-center justify-between px-5 py-2"><span className="text-xs text-slate-400">{label}</span><button onClick={() => toggleModule(key)} className="text-slate-400 hover:text-cyan-400 transition-colors">{modules[key] ? <ToggleRight size={18} className="text-cyan-400" /> : <ToggleLeft size={18} />}</button></div>)}
        </nav>
        <div className="px-5 py-4 border-t border-slate-800 space-y-3"><div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Access Mode</div><div className="text-xs text-slate-300 leading-5">{isPlatformOwner ? 'Owner workspace unlocked.' : isAuthenticated ? 'Seller workspace unlocked.' : 'Public browsing enabled. Seller tools are locked.'}</div></div><button onClick={() => setSovereignMode(!sovereignMode)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${sovereignMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'}`}><Zap size={12} /><span>Sovereign Mode</span><div className={`ml-auto w-2 h-2 rounded-full ${sovereignMode ? 'bg-cyan-400' : 'bg-slate-600'}`} /></button></div>
      </aside>
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0"><header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center gap-4"><button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button><div className="hidden sm:flex items-center gap-2 text-xs text-slate-400"><Bot size={14} className="text-cyan-400" /><span>Marketplace + Service Requests + AI Hub + Affiliates + Community are public. Seller tools require login.</span></div><div className="flex-1" /><button onClick={() => handleNav('notifications', 'public')} className="relative text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"><Bell size={18} /><span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full" /></button><div className="relative"><button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" /><span className="hidden sm:block text-xs font-medium text-slate-300">{isPlatformOwner ? 'Owner' : isAuthenticated ? 'Seller' : 'Guest'}</span><ChevronDown size={12} className="text-slate-500" /></button>{userMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50"><button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800"><Settings size={14} />Settings</button>{isAuthenticated ? <button onClick={onSignOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800"><LogOut size={14} />Sign out</button> : <button onClick={onSignInClick} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 hover:bg-slate-800"><LogIn size={14} />Seller login</button>}</div>}</div></header><main className="flex-1 overflow-y-auto bg-slate-950 min-h-0">{children}</main></div>
    </div>
  );
}
