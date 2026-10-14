import React from 'react';
import { CheckCircle2, Coins, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1b1610]/95 backdrop-blur-md border border-[#d4a340]/60 shadow-2xl shadow-black/80 animate-in slide-in-from-top-3 duration-200 min-w-[240px] max-w-sm"
        >
          {toast.type === 'token' ? (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#c89222] to-[#f4c856] flex items-center justify-center text-[#1a1408] shrink-0">
              <Coins className="w-4 h-4" />
            </div>
          ) : toast.type === 'success' ? (
            <div className="w-7 h-7 rounded-full bg-[#1b2518] border border-[#55c179] flex items-center justify-center text-[#55c179] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#201912] border border-[#d4a340] flex items-center justify-center text-[#d4a340] shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}

          <div className="flex-1 text-xs font-semibold text-[#f5ebd7] leading-tight">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8e806c] hover:text-[#f5ebd7] transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
