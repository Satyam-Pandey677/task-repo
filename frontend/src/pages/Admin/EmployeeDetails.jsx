import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useParams } from 'react-router-dom';
import LoadingContainer from '../../Components/LoadingContainer';

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
  : 'N/A';

const formatTime = (value) => value
  ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  : '--';

const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase() || 'EM';

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = Cookies.get('token');
        const { data } = await axios.get(`/api/employee/${employeeId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(data?.data?.employee || null);
        setAttendance(data?.data?.attendance || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [employeeId]);

  const presentDays = attendance.filter((record) => record.status === 'present' || record.checkIn).length;
  const attendancePercentage = attendance.length ? Math.round((presentDays / attendance.length) * 100) : 0;
  const departmentName = typeof employee?.department === 'object' ? employee.department?.name : employee?.department;
  const initials = getInitials(employee?.name);
  const recentAttendance = useMemo(() => attendance.slice(0, 10), [attendance]);

  if (loading) {
    return <LoadingContainer rows={6} title="Loading employee details..." />;
  }

  if (error || !employee) {
    return <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || 'Employee not found'}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link to="/employees" className="inline-flex text-sm font-semibold text-slate-500 hover:text-emerald-700">← Back to employees</Link>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-700">{initials}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Employee profile</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">{employee.name || 'Unnamed employee'}</h1>
              <p className="mt-1 text-sm text-slate-500">{employee.employeeID || 'No employee ID'} · {employee.designation || 'No designation'}</p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{employee.status || 'Active'}</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Department</p><p className="mt-2 font-bold text-slate-900">{departmentName || 'Unassigned'}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Email</p><p className="mt-2 truncate font-bold text-slate-900">{employee.user?.email || 'No email'}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Phone</p><p className="mt-2 font-bold text-slate-900">{employee.phone || 'No phone'}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Attendance</p><p className="mt-2 font-bold text-slate-900">{attendancePercentage}%</p></div>
      </section>

      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900">Employee details</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <div><p className="text-xs uppercase tracking-wide text-slate-400">Joined</p><p className="mt-1 font-semibold text-slate-800">{formatDate(employee.joiningDate)}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-400">Salary</p><p className="mt-1 font-semibold text-slate-800">{employee.salary ?? 'N/A'}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-400">Role</p><p className="mt-1 font-semibold text-slate-800">{employee.user?.role || 'employee'}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-400">Attendance records</p><p className="mt-1 font-semibold text-slate-800">{attendance.length}</p></div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900">Attendance history</h2>
          <p className="mt-1 text-sm text-slate-500">Recent attendance records for this employee.</p>
        </div>
        {recentAttendance.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Date</th><th className="px-5 py-3 font-semibold">Check in</th><th className="px-5 py-3 font-semibold">Check out</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttendance.map((record) => (
                  <tr key={record._id}>
                    <td className="px-5 py-4 text-sm text-slate-700">{formatDate(record.date)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatTime(record.checkIn)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatTime(record.checkOut)}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{record.status || 'Absent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeeDetails;
