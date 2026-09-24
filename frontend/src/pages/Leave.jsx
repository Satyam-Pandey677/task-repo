import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../context/userApi';

const statusClasses = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

const Leave = () => {
  const { user } = useAppData();
  const isEmployee = user?.user?.role === 'employee';
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = () => ({ Authorization: `Bearer ${Cookies.get('token')}` });

  const fetchLeaveRequests = async () => {
    try {
      const { data } = await axios.get('/api/employee/leave', { headers: headers() });
      setLeaveRequests(data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const submitLeave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await axios.post('/api/employee/leave', form, { headers: headers() });
      setLeaveRequests((current) => [data.data, ...current]);
      setForm({ startDate: '', endDate: '', reason: '' });
      toast.success(data.message || 'Leave request submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (leaveId, status) => {
    try {
      const { data } = await axios.patch(`/api/employee/leave/${leaveId}/status`, { status }, { headers: headers() });
      setLeaveRequests((current) => current.map((leave) => leave._id === leaveId ? data.data : leave));
      toast.success(data.message || `Leave ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update leave request');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">People operations</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{isEmployee ? 'My leave' : 'Leave requests'}</h1>
        <p className="mt-1 text-sm text-slate-500">{isEmployee ? 'Apply for leave and track your request status.' : 'Review and manage employee leave applications.'}</p>
      </div>

      {isEmployee && <form onSubmit={submitLeave} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Apply for leave</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Start date<input type="date" required value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          <label className="text-sm font-semibold text-slate-700">End date<input type="date" required value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500" /></label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">Reason<textarea required rows="3" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Explain the reason for your leave" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500" /></label>
        </div>
        <button type="submit" disabled={saving} className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? 'Submitting...' : 'Submit request'}</button>
      </form>}

      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">{isEmployee ? 'My requests' : 'All requests'}</h2></div>
        {loading ? <p className="px-5 py-8 text-sm text-slate-500">Loading leave requests...</p> : leaveRequests.length === 0 ? <p className="px-5 py-8 text-sm text-slate-500">No leave requests yet.</p> : <div className="divide-y divide-slate-100">{leaveRequests.map((leave) => <div key={leave._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-800">{isEmployee ? 'Leave request' : leave.employeeId?.name || 'Employee'}</p><p className="mt-1 text-sm text-slate-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p><p className="mt-1 text-sm text-slate-600">{leave.reason}</p></div>{leave.status === 'pending' && !isEmployee ? <div className="flex gap-2"><button type="button" onClick={() => updateStatus(leave._id, 'approved')} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">Accept</button><button type="button" onClick={() => updateStatus(leave._id, 'rejected')} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">Reject</button></div> : <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[leave.status]}`}>{leave.status}</span>}</div>)}</div>}
      </section>
    </div>
  );
};

export default Leave;
