import React, { useState } from 'react';
import { ArrowLeft, Key, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IMAGES } from "../../data/imageAssets";
import { LevelItem, UnitItem } from '../../types';
import { sound } from '../../utils/audio';
import { GatewayQuizModal } from './GatewayQuizModal';
import { LevelTasksDrawer } from './LevelTasksDrawer';

interface Props {
  unitId: number;
}

export const UnitPathView: React.FC<Props> = ({ unitId }) => {
  const {
    course,
    backToUnits,
    currentLevelId,
    openLevel,
    closeLevel,
  } = useApp();

  const [showGatewayQuiz, setShowGatewayQuiz] = useState<boolean>(false);

  const unit: UnitItem = course.units.find((u) => u.id === unitId) || course.units[0];
  const activeLevel: LevelItem | undefined = unit.levels.find((l) => l.id === currentLevelId);

  // Responsive coordinates on the 16:9 illustration matching video
  // Lvl 1: On the open magical book on the dais (approx 29% x, 66% y)
  // Lvl 2: Stone bridge crossing (approx 52% x, 62% y)
  // Lvl 3: Courtyard path near lantern (approx 66% x, 58% y)
  // Lvl 4: Steps leading toward gate (approx 66% x, 48% y)
  // Gateway Quiz: Glowing keyhole on the gothic door (approx 65% x, 43% y)

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Breadcrumb Bar (matching video 00:31) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={backToUnits}
            className="w-8 h-8 rounded-lg bg-[#1a1611] hover:bg-[#251e15] border border-[#2b2418] flex items-center justify-center text-[#8e806c] hover:text-[#d4a340] transition-colors"
            title="Back to Units"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider">
            <span
              onClick={backToUnits}
              className="text-[#7e715d] hover:text-[#bcae97] cursor-pointer uppercase"
            >
              COURSES
            </span>
            <span className="text-[#4e4537]">&gt;</span>
            <span
              onClick={backToUnits}
              className="text-[#7e715d] hover:text-[#bcae97] cursor-pointer uppercase"
            >
              {course.title.toUpperCase()}
            </span>
            <span className="text-[#4e4537]">&gt;</span>
            <span className="text-[#d4a340] font-bold uppercase">
              UNIT {unit.roman}: {unit.title.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8c7f6b] font-mono">
            {unit.levels.filter((l) => l.status === 'completed').length} / {unit.levels.length} Quests Complete
          </span>
        </div>
      </div>

      {/* GAMIFIED FANTASY PATHWAY CANVAS */}
      <div className="relative w-full aspect-[16/9] min-h-[460px] max-h-[680px] bg-[#100d0a] border border-[#2c2419] rounded-2xl overflow-hidden shadow-2xl select-none group">
        {/* Fantasy Illustration Background */}
        <img
          src={IMAGES.pathwayMap}
          alt="Scholar Sanctuary Pathway"
          className="w-full h-full object-cover transition-transform duration-700 pointer-events-none group-hover:scale-[1.01]"
        />

        {/* Ambient Dark/Warm Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

        {/* SVG Curved Golden Pathway Line linking the nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldPath" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4a340" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f4c856" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffe488" stopOpacity="1" />
            </linearGradient>
            <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Winding path line connecting book -> bridge -> lanterns -> gate */}
          <path
            d="M 29,66 Q 40,65 52,62 T 66,57 T 66,48 T 65.5,43"
            fill="none"
            stroke="url(#goldPath)"
            strokeWidth="0.8"
            strokeDasharray="2, 1"
            filter="url(#glowLine)"
            className="animate-pulse"
          />
        </svg>

        {/* INTERACTIVE LEVEL NODES */}

        {/* LEVEL 1: Floating on the Open Magic Grimoire on dais (matching video 00:33) */}
        <div
          style={{ left: '29%', top: '65%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <button
            onClick={() => openLevel(1)}
            className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            {/* Pulsing ring */}
            <div className="absolute -inset-2 rounded-full border-2 border-[#55c179]/60 animate-ping pointer-events-none" />

            {/* Glowing badge matching video */}
            <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#3e854f] to-[#55c179] text-[#f2fff5] font-bold text-xs font-mono shadow-xl shadow-[#55c179]/40 border border-[#8ce3a8]/60 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Lvl 1</span>
            </div>

            {/* Sub-label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-[#f4ebdc] bg-[#14100c]/90 px-2 py-0.5 rounded border border-[#3b3121] shadow-md pointer-events-none">
              Vector Spaces
            </div>
          </button>
        </div>

        {/* LEVEL 2: Stone Bridge (matching video 00:47) */}
        <div
          style={{ left: '52%', top: '62%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <button
            onClick={() => openLevel(2)}
            className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <div className="px-3 py-1 rounded-full bg-[#271f14] hover:bg-[#34291a] text-[#d4a340] font-bold text-xs font-mono border border-[#d4a340]/60 shadow-lg shadow-[#d4a340]/20 flex items-center gap-1">
              <span>Lvl 2</span>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-[#c4b59e] bg-[#14100c]/85 px-1.5 py-0.2 rounded border border-[#2b2216] pointer-events-none">
              Subspaces & Span
            </div>
          </button>
        </div>

        {/* LEVEL 3: Courtyard Path (matching video) */}
        <div
          style={{ left: '66%', top: '57%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <button
            onClick={() => openLevel(3)}
            className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <div className="px-3 py-1 rounded-full bg-[#271f14] hover:bg-[#34291a] text-[#d4a340] font-bold text-xs font-mono border border-[#d4a340]/60 shadow-lg shadow-[#d4a340]/20 flex items-center gap-1">
              <span>Lvl 3</span>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-[#c4b59e] bg-[#14100c]/85 px-1.5 py-0.2 rounded border border-[#2b2216] pointer-events-none">
              Linear Independence
            </div>
          </button>
        </div>

        {/* LEVEL 4: Gate Approach */}
        <div
          style={{ left: '66%', top: '48%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <button
            onClick={() => openLevel(4)}
            className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <div className="px-2.5 py-1 rounded-full bg-[#1b1610] text-[#8e806c] hover:text-[#d4a340] font-bold text-xs font-mono border border-[#302619] shadow-md flex items-center gap-1">
              <span>Lvl 4</span>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-[#c4b59e] bg-[#14100c]/85 px-1.5 py-0.2 rounded border border-[#2b2216] pointer-events-none">
              Bases & Dimension
            </div>
          </button>
        </div>

        {/* GATEWAY QUIZ: Glowing Keyhole on Gothic Arched Gate (matching video 00:46) */}
        <div
          style={{ left: '65.5%', top: '43%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-25"
        >
          <button
            onClick={() => {
              sound.playClick();
              setShowGatewayQuiz(true);
            }}
            className="group relative flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-115 active:scale-95"
          >
            {/* Intense golden aura on the lock keyhole */}
            <div className="absolute -inset-3 rounded-full bg-[#f4c856]/30 blur-md animate-pulse pointer-events-none" />

            {/* Glowing Golden Gateway badge matching video */}
            <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d4a340] via-[#f1be4e] to-[#f4c856] text-[#1a1408] font-bold text-xs font-mono uppercase tracking-wider shadow-2xl shadow-[#f4c856]/50 border-2 border-[#fff3cc] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 fill-[#1a1408]" />
              <span>GATEWAY QUIZ</span>
            </div>

            {/* Portal Label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold tracking-widest text-[#f5ebd7] bg-[#16120e]/95 px-2 py-0.5 rounded border border-[#d4a340]/60 pointer-events-none uppercase">
              Unlock Unit II
            </div>
          </button>
        </div>
      </div>

      {/* LEVEL TASKS DRAWER (when Lvl 1 or any level is clicked) */}
      {activeLevel && (
        <LevelTasksDrawer
          unitId={unit.id}
          level={activeLevel}
          onClose={closeLevel}
          onOpenGatewayQuiz={() => {
            closeLevel();
            setShowGatewayQuiz(true);
          }}
        />
      )}

      {/* GATEWAY QUIZ MODAL */}
      {showGatewayQuiz && (
        <GatewayQuizModal
          unit={unit}
          onClose={() => setShowGatewayQuiz(false)}
          onUnitUnlocked={() => {
            setShowGatewayQuiz(false);
          }}
        />
      )}
    </div>
  );
};
