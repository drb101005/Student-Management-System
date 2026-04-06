import { useEffect, useState } from 'react';
import { getAttendanceCount } from '../services/attendanceService';
import { getResultsCount } from '../services/resultService';
import { getStudentsCount } from '../services/studentService';

const TeacherDashboard = ({ profile }) => {
  const [stats, setStats] = useState({
    students: 0,
    attendance: 0,
    results: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const [students, attendance, results] = await Promise.all([
        getStudentsCount(),
        getAttendanceCount(),
        getResultsCount()
      ]);

      setStats({ students, attendance, results });
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <section className="panel p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Teacher Dashboard</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
          Welcome, {profile?.fullName ?? 'Teacher'}
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Review student records, update attendance, and manage result entries from your teacher workspace.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          ['Students', stats.students],
          ['Attendance Records', stats.attendance],
          ['Results', stats.results]
        ].map(([label, value]) => (
          <article key={label} className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
            <p className="mt-5 font-display text-5xl font-bold text-white">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Teacher Profile</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['Full Name', profile?.fullName ?? 'Not set'],
              ['Email', profile?.email ?? 'Not set'],
              ['Phone', profile?.phone ?? 'Not set'],
              ['Department', profile?.department ?? 'Not set']
            ].map(([label, value]) => (
              <div key={label} className="panel-muted p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Access Scope</p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Teachers can log in locally and work with students, attendance, and results.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Admin-only account management stays inside the Admin page.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
