import React, { useState, useEffect } from 'react';
import { TimeCapsuleLetter } from '../types/family';
import { Hourglass, Lock, Unlock, Sparkles, Plus, Clock, X } from 'lucide-react';

interface TimeCapsuleProps {
  letters: TimeCapsuleLetter[];
  onAddLetter: (letter: Omit<TimeCapsuleLetter, 'id' | 'sealedAt'>) => void;
}

export const TimeCapsule: React.FC<TimeCapsuleProps> = ({ letters, onAddLetter }) => {
  const [now, setNow] = useState(new Date());
  const [selectedLetter, setSelectedLetter] = useState<TimeCapsuleLetter | null>(null);
  const [showSealModal, setShowSealModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [author, setAuthor] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [previewHint, setPreviewHint] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - now.getTime();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const handleSealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !unlockDate) return;

    onAddLetter({
      title: title.trim(),
      recipient: recipient.trim() || 'Our Family',
      author: author.trim() || 'Mirwen & Janine',
      unlockDate,
      previewHint: previewHint.trim() || 'A secret love note sealed in the digital vault.',
      content: content.trim(),
    });

    setTitle('');
    setRecipient('');
    setAuthor('');
    setUnlockDate('');
    setPreviewHint('');
    setContent('');
    setShowSealModal(false);
  };

  return (
    <section id="vault" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Hourglass className="w-3.5 h-3.5" />
              <span>Sealed for Tomorrow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Time Capsule & Secret Letters
            </h2>
          </div>

          <button
            onClick={() => setShowSealModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>Seal New Letter</span>
          </button>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {letters.map((letter) => {
            const timeLeft = calculateTimeLeft(letter.unlockDate);
            const isUnlocked = !timeLeft;

            return (
              <div
                key={letter.id}
                onClick={() => setSelectedLetter(letter)}
                className={`group cursor-pointer relative bg-[#131620] border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between ${
                  isUnlocked
                    ? 'border-[#86efac]/40 hover:border-[#86efac]'
                    : 'border-[#23293b] hover:border-[#38435d]'
                }`}
              >
                <div>
                  {/* Status Tag & Wax Seal Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[#86efac] font-medium">
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unlocked & Ready</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#fda4af] font-medium">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Sealed in Vault</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#64748b]">
                      Sealed {letter.sealedAt}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-1 group-hover:text-[#f8b4d9] transition-colors">
                    {letter.title}
                  </h3>

                  <div className="text-xs text-[#94a3b8] mb-3">
                    <span>For: </span>
                    <strong className="text-white">{letter.recipient}</strong>
                    <span className="mx-1.5">·</span>
                    <span>By: {letter.author}</span>
                  </div>

                  <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-5">
                    {letter.previewHint}
                  </p>
                </div>

                {/* Countdown display */}
                <div className="pt-4 border-t border-[#1e2435]">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-xs text-[#86efac]">
                      <span>Ready to read</span>
                      <span className="font-semibold underline underline-offset-4">Open Letter →</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1.5">
                        Countdown to Opening
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                        <div className="bg-[#191e2b] rounded-xl p-1.5 border border-[#262e40]">
                          <span className="block text-xs font-bold text-white tabular-nums">
                            {timeLeft.days}
                          </span>
                          <span className="text-[9px] text-[#64748b]">days</span>
                        </div>
                        <div className="bg-[#191e2b] rounded-xl p-1.5 border border-[#262e40]">
                          <span className="block text-xs font-bold text-white tabular-nums">
                            {timeLeft.hours}
                          </span>
                          <span className="text-[9px] text-[#64748b]">hrs</span>
                        </div>
                        <div className="bg-[#191e2b] rounded-xl p-1.5 border border-[#262e40]">
                          <span className="block text-xs font-bold text-white tabular-nums">
                            {timeLeft.minutes}
                          </span>
                          <span className="text-[9px] text-[#64748b]">min</span>
                        </div>
                        <div className="bg-[#191e2b] rounded-xl p-1.5 border border-[#262e40]">
                          <span className="block text-xs font-bold text-[#fde047] tabular-nums">
                            {timeLeft.seconds}
                          </span>
                          <span className="text-[9px] text-[#64748b]">sec</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Letter Reading Modal */}
        {selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-[#141722] border border-[#272d3e] rounded-3xl p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => setSelectedLetter(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[#f8b4d9] mb-2 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {calculateTimeLeft(selectedLetter.unlockDate) ? 'Sealed Time Capsule' : 'Unlocked Vault Letter'}
                </span>
              </div>

              <h3 className="text-xl font-heading font-bold text-white mb-2">
                {selectedLetter.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-[#94a3b8] mb-5 pb-3 border-b border-[#23293a]">
                <span>Recipient: <strong className="text-white">{selectedLetter.recipient}</strong></span>
                <span>·</span>
                <span>Written by: <strong className="text-white">{selectedLetter.author}</strong></span>
              </div>

              {calculateTimeLeft(selectedLetter.unlockDate) ? (
                /* Still Locked */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#231b26] border border-[#fda4af]/30 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#fda4af]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">This letter is securely sealed</h4>
                  <p className="text-xs text-[#94a3b8] max-w-xs mx-auto leading-relaxed">
                    "{selectedLetter.previewHint}"
                  </p>
                  <p className="text-[11px] text-[#64748b]">
                    Scheduled to unlock on: {new Date(selectedLetter.unlockDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                /* Unlocked & Readable */
                <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed max-h-72 overflow-y-auto p-4 rounded-2xl bg-[#181c28] border border-[#262c3e]">
                  <p className="whitespace-pre-line italic">
                    "{selectedLetter.content}"
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#1f2536] flex justify-end">
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="px-4 py-2 rounded-xl bg-[#1b2030] text-xs text-white hover:bg-[#252b40]"
                >
                  Close Vault
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Seal New Letter Modal */}
        {showSealModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-[#141722] border border-[#272d3e] rounded-3xl p-6 shadow-2xl">
              <button
                onClick={() => setShowSealModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-heading font-bold text-white mb-4">
                Seal a Secret Time Capsule
              </h3>

              <form onSubmit={handleSealSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Letter Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. For Lorizavei's High School Graduation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Recipient</label>
                    <input
                      type="text"
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="e.g. Lorizavei Rae Cuares"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Author</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Papa Mirwen"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Unlock Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Teaser / Hint (Visible while locked)</label>
                  <input
                    type="text"
                    value={previewHint}
                    onChange={(e) => setPreviewHint(e.target.value)}
                    placeholder="e.g. Remember your funny story about the butterflies..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Secret Letter Message</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your timeless thoughts, love, and advice..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowSealModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#181c29] text-[#94a3b8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#f472b6] hover:bg-[#e11d48] text-white font-medium shadow-md shadow-[#f472b6]/20 transition-all"
                  >
                    Seal Letter
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
