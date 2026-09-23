import React, { useState } from 'react';
import { PhotoItem } from '../types/family';
import { Camera, Sparkles, Heart, Plus, MapPin, Calendar, X, Download, Upload } from 'lucide-react';
import { processImageFile } from '../utils/photoStorage';

interface PhotoAlbumProps {
  photos: PhotoItem[];
  onAddPhoto: (photo: Omit<PhotoItem, 'id' | 'likes'>) => void;
  onLikePhoto: (id: string) => void;
  onOpenPhotoSync?: () => void;
}

export const PhotoAlbum: React.FC<PhotoAlbumProps> = ({ photos, onAddPhoto, onLikePhoto, onOpenPhotoSync }) => {
  const [filter, setFilter] = useState<'all' | 'family' | 'daughter' | 'travel' | 'everyday'>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<'family' | 'daughter' | 'travel' | 'everyday'>('family');
  const [newAspect, setNewAspect] = useState<'square' | 'wide' | 'tall'>('square');

  const filteredPhotos = photos.filter((p) => filter === 'all' || p.category === filter);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await processImageFile(file);
      setNewUrl(dataUrl);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newCaption.trim()) return;

    onAddPhoto({
      url: newUrl.trim(),
      caption: newCaption.trim(),
      location: newLocation.trim() || 'Cuares Haven',
      date: newDate.trim() || 'Recently',
      category: newCategory,
      aspect: newAspect,
    });

    setNewUrl('');
    setNewCaption('');
    setNewLocation('');
    setNewDate('');
    setShowAddModal(false);
  };

  return (
    <section id="photos" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Captured Fragments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Photo Album
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#131722] border border-[#23293a] rounded-xl overflow-x-auto max-w-full">
              {(
                [
                  { id: 'all', label: 'All Photos' },
                  { id: 'family', label: 'Family' },
                  { id: 'daughter', label: 'Little Sunshine' },
                  { id: 'travel', label: 'Travels' },
                  { id: 'everyday', label: 'Everyday' },
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

            {onOpenPhotoSync && (
              <button
                onClick={onOpenPhotoSync}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f472b6]/15 hover:bg-[#f472b6]/25 border border-[#f472b6]/30 text-xs text-[#f8b4d9] transition-colors whitespace-nowrap"
              >
                <Camera className="w-3.5 h-3.5 text-[#f472b6]" />
                <span className="hidden sm:inline">Upload Real Photos</span>
                <span className="sm:hidden">Upload Photos</span>
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>Add Photo</span>
            </button>
          </div>
        </div>

        {/* Masonry-Style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group break-inside-avoid relative rounded-2xl overflow-hidden bg-[#131620] border border-[#212738] hover:border-[#38435f] cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
            >
              <div className="relative overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{
                    height: photo.aspect === 'tall' ? '380px' : photo.aspect === 'wide' ? '220px' : '280px',
                  }}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Subtle scrim on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-xs text-white font-medium mb-1">
                    {photo.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#f8b4d9]" />
                      <span>{photo.location}</span>
                    </div>
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-3.5 flex items-center justify-between text-xs border-t border-[#1c2230]">
                <span className="text-[#94a3b8] truncate max-w-[200px]">{photo.caption}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikePhoto(photo.id);
                  }}
                  className="flex items-center gap-1 text-[#f8b4d9] hover:text-[#f472b6] p-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#f8b4d9]/20" />
                  <span className="font-mono text-[11px] tabular-nums">{photo.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-[#131620] border border-[#272d3e] rounded-3xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative bg-black flex items-center justify-center max-h-[65vh]">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  className="max-h-[65vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-[#131620]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-1">
                      {activePhoto.caption}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#f8b4d9]" />
                        {activePhoto.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#94a3b8]" />
                        {activePhoto.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onLikePhoto(activePhoto.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs text-[#fda4af] transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-[#fda4af]/30" />
                      <span className="font-mono tabular-nums">{activePhoto.likes}</span>
                    </button>

                    <a
                      href={activePhoto.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-[#94a3b8] hover:text-white"
                      title="Open full image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Modal */}
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
                Add to Photo Album
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Image URL or Local Upload</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or paste link"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6] mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748b]">Or upload from device:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-[11px] text-[#94a3b8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-[#23293a] file:text-white hover:file:bg-[#2e364c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Caption</label>
                  <input
                    type="text"
                    required
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Afternoon picnic under the mango tree"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Siargao Island"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Date</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="e.g. October 2026"
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
                      <option value="family">Family</option>
                      <option value="daughter">Little Sunshine</option>
                      <option value="travel">Travel</option>
                      <option value="everyday">Everyday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Aspect Ratio</label>
                    <select
                      value={newAspect}
                      onChange={(e) => setNewAspect(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="square">Square</option>
                      <option value="wide">Wide</option>
                      <option value="tall">Tall</option>
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
                    Add to Album
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
