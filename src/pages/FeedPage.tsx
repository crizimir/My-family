import React from 'react';
import { SocialFeed } from '../components/SocialFeed';
import { SocialPost } from '../types/family';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeedPageProps {
  posts: SocialPost[];
  onAddPost: (post: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'userLiked'>) => void;
  onLikePost: (id: string) => void;
  onAddComment: (postId: string, text: string, author: string) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary Home</span>
        </Link>
      </div>

      <SocialFeed
        posts={posts}
        onAddPost={onAddPost}
        onLikePost={onLikePost}
        onAddComment={onAddComment}
      />
    </div>
  );
};
