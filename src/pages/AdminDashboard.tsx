import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Book, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Admin Header */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg"><Users className="text-blue-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">1,240</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg"><Book className="text-green-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Books</p>
              <h3 className="text-2xl font-bold">856</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg"><Activity className="text-purple-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Active Rentals</p>
              <h3 className="text-2xl font-bold">124</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-400">
        User Management Table Coming Soon...
      </div>
    </div>
  );
};

export default AdminDashboard;