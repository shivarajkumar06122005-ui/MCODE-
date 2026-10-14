import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LevelItem } from '../../types';
import { sound } from '../../utils/audio';

interface Props {
  unitId: number;
  level: LevelItem;
  onClose: () => void;
  onOpenGatewayQuiz: () => void;
}

export const LevelTasksDrawer: React.FC<Props> = ({
  unitId,
  level,
  onClose,
  onOpenGatewayQuiz,
}) => {
  const { toggleTask, completeLevel } = useApp();
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  const completedCount = level.tasks.filter((t) => t.completed).length;
  const progressPercent = level.tasks.length > 0
    ? Math.round((completedCount / level.tasks.length) * 100)
    : 100;

  const handleToggleTask = (taskId: string) => {
    toggleTask(unitId, level.id, taskId);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuizOption === null || !level.quiz) return;

    const correct = selectedQuizOption === level.quiz.correctIndex;
    setIsQuizCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      sound.playTokenReward();
    } else {
      sound.playClick();
    }
  };

  const handleCompleteLevel = () => {
    completeLevel(unitId, level.id);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4a340', '#f4c856', '#5ab36d'],
      });
    } catch {
      // Ignore if confetti is not available
    }
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#181410]/95 backdrop-blur-xl border-l border-[#2e261a] p-6 flex flex-col justify-between shadow-2xl shadow-black/80 animate-in slide-in-from-right duration-300">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Header matching video 00:34 */}
        <div className="flex items-start justify-between border-b border-[#2b2317] pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#d4a340] uppercase">
              LEVEL {level.id} TASKS
            </span>
            <h3 className="text-xl font-bold font-cinzel text-[#f5ebd7] mt-0.5">
              {level.title}
            </h3>
            <p className="text-xs text-[#8c7f6b] mt-1">
              {level.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#221c14] hover:bg-[#2e251a] border border-[#372d1f] flex items-center justify-center text-[#8e806c] hover:text-[#d4a340] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar (0% -> 50% -> 100%) */}
        <div className="space-y-2 bg-[#130f0c] p-4 rounded-xl border border-[#261f15]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#8e806c] uppercase tracking-wider text-[10px]">
              LEVEL PROGRESS
            </span>
            <span className="font-mono text-[#d4a340] font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#211a13] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b58529] via-[#e4b344] to-[#f4c856] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task Checklist Items */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-wider text-[#7e715d] uppercase block">
            Core Learning Quests
          </span>

          {level.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                task.completed
                  ? 'bg-[#1b2216] border-[#426b38] text-[#c9e2be]'
                  : 'bg-[#15110d] hover:bg-[#1c1611] border-[#292116] text-[#cfc2ad]'
              }`}
            >
              {/* Custom checkbox */}
              <div
                className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  task.completed
                    ? 'bg-[#55c179] text-[#0d1f11]'
                    : 'border border-[#4c3d28] bg-[#1d1710]'
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 space-y-1">
                <p className={`text-xs leading-relaxed ${task.completed ? 'line-through text-[#849a7a]' : ''}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#d4a340] font-mono font-semibold">
                    +{task.tokenReward} Tokens
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#6e604d] bg-[#201912] px-1.5 py-0.2 rounded border border-[#2b2217]">
                    {task.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Level Quiz Section (matching video at 00:41) */}
        {level.quiz && (
          <div className="space-y-3 pt-3 border-t border-[#2b2317]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#d4a340]" />
              <span className="text-xs font-bold font-cinzel text-[#f4ebdc]">
                Level {level.id} Quiz
              </span>
            </div>

            <div className="bg-[#130f0c] p-4 rounded-xl border border-[#271f15] space-y-3">
              <p className="text-xs font-medium text-[#ede5d5] leading-relaxed">
                {level.quiz.question}
              </p>

              <div className="space-y-2">
                {level.quiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === level.quiz?.correctIndex;
                  let optStyle = 'bg-[#1a1510] border-[#2c2317] text-[#cfc2ad] hover:border-[#4d3e2a]';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      optStyle = 'bg-[#1b2518] border-[#55c179] text-[#7de29d]';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-[#291717] border-[#d84a4a] text-[#f49b9b]';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-[#251d13] border-[#d4a340] text-[#f2cb6c] shadow-sm shadow-[#d4a340]/20';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => {
                        sound.playClick();
                        setSelectedQuizOption(idx);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#55c179] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedQuizOption === null}
                  onClick={handleQuizSubmit}
                  className="w-full bg-[#271f15] hover:bg-[#34291c] disabled:opacity-50 text-[#d4a340] font-semibold text-xs tracking-wider uppercase py-2.5 rounded-lg border border-[#d4a340]/40 transition-colors"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="pt-2 text-[11px] text-[#8e806c]">
                  {isQuizCorrect ? (
                    <span className="text-[#55c179] font-medium">
                      ✓ Correct! +10 Tokens awarded for theorem mastery.
                    </span>
                  ) : (
                    <span className="text-[#df7272]">
                      Review Axler Chapter 3 on linear maps & dimension.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-[#2e261a] space-y-2 ">
        <button
          onClick={handleCompleteLevel}
          className="w-full bg-[#d4a340] hover:bg-[#e4b344] active:scale-[0.99] text-[#140e04] font-bold text-xs tracking-wider uppercase py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#d4a340]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span>Complete Level</span>
        </button>

        <button
          onClick={onOpenGatewayQuiz}
          className="w-full bg-[#1b150f] hover:bg-[#241c14] border border-[#3b2f1f] text-[#c7b9a5] hover:text-[#d4a340] text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          Go to Gateway Quiz
        </button>
      </div>
    </div>
  );
};
