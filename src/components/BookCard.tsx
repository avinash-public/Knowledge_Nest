import { Star, BookOpen } from 'lucide-react';
import type { Book } from '../types/index';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/book/${book.id}`} className="block"> 
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      {/* Book Cover Area */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img 
          src={book.cover_url} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
          {book.category}
        </div>
      </div>

      {/* Book Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{book.title}</h3>
        </div>
        <p className="text-gray-500 text-sm mb-4">{book.author}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-yellow-500 gap-1">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-medium text-gray-700">{book.rating}</span>
          </div>

          <button 
            disabled={!book.available}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
              ${book.available 
                ? 'bg-brand-50 text-brand-900 hover:bg-brand-100 text-blue-600' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            <BookOpen size={16} />
            {book.available ? 'Rent Now' : 'Rented'}
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default BookCard;