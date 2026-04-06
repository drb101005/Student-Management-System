import { useEffect, useState } from 'react';
import { getAttendanceCount } from '../services/attendanceService';
import { getResultsCount } from '../services/resultService';
import { getStudentsCount } from '../services/studentService';

const statCards = [
  {
    key: 'students',
    label: 'Total Students',
    accentClass: 'from-amber-400/30 to-orange-500/20'
  },
  {
    key: 'attendance',
    label: 'Attendance Records',
    accentClass: 'from-teal-400/30 to-cyan-500/20'
  },
  {
    key: 'results',
    label: 'Total Results',
    accentClass: 'from-rose-400/25 to-orange-500/20'
  }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    attendance: 0,
    results: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [students, attendance, results] = await Promise.all([
          getStudentsCount(),
          getAttendanceCount(),
          getResultsCount()
        ]);

        setStats({ students, attendance, results });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <section className="panel p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Overview</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
          Keep everyday admin work moving.
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          This dashboard gives you a quick snapshot of your current student records, attendance entries,
          and uploaded results.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {statCards.map((card) => (
          <article key={card.key} className="panel relative overflow-hidden p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accentClass}`} />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{card.label}</p>
              <p className="mt-6 font-display text-5xl font-bold text-white">
                {loading ? '...' : stats[card.key]}
              </p>
              <p className="mt-3 text-sm text-slate-300">Live total from your Firestore MVP collections.</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">How This MVP Works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Authentication', 'Only logged-in admins can access the app.'],
              ['Firestore', 'Students, attendance, and results live in three core collections.'],
              ['Deployment', 'The app is Vercel-ready with a simple client-side routing rewrite.']
            ].map(([title, description]) => (
              <div key={title} className="panel-muted p-5">
                <p className="font-display text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Quick Checklist</p>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Add your Firebase keys into `.env`.
            </li>
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Enable Email/Password auth and create your admin user.
            </li>
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Start creating student, attendance, and result records.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

