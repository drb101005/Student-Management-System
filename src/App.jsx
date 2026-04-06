import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './routes/ProtectedRoute';
import { logoutAdmin, restoreSession, subscribeToSessionChanges } from './services/authService';
import { getHomePath } from './utils/roles';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Results = lazy(() => import('./pages/Results'));
const Admin = lazy(() => import('./pages/Admin'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));

const PageLoader = () => (
  <div className="panel p-8 text-center">
    <p className="font-display text-2xl font-semibold text-white">Loading page...</p>
    <p className="mt-2 text-sm text-slate-400">Preparing the next module.</p>
  </div>
);

const RoleHome = ({ user, profile }) => {
  if (profile?.role === 'admin') {
    return <Dashboard />;
  }

  if (profile?.role === 'teacher') {
    return <TeacherDashboard profile={profile} />;
  }

  return <StudentDashboard user={user} profile={profile} />;
};

const AppShell = ({ user, profile }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[280px_1fr]">
        <Sidebar profile={profile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="space-y-4">
          <Navbar
            user={user}
            profile={profile}
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
  const [currentProfile, setCurrentProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribeSession = subscribeToSessionChanges((session) => {
      if (!isMounted) {
        return;
      }

      setCurrentUser(session.user);
      setCurrentProfile(session.profile);
    });

    restoreSession()
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) {
          setAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
      unsubscribeSession();
    };
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login user={currentUser} profile={currentProfile} />} />
          <Route
            element={
              <ProtectedRoute user={currentUser} profile={currentProfile} loading={authLoading} />
            }
          >
            <Route element={<AppShell user={currentUser} profile={currentProfile} />}>
              <Route
                index
                element={<Navigate to={getHomePath(currentProfile?.role)} replace />}
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['admin']}
                  >
                    <RoleHome user={currentUser} profile={currentProfile} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher-dashboard"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['teacher']}
                  >
                    <TeacherDashboard profile={currentProfile} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['student']}
                  >
                    <StudentDashboard user={currentUser} profile={currentProfile} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['admin', 'teacher']}
                  >
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['admin', 'teacher']}
                  >
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['admin', 'teacher']}
                  >
                    <Results />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    user={currentUser}
                    profile={currentProfile}
                    loading={authLoading}
                    allowedRoles={['admin']}
                  >
                    <Admin user={currentUser} profile={currentProfile} />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route
            path="*"
            element={<Navigate to={currentUser ? getHomePath(currentProfile?.role) : '/login'} replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
