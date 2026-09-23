import React, { useState, useEffect, useRef } from 'react';
import { AudioTrack } from '../types/family';
import { cozyAudio } from '../utils/audioSynth';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc,
  X,
  ChevronUp,
  ChevronDown,
  ListMusic,
  ExternalLink,
  Upload,
  Sparkles,
} from 'lucide-react';

interface PersistentAudioPlayerProps {
  tracks: AudioTrack[];
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onUpdateTrack?: (trackId: string, updates: Partial<AudioTrack>) => void;
}

export const PersistentAudioPlayer: React.FC<PersistentAudioPlayerProps> = ({
  tracks,
  isOpen,
  onClose,
  isPlaying,
  setIsPlaying,
  onUpdateTrack,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dragging state
  const [position, setPosition] = useState({ x: 24, y: 24 }); // offset from bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Keep volume synced to audioRef and cozyAudio
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    cozyAudio.setVolume(effectiveVol);
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
  }, [volume, isMuted]);

  // Handle play/pause with custom audio or procedural synth
  const startPlaybackForTrack = (track: AudioTrack) => {
    if (track.audioUrl) {
      cozyAudio.stop();
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // If browser blocked autoplay or invalid media, fallback to synth
          cozyAudio.play(track.audioKey);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      cozyAudio.play(track.audioKey);
    }
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    cozyAudio.stop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Timer tick for progress bar
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        if (currentTrack.audioUrl && audioRef.current) {
          setTrackProgress(Math.floor(audioRef.current.currentTime));
        } else {
          setTrackProgress((prev) => (prev >= currentTrack.duration ? 0 : prev + 1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration, currentTrack.audioUrl]);

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlaybackForTrack(currentTrack);
    }
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setTrackProgress(0);
    const newTrack = tracks[index];
    if (isPlaying) {
      startPlaybackForTrack(newTrack);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    handleSelectTrack(prevIdx);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  // Upload custom MP3 / audio for current track
  const handleUploadAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateTrack) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateTrack(currentTrack.id, { audioUrl: reader.result });
          if (isPlaying) {
            startPlaybackForTrack({ ...currentTrack, audioUrl: reader.result });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag listeners
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = dragRef.current.startX - e.clientX;
      const dy = dragRef.current.startY - e.clientY;
      setPosition({
        x: Math.max(16, Math.min(window.innerWidth - 320, dragRef.current.startPosX + dx)),
        y: Math.max(16, Math.min(window.innerHeight - 200, dragRef.current.startPosY + dy)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      const touch = e.touches[0];
      const dx = dragRef.current.startX - touch.clientX;
      const dy = dragRef.current.startY - touch.clientY;
      setPosition({
        x: Math.max(16, Math.min(window.innerWidth - 320, dragRef.current.startPosX + dx)),
        y: Math.max(16, Math.min(window.innerHeight - 200, dragRef.current.startPosY + dy)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      style={{
        right: `${position.x}px`,
        bottom: `${position.y}px`,
      }}
      className={`fixed z-50 select-none transition-shadow ${
        isDragging ? 'cursor-grabbing opacity-90' : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Hidden audio element for user MP3 playback if uploaded */}
      <audio
        ref={audioRef}
        onEnded={handleNext}
        onError={() => {
          // Fallback to synth if custom url fails
          if (isPlaying) cozyAudio.play(currentTrack.audioKey);
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleUploadAudioFile}
        className="hidden"
      />

      {isMinimized ? (
        /* Minimized Cute Floating Pill */
        <div className="flex items-center gap-2.5 p-2 bg-[#121520]/95 backdrop-blur-md border border-[#2b3348] rounded-2xl shadow-2xl shadow-black/80">
          <div
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-[#1b2030] flex items-center justify-center cursor-pointer hover:bg-[#252c40] text-[#f472b6] transition-colors"
          >
            <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          </div>

          <div
            onClick={() => setIsMinimized(false)}
            className="cursor-pointer max-w-[140px] pr-1"
          >
            <p className="text-xs font-semibold text-white truncate">{currentTrack.title}</p>
            <p className="text-[10px] text-[#f8b4d9] truncate">
              {isPlaying ? currentTrack.artist : 'Paused'}
            </p>
          </div>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg transition-colors"
            title="Expand player"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Expanded Player Card */
        <div className="w-[310px] sm:w-[330px] bg-[#121520]/95 backdrop-blur-md border border-[#2b3348] rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80">
          {/* Header Drag Handle */}
          <div className="drag-handle cursor-grab active:cursor-grabbing flex items-center justify-between pb-2.5 border-b border-[#1f2536] mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#f472b6] animate-pulse-subtle' : 'bg-[#64748b]'}`} />
              <span className="text-xs font-semibold text-white font-heading tracking-wide">
                Sanctuary Melodies
              </span>
              <span className="text-[10px] text-[#94a3b8] bg-[#1b2030] px-1.5 py-0.5 rounded-full border border-[#273044]">
                {currentTrackIndex + 1}/{tracks.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPlaylist((prev) => !prev)}
                className={`p-1 rounded-lg transition-colors ${
                  showPlaylist ? 'text-[#f472b6] bg-[#f472b6]/10' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Toggle playlist drawer"
              >
                <ListMusic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-[#94a3b8] hover:text-white rounded-lg transition-colors"
                title="Minimize player"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 text-[#94a3b8] hover:text-white rounded-lg transition-colors"
                title="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vinyl Disc & Track Info */}
          <div className="flex items-center gap-3.5 my-2.5">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b2030] to-[#252c40] border border-[#2a334a] flex items-center justify-center shrink-0 shadow-inner">
              <Disc className={`w-8 h-8 text-[#f472b6] ${isPlaying ? 'animate-spin-slow' : ''}`} />
              <span className="absolute w-2.5 h-2.5 rounded-full bg-[#121520] border border-[#2a334a]" />
            </div>

            <div className="overflow-hidden flex-1">
              <h4 className="text-sm font-bold text-white truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-[#f8b4d9] font-medium truncate">
                {currentTrack.artist}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[#94a3b8] truncate">
                  {currentTrack.album}
                </span>
                <span className="text-[9px] text-[#475569]">·</span>
                <span className="text-[10px] text-[#64748b] truncate">
                  {currentTrack.genre}
                </span>
              </div>
            </div>
          </div>

          {/* Lyric/Vibe Snippet Quote */}
          {currentTrack.vibeSnippet && (
            <div className="px-2.5 py-1.5 bg-[#171b29] rounded-xl border border-[#232a3d] text-[11px] text-[#cbd5e1] italic text-center mb-2.5">
              {currentTrack.vibeSnippet}
            </div>
          )}

          {/* Scrub Progress Bar */}
          <div className="my-2">
            <div className="w-full h-1.5 bg-[#1b2030] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f472b6] via-[#c084fc] to-[#38bdf8] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (trackProgress / currentTrack.duration) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748b] font-mono mt-1">
              <span>{formatSeconds(trackProgress)}</span>
              <span>{formatSeconds(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePrev}
              className="p-2 text-[#94a3b8] hover:text-white transition-colors"
              title="Previous song"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-2xl bg-[#f472b6] hover:bg-[#e11d48] text-white flex items-center justify-center shadow-lg shadow-[#f472b6]/25 transition-all hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause melody' : 'Play melody'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 text-[#94a3b8] hover:text-white transition-colors"
              title="Next song"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Playlist Drawer (All 3 Requested Songs) */}
          {showPlaylist && (
            <div className="mt-3 pt-3 border-t border-[#1f2536] space-y-1 max-h-48 overflow-y-auto">
              <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider px-1 pb-1">
                Your Sanctuary Playlist
              </div>
              {tracks.map((track, idx) => {
                const isSelected = idx === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#f472b6]/15 border border-[#f472b6]/30 text-white'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className={`font-medium truncate ${isSelected ? 'text-[#f472b6]' : 'text-white'}`}>
                        {idx + 1}. {track.title}
                      </p>
                      <p className="text-[10px] text-[#64748b] truncate">{track.artist}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748b] shrink-0">
                      {formatSeconds(track.duration)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Official Studio Stream Links & Custom Audio Upload */}
          <div className="flex items-center justify-between gap-1.5 pt-2.5 mt-2.5 border-t border-[#1f2536]">
            <div className="flex items-center gap-1.5">
              {currentTrack.spotifySearchUrl && (
                <a
                  href={currentTrack.spotifySearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-[#1db954]/15 hover:bg-[#1db954]/25 text-[#1ed760] text-[10px] font-medium flex items-center gap-1 border border-[#1db954]/30 transition-colors"
                  title="Listen to original studio recording on Spotify"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}

              {currentTrack.youtubeSearchUrl && (
                <a
                  href={currentTrack.youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-[#ff0000]/15 hover:bg-[#ff0000]/25 text-[#ff4b4b] text-[10px] font-medium flex items-center gap-1 border border-[#ff0000]/30 transition-colors"
                  title="Watch / listen to official video on YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

            {onUpdateTrack && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 rounded-lg bg-[#252c40] hover:bg-[#303850] text-[#cbd5e1] text-[10px] font-medium flex items-center gap-1 border border-[#374151] transition-colors"
                title="Attach your own MP3/audio file for this song"
              >
                <Upload className="w-2.5 h-2.5 text-[#38bdf8]" />
                <span>{currentTrack.audioUrl ? 'Change MP3' : 'Add MP3'}</span>
              </button>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 pt-2.5 border-t border-[#1f2536] mt-2.5">
            <button
              onClick={toggleMute}
              className="text-[#94a3b8] hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-[#1f2536] rounded-lg appearance-none cursor-pointer accent-[#f472b6]"
            />
          </div>

          <div className="mt-2 text-center text-[10px] text-[#64748b] flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#f472b6]" />
            <span>
              {currentTrack.audioUrl
                ? 'Playing your custom attached audio'
                : 'Acoustic piano & harmonic synthesis'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

