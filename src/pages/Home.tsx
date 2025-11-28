import { Search } from 'lucide-react';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

// Temporary Dummy Data (We will replace this with FastAPI later)
const DUMMY_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    rating: 4.8,
    available: true,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Literature',
    rating: 4.5,
    available: true,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Education',
    rating: 4.9,
    available: false,
    coverUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800'
  }
];

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero / Search Section */}
      <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold">Find Your Next Read</h1>
        <p className="text-brand-50 text-lg max-w-2xl mx-auto">
          Access thousands of books from the KnowledgeNest community. Rent, learn, and share.
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search by title, author, or ISBN..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
        </div>
      </div>

      {/* Book Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;