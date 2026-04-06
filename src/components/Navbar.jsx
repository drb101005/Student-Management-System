const Navbar = ({ user, onMenuClick, onLogout }) => (
  <header className="panel sticky top-4 z-30 flex items-center justify-between gap-4 px-5 py-4">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onMenuClick}
        className="btn-secondary px-3 py-2 md:hidden"
        aria-label="Open menu"
      >
        Menu
      </button>
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Admin Panel</p>
        <h1 className="font-display text-xl font-bold text-white">Student Management System</h1>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Logged In</p>
        <p className="text-sm font-medium text-slate-100">{user?.email}</p>
      </div>
      <button type="button" onClick={onLogout} className="btn-primary px-4 py-2 text-sm">
        Logout
      </button>
    </div>
  </header>
);

export default Navbar;

