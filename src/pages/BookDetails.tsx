import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Book } from '../types';
import { Star, ArrowLeft, Calendar, BookOpen, Loader } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching book:", error);
      } else {
        setBook(data);
      }
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  if (!book) {
    return <div className="text-center py-20">Book not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-brand-500 mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Browse
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-3 gap-0">
          
          {/* Left Column: Cover Image */}
          <div className="bg-gray-100 p-8 flex items-center justify-center border-r border-gray-100">
            <img 
              src={book.cover_url}  // <--- FIXED: Must match database column name (snake_case)
              alt={book.title} 
              className="w-48 shadow-lg rounded-md transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Column: Details */}
          <div className="col-span-2 p-8 md:p-10 space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {book.available ? 'Available' : 'Rented Out'}
                </span>
              </div>
              <p className="text-xl text-gray-500">by {book.author}</p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-6 border-y border-gray-100 py-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="font-bold text-gray-900">{book.rating}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={20} />
                <span>{book.category}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Synopsis</h3>
              <p className="text-gray-600 leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate(`/rent/${book.id}`)}
                disabled={!book.available}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg 
                  ${book.available 
                    ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/30' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
              >
                <BookOpen size={20} />
                {book.available ? 'Rent This Book' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;