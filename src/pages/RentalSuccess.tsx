import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home, BookOpen } from 'lucide-react';

const RentalSuccess = () => {
  const location = useLocation();
  // Get the book title passed from the previous page (if available)
  const bookTitle = location.state?.bookTitle || "your book";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center">
        
        {/* Animated Checkmark */}
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
        <p className="text-gray-500 text-lg mb-8">
          You have successfully rented <span className="font-semibold text-gray-800">"{bookTitle}"</span>.
        </p>

        <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 mb-8 text-left">
          <h3 className="font-semibold text-brand-900 mb-1">What happens next?</h3>
          <ul className="text-sm text-brand-700 space-y-2">
            <li>• The book will be delivered to your address within 2 days.</li>
            <li>• You have 14 days to complete the reading.</li>
            <li>• A return label is included in the box.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Return to Home
          </Link>
          
          {/* We will build this page next */}
          <button 
            disabled
            className="block w-full bg-white text-gray-400 border border-gray-200 py-3 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
          >
            <BookOpen size={20} />
            View My Rentals (Coming Soon)
          </button>
        </div>

      </div>
    </div>
  );
};

export default RentalSuccess;   