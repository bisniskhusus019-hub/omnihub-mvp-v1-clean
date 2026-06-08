import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import {
  Hash,
  TrendingUp,
  Briefcase,
  Package,
  Megaphone,
  ThumbsUp,
  MessageSquare,
  Plus,
  Send,
} from 'lucide-react';
import { mockForumChannels, mockForumPosts } from '../data/mockData';
import {
  fetchCommunityPosts,
  createCommunityPost,
  updateCommunityPostUpvotes,
} from '../lib/supabaseStub';

const channelIcons: Record<
  string,
  ComponentType<{ size: number; className?: string }>
> = {
  megaphone: Megaphone,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  package: Package,
};

type ForumPost = {
  id: string;
  channel: string;
  author: string;
  authorAvatar: string;
  title: string;
  body: string;
  upvotes: number;
  comments: number;
  time: string;
  created_at?: string;
};

function normalizePost(row: any): ForumPost {
  return {
    id: row.id,
    channel: row.channel || 'ch1',
    author: row.author || 'Rangga Adhitya',
    authorAvatar:
      row.authorAvatar ||
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: row.title || 'Untitled Topic',
    body: row.body || 'New topic posted from OmniHub Community.',
    upvotes: Number(row.upvotes || 0),
    comments: Number(row.comments || row.comments_count || 0),
    time: row.time || formatPostTime(row.created_at),
    created_at: row.created_at,
  };
}

function formatPostTime(createdAt?: string) {
  if (!createdAt) return 'just now';

  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

  if (diffMinutes < 2) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function CommunityForum() {
  const [activeChannel, setActiveChannel] = useState('ch1');
  const [newTopic, setNewTopic] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>(
    mockForumPosts.map(normalizePost)
  );
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const supabasePosts = await fetchCommunityPosts();

        if (supabasePosts && supabasePosts.length > 0) {
          setPosts(supabasePosts.map(normalizePost));
        }
      } catch (error) {
        console.error('Failed to load community posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => post.channel === activeChannel);
  const activeChannelData = mockForumChannels.find(
    (channel) => channel.id === activeChannel
  );

  const handlePost = async () => {
    const cleanTopic = newTopic.trim();
    if (!cleanTopic || posting) return;

    setPosting(true);

    try {
      const savedPost = await createCommunityPost({
        channel: activeChannel,
        title: cleanTopic,
        body: 'New topic posted from OmniHub Community.',
      });

      const normalizedPost = normalizePost(savedPost);

      setPosts((prev) => [normalizedPost, ...prev]);
      setNewTopic('');
    } catch (error) {
      console.error('Failed to create community post:', error);
      alert('Failed to save post to Supabase. Check RLS policy.');
    } finally {
      setPosting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    const targetPost = posts.find((post) => post.id === id);
    if (!targetPost) return;

    const nextUpvotes = targetPost.upvotes + 1;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, upvotes: nextUpvotes } : post
      )
    );

    try {
      await updateCommunityPostUpvotes(id, nextUpvotes);
    } catch (error) {
      console.error('Failed to update upvote:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
      <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex-col hidden sm:flex">
        <div className="px-4 py-4 border-b border-slate-800">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Community
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            OmniHub Network
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-4 mb-2">
            Channels
          </p>

          {mockForumChannels.map((channel) => {
            const isActive = activeChannel === channel.id;

            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`
                  w-full flex items-center gap-2 px-4 py-2 text-xs transition-all relative
                  ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-cyan-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
              >
                <Hash size={11} className="flex-shrink-0" />
                <span className="flex-1 truncate">{channel.name}</span>

                {channel.unread > 0 && (
                  <span className="bg-cyan-500 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {channel.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-slate-500" />
            <span className="text-sm font-semibold text-white">
              {activeChannelData?.name}
            </span>
          </div>

          <div className="sm:hidden flex gap-1 overflow-x-auto">
            {mockForumChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`text-[10px] px-2 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  activeChannel === channel.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                #{channel.name.split('-')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex gap-2">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80"
              alt="You"
              className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
            />

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Post a new topic to this channel..."
                value={newTopic}
                onChange={(event) => setNewTopic(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handlePost();
                }}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />

              <button
                onClick={handlePost}
                disabled={posting}
                className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold text-xs px-3 py-2 rounded-xl transition-all whitespace-nowrap"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">
                  {posting ? 'Posting...' : 'Post'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <MessageSquare size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Loading community posts...
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                No posts yet in this channel.
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Be the first to start a discussion!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">
                        {post.author}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-500">
                        {post.time}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-100 mt-1 leading-snug">
                      {post.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-4 ml-12">
                  {post.body}
                </p>

                <div className="flex items-center gap-4 ml-12">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors group"
                  >
                    <ThumbsUp
                      size={13}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>{post.upvotes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                    <MessageSquare size={13} />
                    <span>{post.comments} replies</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors ml-auto">
                    <Send size={11} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}