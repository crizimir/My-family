import React, { useState } from 'react';
import { TimelineMilestone } from '../types/family';
import { Calendar, MapPin, Sparkles, Plus, Heart, Baby, Compass, Crown, Home, HeartHandshake, X } from 'lucide-react';

interface InteractiveTimelineProps {
  milestones: TimelineMilestone[];
  onAddMilestone: (milestone: Omit<TimelineMilestone, 'id'>) => void;
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  milestones,
  onAddMilestone,
}) => {
  const [filter, setFilter] = useState<'all' | 'love' | 'milestone' | 'daughter' | 'travel'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newCategory, setNewCategory] = useState<'love' | 'milestone' | 'daughter' | 'travel'>('love');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const filteredMilestones = milestones
    .filter((m) => filter === 'all' || m.category === filter)
    .sort((a, b) => a.year - b.year);

  const getCategoryIcon = (category: TimelineMilestone['category']) => {
    switch (category) {
      case 'love':
        return <Heart className="w-4 h-4 text-[#fda4af]" />;
      case 'daughter':
        return <Baby className="w-4 h-4 text-[#c4b5fd]" />;
      case 'travel':
        return <Compass className="w-4 h-4 text-[#38bdf8]" />;
      case 'milestone':
      default:
        return <Crown className="w-4 h-4 text-[#fde047]" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    onAddMilestone({
      title: newTitle.trim(),
      date: newDate.trim() || `${newYear}`,
      year: Number(newYear) || 2026,
      category: newCategory,
      description: newDescription.trim(),
      location: newLocation.trim() || undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewDate('');
    setShowAddModal(false);
  };

  return (
    <section id="timeline" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Journey Through Time</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Interactive Timeline
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Filter Tabs (Zero-Pill compliant button bar) */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#23293a] rounded-xl overflow-x-auto max-w-full">
              {(
                [
                  { id: 'all', label: 'All Chapters' },
                  { id: 'love', label: 'Love' },
                  { id: 'milestone', label: 'Milestones' },
                  { id: 'daughter', label: 'Little One' },
                  { id: 'travel', label: 'Adventures' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-[#202738] text-white shadow-sm'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>Add Chapter</span>
            </button>
          </div>
        </div>

        {/* Timeline Line */}
        <div className="relative pl-6 md:pl-8 border-l border-[#23293a] space-y-10 my-8">
          {filteredMilestones.map((milestone) => (
            <div key={milestone.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#131622] border border-[#3b445e] flex items-center justify-center group-hover:border-[#f472b6] group-hover:scale-110 transition-all shadow-md shadow-black">
                {getCategoryIcon(milestone.category)}
              </div>

              {/* Card Container */}
              <div className="bg-[#131620] border border-[#212738] hover:border-[#2f374f] rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-black/40">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                    <span className="font-mono font-semibold text-[#fde047] tabular-nums">
                      {milestone.year}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-[#cbd5e1]">
                      <Calendar className="w-3 h-3 text-[#94a3b8]" />
                      {milestone.date}
                    </span>
                  </div>

                  {milestone.location && (
                    <div className="flex items-center gap-1 text-[11px] text-[#94a3b8]">
                      <MapPin className="w-3 h-3 text-[#f8b4d9]" />
                      <span>{milestone.location}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-2">
                  {milestone.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Milestone Modal */}
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
                Record New Milestone
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Chapter Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. First Family Road Trip to the North"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Date / Month</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="e.g. October 14, 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Year</label>
                    <input
                      type="number"
                      required
                      value={newYear}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="love">Love Story</option>
                      <option value="milestone">Family Milestone</option>
                      <option value="daughter">Little Sunshine</option>
                      <option value="travel">Adventure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Tagaytay Highlands"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe what made this moment unforgettable..."
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
                    Save to Timeline
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
