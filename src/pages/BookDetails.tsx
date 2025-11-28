import { Link } from 'react-router-dom';
import { Star, ArrowLeft, Calendar, BookOpen, MessageKnowledge Nest } from 'lucide-react';

const BookDetails = () => {
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
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800" 
              alt="Book Cover" 
              className="w-48 shadow-lg rounded-md transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Column: Details */}
          <div className="col-span-2 p-8 md:p-10 space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Clean Code</h1>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>
              <p className="text-xl text-gray-500">by Robert C. Martin</p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-6 border-y border-gray-100 py-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="font-bold text-gray-900">4.8</span>
                <span className="text-gray-400 text-sm">(124 reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={20} />
                <span>Pub: 2008</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageKnowledge Nest size={20} />
                <span>12 Discussions</span>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Synopsis</h3>
              <p className="text-gray-600 leading-relaxed">
                Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. 
                Every year, countless hours and significant resources are lost because of poorly written code. 
                But it doesn't have to be that way.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-brand-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30">
                <BookOpen size={20} />
                Rent This Book
              </button>
              <button className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-brand-500 hover:text-brand-500 transition-all">
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;