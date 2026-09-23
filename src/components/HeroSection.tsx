import React, { useRef } from 'react';
import { Heart, Sparkles, MapPin, Calendar, ArrowDown, Camera, Upload, Settings } from 'lucide-react';
import { processImageFile } from '../utils/photoStorage';
import { SiteSettings } from '../types/family';

interface HeroSectionProps {
  onScrollToProfiles: () => void;
  daysTogether: number;
  heroPhoto?: string;
  onUpdateHeroPhoto?: (dataUrl: string) => void;
  onOpenPhotoSync?: () => void;
  siteSettings?: SiteSettings;
  onOpenCustomizer?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToProfiles,
  daysTogether,
  heroPhoto = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
  onUpdateHeroPhoto,
  onOpenPhotoSync,
  siteSettings,
  onOpenCustomizer,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultSettings: SiteSettings = {
    familyName: 'Cuares Family',
    sanctuaryTitle: 'The Cuares Haven',
    tagline: 'Everyday warmth, gentle laughter, and our growing little world.',
    description: 'The digital sanctuary of Mirwen, Janine Rae, and our darling daughter. Documenting our quiet coffee mornings, milestone adventures, handwritten letters, and the sweet ordinary days that mean everything.',
    locationCity: 'Pasig City, Philippines',
    establishedYear: '2018',
    togetherSinceDate: '2018-01-01',
  };

  const current = siteSettings || defaultSettings;

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateHeroPhoto) {
      const dataUrl = await processImageFile(file);
      onUpdateHeroPhoto(dataUrl);
    }
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Soft pastel ambient background flares */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#f472b6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#c084fc]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-ping" />
              <span>{current.sanctuaryTitle} · Est. {current.establishedYear}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#94a3b8]">{current.locationCity}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-heading font-bold text-white tracking-tight leading-[1.15] text-balance">
              {current.tagline}
            </h1>

            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-xl">
              {current.description}
            </p>

            {/* Quick Unboxed Stats Row (Zero-Pill discipline) */}
            <div className="pt-2 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#94a3b8] border-t border-[#1f2433]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#fde047]" />
                <span className="text-white font-semibold tabular-nums">{daysTogether}+</span>
                <span>Days together</span>
              </div>
              <span aria-hidden="true" className="text-[#334155]">·</span>
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-[#f472b6]" />
                <span className="text-white font-semibold">{current.familyName}</span>
                <span>Sanctuary</span>
              </div>
              <span aria-hidden="true" className="text-[#334155]">·</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="text-white font-semibold">Forever</span>
                <span>And always</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onScrollToProfiles}
                className="px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#1a1e2b] hover:bg-[#222738] border border-[#2e374d] rounded-xl transition-all flex items-center gap-2 group"
              >
                <span>Meet Our Family</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#f472b6] group-hover:translate-y-0.5 transition-transform" />
              </button>

              {onOpenCustomizer && (
                <button
                  onClick={onOpenCustomizer}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-[#38bdf8] hover:text-white bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/30 rounded-xl transition-all flex items-center gap-1.5"
                  title="Customize everything on this app"
                >
                  <Settings className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Customize Info</span>
                </button>
              )}

              {onOpenPhotoSync && (
                <button
                  onClick={onOpenPhotoSync}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-[#f8b4d9] hover:text-white bg-[#f472b6]/15 hover:bg-[#f472b6]/25 border border-[#f472b6]/30 rounded-xl transition-all flex items-center gap-2 group"
                >
                  <Camera className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>Upload Real Photos</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-6">
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden border border-[#262c3e] bg-[#141722] shadow-2xl shadow-black/60">
                <img
                  src={heroPhoto}
                  alt="Mirwen, Janine Rae, and their baby daughter together"
                  className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14]/90 via-[#0c0e14]/20 to-transparent" />

                {/* Instant Change Photo Button Overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-xs font-medium backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg"
                    title="Replace with your camera photo"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#f472b6]" />
                    <span>Change Cover Photo</span>
                  </button>
                </div>

                {/* Soft caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#cbd5e1]">
                  <div>
                    <p className="font-heading font-medium text-white">The Cuares Haven</p>
                    <p className="text-[11px] text-[#94a3b8]">Home is wherever we are together</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0c0e14]/70 backdrop-blur-sm border border-white/10 text-[11px] text-[#f8b4d9]">
                    <Sparkles className="w-3 h-3 text-[#fde047]" />
                    <span>Cherished</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
