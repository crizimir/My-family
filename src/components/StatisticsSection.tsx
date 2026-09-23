import React, { useState, useEffect } from 'react';
import { StatItem } from '../types/family';
import { Heart, Sparkles, Coffee, Camera, BookOpen, Clock, Calendar, Check, X, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateDaysTogetherLive } from '../utils/dateCalculations';

interface StatisticsSectionProps {
  stats: StatItem[];
  onIncrementHug: () => void;
  togetherSinceDate?: string;
  onUpdateTogetherSinceDate?: (newDate: string) => void;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  stats,
  onIncrementHug,
  togetherSinceDate = '2018-01-01',
  onUpdateTogetherSinceDate,
}) => {
  const [animatedValues, setAnimatedValues] = useState<{ [id: string]: number }>({});
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState(togetherSinceDate);
  const [currentTimeTick, setCurrentTimeTick] = useState(Date.now());

  // Update tick every second for real-time countdown to next day
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live days calculation
  const liveResult = calculateDaysTogetherLive(togetherSinceDate);
  const previewResult = calculateDaysTogetherLive(tempDate);

  useEffect(() => {
    // Eased counter animation on mount or when stats change
    const start = performance.now();
    const duration = 1400;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentVals: { [id: string]: number } = {};
      stats.forEach((item) => {
        const targetVal = item.id === 'days' ? liveResult.days : item.value;
        currentVals[item.id] = Math.floor(targetVal * ease);
      });
      setAnimatedValues(currentVals);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalVals: { [id: string]: number } = {};
        stats.forEach((item) => {
          finalVals[item.id] = item.id === 'days' ? liveResult.days : item.value;
        });
        setAnimatedValues(finalVals);
      }
    };

    requestAnimationFrame(animate);
  }, [stats, togetherSinceDate, liveResult.days]);

  const handleSaveCalendarDate = () => {
    if (onUpdateTogetherSinceDate && tempDate) {
      onUpdateTogetherSinceDate(tempDate);
      setIsCalendarOpen(false);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#f472b6', '#fde047'],
      });
    }
  };

  const handleHugClick = () => {
    onIncrementHug();

    // Floating heart effect
    const newId = Date.now();
    const randomOffset = (Math.random() - 0.5) * 60;
    setFloatingHearts((prev) => [...prev, { id: newId, x: randomOffset }]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newId));
    }, 1500);

    // Light celebratory confetti
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#f472b6', '#fda4af', '#fde047'],
    });
  };

  const getStatIcon = (id: string) => {
    switch (id) {
      case 'days':
        return <Clock className="w-4 h-4 text-[#fde047]" />;
      case 'coffees':
        return <Coffee className="w-4 h-4 text-[#fb923c]" />;
      case 'photos':
        return <Camera className="w-4 h-4 text-[#38bdf8]" />;
      case 'hugs':
        return <Heart className="w-4 h-4 text-[#f472b6] fill-[#f472b6]/20" />;
      case 'stories':
      default:
        return <BookOpen className="w-4 h-4 text-[#c084fc]" />;
    }
  };

  return (
    <section className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>By The Numbers · Updated Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Family Living Statistics
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTempDate(togetherSinceDate);
                setIsCalendarOpen(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-[#1b2030] hover:bg-[#252c40] text-[#7dd3fc] border border-[#2a3854] text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              title="Adjust your anniversary / together start date with the calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Adjust Calendar Date</span>
            </button>

            <div className="relative">
              <button
                onClick={handleHugClick}
                className="relative group flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#e11d48]/80 to-[#f472b6]/80 hover:from-[#e11d48] hover:to-[#f472b6] text-white text-xs font-semibold shadow-lg shadow-[#f472b6]/20 active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white animate-pulse-subtle" />
                <span>Share a Hug (+1)</span>
              </button>

              {/* Floating hearts */}
              {floatingHearts.map((heart) => (
                <span
                  key={heart.id}
                  className="absolute top-0 left-1/2 -translate-x-1/2 text-lg pointer-events-none animate-float-slow transition-opacity"
                  style={{
                    transform: `translateX(${heart.x}px) translateY(-30px)`,
                    animation: 'floatUp 1.2s forwards',
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Column Stats Grid on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((item) => {
            const isDays = item.id === 'days';
            const displayValue = isDays ? liveResult.days : item.value;
            const animatedVal = animatedValues[item.id] ?? displayValue;

            return (
              <div
                key={item.id}
                className={`relative bg-[#131620] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                  isDays
                    ? 'border-[#38bdf8]/40 bg-gradient-to-b from-[#141b2d] to-[#131620] shadow-lg shadow-[#38bdf8]/5'
                    : 'border-[#212738] hover:border-[#2e374f]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-[#1b2030] border border-[#2a3246]">
                    {getStatIcon(item.id)}
                  </span>

                  {isDays ? (
                    <div className="flex items-center gap-1.5 bg-[#0f243a] px-2 py-0.5 rounded-full border border-[#38bdf8]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#7dd3fc] tracking-wider uppercase">
                        LIVE
                      </span>
                    </div>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accent }} />
                  )}
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight tabular-nums mb-1 flex items-baseline gap-1">
                    {animatedVal.toLocaleString()}
                    <span className="text-xs sm:text-sm font-normal text-[#94a3b8]">
                      {isDays ? 'days' : item.suffix}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-[#cbd5e1] mb-1 flex items-center justify-between">
                    <span>{isDays ? 'DAYS TOGETHER (LIVE)' : item.label}</span>
                  </h3>

                  {isDays ? (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-[#93c5fd] font-medium leading-tight">
                        Since {liveResult.formattedDate}
                      </p>
                      <p className="text-[10px] text-[#64748b] leading-tight">
                        {liveResult.years}y {liveResult.months}m {liveResult.remainingDays}d · Includes today
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[9px] text-[#64748b]">
                          Next day in: <span className="font-mono text-[#94a3b8]">{liveResult.nextDayCountdown}</span>
                        </span>

                        <button
                          onClick={() => {
                            setTempDate(togetherSinceDate);
                            setIsCalendarOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] text-[10px] font-medium flex items-center gap-1 transition-colors"
                          title="Click to pick start date on calendar"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Calendar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#64748b] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Date Picker Modal for Live Days Together */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#131622] border border-[#2b354d] rounded-3xl p-6 shadow-2xl shadow-black/80 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Adjust Days Together Date
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Pick your anniversary or when your family journey began
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCalendarOpen(false)}
                className="p-1.5 rounded-xl text-[#94a3b8] hover:text-white hover:bg-[#202738] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
                  Select Starting Date (Anniversary / Together Since)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#1a2030] border border-[#313c55] text-white text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#64748b] mt-1.5">
                  Today is {previewResult.todayFormatted}. The counter automatically counts every day including today and advances tomorrow at midnight.
                </p>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-[#171f30] border border-[#23334e] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#94a3b8]">Calculated Live Days:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold font-heading text-[#38bdf8] tabular-nums">
                      {previewResult.days.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#7dd3fc]">days</span>
                  </div>
                </div>

                <div className="text-xs text-[#cbd5e1] flex items-center justify-between pt-1 border-t border-[#223048]">
                  <span>Total Time:</span>
                  <span className="font-medium text-white">
                    {previewResult.years} years, {previewResult.months} months, {previewResult.remainingDays} days
                  </span>
                </div>

                <div className="text-[11px] text-[#93c5fd]/90 pt-1">
                  ✨ Starts on <span className="font-semibold text-white">{previewResult.formattedDate}</span> and includes today.
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-[#94a3b8]">Quick Presets:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTempDate('2018-01-01')}
                    className="px-2.5 py-1 rounded-xl bg-[#1e2538] hover:bg-[#28324a] text-xs text-[#cbd5e1] transition-colors"
                  >
                    Jan 1, 2018
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempDate('2020-01-01')}
                    className="px-2.5 py-1 rounded-xl bg-[#1e2538] hover:bg-[#28324a] text-xs text-[#cbd5e1] transition-colors"
                  >
                    Jan 1, 2020
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempDate('2022-01-01')}
                    className="px-2.5 py-1 rounded-xl bg-[#1e2538] hover:bg-[#28324a] text-xs text-[#cbd5e1] transition-colors"
                  >
                    Jan 1, 2022
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setFullYear(d.getFullYear() - 1);
                      setTempDate(d.toISOString().split('T')[0]);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#1e2538] hover:bg-[#28324a] text-xs text-[#cbd5e1] transition-colors"
                  >
                    Exactly 1 Year Ago
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222a3d]">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-[#1c2233] hover:bg-[#262e44] text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCalendarDate}
                className="px-5 py-2.5 rounded-2xl bg-[#38bdf8] hover:bg-[#0284c7] text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#38bdf8]/20 transition-all hover:scale-105 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Live Date</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
