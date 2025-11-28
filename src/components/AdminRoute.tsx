import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AdminRoute = () => {
  const { session, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (session?.user.id) {
        // Query the 'profiles' table we created in Step 1
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(data?.role === 'admin');
      }
      setLoading(false);
    };

    if (!authLoading) checkAdmin();
  }, [session, authLoading]);

  if (authLoading || loading) return <div className="p-10 text-center">Checking permissions...</div>;

  // If not logged in, go to Login
  if (!session) return <Navigate to="/login" replace />;

  // If logged in but NOT admin, go to Home
  if (!isAdmin) return <Navigate to="/" replace />;

  // If admin, show the page
  return <Outlet />;
};

export default AdminRoute;