import React, { useState } from 'react';
import { Coins, Flame, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const { tokens, streak, user, setActiveTab } = useApp();
  const [audioEnabled, setAudioEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setAudioEnabled(sound.enabled);
    if (sound.enabled) {
      sound.playClick();
    }
  };

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-[#241e15] bg-[#14110e]/80 backdrop-blur-md sticky top-0 z-30 select-none header-bar relative">
      {/* Decorative Blue & White tile accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] tile-pattern-bar opacity-70" />

      <div className="flex items-center gap-3">
        {/* Subtle breadcrumb / context */}
        <span className="text-xs tracking-wider uppercase text-[#887862] font-semibold header-dept">
          Department of {user.department}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Sun to Moon Workable Theme Toggle */}
        <ThemeToggle size="sm" />

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          title={audioEnabled ? 'Mute ambient SFX' : 'Enable ambient SFX'}
          className="w-9 h-9 rounded-xl bg-[#1b1712] border border-[#2d251a] flex items-center justify-center text-[#9c8c74] hover:text-[#d4a340] hover:border-[#d4a340]/40 transition-all header-btn"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Tokens Badge (Gold Coin counter as seen in tutorial) */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1912] border border-[#d4a340]/40 shadow-sm shadow-[#d4a340]/10">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#c89222] to-[#f4c856] flex items-center justify-center text-[#211604]">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-[#f0e4cc] font-mono tracking-tight">
            {tokens} Tokens
          </span>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1610] border border-[#352b1e]">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30" />
          <span className="text-xs font-semibold text-[#cfc2ad] font-mono">
            {streak}
          </span>
        </div>

        {/* User Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-2 hover:opacity-85 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b3121] to-[#1f1910] border border-[#c4922e]/40 flex items-center justify-center text-[#e2cfb4] text-xs font-bold font-cinzel shadow-inner">
            {user.name.charAt(0)}
          </div>
        </button>
      </div>
    </header>
  );
};
