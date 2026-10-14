import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UnitItem } from '../../types';
import { sound } from '../../utils/audio';

export const UnitsRadialMap: React.FC = () => {
  const { course, openUnit, backToCourses } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(() => {
    return course.units.find((u) => u.status === 'current') || course.units[0];
  });

  const handleSelectUnit = (unit: UnitItem) => {
    sound.playClick();
    setSelectedUnit(unit);
  };

  const handleEnterUnit = (unitId: number) => {
    sound.playClick();
    openUnit(unitId);
  };

  // Orbital positions for 5 units in a circular star constellation:
  // Using relative math so it renders cleanly and responsively
  const positions = [
    { top: '12%', left: '50%', transform: 'translate(-50%, -50%)' }, // Top (Unit I)
    { top: '38%', left: '85%', transform: 'translate(-50%, -50%)' }, // Top-Right (Unit II)
    { top: '80%', left: '72%', transform: 'translate(-50%, -50%)' }, // Bottom-Right (Unit III)
    { top: '80%', left: '28%', transform: 'translate(-50%, -50%)' }, // Bottom-Left (Unit IV)
    { top: '38%', left: '15%', transform: 'translate(-50%, -50%)' }, // Top-Left (Unit V)
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={backToCourses}
            className="w-8 h-8 rounded-lg bg-[#1a1611] hover:bg-[#251e15] border border-[#2b2418] flex items-center justify-center text-[#8e806c] hover:text-[#d4a340] transition-colors"
            title="Back to Courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider">
            <span
              onClick={backToCourses}
              className="text-[#7e715d] hover:text-[#bcae97] cursor-pointer uppercase"
            >
              COURSES
            </span>
            <span className="text-[#4e4537]">&gt;</span>
            <span className="text-[#d4a340] font-bold uppercase">
              {course.title.toUpperCase()}
            </span>
          </div>
        </div>

        <span className="text-xs text-[#7e715d]">
          {course.units.filter((u) => u.status === 'completed').length} / {course.units.length} Units Mastered
        </span>
      </div>

      {/* Main Radial Orbital Arena */}
      <div className="relative min-h-[520px] bg-[#14100c] border border-[#262016] rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center shadow-2xl">
        {/* Subtle Constellation Lines & Orbital Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer circle ring */}
          <div className="w-[360px] h-[360px] rounded-full border border-[#2a2217]/50" />
          {/* Middle circle ring */}
          <div className="w-[260px] h-[260px] rounded-full border border-dashed border-[#342a1b]/40" />
          {/* Center glow */}
          <div className="w-[120px] h-[120px] rounded-full bg-[#d4a340]/5 blur-2xl" />
        </div>

        {/* Center "UNITS" hub label (matching video exactly) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
          <span className="text-xs font-bold font-cinzel tracking-[0.3em] text-[#6d5e49] uppercase block">
            UNITS
          </span>
        </div>

        {/* 5 Orbital Units nodes */}
        <div className="absolute inset-0">
          {course.units.map((unit, index) => {
            const isCurrent = unit.status === 'current';
            const isCompleted = unit.status === 'completed';
            const isLocked = unit.status === 'locked';
            const isSelected = selectedUnit?.id === unit.id;
            const pos = positions[index % positions.length];

            return (
              <div
                key={unit.id}
                style={{ top: pos.top, left: pos.left, transform: pos.transform }}
                className="absolute"
              >
                <button
                  onClick={() => handleSelectUnit(unit)}
                  className={`group relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-20 h-20 bg-gradient-to-tr from-[#d4a340] to-[#f4c856] text-[#1a1408] font-bold shadow-xl shadow-[#d4a340]/40 scale-105'
                      : isSelected
                      ? 'w-16 h-16 bg-[#251e15] border-2 border-[#d4a340] text-[#f2cb6c] shadow-lg shadow-[#d4a340]/20 scale-105'
                      : isCompleted
                      ? 'w-16 h-16 bg-[#20271b] border-2 border-[#5ab36d] text-[#68cf7f] shadow-md shadow-[#5ab36d]/20'
                      : 'w-16 h-16 bg-[#1a1611] border border-[#2c2419] text-[#786b58] hover:border-[#4d3e2b] hover:text-[#baa992]'
                  }`}
                >
                  {/* Glowing pulse rings for active current unit */}
                  {isCurrent && (
                    <div className="absolute -inset-2.5 rounded-full border-2 border-[#d4a340]/50 animate-ping pointer-events-none" />
                  )}

                  {/* Roman Numeral */}
                  <span className="text-xl font-cinzel font-bold tracking-tight">
                    {unit.roman}
                  </span>

                  {/* Lock icon for locked units */}
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#120f0c] border border-[#2c2419] flex items-center justify-center text-[#6e604f]">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}

                  {/* Checkmark icon for completed units */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#172414] border border-[#489157] flex items-center justify-center text-[#55c179]">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}

                  {/* Unit Title hover label */}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-[#cbbfae] bg-[#16120e]/90 px-2 py-0.5 rounded border border-[#2c2317] pointer-events-none">
                    {unit.title}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Unit Details Flyout Card (matching video at 00:29) */}
        {selectedUnit && (
          <div className="absolute bottom-6 right-6 max-w-sm w-full bg-[#181410]/95 backdrop-blur-md border border-[#d4a340]/50 rounded-2xl p-5 shadow-2xl shadow-black/60 z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#d4a340] uppercase">
                  {selectedUnit.status === 'current'
                    ? 'STATUS: CURRENT UNIT'
                    : selectedUnit.status === 'completed'
                    ? 'STATUS: COMPLETED'
                    : 'STATUS: LOCKED UNIT'}
                </span>
                <span className="text-xs font-mono text-[#8a7c67]">
                  Unit {selectedUnit.roman}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold font-cinzel text-[#f5ebd7]">
                  {selectedUnit.title}
                </h4>
                <p className="text-xs text-[#8e806c]">
                  {selectedUnit.subtitle}
                </p>
              </div>

              {/* Topics Breakdown Checklist */}
              <div className="space-y-1.5 pt-1 border-t border-[#2a2217]">
                <span className="text-[10px] font-bold tracking-wider text-[#796c58] uppercase block">
                  Curriculum Milestones
                </span>
                {selectedUnit.topics.map((topic, i) => (
                  <div
                    key={i}
                    className="text-xs text-[#cfc2ad] flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4a340]" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {selectedUnit.status !== 'locked' ? (
                <button
                  onClick={() => handleEnterUnit(selectedUnit.id)}
                  className="w-full mt-2 bg-[#d4a340] hover:bg-[#e4b344] text-[#140e04] font-bold text-xs tracking-wider uppercase py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#d4a340]/25 transition-all hover:scale-[1.01]"
                >
                  <span>Enter Unit Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="mt-2 text-center py-2 px-3 rounded-xl bg-[#120f0c] border border-[#272017] text-xs text-[#7d705c] flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pass preceding Gateway Quiz to unlock</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
