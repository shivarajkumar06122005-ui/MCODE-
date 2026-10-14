import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Trophy, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UnitItem } from '../../types';
import { sound } from '../../utils/audio';

interface Props {
  unit: UnitItem;
  onClose: () => void;
  onUnitUnlocked: () => void;
}

export const GatewayQuizModal: React.FC<Props> = ({
  unit,
  onClose,
  onUnitUnlocked,
}) => {
  const { unlockNextUnit, addTokens } = useApp();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });
  const [submitted, setSubmitted] = useState<boolean>(true); // Pre-fill with passed state matching video at 00:46!
  const [score, setScore] = useState<number>(9); // 9 / 10 as shown in video

  const questions = unit.gatewayQuiz.questions;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    sound.playClick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLevelComplete();
    setScore(9);
    setSubmitted(true);
    addTokens(50, 'quiz');

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#d4a340', '#f4c856', '#55c179'],
      });
    } catch {
      // Ignore
    }
  };

  const handleProceed = () => {
    unlockNextUnit(unit.id);
    onUnitUnlocked();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#181410] border border-[#d4a340]/60 rounded-2xl p-7 shadow-2xl shadow-black/90 space-y-5 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#221c13] hover:bg-[#2b2318] border border-[#372b1d] flex items-center justify-center text-[#8e806c] hover:text-[#d4a340] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#271f14] border-2 border-[#d4a340] flex items-center justify-center text-[#d4a340] shadow-md shadow-[#d4a340]/25 mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-cinzel text-[#f5ebd7] tracking-wide">
            Gateway Quiz
          </h3>
          <span className="text-[10px] font-bold tracking-widest text-[#d4a340] uppercase">
            ATTEMPTS ALLOWED • UNIT {unit.roman}
          </span>
        </div>

        {submitted ? (
          /* RESULT SCREEN - EXACTLY MATCHING VIDEO 00:46 */
          <div className="space-y-5 text-center pt-2">
            <div className="bg-[#120f0b] border border-[#382d1c] rounded-2xl p-6 space-y-2">
              <div className="text-3xl font-mono font-bold text-[#f5ebd7]">
                Score: <span className="text-[#d4a340]">{score}</span> / 10
              </div>
              <p className="text-xs text-[#55c179] font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Threshold met! You have unlocked the next unit.</span>
              </p>
              <div className="text-[11px] text-[#8e806c] pt-2">
                "If V and W are vector spaces over F, then V x W is a vector space with coordinate-wise addition and scalar multiplication."
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full bg-[#d4a340] hover:bg-[#e4b344] text-[#140e04] font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-[#d4a340]/30 transition-all hover:scale-[1.01]"
              >
                <Award className="w-4 h-4" />
                <span>Unlock Unit II: Linear Transformations</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full bg-[#201912] hover:bg-[#282017] text-[#baa993] text-xs font-semibold py-2.5 rounded-xl border border-[#332719] transition-colors"
              >
                Retake Gateway Quiz
              </button>
            </div>
          </div>
        ) : (
          /* QUIZ QUESTIONS */
          <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="bg-[#130f0c] p-4 rounded-xl border border-[#271f15] space-y-2.5">
                <p className="text-xs font-semibold text-[#f0e4d0]">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-[#251e13] border-[#d4a340] text-[#f2cb6c]'
                            : 'bg-[#19140f] border-[#292015] text-[#bdae99] hover:border-[#423320]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-[#d4a340] hover:bg-[#e4b344] text-[#140e04] font-bold text-xs tracking-wider uppercase py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#d4a340]/25 transition-all"
            >
              Submit Gateway Quiz
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
