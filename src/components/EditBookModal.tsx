import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Book } from '../types';
import { X, Save, Link as LinkIcon } from 'lucide-react';

interface EditBookModalProps {
  book: Book;
  onClose: () => void;
  onUpdate: () => void;
}

const EditBookModal = ({ book, onClose, onUpdate }: EditBookModalProps) => {
  const [loading, setLoading] = useState(false);
  
  // 1. Initialize category in state
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    category: book.category, // <--- Added
    price: book.price || 50,
    available: book.available,
    cover_url: book.cover_url || '' 
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('books')
      .update({
        title: formData.title,
        author: formData.author,
        category: formData.category, // <--- Send to DB
        price: formData.price,
        available: formData.available,
        cover_url: formData.cover_url 
      })
      .eq('id', book.id);

    setLoading(false);

    if (error) {
      alert("Error updating: " + error.message);
    } else {
      alert("Book updated successfully!");
      onUpdate();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Book Details</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          
          {/* Title & Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded-lg" 
              />
            </div>
            
            {/* 2. Category Dropdown */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              >
                <option value="Fiction">Fiction</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Literature">Literature</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Short Stories">Short Stories</option>
              </select>
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input 
              value={formData.author} 
              onChange={e => setFormData({...formData, author: e.target.value})}
              className="w-full p-2 border rounded-lg" 
            />
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-gray-400" />
              </div>
              <input 
                value={formData.cover_url} 
                onChange={e => setFormData({...formData, cover_url: e.target.value})}
                className="w-full pl-10 p-2 border rounded-lg text-sm text-gray-600" 
                placeholder="https://..."
              />
            </div>
            {formData.cover_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={formData.cover_url} alt="Preview" className="h-20 rounded border border-gray-200 object-cover" />
              </div>
            )}
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input 
                type="number"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select 
                value={formData.available ? 'true' : 'false'}
                onChange={e => setFormData({...formData, available: e.target.value === 'true'})}
                className={`w-full p-2 border rounded-lg font-medium ${formData.available ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
              >
                <option value="true">Available</option>
                <option value="false">Rented / Unavailable</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-500 text-white py-2 rounded-lg hover:bg-brand-600 flex justify-center items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;