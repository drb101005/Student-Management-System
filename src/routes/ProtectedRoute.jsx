import { Navigate, Outlet } from 'react-router-dom';
import { getHomePath } from '../utils/roles';

const ProtectedRoute = ({ user, profile, loading, allowedRoles, children }) => {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="panel w-full max-w-md p-10 text-center">
          <p className="font-display text-2xl font-semibold text-white">Loading your workspace...</p>
          <p className="mt-3 text-sm text-slate-400">Checking your account and role access.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="panel w-full max-w-xl p-10 text-center">
          <p className="font-display text-2xl font-semibold text-white">Profile setup missing</p>
          <p className="mt-3 text-sm text-slate-400">
            This account is signed in, but the local backend does not have a role profile for it yet.
          </p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={getHomePath(profile.role)} replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
