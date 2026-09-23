import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../context/userApi';

const attendanceRecords = [
  { name: 'Aarav Sharma', department: 'Design', date: '23 Sep 2026', checkIn: '09:02 AM', checkOut: '06:10 PM', hours: '9h 08m', status: 'Present' },
  { name: 'Nisha Verma', department: 'Engineering', date: '23 Sep 2026', checkIn: '09:11 AM', checkOut: '06:02 PM', hours: '8h 51m', status: 'Present' },
  { name: 'Rohan Mehta', department: 'Engineering', date: '23 Sep 2026', checkIn: '09:42 AM', checkOut: '06:00 PM', hours: '8h 18m', status: 'Late' },
  { name: 'Meera Kapoor', department: 'Human Resources', date: '23 Sep 2026', checkIn: '--', checkOut: '--', hours: '--', status: 'On leave' },
  { name: 'Kabir Singh', department: 'Finance', date: '23 Sep 2026', checkIn: '08:54 AM', checkOut: '05:45 PM', hours: '8h 51m', status: 'Present' },
];

const statusStyles = {
  Present: 'bg-emerald-50 text-emerald-700',
  Late: 'bg-amber-50 text-amber-700',
  'On leave': 'bg-slate-100 text-slate-600',
};

const Attendance = () => {
  const { user } = useAppData();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadTodayAttendance = async () => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.get('/api/employee/attendance/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayAttendance(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayAttendance();
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
      setTodayAttendance(data.data);
      toast.success(data.message);
    } catch (error) {
      setTodayAttendance(error.response?.data?.data || todayAttendance);
      toast.error(error.response?.data?.message || 'Attendance action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (value) => (value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--');

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">People operations</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Attendance</h2>
          <p className="mt-2 text-sm text-slate-500">Track check-ins, working hours, and leave status.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Live attendance</span>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-500">Present</p><p className="mt-2 text-3xl font-bold text-slate-900">112</p><p className="mt-1 text-xs font-medium text-emerald-600">87.5% of team</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-500">Late arrivals</p><p className="mt-2 text-3xl font-bold text-slate-900">07</p><p className="mt-1 text-xs font-medium text-amber-600">5.4% of team</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-500">On leave</p><p className="mt-2 text-3xl font-bold text-slate-900">09</p><p className="mt-1 text-xs font-medium text-slate-500">4 pending approvals</p></div>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl bg-emerald-700 p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-emerald-100">Your attendance today</p>
          <h3 className="mt-1 text-xl font-bold">{user?.name || 'Employee'}</h3>
          <p className="mt-2 text-sm text-emerald-100">
            {loading ? 'Checking today’s status...' : todayAttendance?.checkIn
              ? `Checked in at ${formatTime(todayAttendance.checkIn)}${todayAttendance.checkOut ? ` · Checked out at ${formatTime(todayAttendance.checkOut)}` : ''}`
              : 'You have not marked attendance yet.'}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            disabled={loading || submitting || Boolean(todayAttendance?.checkIn)}
            onClick={() => markAttendance('check-in')}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && !todayAttendance?.checkIn ? 'Marking...' : 'Check in'}
          </button>
          <button
            type="button"
            disabled={loading || submitting || !todayAttendance?.checkIn || Boolean(todayAttendance?.checkOut)}
            onClick={() => markAttendance('check-out')}
            className="rounded-xl border border-emerald-300 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && todayAttendance?.checkIn ? 'Saving...' : 'Check out'}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div><h3 className="text-lg font-bold text-slate-900">Daily attendance log</h3><p className="mt-1 text-sm text-slate-500">Wednesday, 23 September 2026</p></div>
          <div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">Today ▾</button><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">All departments ▾</button></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3 font-semibold">Employee</th><th className="px-6 py-3 font-semibold">Date</th><th className="px-6 py-3 font-semibold">Check in</th><th className="px-6 py-3 font-semibold">Check out</th><th className="px-6 py-3 font-semibold">Hours</th><th className="px-6 py-3 font-semibold">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((record) => (
                <tr key={record.name} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">{record.name.split(' ').map((part) => part[0]).join('')}</span><div><p className="text-sm font-semibold text-slate-800">{record.name}</p><p className="text-xs text-slate-500">{record.department}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td><td className="px-6 py-4 text-sm text-slate-600">{record.checkIn}</td><td className="px-6 py-4 text-sm text-slate-600">{record.checkOut}</td><td className="px-6 py-4 text-sm font-medium text-slate-700">{record.hours}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Attendance;
