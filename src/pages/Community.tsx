import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ThumbsUp, Send, User } from 'lucide-react';

// Define the shape of our post data
type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { full_name: string }; // Assuming you have a profiles table!
};

const Community = () => {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    // If you don't have a profiles table yet, just select('*')
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setPosts(data);
    }
  }, []);

  // Fetch posts on load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPosts();
  }, [fetchPosts]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newPost.trim()) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('community_posts')
      .insert([{ 
        user_id: session.user.id, 
        content: newPost 
      }]);

    if (!error) {
      setNewPost('');
      fetchPosts(); // Refresh the feed!
    } else {
      alert("Error posting: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Feed</h1>
        <p className="text-gray-600 mt-2">Discuss books, ask for recommendations, and share what you're learning.</p>
      </div>

      {/* Write a Post Box */}
      {session ? (
        <form onSubmit={handlePostSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share a book review, ask a question, or drop a reading tip..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-brand-500 focus:border-brand-500 resize-none"
            rows={3}
            required
          />
          <div className="flex justify-end mt-3">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-500 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-600 transition disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Posting...' : 'Post to Community'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-brand-50 p-4 rounded-xl text-brand-800 text-center mb-8 border border-brand-100">
          Please log in to join the discussion and post!
        </div>
      )}

      {/* The Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No posts yet. Be the first to start a discussion!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand-100 p-2 rounded-full text-brand-600">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {post.profiles?.full_name || 'Anonymous Reader'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex gap-6 mt-4 pt-4 border-t border-gray-50 text-sm font-medium text-gray-500">
                <button className="flex items-center gap-1.5 hover:text-brand-500 transition">
                  <ThumbsUp size={16} /> Like
                </button>
                <button className="flex items-center gap-1.5 hover:text-brand-500 transition">
                  <MessageSquare size={16} /> Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;