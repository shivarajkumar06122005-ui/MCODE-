import React, { useState } from 'react';
import { ArrowRight, BookOpen, Pause, Play, Quote, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SCHOLAR_QUOTES } from '../../data/defaultData';
import { IMAGES } from '../../data/imageAssets';
import { sound } from '../../utils/audio';

export const HomeView: React.FC = () => {
  const {
    user,
    streak,
    equippedEnvironment,
    equippedPet,
    course,
    openUnit,
    scratchpad,
    setScratchpad,
    heatmap,
    timerSeconds,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useApp();

  const [quoteIndex, setQuoteIndex] = useState(0);

  // Active unit
  const activeUnit = course.units.find((u) => u.status === 'current') || course.units[0];
  const activeLevel = activeUnit.levels.find((l) => l.status === 'unlocked' && l.progress < 100) || activeUnit.levels[0];

  const handleNextQuote = () => {
    sound.playClick();
    setQuoteIndex((prev) => (prev + 1) % SCHOLAR_QUOTES.length);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const petImages: Record<string, string> = {
  lumis: IMAGES.petLumis,
  frodo: IMAGES.petFrodo,
  astrofel: IMAGES.petAstrofel,
  vellum: IMAGES.petVellum,
  quill: IMAGES.petQuill,
};

const environmentImages: Record<string, string> = {
  carrara_atrium: IMAGES.carraraMarble,
  scholars_desk: IMAGES.scholarsDesk,
  vintage_library: IMAGES.vintageLibrary,
  botanists_sanctuary: IMAGES.botanistsSanctuary,
};

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* HERO SANCTUARY BANNER */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2c2419] bg-[#181410] shadow-xl shadow-black/40">
        {/* Background Environment Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700"
          style={{
            backgroundImage: `url(${environmentImages[equippedEnvironment.id] || equippedEnvironment.image})`,
          }}
        />
        {/* Dark radial cozy gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14100c] via-[#16120e]/85 to-transparent" />

        {/* Content */}
        <div className="relative z-10 px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Equipped Pet Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#d4a340]/60 bg-[#221b13] shadow-lg shadow-[#d4a340]/20 flex items-center justify-center">
                <img
                  src={petImages[equippedPet.id] || equippedPet.image}
                  alt={equippedPet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#d4a340] text-[#120f0c] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[#16120e]">
                {equippedPet.name}
              </div>
            </div>

            {/* Greeting & Message */}
            <div className="space-y-1">
              <p className="text-sm md:text-base text-[#cfc2ad] leading-relaxed">
                Good afternoon, <span className="font-bold text-[#f5ebd7]">{user.name}</span>.
                Your streak is at{' '}
                <span className="font-bold text-[#d4a340]">{streak} days</span>.{' '}
                Let's finish up <span className="font-medium text-[#f0e4cc]">{course.title}</span>!
              </p>
              <p className="text-xs text-[#8c7f6b]">
                Sanctuary: <span className="text-[#c7baa6]">{equippedEnvironment.name}</span> • Perk:{' '}
                <span className="text-[#a89980]">{equippedPet.buff}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: UP NEXT & FOCUS TIMER */}
        <div className="lg:col-span-5 space-y-6">
          {/* UP NEXT CARD (matching video exactly) */}
          <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-cinzel tracking-wider text-[#ede4d3]">
                Up Next
              </h3>
              <span className="text-[11px] font-mono text-[#8a7c67]">
                Unit {activeUnit.id} • Level {activeLevel.id}
              </span>
            </div>

            <div>
              <h4 className="text-base font-semibold text-[#f5ebd7]">
                Unit {activeUnit.id}, {activeLevel.name}: {activeLevel.title}
              </h4>
              <p className="text-xs text-[#8b7d69] mt-1 line-clamp-1">
                {activeLevel.description}
              </p>
            </div>

            {/* Level progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#8e806c]">
                <span>Progress</span>
                <span className="font-mono">{activeLevel.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#231c14] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#b38327] to-[#e4b344] transition-all duration-500 rounded-full"
                  style={{ width: `${activeLevel.progress}%` }}
                />
              </div>
            </div>

            {/* Resume Study Button */}
            <button
              onClick={() => openUnit(activeUnit.id)}
              className="w-full bg-[#6c4897] hover:bg-[#7b53ac] active:scale-[0.99] text-[#f7f2fb] font-semibold text-xs tracking-wider uppercase py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#6c4897]/25 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Resume Study</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* FOCUS TIMER CARD (matching video 25:00 timer) */}
          <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 shadow-md shadow-black/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-[#8a7c67] uppercase">
                Focus Timer
              </span>
              <span className="text-[10px] text-[#847663] bg-[#221c13] px-2 py-0.5 rounded-full border border-[#352c1e]">
                Pomodoro
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="text-4xl font-mono font-bold tracking-tight text-[#f4ebda]">
                {formatTimer(timerSeconds)}
              </div>

              <div className="flex items-center gap-2">
                {isTimerRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="w-11 h-11 rounded-xl bg-[#2a2216] border border-[#d4a340]/40 flex items-center justify-center text-[#d4a340] hover:bg-[#332a1c] transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={startTimer}
                    className="w-11 h-11 rounded-xl bg-[#d4a340] text-[#161108] flex items-center justify-center font-bold hover:bg-[#e2b34a] transition-all shadow-md shadow-[#d4a340]/20"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="w-11 h-11 rounded-xl bg-[#1d1711] border border-[#2d2418] flex items-center justify-center text-[#7c6f5b] hover:text-[#c4b39a] hover:bg-[#251e15] transition-colors"
                  title="Reset 25m"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#716553]">
              25 minutes of deep focus earns +25 Scholar Tokens.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: STUDY CONSISTENCY & SCRATCHPAD & QUOTE */}
        <div className="lg:col-span-7 space-y-6">
          {/* STUDY CONSISTENCY HEATMAP */}
          <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4a340]" />
                <h3 className="text-sm font-bold font-cinzel tracking-wider text-[#ede4d3]">
                  Study Consistency
                </h3>
              </div>
              <span className="text-xs text-[#8c7f6b]">Past 5 Weeks</span>
            </div>

            {/* Heatmap Matrix Grid */}
            <div className="p-3 bg-[#130f0c] rounded-xl border border-[#231c13] flex flex-wrap gap-1.5 justify-start">
              {heatmap.map((day, idx) => {
                const colors = [
                  'bg-[#221c15] border-[#292218]', // 0: none
                  'bg-[#37452d] border-[#485b3b]', // 1: light sage
                  'bg-[#4f6b3e] border-[#65894f]', // 2: medium moss
                  'bg-[#6c9354] border-[#8cb770]', // 3: vibrant scholar green
                  'bg-[#8cb770] border-[#b0e090]', // 4: maximum
                ];
                return (
                  <div
                    key={idx}
                    title={`${day.date}: ${day.minutes} min study session`}
                    className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer ${
                      colors[day.intensity]
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* SCHOLAR'S SCRATCHPAD */}
          <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 shadow-md shadow-black/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-[#8a7c67] uppercase">
                Scholar's Scratchpad
              </span>
              <span className="text-[10px] text-[#6d604e]">Auto-saved locally</span>
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              placeholder="jot down theorems, formulas, or quick thoughts..."
              rows={3}
              className="w-full bg-[#120f0c] border border-[#292217] rounded-xl p-3 text-xs text-[#ede5d5] placeholder-[#594e3e] focus:outline-none focus:border-[#d4a340] font-mono leading-relaxed resize-none transition-colors"
            />
          </div>

          {/* DAILY MAXIM / QUOTE */}
          <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 shadow-md shadow-black/20 relative group">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-[#d4a340] shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="text-sm font-serif-quote italic text-[#ded2be] leading-relaxed">
                  "{SCHOLAR_QUOTES[quoteIndex].quote}"
                </p>
                <p className="text-[10px] font-bold tracking-widest text-[#9e8f77] uppercase">
                  — {SCHOLAR_QUOTES[quoteIndex].author}
                </p>
              </div>
              <button
                onClick={handleNextQuote}
                className="w-7 h-7 rounded-lg bg-[#221c13] hover:bg-[#2e261a] border border-[#352b1d] flex items-center justify-center text-[#8e806c] hover:text-[#d4a340] transition-colors"
                title="Next maxim"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
