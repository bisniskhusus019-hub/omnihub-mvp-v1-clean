import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Hash, TrendingUp, Briefcase, Package, Megaphone, ThumbsUp, MessageSquare, Plus, Send, Tag } from 'lucide-react';
import { mockForumChannels, mockForumPosts } from '../data/mockData';
import { fetchCommunityPosts, createCommunityPost, updateCommunityPostUpvotes } from '../lib/supabaseStub';

const channelIcons: Record<string, ComponentType<{ size: number; className?: string }>> = {
  megaphone: Megaphone,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  package: Package,
};

const postTypes = [
  { value: 'discussion', label: 'Discussion' },
  { value: 'product-promo', label: 'Product Promo' },
  { value: 'service-promo', label: 'Service Promo' },
  { value: 'affiliate-share', label: 'Affiliate Share' },
  { value: 'help-request', label: 'Help Request' },
];

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
    author: row.author || 'OmniHub Member',
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
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function CommunityForum() {
  const [activeChannel, setActiveChannel] = useState('ch1');
  const [newTopic, setNewTopic] = useState('');
  const [newBody, setNewBody] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts.map(normalizePost));
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const supabasePosts = await fetchCommunityPosts();
        if (supabasePosts && supabasePosts.length > 0) setPosts(supabasePosts.map(normalizePost));
      } catch (error) {
        console.error('Failed to load community posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => post.channel === activeChannel);
  const activeChannelData = mockForumChannels.find((channel) => channel.id === activeChannel);
  const activePostType = postTypes.find((item) => item.value === postType)?.label || 'Discussion';

  const handlePost = async () => {
    const cleanTopic = newTopic.trim();
    if (!cleanTopic || posting) return;
    setPosting(true);
    try {
      const savedPost = await createCommunityPost({
        channel: activeChannel,
        title: `[${activePostType}] ${cleanTopic}`,
        body: newBody.trim() || 'New topic posted from OmniHub Community.',
      });
      setPosts((prev) => [normalizePost(savedPost), ...prev]);
      setNewTopic('');
      setNewBody('');
      setPostType('discussion');
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
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, upvotes: nextUpvotes } : post)));
    try {
      await updateCommunityPostUpvotes(id, nextUpvotes);
    } catch (error) {
      console.error('Failed to update upvote:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
      <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex-col hidden sm:flex">
        <div className="px-4 py-4 border-b border-slate-800">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Community</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Discuss, promote, recruit, and support</p>
        </div>
        <div className="flex-1 overflow-y-auto py-3">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-4 mb-2">Channels</p>
          {mockForumChannels.map((channel) => {
            const isActive = activeChannel === channel.id;
            const Icon = channelIcons[channel.icon] || Hash;
            return (
              <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-all relative ${isActive ? 'bg-cyan-500/10 text-cyan-400 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                <Icon size={12} className="flex-shrink-0" />
                <span className="flex-1 truncate">{channel.name}</span>
                {channel.unread > 0 && <span className="bg-cyan-500 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{channel.unread}</span>}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2"><Hash size={14} className="text-slate-500" /><span className="text-sm font-semibold text-white">{activeChannelData?.name}</span></div>
          <div className="sm:hidden flex gap-1 overflow-x-auto">
            {mockForumChannels.map((channel) => <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`text-[10px] px-2 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${activeChannel === channel.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>#{channel.name.split('-')[0]}</button>)}
          </div>
        </div>

        <div className="px-5 py-4 border-b border-slate-800 flex-shrink-0 bg-slate-950/40">
          <div className="flex gap-3">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80" alt="You" className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr] gap-2">
                <select value={postType} onChange={(event) => setPostType(event.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60">
                  {postTypes.map((item) => <option key={item.value} value={item.value} className="bg-slate-900 text-slate-100">{item.label}</option>)}
                </select>
                <input type="text" placeholder="Title: promote a product, ask for help, share service, recruit affiliate..." value={newTopic} onChange={(event) => setNewTopic(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) handlePost(); }} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60" />
              </div>
              <textarea value={newBody} onChange={(event) => setNewBody(event.target.value)} placeholder="Details, offer, product link, service explanation, affiliate angle, question, or community update..." rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500"><Tag size={12} />Community supports product promo, service promo, affiliate share, and help requests.</div>
                <button onClick={handlePost} disabled={posting || !newTopic.trim()} className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold text-xs px-3 py-2 rounded-xl transition-all whitespace-nowrap"><Plus size={13} />{posting ? 'Posting...' : 'Post'}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="text-center py-16"><MessageSquare size={32} className="text-slate-700 mx-auto mb-3" /><p className="text-sm text-slate-500">Loading community posts...</p></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16"><MessageSquare size={32} className="text-slate-700 mx-auto mb-3" /><p className="text-sm text-slate-500">No posts yet in this channel.</p><p className="text-xs text-slate-600 mt-1">Be the first to start a useful discussion or promotion.</p></div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <img src={post.authorAvatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-semibold text-white">{post.author}</span><span className="text-xs text-slate-500">·</span><span className="text-xs text-slate-500">{post.time}</span></div>
                    <p className="text-sm font-medium text-slate-100 mt-1 leading-snug">{post.title}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 ml-12">{post.body}</p>
                <div className="flex items-center gap-4 ml-12">
                  <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors group"><ThumbsUp size={13} className="group-hover:scale-110 transition-transform" /><span>{post.upvotes}</span></button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"><MessageSquare size={13} /><span>{post.comments} replies</span></button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors ml-auto"><Send size={11} /><span>Share</span></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
