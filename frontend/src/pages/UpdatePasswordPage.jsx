import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.oldPassword || !form.newPassword) {
      toast.error('All fields are required');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post(
        '/api/user/update-password',
        {
          email: form.email,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        { headers }
      );

      toast.success(data.message || 'Password updated successfully!');
      navigate('/sign-in');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to update password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-800 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-emerald-300 blur-3xl" />
            <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-teal-400 blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center gap-3 text-xl font-semibold tracking-wide">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">HR</div>
            <span>HRMS</span>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-100">
              Account Security
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Update your account password.
            </h1>
            <p className="mt-5 text-base leading-7 text-emerald-100/90">
              Keep your HRMS user account secure by setting a strong, unique password.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm text-emerald-100/80">
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Secure Hashing</div>
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Instant Sync</div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 px-5 py-10 text-slate-800">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8">
            <div className="mb-6">
              <Link to="/sign-in" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                ← Back to Sign in
              </Link>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Update Password</h2>
              <p className="mt-1 text-sm text-slate-500">Enter your email and current password to set a new password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="oldPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Current (Old) Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
