import { NavLink } from 'react-router-dom';
import { ROLE_LABELS } from '../utils/roles';

const navItemsByRole = {
  admin: [
    { label: 'Dashboard', to: '/admin-dashboard' },
    { label: 'Students', to: '/students' },
    { label: 'Attendance', to: '/attendance' },
    { label: 'Results', to: '/results' },
    { label: 'Admin', to: '/admin' }
  ],
  teacher: [
    { label: 'Dashboard', to: '/teacher-dashboard' },
    { label: 'Students', to: '/students' },
    { label: 'Attendance', to: '/attendance' },
    { label: 'Results', to: '/results' }
  ],
  student: [{ label: 'Dashboard', to: '/student-dashboard' }]
};

const Sidebar = ({ profile, isOpen, onClose }) => {
  const navItems = navItemsByRole[profile?.role] ?? [];

  return (
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
          <h2 className="mt-2 font-display text-3xl font-bold text-white">
            {ROLE_LABELS[profile?.role] ?? 'Control'} Center
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {profile?.role === 'student'
              ? 'Your personal dashboard for attendance, results, and profile details.'
              : 'A simple workspace for multi-role school operations and admin access.'}
          </p>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end
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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Role</p>
          <p className="mt-2 text-sm text-slate-200">{ROLE_LABELS[profile?.role] ?? 'Unknown user role'}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
