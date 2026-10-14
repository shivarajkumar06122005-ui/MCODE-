import React from 'react';
import {
  BookOpen,
  Home,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import { NavigationTab, useApp } from '../context/AppContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setOnboardingCompleted } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'lessons', label: 'My Lessons', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'pets', label: 'My Pets', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#14110e] border-r border-[#262016] flex flex-col justify-between p-6 select-none shrink-0 min-h-screen">
      <div>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3.5 mb-10 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#d4a340] p-0.5 shadow-lg shadow-[#1e3a8a]/30 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-[10px] bg-[#16120e] flex items-center justify-center border border-[#e5b34a]/30">
              {/* MCODE monogram */}
              <span className="font-bold text-sm font-cinzel tracking-wider bg-gradient-to-r from-[#d4a340] to-[#60a5fa] bg-clip-text text-transparent">
                M
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider font-cinzel text-[#f0e4d0] group-hover:text-[#60a5fa] transition-colors">
              MCODE
            </h1>
            <span className="text-[10px] tracking-widest text-[#8d7e67] uppercase block font-medium">
              Study Engine
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left relative ${
                  isActive
                    ? 'bg-[#231d14] text-[#f2cb6c] border border-[#d4a340]/40 shadow-md shadow-[#d4a340]/5 nav-btn-active'
                    : 'text-[#9c8e79] hover:text-[#e4d8c5] hover:bg-[#1a1610] nav-btn-inactive'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#d4a340]" />
                )}
                <span className={isActive ? 'text-[#e6b343]' : 'text-[#817460]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls & Onboarding trigger */}
      <div className="pt-6 border-t border-[#231d15] space-y-2">
        <button
          onClick={() => setOnboardingCompleted(false)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#7d705c] hover:text-[#d4a340] hover:bg-[#1b1610] transition-colors"
          title="Re-open original onboarding flow from the video"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replay Onboarding</span>
          </span>
          <span className="text-[10px] bg-[#211b13] px-1.5 py-0.5 rounded text-[#a09077] border border-[#30271b]">
            Tutorial
          </span>
        </button>

        <div className="text-[11px] text-[#615543] px-3 pt-1">
          MCODE v1.0.4 • Academic AI
        </div>
      </div>
    </aside>
  );
};
