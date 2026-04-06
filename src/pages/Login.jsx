import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutAdmin, registerStudentAccount } from '../services/authService';
import { getHomePath, ROLE_LABELS } from '../utils/roles';

const modeLabels = {
  admin: 'Admin Login',
  teacher: 'Teacher Login',
  student: 'Student Login',
  signup: 'Student Signup'
};

const defaultStudentForm = {
  studentId: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  class: '',
  section: '',
  rollNumber: '',
  parentName: '',
  status: 'active'
};

const Login = ({ user, profile }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('admin');
  const [loginForm, setLoginForm] = useState({
    email: 'admin1@gmail.com',
    password: '123456'
  });
  const [studentForm, setStudentForm] = useState(defaultStudentForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile) {
      navigate(getHomePath(profile.role), { replace: true });
    }
  }, [navigate, profile, user]);

  const activeRole = useMemo(() => {
    if (mode === 'signup') {
      return 'student';
    }

    return mode;
  }, [mode]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleStudentChange = (event) => {
    const { name, value } = event.target;
    setStudentForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleRoleLogin = async (role) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const session = await loginUser(loginForm.email, loginForm.password);
      const userProfile = session.profile;

      if (userProfile.role !== role) {
        await logoutAdmin();
        setError(
          `This account is registered as ${ROLE_LABELS[userProfile.role] ?? userProfile.role}, not ${ROLE_LABELS[role]}.`
        );
        return;
      }

      navigate(getHomePath(userProfile.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSignup = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (studentForm.password !== studentForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerStudentAccount(studentForm);
      setSuccess('Student account created successfully. Redirecting to your dashboard...');
      setStudentForm(defaultStudentForm);
      navigate('/student-dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel overflow-hidden p-8 lg:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Multi Role Access</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-white lg:text-6xl">
            One app for admins, teachers, and students.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 lg:text-lg">
            The app now runs on a local NestJS backend with JWT auth and a seeded SQLite database.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ['Admin', 'Use admin1@gmail.com / 123456 for the seeded admin workspace.'],
              ['Teacher', 'Use yash@gmail.com / 123456 for the seeded teacher workspace.'],
              ['Student', 'Students can still create a local account from the signup form.'],
              ['Local Stack', 'All data now comes from your local backend and database.']
            ].map(([title, description]) => (
              <div key={title} className="panel-muted p-5">
                <p className="font-display text-xl font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-8 lg:p-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(modeLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  setError('');
                  setSuccess('');

                  if (key === 'admin') {
                    setLoginForm({
                      email: 'admin1@gmail.com',
                      password: '123456'
                    });
                  } else if (key === 'teacher') {
                    setLoginForm({
                      email: 'yash@gmail.com',
                      password: '123456'
                    });
                  } else if (key !== 'signup') {
                    setLoginForm({
                      email: '',
                      password: ''
                    });
                  }
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === key
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">{modeLabels[mode]}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">
              {mode === 'signup' ? 'Create a student account' : `Continue as ${ROLE_LABELS[activeRole]}`}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {mode === 'signup'
                ? 'Students can create their own local account and immediately access the student dashboard.'
                : 'Use one of the seeded accounts or any local role account created from the admin page.'}
            </p>
          </div>

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
              {error}
            </div>
          ) : null}

          {mode === 'signup' ? (
            <form className="mt-8 space-y-5" onSubmit={handleStudentSignup}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="studentId"
                  className="field"
                  placeholder="Student ID"
                  value={studentForm.studentId}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="rollNumber"
                  className="field"
                  placeholder="Roll Number"
                  value={studentForm.rollNumber}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="fullName"
                  className="field md:col-span-2"
                  placeholder="Full Name"
                  value={studentForm.fullName}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="email"
                  type="email"
                  className="field"
                  placeholder="Email"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="phone"
                  className="field"
                  placeholder="Phone"
                  value={studentForm.phone}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="class"
                  className="field"
                  placeholder="Class"
                  value={studentForm.class}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="section"
                  className="field"
                  placeholder="Section"
                  value={studentForm.section}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="parentName"
                  className="field md:col-span-2"
                  placeholder="Parent Name"
                  value={studentForm.parentName}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="password"
                  type="password"
                  className="field"
                  placeholder="Password"
                  value={studentForm.password}
                  onChange={handleStudentChange}
                  required
                />
                <input
                  name="confirmPassword"
                  type="password"
                  className="field"
                  placeholder="Confirm Password"
                  value={studentForm.confirmPassword}
                  onChange={handleStudentChange}
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Creating account...' : 'Create Student Account'}
              </button>
            </form>
          ) : (
            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleRoleLogin(activeRole);
              }}
            >
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="field"
                  placeholder={`${activeRole}@school.com`}
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="field"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Signing in...' : `Login as ${ROLE_LABELS[activeRole]}`}
              </button>

              {mode === 'admin' ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  Seeded admin: <span className="font-semibold text-white">admin1@gmail.com / 123456</span>
                </div>
              ) : null}
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Login;
