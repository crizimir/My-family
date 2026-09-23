import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Check,
  User,
  Heart,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { processImageFile } from '../utils/photoStorage';
import { PhotoItem, Profile } from '../types/family';

interface PhotoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  onUpdateAvatar: (profileId: string, dataUrl: string) => void;
  heroPhoto: string;
  onUpdateHeroPhoto: (dataUrl: string) => void;
  onAddPhotos: (newPhotos: PhotoItem[]) => void;
}

export const PhotoSyncModal: React.FC<PhotoSyncModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onUpdateAvatar,
  heroPhoto,
  onUpdateHeroPhoto,
  onAddPhotos,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedQueue, setUploadedQueue] = useState<{ id: string; name: string; dataUrl: string }[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    const newItems: { id: string; name: string; dataUrl: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const dataUrl = await processImageFile(file);
        newItems.push({
          id: `upload-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          dataUrl,
        });
      } catch (err) {
        console.error('Error processing file:', file.name, err);
      }
    }

    if (newItems.length > 0) {
      setUploadedQueue((prev) => [...newItems, ...prev]);
      setSelectedPhoto(newItems[0].dataUrl);
      showToast(`Loaded ${newItems.length} photo${newItems.length > 1 ? 's' : ''}! Assign them below.`);
    }
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const assignToProfile = (profileId: string, dataUrl: string) => {
    onUpdateAvatar(profileId, dataUrl);
    const name = profiles.find((p) => p.id === profileId)?.name.split(' ')[0] || 'Profile';
    showToast(`Updated ${name}'s photo!`);
  };

  const assignToHero = (dataUrl: string) => {
    onUpdateHeroPhoto(dataUrl);
    showToast('Updated main Sanctuary cover photo!');
  };

  const addAllToAlbum = () => {
    if (uploadedQueue.length === 0) return;
    const albumPhotos: PhotoItem[] = uploadedQueue.map((item, index) => ({
      id: `real-${Date.now()}-${index}`,
      url: item.dataUrl,
      caption: 'Real family memory',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      location: 'The Cuares Collection',
      category: (index % 3 === 0 ? 'family' : index % 3 === 1 ? 'everyday' : 'travel') as any,
      aspect: (index % 2 === 0 ? 'wide' : 'square') as any,
      likes: Math.floor(Math.random() * 20) + 15,
    }));

    onAddPhotos(albumPhotos);
    showToast(`Added all ${uploadedQueue.length} photos to your Photo Album!`);
  };

  const mirwen = profiles.find((p) => p.id === 'mirwen');
  const janine = profiles.find((p) => p.id === 'janine');
  const daughter = profiles.find((p) => p.id === 'daughter');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#11131c] border border-[#23293a] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#1f2434] flex items-center justify-between bg-[#141724]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f472b6]/15 border border-[#f472b6]/30 flex items-center justify-center text-[#f472b6]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-semibold text-white flex items-center gap-2">
                <span>Upload Your Real Photos</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Genuine
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Select your phone or camera photos to replace avatars, hero cover, and gallery memories.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1f2434] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[#f472b6]/20 border-b border-[#f472b6]/30 px-4 py-2 text-xs text-white font-medium flex items-center justify-center gap-2 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#fde047]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Multi-file Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#2b3347] hover:border-[#f472b6]/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-[#141824]/50 hover:bg-[#171b29] transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <div className="w-14 h-14 rounded-2xl bg-[#1b2030] border border-[#2b3347] flex items-center justify-center mx-auto mb-3 text-[#f472b6] group-hover:scale-110 transition-transform">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#fde047]" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <p className="text-sm sm:text-base font-medium text-white mb-1">
              {isProcessing ? 'Processing High-Resolution Images...' : 'Click or Drag & Drop Your Photos Here'}
            </p>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Select all 14 images at once! Supports full-res camera photos from your phone or desktop.
            </p>
          </div>

          {/* Quick Target Assignment Slots */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94a3b8] mb-3">
              Assign Dedicated Profile & Hero Photos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Mirwen Slot */}
              <div className="p-3 rounded-xl bg-[#151926] border border-[#22283a] flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <img
                    src={mirwen?.avatar}
                    alt="Mirwen"
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/40"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-black rounded-full text-[10px]">
                    <User className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Mirwen</p>
                <p className="text-[11px] text-[#94a3b8] mb-2.5">Dad / Rock</p>
                {selectedPhoto ? (
                  <button
                    onClick={() => assignToProfile('mirwen', selectedPhoto)}
                    className="w-full py-1 text-[11px] font-medium bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Set Selected</span>
                  </button>
                ) : (
                  <label className="w-full py-1 text-[11px] font-medium bg-[#1e2333] hover:bg-[#252c40] text-[#cbd5e1] border border-[#2e374d] rounded-lg transition-colors text-center cursor-pointer block">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await processImageFile(file);
                          assignToProfile('mirwen', dataUrl);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Janine Slot */}
              <div className="p-3 rounded-xl bg-[#151926] border border-[#22283a] flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <img
                    src={janine?.avatar}
                    alt="Janine Rae"
                    className="w-16 h-16 rounded-full object-cover border-2 border-rose-400/40"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-rose-400 text-black rounded-full text-[10px]">
                    <Heart className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Janine Rae</p>
                <p className="text-[11px] text-[#94a3b8] mb-2.5">Mom / Soul</p>
                {selectedPhoto ? (
                  <button
                    onClick={() => assignToProfile('janine', selectedPhoto)}
                    className="w-full py-1 text-[11px] font-medium bg-rose-400/20 hover:bg-rose-400/30 text-rose-300 border border-rose-400/40 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Set Selected</span>
                  </button>
                ) : (
                  <label className="w-full py-1 text-[11px] font-medium bg-[#1e2333] hover:bg-[#252c40] text-[#cbd5e1] border border-[#2e374d] rounded-lg transition-colors text-center cursor-pointer block">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await processImageFile(file);
                          assignToProfile('janine', dataUrl);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Daughter Slot */}
              <div className="p-3 rounded-xl bg-[#151926] border border-[#22283a] flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <img
                    src={daughter?.avatar}
                    alt="Daughter"
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/40"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-purple-400 text-black rounded-full text-[10px]">
                    <Sparkles className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Our Daughter</p>
                <p className="text-[11px] text-[#94a3b8] mb-2.5">Little Sunshine</p>
                {selectedPhoto ? (
                  <button
                    onClick={() => assignToProfile('daughter', selectedPhoto)}
                    className="w-full py-1 text-[11px] font-medium bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 border border-purple-400/40 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Set Selected</span>
                  </button>
                ) : (
                  <label className="w-full py-1 text-[11px] font-medium bg-[#1e2333] hover:bg-[#252c40] text-[#cbd5e1] border border-[#2e374d] rounded-lg transition-colors text-center cursor-pointer block">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await processImageFile(file);
                          assignToProfile('daughter', dataUrl);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Hero Cover Slot */}
              <div className="p-3 rounded-xl bg-[#151926] border border-[#22283a] flex flex-col items-center text-center">
                <div className="relative mb-2 w-full h-16 rounded-lg overflow-hidden border-2 border-sky-400/40 bg-black">
                  <img src={heroPhoto} alt="Sanctuary Cover" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 p-1 bg-sky-400 text-black rounded-full text-[9px]">
                    <ImageIcon className="w-2.5 h-2.5" />
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Home Cover</p>
                <p className="text-[11px] text-[#94a3b8] mb-2.5">Sanctuary Hero</p>
                {selectedPhoto ? (
                  <button
                    onClick={() => assignToHero(selectedPhoto)}
                    className="w-full py-1 text-[11px] font-medium bg-sky-400/20 hover:bg-sky-400/30 text-sky-300 border border-sky-400/40 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Set Selected</span>
                  </button>
                ) : (
                  <label className="w-full py-1 text-[11px] font-medium bg-[#1e2333] hover:bg-[#252c40] text-[#cbd5e1] border border-[#2e374d] rounded-lg transition-colors text-center cursor-pointer block">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await processImageFile(file);
                          assignToHero(dataUrl);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Photos Queue / Grid */}
          {uploadedQueue.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
                  Uploaded Queue ({uploadedQueue.length} photos)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addAllToAlbum}
                    className="px-3 py-1.5 text-xs font-medium bg-[#f472b6] hover:bg-[#ec4899] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#f472b6]/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Add All to Photo Album</span>
                  </button>
                  <button
                    onClick={() => setUploadedQueue([])}
                    className="p-1.5 text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Clear queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#94a3b8] mb-3">
                Tap any photo to select it, then click "Set Selected" above to set it as Mirwen, Janine, Daughter, or Cover!
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
                {uploadedQueue.map((item) => {
                  const isSelected = selectedPhoto === item.dataUrl;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPhoto(item.dataUrl)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-[#f472b6] scale-105 shadow-lg shadow-[#f472b6]/30'
                          : 'border-[#22283a] hover:border-[#38425d] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#f472b6] rounded-full flex items-center justify-center text-white text-[9px]">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2434] bg-[#141724] flex items-center justify-between">
          <div className="text-[11px] text-[#94a3b8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Changes persist immediately across visits.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-medium bg-[#1e2333] hover:bg-[#262c3e] text-white border border-[#2e374d] rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
