import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Plus } from 'lucide-react';
import AddBookForm from '../components/AddBookForm';
import BookTable from '../components/BookTable';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [showAddBook, setShowAddBook] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-brand-500" />
            Admin Portal
          </h1>
          <p className="text-gray-500">Manage users, books, and rentals</p>
        </div>
        <button 
          onClick={logout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid (Keep existing code) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         {/* ... (Keep your stats blocks here) ... */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg"><Users className="text-blue-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">1,240</h3>
            </div>
          </div>
        </div>
        {/* ... etc ... */}
      </div>

      {/* MANAGEMENT SECTION */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Library Management</h2>
        <button 
          onClick={() => setShowAddBook(!showAddBook)}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition"
        >
          <Plus size={20} />
          {showAddBook ? 'Close Form' : 'Add New Book'}
        </button>
      </div>

      {/* Conditionally Show Form */}
      {showAddBook && (
        <div className="mb-8">
          <AddBookForm 
            onSuccess={() => setShowAddBook(false)} 
            onCancel={() => setShowAddBook(false)} 
          />
        </div>
      )}
      

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Book Inventory</h2>
        <BookTable />
      </div>
    </div>
  );
};

export default AdminDashboard;