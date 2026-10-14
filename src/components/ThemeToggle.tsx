import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ThemeToggle: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Sun (Light Mode)' : 'Switch to Moon (Dark Mode)'}
      aria-label={isDark ? 'Switch to Sun (Light Mode)' : 'Switch to Moon (Dark Mode)'}
      className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none select-none ${
        size === 'sm' ? 'w-14 h-7 p-0.5' : 'w-16 h-8 p-1'
      } ${
        isDark
          ? 'bg-[#1e1913] border border-[#3e3221] shadow-inner shadow-black/50'
          : 'bg-[#ede5d5] border border-[#c9bba2] shadow-inner shadow-amber-900/10'
      }`}
    >
      {/* Background celestial icons indicator */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none opacity-60">
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-[#6e614d]'}`} />
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-[#e5b344]' : 'text-[#a2927c]'}`} />
      </div>

      {/* Sliding Knob with Sun/Moon Icon */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-300 transform shadow-md ${
          size === 'sm' ? 'w-6 h-6' : 'w-6 h-6'
        } ${
          isDark
            ? 'translate-x-8 bg-gradient-to-tr from-[#261f15] to-[#3a2f1e] text-[#f4c856] border border-[#d4a340]/60 shadow-[#d4a340]/30'
            : 'translate-x-0 bg-gradient-to-tr from-[#ffffff] to-[#fff6df] text-amber-500 border border-amber-300 shadow-amber-500/20'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-[#f4c856]/20 transition-transform duration-300 rotate-0" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-amber-400/30 transition-transform duration-300 rotate-45" />
        )}
      </div>
    </button>
  );
};
