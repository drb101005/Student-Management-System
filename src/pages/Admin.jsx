import { useMemo, useState } from 'react';
import { sendAdminPasswordReset } from '../services/authService';

const formatTimestamp = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Date(value).toLocaleString();
};

const Admin = ({ user }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const adminDetails = useMemo(
    () => [
      ['Admin Email', user?.email ?? 'Not available'],
      ['User ID', user?.uid ?? 'Not available'],
      ['Email Verified', user?.emailVerified ? 'Yes' : 'No'],
      ['Account Created', formatTimestamp(user?.metadata?.creationTime)],
      ['Last Login', formatTimestamp(user?.metadata?.lastSignInTime)]
    ],
    [user]
  );

  const handleResetPassword = async () => {
    if (!user?.email) {
      setError('No admin email is available for password reset.');
      setFeedback('');
      return;
    }

    setIsSending(true);
    setError('');
    setFeedback('');

    try {
      await sendAdminPasswordReset(user.email);
      setFeedback(`Password reset email sent to ${user.email}.`);
    } catch (resetError) {
      setError(resetError.message.replace('Firebase: ', ''));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin Page</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
          Manage your admin access
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          This page is built for the single-admin MVP. It shows the current Firebase admin account,
          basic security details, and quick account actions.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Account Details</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">Current admin profile</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Single Admin MVP
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
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Quick Actions</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">Admin account tools</h3>
            <p className="mt-3 text-sm text-slate-400">
              Use Firebase Auth to keep the admin account easy to recover and maintain.
            </p>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isSending}
              className="btn-primary mt-6 w-full"
            >
              {isSending ? 'Sending reset email...' : 'Send Password Reset Email'}
            </button>

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

          <section className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-300">MVP Notes</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                This version uses one Firebase admin account and protected routes for access control.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Students, attendance, and results stay inside Firestore with no custom backend.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Later, this page can grow into role management for teachers and students.
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Admin;
