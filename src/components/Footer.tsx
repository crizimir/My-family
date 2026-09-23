import React from 'react';
import { Heart, ArrowUp, Sparkles, RotateCcw } from 'lucide-react';

interface FooterProps {
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetData }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-[#181d2a] bg-[#090b10] text-[#64748b] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#141722] border border-[#242c3e] flex items-center justify-center text-[#f472b6]">
              <Heart className="w-4 h-4 fill-[#f472b6]" />
            </span>
            <div>
              <p className="text-white font-medium font-heading">
                The Cuares Sanctuary
              </p>
              <p className="text-[11px] text-[#64748b]">
                Mirwen H. Cuares · Janine Rae D Cuares · Our Precious Daughter
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#64748b] max-w-sm">
            Crafted with warmth, lofi melodies, and endless love. Every small day counts.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131620] hover:bg-[#1a1f2c] border border-[#222839] text-[#94a3b8] hover:text-white transition-colors text-[11px]"
              title="Reset sample data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#131620] hover:bg-[#1a1f2c] border border-[#222839] text-[#94a3b8] hover:text-white transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
