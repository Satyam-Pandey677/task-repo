import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../../context/userApi';

const getHeaders = () => ({ Authorization: `Bearer ${Cookies.get('token')}` });
const formatTime = (val) => (val ? new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--');
const formattedDate = new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

const HeroBanner = ({ title, subtitle }) => (
  <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200 sm:p-8">
    <div className="relative z-10 max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{formattedDate}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{subtitle}</p>
    </div>
    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-28 border-emerald-400/20" />
    <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-emerald-400/10" />
  </section>
);

const EmployeeDashboard = () => {
  const { user, logout } = useAppData();
  const navigate = useNavigate();
  const [todayAtt, setTodayAtt] = useState(null);
  const [attPct, setAttPct] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get('/api/employee/attendance/today', { headers: getHeaders() }),
      axios.get('/api/employee/attendance/stats', { headers: getHeaders() }),
    ])
      .then(([todayRes, statsRes]) => {
        setTodayAtt(todayRes.data?.data || null);
        setAttPct(statsRes.data?.attendancePercentage || 0);
      })
      .catch((err) => console.error('Failed to load personal attendance', err))
      .finally(() => setLoading(false));
  }, []);

  const markAttendance = async (action) => {
    try {
      setSubmitting(true);
      const isCheckIn = action === 'check-in';
      const endpoint = isCheckIn ? '/api/employee/attendance/check-in' : '/api/employee/attendance/check-out';
      const request = isCheckIn ? axios.post : axios.patch;
      const { data } = await request(endpoint, {}, { headers: getHeaders() });

      setTodayAtt(data?.data || todayAtt);
      toast.success(data?.message || `${action} successful`);

      const statsRes = await axios.get('/api/employee/attendance/stats', { headers: getHeaders() });
      setAttPct(statsRes.data?.attendancePercentage || 0);
    } catch (error) {
      setTodayAtt(error.response?.data?.data || todayAtt);
      toast.error(error.response?.data?.message || 'Attendance action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in', { replace: true });
  };

  const status = todayAtt?.checkOut ? 'Completed' : todayAtt?.checkIn ? 'Working' : 'Not marked';
  const deptName = typeof user?.department === 'object' ? user.department.name : user?.department;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <HeroBanner
        title={`Good morning, ${user?.name || 'Employee'}.`}
        subtitle="Your personal workday overview, attendance status, and profile details."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Check in', formatTime(todayAtt?.checkIn), 'Today', 'bg-sky-50 text-sky-700'],
          ['Check out', formatTime(todayAtt?.checkOut), 'Today', 'bg-amber-50 text-amber-700'],
          ['Attendance', `${attPct}%`, 'This month', 'bg-violet-50 text-violet-700'],
          ['Department', deptName || 'Not assigned', 'Your team', 'bg-slate-100 text-slate-700'],
        ].map(([label, value, detail, tone]) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <span className={`inline-flex rounded-xl px-3 py-2 text-xs font-bold ${tone}`}>{label}</span>
            <p className="mt-5 truncate text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today’s attendance</h2>
              <p className="mt-1 text-sm text-slate-500">Only your current attendance record is shown here.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${todayAtt ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{status}</span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Check in time</p><p className="mt-2 text-2xl font-bold text-slate-800">{formatTime(todayAtt?.checkIn)}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Check out time</p><p className="mt-2 text-2xl font-bold text-slate-800">{formatTime(todayAtt?.checkOut)}</p></div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading || submitting || Boolean(todayAtt?.checkIn)}
              onClick={() => markAttendance('check-in')}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && !todayAtt?.checkIn ? 'Checking in...' : 'Check in'}
            </button>
            <button
              type="button"
              disabled={loading || submitting || !todayAtt?.checkIn || Boolean(todayAtt?.checkOut)}
              onClick={() => markAttendance('check-out')}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && todayAtt?.checkIn ? 'Checking out...' : 'Check out'}
            </button>
          </div>
          {todayAtt?.checkOut && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Log out
            </button>
          )}
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">My work profile</h2>
          <p className="mt-1 text-sm text-slate-500">Your current employee information.</p>
          <div className="mt-6 space-y-4">
            <div><p className="text-xs uppercase tracking-wide text-slate-400">Name</p><p className="mt-1 font-semibold text-slate-800">{user?.name || 'Not available'}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-slate-400">Email</p><p className="mt-1 break-all font-semibold text-slate-800">{user?.user?.email || 'Not available'}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-slate-400">Designation</p><p className="mt-1 font-semibold text-slate-800">{user?.designation || 'Not assigned'}</p></div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default EmployeeDashboard;