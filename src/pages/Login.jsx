import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/authService';

const Login = ({ user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
      navigate('/', { replace: true });
    } catch (firebaseError) {
      setError(firebaseError.message.replace('Firebase: ', ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel overflow-hidden p-8 lg:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Fast MVP</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight text-white lg:text-6xl">
            School operations, simplified for admins.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 lg:text-lg">
            Manage students, attendance, and results from one clean Firebase-powered dashboard.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Students', 'Create, update, search, and review records quickly.'],
              ['Attendance', 'Track present, absent, and late entries by date.'],
              ['Results', 'Store marks, totals, grades, and exam names.']
            ].map(([title, description]) => (
              <div key={title} className="panel-muted p-5">
                <p className="font-display text-xl font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin Login</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-3 text-sm text-slate-400">
            Sign in with your Firebase Email/Password admin account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="field"
                placeholder="admin@school.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Signing in...' : 'Login as Admin'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;

