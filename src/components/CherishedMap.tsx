import React, { useState } from 'react';
import { CherishedLocation } from '../types/family';
import { MapPin, Sparkles, Plus, Calendar, Compass, X } from 'lucide-react';

interface CherishedMapProps {
  locations: CherishedLocation[];
  onAddLocation: (location: Omit<CherishedLocation, 'id'>) => void;
}

export const CherishedMap: React.FC<CherishedMapProps> = ({ locations, onAddLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<CherishedLocation | null>(locations[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [memoryType, setMemoryType] = useState<CherishedLocation['memoryType']>('Vacation');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    // Random coordinates on stylized canvas
    const x = Math.floor(Math.random() * 60) + 20;
    const y = Math.floor(Math.random() * 60) + 20;

    onAddLocation({
      name: name.trim(),
      description: description.trim(),
      date: date.trim() || '2026',
      memoryType,
      coordinates: { x, y },
    });

    setName('');
    setDescription('');
    setDate('');
    setShowAddModal(false);
  };

  return (
    <section id="map" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Constellation of Places</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Cherished Locations Map
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>Pin Location</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Stylized Map View */}
          <div className="lg:col-span-8 bg-[#131620] border border-[#222839] rounded-3xl p-6 relative overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center shadow-xl">
            {/* Soft grid lines & contour decorations */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Stylized island / archipelago contour outlines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M150 120 C 220 80, 310 140, 360 90 C 420 50, 480 130, 440 210 C 400 280, 310 260, 240 330 C 180 390, 130 300, 120 220 Z"
                fill="#38bdf8"
                fillOpacity="0.08"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M480 280 C 530 250, 600 290, 630 350 C 650 410, 580 460, 520 440 C 460 410, 440 330, 480 280 Z"
                fill="#f472b6"
                fillOpacity="0.06"
                stroke="#f472b6"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Location Marker Pins */}
            {locations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`,
                  }}
                  onClick={() => setSelectedLocation(loc)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    className={`relative flex items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#f472b6] text-white scale-125 shadow-lg shadow-[#f472b6]/40'
                        : 'bg-[#1a1f2d] text-[#fda4af] hover:scale-110 border border-[#2e374d]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    )}
                  </div>

                  {/* Marker Tooltip */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl bg-[#0c0e14] border border-[#2d354a] text-[11px] text-white whitespace-nowrap shadow-xl transition-all duration-200 ${
                      isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0'
                    }`}
                  >
                    {loc.name}
                  </div>
                </div>
              );
            })}

            {/* Map Watermark Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[11px] text-[#64748b]">
              <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
              <span>Interactive Memory Points</span>
            </div>
          </div>

          {/* Selected Location Card */}
          <div className="lg:col-span-4 bg-[#131620] border border-[#222839] rounded-3xl p-6 shadow-xl">
            {selectedLocation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#f8b4d9] tracking-wide">
                    {selectedLocation.memoryType}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedLocation.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-white">
                  {selectedLocation.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {selectedLocation.description}
                </p>

                <div className="pt-4 border-t border-[#1f2536] space-y-2">
                  <span className="text-[11px] text-[#94a3b8] uppercase font-semibold tracking-wider block">
                    All Pinned Sanctuaries
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {locations.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedLocation(item)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedLocation.id === item.id
                            ? 'bg-[#1d2333] text-white font-medium border border-[#303a52]'
                            : 'text-[#94a3b8] hover:bg-[#181c28] hover:text-white'
                        }`}
                      >
                        <span className="truncate">{item.name}</span>
                        <span className="text-[10px] text-[#64748b] ml-2 shrink-0">{item.memoryType}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#64748b]">
                Click any pin on the map to explore the memory.
              </div>
            )}
          </div>
        </div>

        {/* Add Location Modal */}
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
                Pin Cherished Location
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Place Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hundred Islands Family Adventure"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Memory Type</label>
                    <select
                      value={memoryType}
                      onChange={(e) => setMemoryType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="First Met">First Met</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Home">Home Sanctuary</option>
                      <option value="Birthplace">Birthplace</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Adventure">Adventure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Date or Year</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. December 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Memory Story</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What occurred here that touched our hearts?"
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
                    Pin to Map
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
