import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../context/userApi';

const statusStyles = {
  Present: 'bg-emerald-50 text-emerald-700',
  Late: 'bg-amber-50 text-amber-700',
  'On leave': 'bg-slate-100 text-slate-600',
};

const Attendance = () => {
  const { user } = useAppData();
  const isEmployee = user?.user?.role === 'employee';
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
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
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.get('/api/employee/attendance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendanceRecords(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayAttendance();
    loadAttendanceRecords();
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
      await loadAttendanceRecords();
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

  const totalPresent = attendanceRecords.filter((record) => record.status === 'Present').length;
  const totalLate = attendanceRecords.filter((record) => record.status === 'Late').length;
  const totalOnLeave = attendanceRecords.filter((record) => record.status === 'On leave').length;

  const currentDateString = new Intl.DateTimeFormat([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-2 sm:px-4 lg:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">People operations</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{isEmployee ? 'My attendance' : 'Attendance'}</h2>
          <p className="mt-2 text-sm text-slate-500">{isEmployee ? 'Review your check-ins, working hours, and attendance history.' : 'Track check-ins, working hours, and leave status.'}</p>
        </div>
        <span className="self-start rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 sm:self-auto">Live attendance</span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"><p className="text-sm text-slate-500">Present</p><p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{totalPresent}</p><p className="mt-1 text-xs font-medium text-emerald-600">Today’s live count</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"><p className="text-sm text-slate-500">Late arrivals</p><p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{totalLate}</p><p className="mt-1 text-xs font-medium text-amber-600">Arrived after 9:30 AM</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5 sm:col-span-2 xl:col-span-1"><p className="text-sm text-slate-500">On leave</p><p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{totalOnLeave}</p><p className="mt-1 text-xs font-medium text-slate-500">Marked unavailable</p></div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-emerald-700 p-4 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-emerald-100">Your attendance today</p>
          <h3 className="mt-1 text-lg font-bold sm:text-xl">{user?.name || 'Employee'}</h3>
          <p className="mt-2 text-sm text-emerald-100">
            {loading ? 'Checking today’s status...' : todayAttendance?.checkIn
              ? `Checked in at ${formatTime(todayAttendance.checkIn)}${todayAttendance.checkOut ? ` · Checked out at ${formatTime(todayAttendance.checkOut)}` : ''}`
              : 'You have not marked attendance yet.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            disabled={loading || submitting || Boolean(todayAttendance?.checkIn)}
            onClick={() => markAttendance('check-in')}
            className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting && !todayAttendance?.checkIn ? 'Marking...' : 'Check in'}
          </button>
          <button
            type="button"
            disabled={loading || submitting || !todayAttendance?.checkIn || Boolean(todayAttendance?.checkOut)}
            onClick={() => markAttendance('check-out')}
            className="w-full rounded-xl border border-emerald-300 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting && todayAttendance?.checkIn ? 'Saving...' : 'Check out'}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daily attendance log</h3>
            <p className="mt-1 text-sm text-slate-500">{currentDateString}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">Today ▾</button>
            {!isEmployee && <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">All departments ▾</button>}
          </div>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {attendanceRecords.map((record) => (
            <div key={record.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                    {record.name.split(' ').map((part) => part[0]).join('')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{record.name}</p>
                    <p className="text-xs text-slate-500">{record.department}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[record.status]}`}>
                  {record.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Date</p>
                  <p className="mt-1 text-slate-600">{record.date}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Hours</p>
                  <p className="mt-1 font-medium text-slate-700">{record.hours}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Check in</p>
                  <p className="mt-1 text-slate-600">{record.checkIn}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Check out</p>
                  <p className="mt-1 text-slate-600">{record.checkOut}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-180 text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3 font-semibold sm:px-6">Employee</th><th className="px-4 py-3 font-semibold sm:px-6">Date</th><th className="px-4 py-3 font-semibold sm:px-6">Check in</th><th className="px-4 py-3 font-semibold sm:px-6">Check out</th><th className="px-4 py-3 font-semibold sm:px-6">Hours</th><th className="px-4 py-3 font-semibold sm:px-6">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((record) => (
                <tr key={record.name} className="transition hover:bg-slate-50">
                  <td className="px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">{record.name.split(' ').map((part) => part[0]).join('')}</span><div><p className="text-sm font-semibold text-slate-800">{record.name}</p><p className="text-xs text-slate-500">{record.department}</p></div></div></td>
                  <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">{record.date}</td><td className="px-4 py-4 text-sm text-slate-600 sm:px-6">{record.checkIn}</td><td className="px-4 py-4 text-sm text-slate-600 sm:px-6">{record.checkOut}</td><td className="px-4 py-4 text-sm font-medium text-slate-700 sm:px-6">{record.hours}</td><td className="px-4 py-4 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>{record.status}</span></td>
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
