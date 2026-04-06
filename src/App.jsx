import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './routes/ProtectedRoute';
import { logoutAdmin, subscribeToAuthChanges } from './services/authService';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Results = lazy(() => import('./pages/Results'));
const Admin = lazy(() => import('./pages/Admin'));

const PageLoader = () => (
  <div className="panel p-8 text-center">
    <p className="font-display text-2xl font-semibold text-white">Loading page...</p>
    <p className="mt-2 text-sm text-slate-400">Preparing the next module.</p>
  </div>
);

const AppShell = ({ user }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[280px_1fr]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="space-y-4">
          <Navbar
            user={user}
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={handleLogout}
          />

          <main className="pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login user={currentUser} />} />
          <Route element={<ProtectedRoute user={currentUser} loading={authLoading} />}>
            <Route element={<AppShell user={currentUser} />}>
              <Route index element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/results" element={<Results />} />
              <Route path="/admin" element={<Admin user={currentUser} />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
