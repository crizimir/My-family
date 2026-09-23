import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Music, Plus, Menu, X, Heart, Camera, Settings, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  isAudioPlaying: boolean;
  onToggleAudioPlayer: () => void;
  onOpenPhotoSync?: () => void;
  onOpenCustomizer?: () => void;
  onLockSanctuary?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAdd,
  isAudioPlaying,
  onToggleAudioPlayer,
  onOpenPhotoSync,
  onOpenCustomizer,
  onLockSanctuary,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Sanctuary', path: '/' },
    { label: 'Profiles', path: '/profiles' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Planner', path: '/planner' },
    { label: 'Finances', path: '/finances' },
    { label: 'Vault', path: '/vault' },
    { label: 'Feed', path: '/feed' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0f17]/90 backdrop-blur-md border-b border-[#1f2433]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-white hover:text-[#f8b4d9] transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6] inline-block animate-pulse-subtle" />
          <span className="font-heading">Cuares Family</span>
        </Link>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#94a3b8]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`hover:text-white transition-colors relative py-1 ${
                  isActive
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f472b6] after:rounded-full'
                    : ''
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#38bdf8] hover:text-white bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/30 rounded-xl transition-all shadow-sm"
              title="Customize all family names, stories, dates, and settings"
            >
              <Settings className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="hidden md:inline whitespace-nowrap">Customize</span>
            </button>
          )}

          {onOpenPhotoSync && (
            <button
              onClick={onOpenPhotoSync}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#f8b4d9] hover:text-white bg-[#f472b6]/15 hover:bg-[#f472b6]/25 border border-[#f472b6]/30 rounded-xl transition-all shadow-sm"
              title="Upload your real camera photos"
            >
              <Camera className="w-3.5 h-3.5 text-[#f472b6]" />
              <span className="hidden sm:inline whitespace-nowrap">Real Photos</span>
            </button>
          )}

          <button
            onClick={onToggleAudioPlayer}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              isAudioPlaying
                ? 'bg-[#1e1e2d] border-[#f472b6]/40 text-[#f8b4d9] shadow-sm shadow-[#f472b6]/10'
                : 'bg-[#151824] border-[#262c3e] text-[#94a3b8] hover:text-white hover:border-[#3b445e]'
            }`}
            title="Music Player"
          >
            <Music className={`w-3.5 h-3.5 ${isAudioPlaying ? 'animate-spin-slow text-[#f472b6]' : ''}`} />
            <span className="hidden sm:inline whitespace-nowrap">
              {isAudioPlaying ? 'Melody Playing' : 'Cozy Audio'}
            </span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#e11d48]/80 to-[#f472b6]/80 hover:from-[#e11d48] hover:to-[#f472b6] rounded-xl transition-all shadow-md shadow-[#e11d48]/20 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Add Memory</span>
          </button>

          {onLockSanctuary && (
            <button
              onClick={onLockSanctuary}
              className="p-2 rounded-xl bg-[#151824] hover:bg-[#1e2334] border border-[#262c3e] hover:border-[#f472b6]/40 text-[#94a3b8] hover:text-[#f8b4d9] transition-all"
              title="Lock Sanctuary (Requires Password)"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#151824] border border-[#262c3e] text-[#94a3b8] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0f17] border-b border-[#1f2433] px-5 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1b2030] text-white font-semibold border border-[#2e374e]'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#161a26]'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#1f2433] flex flex-col gap-2">
            {onOpenCustomizer && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomizer();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize Everything</span>
              </button>
            )}

            {onLockSanctuary && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLockSanctuary();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#fda4af] bg-[#f43f5e]/10 border border-[#f43f5e]/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Sanctuary (Log Out)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
