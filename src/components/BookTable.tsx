import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Book } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import EditBookModal from './EditBookModal';

const BookTable = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    setBooks(data || []);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else fetchBooks(); // Refresh list
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
              <th className="p-4 font-medium">Book Info</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{book.title}</div>
                  <div className="text-sm text-gray-500">{book.author}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{book.category}</td>
                <td className="p-4 font-medium text-gray-900">₹{book.price || 50}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.available ? 'Available' : 'Rented'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => setEditingBook(book)}
                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <EditBookModal 
          book={editingBook} 
          onClose={() => setEditingBook(null)} 
          onUpdate={fetchBooks}
        />
      )}
    </>
  );
};

export default BookTable;