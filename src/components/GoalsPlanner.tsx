import React, { useState } from 'react';
import { FamilyGoal } from '../types/family';
import { Target, Sparkles, Plus, Calendar, CheckSquare, Square, X, Compass, Home, BookOpen, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalsPlannerProps {
  goals: FamilyGoal[];
  onToggleMilestone: (goalId: string, milestoneIndex: number) => void;
  onAddGoal: (goal: Omit<FamilyGoal, 'id' | 'progress'>) => void;
}

export const GoalsPlanner: React.FC<GoalsPlannerProps> = ({
  goals,
  onToggleMilestone,
  onAddGoal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'short-term' | 'long-term'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<FamilyGoal['type']>('short-term');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<FamilyGoal['category']>('Home');
  const [milestonesInput, setMilestonesInput] = useState('');

  const filteredGoals = goals.filter((g) => filterType === 'all' || g.type === filterType);

  const getCategoryIcon = (c: FamilyGoal['category']) => {
    switch (c) {
      case 'Adventure':
        return <Compass className="w-4 h-4 text-[#38bdf8]" />;
      case 'Education':
        return <BookOpen className="w-4 h-4 text-[#c084fc]" />;
      case 'Wellness':
        return <Heart className="w-4 h-4 text-[#fda4af]" />;
      case 'Home':
      default:
        return <Home className="w-4 h-4 text-[#fde047]" />;
    }
  };

  const handleMilestoneClick = (goal: FamilyGoal, idx: number) => {
    const isNowDone = !goal.milestones[idx].done;
    if (isNowDone) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#f472b6'],
      });
    }
    onToggleMilestone(goal.id, idx);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean)
      .map((text) => ({ text, done: false }));

    onAddGoal({
      title: title.trim(),
      type,
      targetDate: targetDate.trim(),
      category,
      milestones: milestones.length ? milestones : [{ text: 'Initiate preparations', done: false }],
    });

    setTitle('');
    setTargetDate('');
    setMilestonesInput('');
    setShowAddModal(false);
  };

  return (
    <section className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Building Our Future Together</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Family Goals & Aspirations
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#23293a] rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterType === 'all' ? 'bg-[#202738] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                All Aspirations
              </button>
              <button
                onClick={() => setFilterType('short-term')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterType === 'short-term' ? 'bg-[#202738] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Short-Term
              </button>
              <button
                onClick={() => setFilterType('long-term')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterType === 'long-term' ? 'bg-[#202738] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Long-Term
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>New Objective</span>
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const completedCount = goal.milestones.filter((m) => m.done).length;
            const progress = goal.milestones.length
              ? Math.round((completedCount / goal.milestones.length) * 100)
              : goal.progress;

            return (
              <div
                key={goal.id}
                className="bg-[#131620] border border-[#222839] rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-[#38435d] transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-[#1a1f2d] border border-[#293245]">
                        {getCategoryIcon(goal.category)}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {goal.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target: {goal.targetDate}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-2">
                    {goal.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="my-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94a3b8] capitalize">{goal.type} Objective</span>
                      <span className="font-mono text-white font-semibold tabular-nums">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#1b2030] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#f472b6] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-Milestones Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
                      Milestone Steps (Tap to toggle)
                    </span>
                    {goal.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleMilestoneClick(goal, idx)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer text-xs transition-colors ${
                          milestone.done
                            ? 'bg-[#181d2a]/60 text-[#64748b]'
                            : 'hover:bg-[#181d2a] text-[#cbd5e1]'
                        }`}
                      >
                        <button type="button" className="mt-0.5 shrink-0 text-[#f472b6]">
                          {milestone.done ? (
                            <CheckSquare className="w-4 h-4 text-[#86efac]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#475569]" />
                          )}
                        </button>
                        <span className={milestone.done ? 'line-through' : ''}>
                          {milestone.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1d2334] mt-5 flex items-center justify-between text-[11px] text-[#64748b]">
                  <span>Step progress: {completedCount} / {goal.milestones.length} done</span>
                  <span className="text-[#a5b4fc] font-medium">In Active Pursuit</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Modal */}
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
                Define Family Objective
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build Family Mountain Cabin Retreat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Horizon</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="short-term">Short-Term (Within 1 Year)</option>
                      <option value="long-term">Long-Term (3-5 Years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="Home">Home Sanctuary</option>
                      <option value="Adventure">Adventure & Travel</option>
                      <option value="Education">Education & Growth</option>
                      <option value="Wellness">Wellness & Health</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Target Completion Date</label>
                  <input
                    type="text"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    placeholder="e.g. Autumn 2027 or December 2028"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">
                    Milestones (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={milestonesInput}
                    onChange={(e) => setMilestonesInput(e.target.value)}
                    placeholder="Research property lots&#10;Consult eco architect&#10;Begin foundation framing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6] resize-none"
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
                    Save Objective
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
