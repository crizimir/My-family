import React, { useState } from 'react';
import { RoutineTask } from '../types/family';
import { CalendarCheck, Sun, Moon, Utensils, Sparkles, Plus, Check, Clock, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DayPlannerProps {
  routines: RoutineTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<RoutineTask, 'id' | 'completed'>) => void;
}

export const DayPlanner: React.FC<DayPlannerProps> = ({
  routines,
  onToggleTask,
  onAddTask,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [timeSlot, setTimeSlot] = useState('');
  const [period, setPeriod] = useState<RoutineTask['period']>('Morning');
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState<RoutineTask['assignedTo']>('All');
  const [notes, setNotes] = useState('');

  const completedCount = routines.filter((r) => r.completed).length;
  const progressPercent = Math.round((completedCount / (routines.length || 1)) * 100);

  const filteredTasks = routines.filter(
    (r) => selectedPeriod === 'All' || r.period === selectedPeriod
  );

  const handleToggle = (task: RoutineTask) => {
    if (!task.completed && completedCount + 1 === routines.length) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#86efac', '#fde047'],
      });
    }
    onToggleTask(task.id);
  };

  const getPeriodIcon = (p: RoutineTask['period']) => {
    switch (p) {
      case 'Morning':
        return <Sun className="w-4 h-4 text-[#fde047]" />;
      case 'Afternoon':
        return <Utensils className="w-4 h-4 text-[#fb923c]" />;
      case 'Evening':
        return <Sparkles className="w-4 h-4 text-[#f472b6]" />;
      case 'Bedtime':
      default:
        return <Moon className="w-4 h-4 text-[#c084fc]" />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !timeSlot.trim()) return;

    onAddTask({
      timeSlot: timeSlot.trim(),
      period,
      title: title.trim(),
      assignedTo,
      notes: notes.trim() || undefined,
      icon: period === 'Morning' ? 'Sun' : period === 'Bedtime' ? 'Moon' : 'Sparkles',
    });

    setTimeSlot('');
    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <section id="planner" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Harmony & Daily Rhythm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Day Planner & Routine Maker
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Filters */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#23293a] rounded-xl overflow-x-auto">
              {['All', 'Morning', 'Afternoon', 'Evening', 'Bedtime'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedPeriod(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedPeriod === tab
                      ? 'bg-[#202738] text-white shadow-sm'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>Add Routine</span>
            </button>
          </div>
        </div>

        {/* Daily Progress Banner */}
        <div className="bg-[#131620] border border-[#212738] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#94a3b8]">Today's Routine Completion</span>
            <span className="font-mono text-white font-semibold tabular-nums">
              {completedCount} of {routines.length} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#1b2030] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#f472b6] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggle(task)}
              className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                task.completed
                  ? 'bg-[#121620]/60 border-[#1e2535] opacity-75'
                  : 'bg-[#131620] border-[#222839] hover:border-[#38435d] hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <button
                  type="button"
                  className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-[#86efac] text-[#0b1b13]'
                      : 'border border-[#38435d] text-transparent hover:border-[#f472b6]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-medium transition-all ${
                        task.completed
                          ? 'line-through text-[#64748b]'
                          : 'text-white group-hover:text-[#f8b4d9]'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  {task.notes && (
                    <p className="text-[11px] text-[#64748b] truncate mt-0.5">{task.notes}</p>
                  )}
                </div>
              </div>

              {/* Time Slot & Assignee tags */}
              <div className="flex items-center gap-3 text-xs text-[#94a3b8] shrink-0">
                <div className="flex items-center gap-1.5 font-mono text-[#cbd5e1]">
                  <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                  <span>{task.timeSlot}</span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-[#a5b4fc] text-[11px] font-medium">
                  {task.assignedTo}
                </span>
                <span className="p-1 rounded-lg bg-[#181c28]">
                  {getPeriodIcon(task.period)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Routine Modal */}
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
                Schedule Routine Block
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Routine Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Afternoon sensory playtime & coloring"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Time Slot</label>
                    <input
                      type="text"
                      required
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      placeholder="e.g. 03:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Period</label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Bedtime">Bedtime</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Assigned To</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  >
                    <option value="All">All Family</option>
                    <option value="Mirwen">Mirwen</option>
                    <option value="Janine">Janine</option>
                    <option value="Daughter">Lorizavei</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Gentle Note / Instructions</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Put on warm soothing music, prepare soft towels"
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
                    Add to Routine
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
