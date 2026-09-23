import React, { useState } from 'react';
import { StickyNote } from '../types/family';
import { Pin, Sparkles, Plus, Trash2, Heart, X } from 'lucide-react';

interface DigitalNoteBoardProps {
  notes: StickyNote[];
  onAddNote: (note: Omit<StickyNote, 'id'>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const DigitalNoteBoard: React.FC<DigitalNoteBoardProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const [filterAuthor, setFilterAuthor] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState<StickyNote['author']>('Mirwen');
  const [color, setColor] = useState<StickyNote['color']>('peach');

  const getColorStyles = (c: StickyNote['color']) => {
    switch (c) {
      case 'rose':
        return {
          bg: 'bg-[#2a1722]/90 border-[#fda4af]/30 text-[#ffe4e6]',
          pin: 'text-[#fb7185]',
          authorTag: 'text-[#fda4af]',
        };
      case 'sage':
        return {
          bg: 'bg-[#15241f]/90 border-[#86efac]/30 text-[#dcfce7]',
          pin: 'text-[#4ade80]',
          authorTag: 'text-[#86efac]',
        };
      case 'lilac':
        return {
          bg: 'bg-[#211a2e]/90 border-[#c4b5fd]/30 text-[#ede9fe]',
          pin: 'text-[#a78bfa]',
          authorTag: 'text-[#c4b5fd]',
        };
      case 'butter':
        return {
          bg: 'bg-[#292415]/90 border-[#fde047]/30 text-[#fef9c3]',
          pin: 'text-[#facc15]',
          authorTag: 'text-[#fde047]',
        };
      case 'peach':
      default:
        return {
          bg: 'bg-[#2b1b19]/90 border-[#ffb4a2]/30 text-[#ffedd5]',
          pin: 'text-[#fb923c]',
          authorTag: 'text-[#ffb4a2]',
        };
    }
  };

  const filteredNotes = notes.filter(
    (n) => filterAuthor === 'all' || n.author.toLowerCase() === filterAuthor.toLowerCase()
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const randomRot = Math.floor(Math.random() * 7) - 3; // -3 to 3 deg
    onAddNote({
      content: content.trim(),
      author,
      color,
      rotation: randomRot,
      date: 'Just now',
      pinned: true,
    });

    setContent('');
    setShowAddModal(false);
  };

  return (
    <section id="notes" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fridge & Corkboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Digital Note Board
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#23293a] rounded-xl overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All Notes' },
                  { id: 'Mirwen', label: 'From Mirwen' },
                  { id: 'Janine', label: 'From Janine' },
                  { id: 'Family', label: 'For All' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterAuthor(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    filterAuthor === tab.id
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
              <span>Pin a Note</span>
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNotes.map((note) => {
            const style = getColorStyles(note.color);

            return (
              <div
                key={note.id}
                className={`relative p-5 rounded-2xl border ${style.bg} shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.03] hover:z-10 group flex flex-col justify-between min-h-[190px]`}
                style={{
                  transform: `rotate(${note.rotation}deg)`,
                }}
              >
                {/* Pin Head Ornament */}
                <button
                  onClick={() => onTogglePin(note.id)}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#141722] border border-[#3b445e] flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  title={note.pinned ? 'Unpin note' : 'Pin note'}
                >
                  <Pin className={`w-3.5 h-3.5 ${style.pin}`} />
                </button>

                {/* Content */}
                <div className="pt-2">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed font-sans select-none">
                    "{note.content}"
                  </p>
                </div>

                {/* Note Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <div>
                    <span className={`font-semibold ${style.authorTag}`}>
                      — {note.author}
                    </span>
                    <span className="text-[#94a3b8] block text-[10px]">{note.date}</span>
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94a3b8] hover:text-[#ef4444] transition-all rounded-lg"
                    title="Remove note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Note Modal */}
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
                Leave a Sticky Note
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Your Note</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a sweet reminder, funny quote, or warm thought..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Author</label>
                    <select
                      value={author}
                      onChange={(e) => setAuthor(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="Mirwen">Mirwen</option>
                      <option value="Janine">Janine</option>
                      <option value="Daughter">Lorizavei</option>
                      <option value="Family">For the Whole Family</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Paper Color</label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="peach">Pastel Peach</option>
                      <option value="rose">Pastel Rose</option>
                      <option value="sage">Pastel Sage</option>
                      <option value="lilac">Pastel Lilac</option>
                      <option value="butter">Pastel Butter</option>
                    </select>
                  </div>
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
                    Pin to Board
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
