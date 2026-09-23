import React, { useState } from 'react';
import { SocialPost } from '../types/family';
import { MessageSquare, Heart, Share2, Sparkles, Plus, Image as ImageIcon, Send, X, Play } from 'lucide-react';

interface SocialFeedProps {
  posts: SocialPost[];
  onAddPost: (post: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'userLiked'>) => void;
  onLikePost: (id: string) => void;
  onAddComment: (postId: string, text: string, author: string) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Mirwen H. Cuares');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaType, setMediaType] = useState<SocialPost['mediaType']>('text');
  const [tagsInput, setTagsInput] = useState('');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [commentAuthor, setCommentAuthor] = useState('Janine');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const authorAvatar =
      author.includes('Mirwen')
        ? '/src/assets/images/avatar_mirwen_1790186738497.jpg'
        : '/src/assets/images/avatar_janine_1790186753016.jpg';

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onAddPost({
      author,
      authorAvatar,
      date: 'Today',
      timestamp: 'Just now',
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      mediaType: imageUrl.trim() ? (mediaType === 'video-mock' ? 'video-mock' : 'image') : 'text',
      tags: tags.length ? tags : ['EverydayBliss'],
    });

    setContent('');
    setImageUrl('');
    setTagsInput('');
    setShowCreateModal(false);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    onAddComment(postId, text, commentAuthor);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <section id="feed" className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Micro-Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Family Social Journal
            </h2>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e11d48]/80 to-[#f472b6]/80 hover:from-[#e11d48] hover:to-[#f472b6] text-xs text-white font-medium shadow-md shadow-[#e11d48]/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#131620] border border-[#212738] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1c2130] border border-[#2e374f] shrink-0">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{post.author}</h4>
                    {/* Unboxed timestamp */}
                    <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
                      <span>{post.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Optional Image or Video-mock media */}
              {post.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden bg-[#1a1f2e] border border-[#272f42] max-h-96">
                  <img
                    src={post.imageUrl}
                    alt="Post media"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {post.mediaType === 'video-mock' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags (clean unboxed text with #) */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-[#a5b4fc]">
                  {post.tags.map((tag) => (
                    <span key={tag} className="hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#1d2334] flex items-center justify-between text-xs">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                    post.userLiked
                      ? 'bg-[#fda4af]/20 border-[#fda4af]/40 text-[#fda4af]'
                      : 'bg-[#181c28] border-[#252c3e] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      post.userLiked ? 'fill-[#fda4af] text-[#fda4af]' : ''
                    }`}
                  />
                  <span className="font-mono tabular-nums">{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[#94a3b8]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.comments.length} comments</span>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="space-y-2.5 pt-2">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-2xl bg-[#171b26] border border-[#212738] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white">{comment.author}</span>
                      <span className="text-[#64748b]">{comment.time}</span>
                    </div>
                    <p className="text-[#cbd5e1]">{comment.text}</p>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <select
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-[#171b26] border border-[#262c3e] text-xs text-[#94a3b8] focus:outline-none"
                  >
                    <option value="Janine">Janine</option>
                    <option value="Mirwen">Mirwen</option>
                    <option value="Lorizavei">Lorizavei</option>
                  </select>

                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendComment(post.id);
                    }}
                    placeholder="Write a sweet reply..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#171b26] border border-[#262c3e] text-xs text-white focus:outline-none focus:border-[#f472b6]"
                  />

                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 rounded-xl bg-[#f472b6] hover:bg-[#e11d48] text-white transition-colors"
                    title="Send comment"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-[#141722] border border-[#272d3e] rounded-3xl p-6 shadow-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-heading font-bold text-white mb-4">
                Share a Family Moment
              </h3>

              <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Author</label>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  >
                    <option value="Mirwen H. Cuares">Mirwen H. Cuares</option>
                    <option value="Janine Rae D Cuares">Janine Rae D Cuares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">What's on your mind?</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell the family story from today..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#94a3b8] mb-1 font-medium">Optional Photo / Video URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... image link"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Media Type</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    >
                      <option value="text">Text only</option>
                      <option value="image">Photo</option>
                      <option value="video-mock">Video clip</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94a3b8] mb-1 font-medium">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Cozy, Baking, Sunshine"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181c29] border border-[#262c3e] text-white focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#181c29] text-[#94a3b8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#f472b6] hover:bg-[#e11d48] text-white font-medium shadow-md shadow-[#f472b6]/20 transition-all"
                  >
                    Post to Feed
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
