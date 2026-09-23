import React, { useState } from 'react';
import { BucketListItem } from '../types/family';
import { CheckCircle2, Circle, Sparkles, Plus, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SharedBucketListProps {
  items: BucketListItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<BucketListItem, 'id' | 'completed'>) => void;
}

export const SharedBucketList: React.FC<SharedBucketListProps> = ({
  items,
  onToggleItem,
  onAddItem,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BucketListItem['category']>('Travel');
  const [targetYear, setTargetYear] = useState('');
  const [assignee, setAssignee] = useState('Family');

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  const filteredItems = items.filter((i) => {
    if (filter === 'completed') return i.completed;
    if (filter === 'pending') return !i.completed;
    return true;
  });

  const handleToggle = (item: BucketListItem) => {
    if (!item.completed) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#86efac', '#f472b6', '#fde047'],
      });
    }
    onToggleItem(item.id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddItem({
      title: title.trim(),
      category,
      targetYear: targetYear.trim() || undefined,
      assignee: assignee.trim() || 'Family',
    });

    setTitle('');
    setTargetYear('');
    setShowAddModal(false);
  };

  return (
    <section className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daring Dreams & Quiet Wishes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Shared Family Bucket List
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#23293a] rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-[#202738] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'pending' ? 'bg-[#202738] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'completed' ? 'bg-[#202738] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Cherished ({completedCount})
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>Add Wish</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Card */}
        <div className="bg-[#131620] border border-[#212738] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#94a3b8]">Bucket List Fulfillments</span>
            <span className="font-mono text-white font-semibold tabular-nums">
              {completedCount} of {items.length} fulfilled ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#1b2030] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#86efac] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* List items */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                item.completed
                  ? 'bg-[#121620]/60 border-[#1f2838] opacity-80'
                  : 'bg-[#131620] border-[#222839] hover:border-[#38435d] hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <button
                  type="button"
                  className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    item.completed
                      ? 'bg-[#86efac] text-[#0b1b13]'
                      : 'border border-[#38435d] text-transparent hover:border-[#f472b6]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <span
                  className={`text-xs sm:text-sm font-medium transition-all ${
                    item.completed
                      ? 'line-through text-[#64748b]'
                      : 'text-white group-hover:text-[#f8b4d9]'
                  }`}
                >
                  {item.title}
                </span>
              </div>

              {/* Unboxed metadata tags */}
              <div className="flex items-center gap-3 text-xs text-[#94a3b8] shrink-0">
                <span className="hidden sm:inline text-[#cbd5e1]">{item.category}</span>
                {item.targetYear && (
                  <>
                    <span aria-hidden="true" className="hidden sm:inline">·</span>
                    <span className="font-mono text-[#fde047]">{item.targetYear}</span>
                  </>
                )}
                {item.assignee && (
                  <>
                    <span aria-hidden="true" className="hidden sm:inline">·</span>
                    <span className="text-[#a5b4fc] text-[11px]">{item.assignee}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Bucket Item Modal */}
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
                Add to Family Bucket List
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Dream / Wish</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ride the hot air balloon in Cappadocia together"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="Travel">Travel & Island</option>
                      <option value="Home">Home Sanctuary</option>
                      <option value="Milestone">Milestone</option>
                      <option value="Fun">Sweet Fun</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Target Year</label>
                    <input
                      type="text"
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value)}
                      placeholder="e.g. 2027"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Assignee / Dreamers</label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="e.g. Mirwen & Daughter, or All"
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
                    Save Dream
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
