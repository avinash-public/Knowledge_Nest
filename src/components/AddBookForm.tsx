import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookPlus, X } from 'lucide-react';

const AddBookForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    cover_url: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Insert into Supabase
    const { error } = await supabase
      .from('books')
      .insert([
        {
          title: formData.title,
          author: formData.author,
          category: formData.category,
          cover_url: formData.cover_url || 'https://via.placeholder.com/400x600?text=No+Cover', // Default image
          description: formData.description,
          rating: 4.5, // Default rating for new books
          available: true
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Error adding book: " + error.message);
    } else {
      alert("Book added successfully!");
      onSuccess(); // Tell parent component to refresh
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookPlus className="text-brand-500" />
          Add New Book
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input 
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Ponniyin Selvan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input 
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              placeholder="e.g. Kalki"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
              <option value="Literature">Literature</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              value={formData.cover_url}
              onChange={(e) => setFormData({...formData, cover_url: e.target.value})}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Write a short summary..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white py-2 rounded-lg hover:bg-brand-600 font-medium transition-colors"
        >
          {loading ? 'Adding...' : 'Add Book to Library'}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;