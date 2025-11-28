import { useEffect, useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import for redirection
import { supabase } from '../lib/supabase';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initHome = async () => {
      setLoading(true);

      // 1. Check if the current user is an Admin
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch the user's role from the 'profiles' table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        // If Admin, kick them to the Dashboard immediately
        if (profile?.role === 'admin') {
          navigate('/admin');
          return; // Stop here, don't fetch books
        }
      }

      // 2. If NOT Admin (or not logged in), fetch books
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching books:', error);
      } else {
        setBooks(data || []);
      }
      
      setLoading(false);
    };

    initHome();
  }, [navigate]);

  // Filter Logic based on search input
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold">Find Your Next Read</h1>
        <p className="text-brand-50 text-lg max-w-2xl mx-auto">
          Access thousands of books from the Knowledge Nest community. Rent, learn, and share.
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or category..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
        </div>
      </div>

      {/* Book Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Arrivals</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-brand-500" size={40} />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No books found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;