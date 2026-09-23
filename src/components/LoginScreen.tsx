import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, Heart, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const cleanInput = password.trim();

    // Required password check: "mirwenjanineforever"
    if (cleanInput.toLowerCase() === 'mirwenjanineforever') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#38bdf8', '#fbbf24', '#34d399'],
      });
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess();
      }, 350);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setError('Incorrect password. Please enter the family sanctuary key.');
      }, 250);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080a11] overflow-y-auto">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#f472b6]/15 via-[#38bdf8]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#38bdf8]/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-[#f472b6]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md my-auto">
        {/* Main Card */}
        <div className="bg-[#101420]/90 backdrop-blur-xl border border-[#232b3e] rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-7">
          {/* Top Brand & Security Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182033] border border-[#293652] text-xs font-semibold text-[#7dd3fc]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="tracking-wide uppercase text-[11px]">Private Family Sanctuary</span>
            </div>

            {/* Tri-Avatar Crest: Mirwen, Janine, Lorizavei */}
            <div className="flex items-center justify-center -space-x-3 pt-2">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#f59e0b] shadow-lg shadow-[#f59e0b]/20 bg-[#1e2538] flex items-center justify-center text-white font-bold text-sm z-30">
                <span className="font-heading">M</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#f59e0b] rounded-full border border-black" />
              </div>
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#f472b6] shadow-xl shadow-[#f472b6]/30 bg-[#251b2e] flex items-center justify-center text-white font-bold text-base z-40 scale-105">
                <Heart className="w-6 h-6 text-[#f472b6] fill-[#f472b6]/40 animate-pulse-subtle" />
              </div>
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#38bdf8] shadow-lg shadow-[#38bdf8]/20 bg-[#19273a] flex items-center justify-center text-white font-bold text-sm z-30">
                <span className="font-heading">J</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#38bdf8] rounded-full border border-black" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Welcome Home
              </h1>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-1.5 max-w-xs leading-relaxed">
                Mirwen & Janine’s Sanctuary. Enter the family password to access your memories, timeline, and financial vault.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>Sanctuary Access Key</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-[11px] text-[#7dd3fc] hover:underline"
                >
                  {showHint ? 'Hide Hint' : 'Forgot Password?'}
                </button>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter family password..."
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl bg-[#171d2c] border text-white text-sm placeholder-[#64748b] transition-all focus:outline-none ${
                    error
                      ? 'border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/30'
                      : 'border-[#29354d] focus:border-[#f472b6] focus:ring-2 focus:ring-[#f472b6]/20'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748b] hover:text-[#cbd5e1] transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-[#f43f5e] mt-2 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                  <span>{error}</span>
                </div>
              )}

              {showHint && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#1b2336] border border-[#2b3955] text-xs text-[#94a3b8] animate-fade-in space-y-1">
                  <p className="text-white font-medium">Family Password Hint:</p>
                  <p className="font-mono text-[#f8b4d9] text-[11px]">mirwenjanineforever</p>
                  <p className="text-[10px] text-[#64748b]">Our timeless love motto since January 1, 2018.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#e11d48] via-[#f472b6] to-[#ec4899] hover:from-[#be123c] hover:to-[#db2777] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#f472b6]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Sanctuary Key...' : 'Unlock Family Sanctuary'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Security Footer */}
          <div className="pt-4 border-t border-[#1c2334] flex items-center justify-between text-[11px] text-[#64748b]">
            <span>Dedicated to Mirwen, Janine & Lorizavei</span>
            <span className="flex items-center gap-1 text-[#f472b6]">
              <Heart className="w-3 h-3 fill-[#f472b6]" />
              <span>Forever</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
