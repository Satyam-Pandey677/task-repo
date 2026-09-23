import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../context/userApi';

const HrDashboard = () => {
  const { user } = useAppData();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = Cookies.get('token');
        const { data } = await axios.get('/api/employee/attendance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceRecords(data?.data || []);
      } catch (error) {
        console.error('Failed to load dashboard attendance', error);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const totalEmployees = attendanceRecords.length;
  const totalPresent = attendanceRecords.filter((record) => record.status === 'Present').length;
  const totalLate = attendanceRecords.filter((record) => record.status === 'Late').length;
  const totalOnLeave = attendanceRecords.filter((record) => record.status === 'On leave').length;
  const attendanceRate = totalEmployees ? Math.round((totalPresent / totalEmployees) * 100) : 0;

  const stats = [
    { label: 'Total employees', value: String(totalEmployees || 0), detail: totalEmployees ? 'Live roster' : 'No data', tone: 'bg-emerald-50 text-emerald-700', icon: '👥' },
    { label: 'Present today', value: String(totalPresent || 0), detail: `${attendanceRate}% attendance`, tone: 'bg-sky-50 text-sky-700', icon: '✓' },
    { label: 'On leave', value: String(totalOnLeave || 0), detail: 'Team status', tone: 'bg-amber-50 text-amber-700', icon: '◷' },
    { label: 'Late arrivals', value: String(totalLate || 0), detail: 'Need review', tone: 'bg-rose-50 text-rose-700', icon: '!' },
  ];

  const statusBreakdown = useMemo(() => {
    const items = [
      { label: 'Present', value: totalEmployees ? Math.round((totalPresent / totalEmployees) * 100) : 0, color: 'bg-emerald-500' },
      { label: 'Late', value: totalEmployees ? Math.round((totalLate / totalEmployees) * 100) : 0, color: 'bg-amber-500' },
      { label: 'On leave', value: totalEmployees ? Math.round((totalOnLeave / totalEmployees) * 100) : 0, color: 'bg-slate-400' },
    ];
    return items;
  }, [totalEmployees, totalLate, totalOnLeave, totalPresent]);

  const teamStatus = attendanceRecords.slice(0, 4).map((person) => ({
    name: person.name,
    role: person.department,
    status: person.status,
    time: person.checkIn !== '--' ? person.checkIn : 'Today',
    color: person.status === 'Present' ? 'bg-emerald-500' : person.status === 'Late' ? 'bg-amber-500' : 'bg-slate-400',
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-300">Wednesday, 23 September 2026</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good morning, {user?.name || 'Employee'}.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Here is what is happening across your team today. Keep your people, attendance, and approvals moving.</p>
        </div>
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-28 border-emerald-400/20" />
        <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-emerald-400/10" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${stat.tone}`}>{stat.icon}</span>
              <span className="text-xs font-medium text-slate-400">Today</span>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-right text-xs font-medium text-slate-500">{stat.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Attendance overview</h3>
              <p className="mt-1 text-sm text-slate-500">Current team status</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{loading ? 'Loading...' : `${attendanceRate}% average`}</span>
          </div>

          <div className="mt-8 space-y-4">
            {statusBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{item.label}</span>
                  <span className="text-slate-500">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Today’s team</h3>
              <p className="mt-1 text-sm text-slate-500">Latest check-in activity</p>
            </div>
            <span className="text-sm font-semibold text-emerald-600">{totalPresent} present</span>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {teamStatus.length ? teamStatus.map((person) => (
              <div key={person.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{person.name.split(' ').map((part) => part[0]).join('')}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{person.name}</p>
                  <p className="truncate text-xs text-slate-500">{person.role}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-700"><span className={`h-2 w-2 rounded-full ${person.color}`} />{person.status}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{person.time}</p>
                </div>
              </div>
            )) : (
              <p className="py-4 text-sm text-slate-500">No attendance records available yet.</p>
            )}
          </div>
        </article>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Quick actions</h3>
            <p className="mt-1 text-sm text-slate-500">Common tasks for your workday</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/attendance" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Mark attendance</Link>
            <Link to="/attendance" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">View reports</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const EmployeeDashboard = () => {
  const { user } = useAppData();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const token = Cookies.get('token');
        const [todayResponse, statsResponse] = await Promise.all([
          axios.get('/api/employee/attendance/today', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/employee/attendance/stats', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTodayAttendance(todayResponse.data?.data || null);
        setAttendancePercentage(statsResponse.data?.attendancePercentage || 0);
      } catch (error) {
        console.error('Failed to load personal attendance', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);

  const markAttendance = async (action) => {
    try {
      setSubmitting(true);
      const token = Cookies.get('token');
      const endpoint = action === 'check-in'
        ? '/api/employee/attendance/check-in'
        : '/api/employee/attendance/check-out';
      const request = action === 'check-in' ? axios.post : axios.patch;
      const { data } = await request(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodayAttendance(data?.data || todayAttendance);
      toast.success(data?.message || `${action} successful`);
    } catch (error) {
      setTodayAttendance(error.response?.data?.data || todayAttendance);
      toast.error(error.response?.data?.message || 'Attendance action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (value) => value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--';
  const formatDate = new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const employeeStatus = todayAttendance?.checkOut
    ? 'Completed'
    : todayAttendance?.checkIn
      ? 'Working'
      : 'Not marked';
  const departmentName = typeof user?.department === 'object' ? user.department.name : user?.department;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{formatDate}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Good morning, {user?.name || 'Employee'}.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Your personal workday overview, attendance status, and profile details.</p>
        </div>
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-28 border-emerald-400/20" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Check in', formatTime(todayAttendance?.checkIn), 'Today', 'bg-sky-50 text-sky-700'],
          ['Check out', formatTime(todayAttendance?.checkOut), 'Today', 'bg-amber-50 text-amber-700'],
          ['Attendance', `${attendancePercentage}%`, 'This month', 'bg-violet-50 text-violet-700'],
          ['Department', departmentName || 'Not assigned', 'Your team', 'bg-slate-100 text-slate-700'],
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
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${todayAttendance ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{employeeStatus}</span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Check in time</p><p className="mt-2 text-2xl font-bold text-slate-800">{formatTime(todayAttendance?.checkIn)}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Check out time</p><p className="mt-2 text-2xl font-bold text-slate-800">{formatTime(todayAttendance?.checkOut)}</p></div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading || submitting || Boolean(todayAttendance?.checkIn)}
              onClick={() => markAttendance('check-in')}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && !todayAttendance?.checkIn ? 'Checking in...' : 'Check in'}
            </button>
            <button
              type="button"
              disabled={loading || submitting || !todayAttendance?.checkIn || Boolean(todayAttendance?.checkOut)}
              onClick={() => markAttendance('check-out')}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && todayAttendance?.checkIn ? 'Checking out...' : 'Check out'}
            </button>
          </div>
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

const Dashboard = () => {
  const { user, loading } = useAppData();
  const role = user?.user?.role;

  if (loading) {
    return <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">Loading your dashboard...</div>;
  }

  if (role === 'employee') {
    return <EmployeeDashboard />;
  }

  if (role === 'hr' || role === 'admin') {
    return <HrDashboard />;
  }

  return <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">Dashboard is not available for this account.</div>;
};

export default Dashboard;