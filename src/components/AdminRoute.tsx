import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AdminRoute = () => {
  const { session, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (session?.user.id) {
        console.log("Checking admin role for:", session.user.email);
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(data?.role === 'admin');
      }
      setCheckingRole(false);
    };

    if (!authLoading && session) {
      checkAdmin();
    }
  }, [session, authLoading]);

  // 1. Show loading text instead of white screen
  if (authLoading || checkingRole) {
    return <div className="p-10 text-center text-xl font-bold">Verifying Admin Access...</div>;
  }

  // 2. If not logged in -> Login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in but NOT admin -> Home
  if (!isAdmin) {
    console.log("User is not admin, redirecting home.");
    return <Navigate to="/" replace />;
  }

  // 4. If Admin -> Show the page
  return <Outlet />;
};

export default AdminRoute;