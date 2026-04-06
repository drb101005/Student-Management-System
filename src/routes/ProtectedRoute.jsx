import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="panel w-full max-w-md p-10 text-center">
          <p className="font-display text-2xl font-semibold text-white">Loading your workspace...</p>
          <p className="mt-3 text-sm text-slate-400">Checking your admin session.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
