import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, ThumbsUp, PlusCircle } from 'lucide-react';

type CommunityPost = {
  id: string;
  title: string | null;
  content: string | null;
  created_at?: string | null;
  user_id?: string | null;
  profiles?: { full_name: string | null } | null;
};

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  // 1. Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      // Note: We fetch the user's email or profile data too so we know who posted it!
      const { data } = await supabase
        .from('community_posts')
        .select('*, profiles(full_name)') 
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  // 2. Submit a New Post
  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;
    
    await supabase.from('community_posts').insert([
      { 
        user_id: user.id, 
        title: "New Discussion", 
        content: newPostContent 
      }
    ]);
    
    setNewPostContent('');
    // Re-fetch posts here to update the feed
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Knowledge Feed</h1>
      
      {/* Create Post Box */}
      <form onSubmit={handlePostSubmit} className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-200">
        <textarea 
          placeholder="What are you reading right now? Share your thoughts..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg mb-3"
          rows={3}
        />
        <button type="submit" className="bg-brand-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <PlusCircle size={18} /> Post
        </button>
      </form>

      {/* The Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.content}</p>
            
            <div className="flex gap-4 mt-4 text-sm text-gray-400">
              <button className="flex items-center gap-1 hover:text-brand-500"><ThumbsUp size={16}/> Like</button>
              <button className="flex items-center gap-1 hover:text-brand-500"><MessageSquare size={16}/> Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;