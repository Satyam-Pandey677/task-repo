import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAppData } from '../context/userApi';

const Dashboard = () => {
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
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-emerald-400/20" />
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

export default Dashboard;