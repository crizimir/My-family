import React, { useState } from 'react';
import { X, Calendar, Camera, FileText, CheckCircle2, Target, MessageSquare } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'milestone' | 'photo' | 'note' | 'bucket' | 'goal' | 'post') => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSelectAction }) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'post' as const,
      label: 'Family Social Post',
      desc: 'Share a story, photo reflection, or funny moment',
      icon: MessageSquare,
      color: 'text-[#f472b6] bg-[#f472b6]/10 border-[#f472b6]/20',
    },
    {
      id: 'photo' as const,
      label: 'Photo to Album',
      desc: 'Add a new memory picture to the gallery',
      icon: Camera,
      color: 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/20',
    },
    {
      id: 'note' as const,
      label: 'Fridge Sticky Note',
      desc: 'Pin a sweet message for Mirwen or Janine',
      icon: FileText,
      color: 'text-[#fde047] bg-[#fde047]/10 border-[#fde047]/20',
    },
    {
      id: 'milestone' as const,
      label: 'Timeline Chapter',
      desc: 'Record a major family milestone date',
      icon: Calendar,
      color: 'text-[#fda4af] bg-[#fda4af]/10 border-[#fda4af]/20',
    },
    {
      id: 'bucket' as const,
      label: 'Bucket List Dream',
      desc: 'Add a new dream to fulfill together',
      icon: CheckCircle2,
      color: 'text-[#86efac] bg-[#86efac]/10 border-[#86efac]/20',
    },
    {
      id: 'goal' as const,
      label: 'Family Objective',
      desc: 'Set a new short or long-term objective',
      icon: Target,
      color: 'text-[#c084fc] bg-[#c084fc]/10 border-[#c084fc]/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#141722] border border-[#272d3e] rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-heading font-bold text-white mb-1">
          Capture a Memory
        </h3>
        <p className="text-xs text-[#94a3b8] mb-5">
          Select what kind of memory you would like to record today:
        </p>

        <div className="space-y-2.5">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectAction(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-[#191d2a] border border-[#262e40] hover:border-[#3b4763] hover:bg-[#1f2434] transition-all text-left group"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#f8b4d9] transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-[#64748b]">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
