import React from 'react';
import { CharacterProfiles } from '../components/CharacterProfiles';
import { Profile } from '../types/family';
import { Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfilesPageProps {
  profiles: Profile[];
  onHeartProfile: (id: string) => void;
  onUpdateAvatar?: (id: string, dataUrl: string) => void;
  onOpenPhotoSync?: () => void;
  onOpenCustomizer?: () => void;
}

export const ProfilesPage: React.FC<ProfilesPageProps> = ({
  profiles,
  onHeartProfile,
  onUpdateAvatar,
  onOpenPhotoSync,
  onOpenCustomizer,
}) => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary Home</span>
        </Link>
      </div>

      <CharacterProfiles
        profiles={profiles}
        onHeartProfile={onHeartProfile}
        onUpdateAvatar={onUpdateAvatar}
        onOpenPhotoSync={onOpenPhotoSync}
        onOpenCustomizer={onOpenCustomizer}
      />
    </div>
  );
};
