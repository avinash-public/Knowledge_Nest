import { Outlet, Link } from 'react-router-dom';
import { BookOpen, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { logout, session } = useAuth(); // Changed isAuthenticated to session

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-brand-500" />
              <span className="text-xl font-bold text-gray-900">Knowledge Nest</span>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="hover:text-brand-500 transition">Browse Books</Link>
              <Link to="/" className="hover:text-brand-500 transition">Community</Link>
            </div>

            <div className="flex items-center">
              {/* Check if session exists instead of isAuthenticated */}
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden sm:block">
                    {session.user.email}
                  </span>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition">
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;