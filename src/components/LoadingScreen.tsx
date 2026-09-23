import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onFinish?: () => void;
  isInitial?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish, isInitial = true }) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFading(true);
            setTimeout(() => {
              if (onFinish) onFinish();
            }, 600);
          }, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0c12] text-white transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#f472b6]/15 via-[#c084fc]/15 to-[#38bdf8]/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-xs text-center px-6">
        {/* Animated cute house / heart emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#141722] border border-[#272d3d] flex items-center justify-center shadow-xl shadow-black/40 animate-pulse-subtle">
            <Heart className="w-9 h-9 text-[#f472b6] fill-[#f472b6]/20" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#1b2030] border border-[#374151] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#fde047] animate-spin-slow" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-heading font-semibold text-white tracking-wide mb-1">
          The Cuares Sanctuary
        </h2>
        <p className="text-xs text-[#94a3b8] mb-6">
          Gathering gentle moments & sweet memories...
        </p>

        {/* Minimalist Progress Bar */}
        <div className="w-48 h-1.5 bg-[#1a1e2b] rounded-full overflow-hidden mb-3 border border-[#272d3d]/50">
          <div
            className="h-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#38bdf8] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-48 text-[11px] font-mono text-[#64748b]">
          <span>loading love</span>
          <span>{progress}%</span>
        </div>

        {isInitial && (
          <button
            onClick={() => {
              setFading(true);
              setTimeout(() => {
                if (onFinish) onFinish();
              }, 400);
            }}
            className="mt-6 text-xs text-[#64748b] hover:text-[#e2e8f0] transition-colors underline decoration-[#374151] underline-offset-4"
          >
            Enter Sanctuary
          </button>
        )}
      </div>
    </div>
  );
};
