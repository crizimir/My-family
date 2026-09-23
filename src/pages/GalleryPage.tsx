import React from 'react';
import { PhotoAlbum } from '../components/PhotoAlbum';
import { DigitalNoteBoard } from '../components/DigitalNoteBoard';
import { PhotoItem, StickyNote } from '../types/family';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryPageProps {
  photos: PhotoItem[];
  notes: StickyNote[];
  onAddPhoto: (photo: Omit<PhotoItem, 'id' | 'likes'>) => void;
  onLikePhoto: (id: string) => void;
  onAddNote: (note: Omit<StickyNote, 'id'>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenPhotoSync?: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  photos,
  notes,
  onAddPhoto,
  onLikePhoto,
  onAddNote,
  onDeleteNote,
  onTogglePin,
  onOpenPhotoSync,
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

      <PhotoAlbum
        photos={photos}
        onAddPhoto={onAddPhoto}
        onLikePhoto={onLikePhoto}
        onOpenPhotoSync={onOpenPhotoSync}
      />

      <DigitalNoteBoard
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        onTogglePin={onTogglePin}
      />
    </div>
  );
};
