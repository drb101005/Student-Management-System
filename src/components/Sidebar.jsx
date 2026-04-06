import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Students', to: '/students' },
  { label: 'Attendance', to: '/attendance' },
  { label: 'Results', to: '/results' },
  { label: 'Admin', to: '/admin' }
];

const Sidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen ? (
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
      />
    ) : null}

    <aside
      className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl transition-transform duration-300 md:static md:h-auto md:translate-x-0 md:rounded-3xl md:border md:bg-white/5 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Campus Flow</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-white">Control Center</h2>
        <p className="mt-3 text-sm text-slate-400">
          A simple workspace for students, attendance, results, and admin access.
        </p>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="panel-muted mt-auto p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">MVP Stack</p>
        <p className="mt-2 text-sm text-slate-200">React, Firebase Auth, Firestore, Tailwind, Vercel.</p>
      </div>
    </aside>
  </>
);

export default Sidebar;
