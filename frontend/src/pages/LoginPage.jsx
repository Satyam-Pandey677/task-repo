import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/userApi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuth, setUser, setIsAuth } = useAppData();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if(isAuth) {
    navigate("/")
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/login', form);

      Cookies.set('token', data.token, { expires: 1 });
      setUser(data.user);
      setIsAuth(true);
      toast.success(data.message || 'Login successful');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
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
              Human Resource System
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Manage your people with clarity.
            </h1>
            <p className="mt-5 text-base leading-7 text-emerald-100/90">
              One dashboard for employee records, access management, and daily HR operations.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm text-emerald-100/80">
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Secure</div>
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Fast</div>
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Reliable</div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 px-5 py-10 text-slate-800">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Welcome back</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  Remember me
                </label>
                <button type="button" className="font-medium text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Use your HRMS credentials to continue.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;