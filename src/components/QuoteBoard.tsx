import React, { useState, useEffect } from 'react';
import { QuoteItem } from '../types/family';
import { Quote, ChevronLeft, ChevronRight, Sparkles, Plus, X } from 'lucide-react';

interface QuoteBoardProps {
  quotes: QuoteItem[];
  onAddQuote: (quote: Omit<QuoteItem, 'id'>) => void;
}

export const QuoteBoard: React.FC<QuoteBoardProps> = ({ quotes, onAddQuote }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [context, setContext] = useState('');
  const [year, setYear] = useState('2026');

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, quotes.length]);

  const activeQuote = quotes[currentIndex] || quotes[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim() || !author.trim()) return;

    onAddQuote({
      quote: quoteText.trim().startsWith('"') ? quoteText.trim() : `"${quoteText.trim()}"`,
      author: author.trim(),
      context: context.trim() || 'Everyday family moment',
      year: year.trim() || '2026',
    });

    setQuoteText('');
    setAuthor('');
    setContext('');
    setShowAddModal(false);
  };

  return (
    <section className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Words We Cherish</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Quote Board
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>Add Quote</span>
          </button>
        </div>

        {/* Carousel Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-gradient-to-br from-[#141722] to-[#11131c] border border-[#23293a] rounded-3xl p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center justify-between min-h-[260px]"
        >
          {/* Subtle Quote Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#1d2232] border border-[#2c354c] flex items-center justify-center mb-6">
            <Quote className="w-5 h-5 text-[#f472b6]" />
          </div>

          {/* Quote Body with transition */}
          <div className="my-auto max-w-2xl px-4 animate-in fade-in duration-300">
            <p className="text-base sm:text-xl font-heading font-medium text-white italic leading-relaxed mb-6">
              {activeQuote.quote}
            </p>

            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-semibold text-[#f8b4d9]">
                {activeQuote.author}
              </h4>
              <p className="text-[11px] text-[#64748b]">
                {activeQuote.context} · {activeQuote.year}
              </p>
            </div>
          </div>

          {/* Navigation Controls & Dots */}
          <div className="flex items-center justify-between w-full pt-8 border-t border-[#1a1f2c] mt-6">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length)
              }
              className="p-2 rounded-xl bg-[#181c28] hover:bg-[#222738] text-[#94a3b8] hover:text-white transition-colors"
              title="Previous quote"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-[#f472b6]'
                      : 'w-1.5 bg-[#252c40] hover:bg-[#38435d]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % quotes.length)}
              className="p-2 rounded-xl bg-[#181c28] hover:bg-[#222738] text-[#94a3b8] hover:text-white transition-colors"
              title="Next quote"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add Quote Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-[#141722] border border-[#272d3e] rounded-3xl p-6 shadow-2xl">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-heading font-bold text-white mb-4">
                Record a Family Quote
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">The Quote</label>
                  <textarea
                    rows={3}
                    required
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    placeholder="What was said that brought a smile or tear to your eye?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Speaker / Author</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Lorizavei, Janine, or Mirwen"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Year</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Context / Occasion</label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. Overheard while building block castles"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#181c29] text-[#94a3b8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#f472b6] hover:bg-[#e11d48] text-white font-medium shadow-md shadow-[#f472b6]/20 transition-all"
                  >
                    Add Quote
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
