import { useEffect, useMemo, useState } from 'react';
import { createTeacherAccount, subscribeToTeachers } from '../services/teacherService';

const formatTimestamp = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Date(value).toLocaleString();
};

const defaultTeacherForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  department: ''
};

const Admin = ({ user, profile }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teacherForm, setTeacherForm] = useState(defaultTeacherForm);

  useEffect(() => subscribeToTeachers(setTeachers), []);

  const adminDetails = useMemo(
    () => [
      ['Admin Name', profile?.fullName ?? 'Not available'],
      ['Admin Email', user?.email ?? 'Not available'],
      ['User ID', user?.id ?? 'Not available'],
      ['Auth Type', 'Local JWT'],
      ['Account Created', formatTimestamp(user?.createdAt)],
      ['Last Login', formatTimestamp(user?.lastLoginAt)]
    ],
    [profile?.fullName, user]
  );

  const handleTeacherChange = (event) => {
    const { name, value } = event.target;

    setTeacherForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleCreateTeacher = async (event) => {
    event.preventDefault();
    setError('');
    setFeedback('');
    setIsCreatingTeacher(true);

    try {
      await createTeacherAccount(teacherForm);
      setFeedback(`Teacher account created for ${teacherForm.email}.`);
      setTeacherForm(defaultTeacherForm);
    } catch (creationError) {
      setError(creationError.message);
    } finally {
      setIsCreatingTeacher(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin Page</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
          Manage roles, access, and admin tools
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          This page manages the local admin account, seeded demo users, and teacher accounts stored
          in your local database.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <section className="panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Account Details</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">Current admin profile</h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Role: Admin
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {adminDetails.map(([label, value]) => (
                <div key={label} className="panel-muted p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  <p className="mt-2 break-all text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Quick Actions</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">Seeded access</h3>
            <p className="mt-3 text-sm text-slate-400">
              These demo credentials are inserted automatically when the local backend starts.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Admin: admin1@gmail.com / 123456',
                'Teacher: yash@gmail.com / 123456'
              ].map((credential) => (
                <div key={credential} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {credential}
                </div>
              ))}
            </div>

            {feedback ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {feedback}
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
                {error}
              </div>
            ) : null}
          </section>
        </div>

        <section className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Teacher Accounts</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Create teacher login</h3>
          <p className="mt-3 text-sm text-slate-400">
            New teacher accounts are added to the local backend and can sign in immediately with JWT auth.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCreateTeacher}>
            <input
              name="fullName"
              className="field"
              placeholder="Teacher full name"
              value={teacherForm.fullName}
              onChange={handleTeacherChange}
              required
            />
            <input
              name="email"
              type="email"
              className="field"
              placeholder="teacher@school.com"
              value={teacherForm.email}
              onChange={handleTeacherChange}
              required
            />
            <input
              name="password"
              type="password"
              className="field"
              placeholder="Temporary password"
              value={teacherForm.password}
              onChange={handleTeacherChange}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="phone"
                className="field"
                placeholder="Phone"
                value={teacherForm.phone}
                onChange={handleTeacherChange}
                required
              />
              <input
                name="department"
                className="field"
                placeholder="Department"
                value={teacherForm.department}
                onChange={handleTeacherChange}
                required
              />
            </div>

            <button type="submit" disabled={isCreatingTeacher} className="btn-primary w-full">
              {isCreatingTeacher ? 'Creating teacher account...' : 'Create Teacher Account'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Existing Teachers</p>
            <div className="mt-4 space-y-3">
              {teachers.length ? (
                teachers.map((teacher) => (
                  <div key={teacher.id} className="panel-muted flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-semibold text-white">{teacher.fullName}</p>
                      <p className="text-sm text-slate-400">
                        {teacher.email} • {teacher.department}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Teacher</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No teacher accounts created yet.</p>
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Admin;
