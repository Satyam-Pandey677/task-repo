import React from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/userApi';

const stats = [
  { label: 'Total employees', value: '128', detail: '+8 this month', tone: 'bg-emerald-50 text-emerald-700', icon: '👥' },
  { label: 'Present today', value: '112', detail: '87.5% attendance', tone: 'bg-sky-50 text-sky-700', icon: '✓' },
  { label: 'On leave', value: '09', detail: '4 pending approvals', tone: 'bg-amber-50 text-amber-700', icon: '◷' },
  { label: 'Late arrivals', value: '07', detail: '2 need attention', tone: 'bg-rose-50 text-rose-700', icon: '!' },
];

const weeklyAttendance = [
  { day: 'Mon', value: 82 },
  { day: 'Tue', value: 91 },
  { day: 'Wed', value: 86 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 88 },
  { day: 'Sat', value: 42 },
];

const teamStatus = [
  { name: 'Aarav Sharma', role: 'Product Designer', status: 'Present', time: '09:02 AM', color: 'bg-emerald-500' },
  { name: 'Nisha Verma', role: 'Frontend Developer', status: 'Present', time: '09:11 AM', color: 'bg-emerald-500' },
  { name: 'Rohan Mehta', role: 'Backend Developer', status: 'Late', time: '09:42 AM', color: 'bg-amber-500' },
  { name: 'Meera Kapoor', role: 'HR Executive', status: 'On leave', time: 'Today', color: 'bg-slate-400' },
];

const Dashboard = () => {
  const { user } = useAppData();

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
              <p className="mt-1 text-sm text-slate-500">Team attendance for the current week</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">87.5% average</span>
          </div>
          <div className="mt-8 flex h-56 items-end justify-between gap-2 sm:gap-5">
            {weeklyAttendance.map((item, index) => (
              <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                <span className="text-xs font-semibold text-slate-500">{item.value}%</span>
                <div className="flex h-40 w-full items-end rounded-t-xl bg-slate-100">
                  <div className={`w-full rounded-t-xl ${index === 3 ? 'bg-emerald-500' : 'bg-emerald-200'}`} style={{ height: `${item.value}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-400">{item.day}</span>
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
            <span className="text-sm font-semibold text-emerald-600">112 present</span>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {teamStatus.map((person) => (
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
            ))}
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