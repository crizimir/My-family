import React, { useState } from 'react';
import { Profile } from '../types/family';
import { Heart, Sparkles, Coffee, Music, Smile, Cake, MessageCircleHeart, X, Camera, Settings } from 'lucide-react';
import { processImageFile } from '../utils/photoStorage';

interface CharacterProfilesProps {
  profiles: Profile[];
  onHeartProfile: (id: string) => void;
  onUpdateAvatar?: (id: string, dataUrl: string) => void;
  onOpenPhotoSync?: () => void;
  onOpenCustomizer?: () => void;
}

export const CharacterProfiles: React.FC<CharacterProfilesProps> = ({
  profiles,
  onHeartProfile,
  onUpdateAvatar,
  onOpenPhotoSync,
  onOpenCustomizer,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const getAccentColors = (scheme: Profile['colorScheme']) => {
    switch (scheme) {
      case 'amber':
        return {
          border: 'border-[#fde047]/30 hover:border-[#fde047]/60',
          badgeText: 'text-[#fde047]',
          bgGlow: 'from-[#fde047]/10 to-transparent',
          heartFill: 'fill-[#fde047]/20 text-[#fde047]',
        };
      case 'rose':
        return {
          border: 'border-[#fda4af]/30 hover:border-[#fda4af]/60',
          badgeText: 'text-[#fda4af]',
          bgGlow: 'from-[#fda4af]/10 to-transparent',
          heartFill: 'fill-[#fda4af]/20 text-[#fda4af]',
        };
      case 'lavender':
      default:
        return {
          border: 'border-[#c4b5fd]/30 hover:border-[#c4b5fd]/60',
          badgeText: 'text-[#c4b5fd]',
          bgGlow: 'from-[#c4b5fd]/10 to-transparent',
          heartFill: 'fill-[#c4b5fd]/20 text-[#c4b5fd]',
        };
    }
  };

  return (
    <section id="family" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Trio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Character Profiles
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xs sm:max-w-md hidden sm:block">
              Click any profile card to discover their quirky habits, favorite comforts, and love notes.
            </p>
            {onOpenCustomizer && (
              <button
                onClick={onOpenCustomizer}
                className="px-3.5 py-1.5 text-xs font-medium text-[#38bdf8] hover:text-white bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/30 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                title="Edit and customize profile details"
              >
                <Settings className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Customize Profiles</span>
              </button>
            )}

            {onOpenPhotoSync && (
              <button
                onClick={onOpenPhotoSync}
                className="px-3.5 py-1.5 text-xs font-medium text-[#f8b4d9] hover:text-white bg-[#f472b6]/15 hover:bg-[#f472b6]/25 border border-[#f472b6]/30 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <Camera className="w-3.5 h-3.5 text-[#f472b6]" />
                <span>Upload Real Photos</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Cards in a Row on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((person) => {
            const colors = getAccentColors(person.colorScheme);

            return (
              <div
                key={person.id}
                onClick={() => setSelectedProfile(person)}
                className={`group cursor-pointer relative bg-[#131620] border ${colors.border} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between`}
              >
                {/* Subtle top corner gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.bgGlow} rounded-tr-2xl pointer-events-none blur-xl`}
                />

                <div>
                  {/* Avatar & Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative group/avatar">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#1c2130] border border-[#2d354a] relative">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* Hover Camera Overlay for Direct Upload */}
                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
                          title="Change to your real photo"
                        >
                          <Camera className="w-4 h-4 text-[#f472b6] mb-0.5" />
                          <span className="text-[9px] font-medium">Change</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file && onUpdateAvatar) {
                                const dataUrl = await processImageFile(file);
                                onUpdateAvatar(person.id, dataUrl);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-sm bg-[#131620] rounded-full p-0.5 border border-[#2d354a]">
                        {person.id === 'mirwen' ? '☕' : person.id === 'janine' ? '🌸' : '⭐'}
                      </span>
                    </div>

                    {/* Interactive Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onHeartProfile(person.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#252b40] border border-[#2b3348] text-xs transition-colors"
                      title="Send love"
                    >
                      <Heart className={`w-3.5 h-3.5 ${colors.heartFill} group-hover:scale-110 transition-transform`} />
                      <span className="text-[#e2e8f0] font-mono tabular-nums">{person.hearts}</span>
                    </button>
                  </div>

                  {/* Name and Role */}
                  <div className="mb-3">
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-white transition-colors">
                      {person.name}
                    </h3>
                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8] mt-0.5">
                      <span className={colors.badgeText}>{person.role}</span>
                      <span aria-hidden="true">·</span>
                      <span>{person.nickname}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3 mb-5">
                    {person.bio}
                  </p>
                </div>

                {/* Footer preview */}
                <div className="pt-4 border-t border-[#1f2536] flex items-center justify-between text-xs text-[#64748b]">
                  <div className="flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <span className="text-[#94a3b8]">{person.birthday}</span>
                  </div>
                  <span className="text-[#f8b4d9] group-hover:translate-x-0.5 transition-transform font-medium">
                    View Story →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Profile Expansion */}
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-[#141722] border border-[#272d3e] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white hover:bg-[#252b40] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative group/modalAvatar w-20 h-20 rounded-2xl overflow-hidden bg-[#1c2130] border border-[#2d354a] shrink-0">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <label
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/modalAvatar:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
                    title="Upload real camera photo"
                  >
                    <Camera className="w-4 h-4 text-[#f472b6] mb-0.5" />
                    <span className="text-[9px] font-medium">Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && onUpdateAvatar) {
                          const dataUrl = await processImageFile(file);
                          onUpdateAvatar(selectedProfile.id, dataUrl);
                          setSelectedProfile((prev) => prev ? { ...prev, avatar: dataUrl } : null);
                        }
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    {selectedProfile.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#94a3b8] mt-1 mb-2">
                    <span className="text-[#f8b4d9]">{selectedProfile.role}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedProfile.nickname}</span>
                  </div>
                  {onUpdateAvatar && (
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[#f8b4d9] hover:text-white bg-[#f472b6]/15 hover:bg-[#f472b6]/25 border border-[#f472b6]/30 rounded-lg cursor-pointer transition-colors">
                      <Camera className="w-3 h-3 text-[#f472b6]" />
                      <span>Upload Real Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file && onUpdateAvatar) {
                            const dataUrl = await processImageFile(file);
                            onUpdateAvatar(selectedProfile.id, dataUrl);
                            setSelectedProfile((prev) => prev ? { ...prev, avatar: dataUrl } : null);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Bio & Love Note */}
              <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-6">
                <p>{selectedProfile.bio}</p>

                <div className="p-4 rounded-2xl bg-[#191d2c] border border-[#293247] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#f8b4d9]">
                    <MessageCircleHeart className="w-4 h-4" />
                    <span>Heartfelt Words</span>
                  </div>
                  <p className="text-xs text-[#cbd5e1] italic">"{selectedProfile.loveNote}"</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#191d2c] border border-[#293247] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#fde047]">
                    <Smile className="w-4 h-4" />
                    <span>Adorable Quirk</span>
                  </div>
                  <p className="text-xs text-[#cbd5e1]">{selectedProfile.quirk}</p>
                </div>
              </div>

              {/* Favorite Things Grid */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                  Favorite Comforts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#181c29] border border-[#23293a]">
                    <span className="text-[#94a3b8] block text-[11px] mb-0.5">Warm Drink</span>
                    <span className="text-white font-medium">{selectedProfile.favoriteThings.coffeeOrDrink}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181c29] border border-[#23293a]">
                    <span className="text-[#94a3b8] block text-[11px] mb-0.5">Comfort Food</span>
                    <span className="text-white font-medium">{selectedProfile.favoriteThings.comfortFood}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181c29] border border-[#23293a]">
                    <span className="text-[#94a3b8] block text-[11px] mb-0.5">Pastime</span>
                    <span className="text-white font-medium">{selectedProfile.favoriteThings.hobby}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181c29] border border-[#23293a]">
                    <span className="text-[#94a3b8] block text-[11px] mb-0.5">Cherished Song</span>
                    <span className="text-white font-medium">{selectedProfile.favoriteThings.song}</span>
                  </div>
                </div>
              </div>

              {/* Heart reaction button inside modal */}
              <div className="mt-6 pt-5 border-t border-[#1f2536] flex items-center justify-between">
                <span className="text-xs text-[#94a3b8]">
                  Born on <strong className="text-white">{selectedProfile.birthday}</strong>
                </span>

                <button
                  onClick={() => onHeartProfile(selectedProfile.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e11d48]/20 hover:bg-[#e11d48]/30 border border-[#e11d48]/40 text-xs font-medium text-[#fda4af] transition-colors"
                >
                  <Heart className="w-4 h-4 fill-[#fda4af] text-[#fda4af]" />
                  <span>Send Love ({selectedProfile.hearts})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
