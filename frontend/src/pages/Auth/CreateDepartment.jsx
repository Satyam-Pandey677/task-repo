import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

const CreateDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get('token')}`,
  });

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('/api/department', { headers: getHeaders() });
      setDepartments(data.departments || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to load departments');
      }
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const departmentName = name.trim();

    if (!departmentName) {
      toast.error('Department name is required');
      return;
    }

    try {
      setSaving(true);
      const { data } = await axios.post('/api/department', { name: departmentName }, {
        headers: getHeaders(),
      });

      toast.success(data.message || 'Department created successfully');
      await fetchDepartments();
      setName('');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (department) => {
    if (!window.confirm(`Delete ${department.name}?`)) {
      return;
    }

    try {
      setDeletingId(department._id);
      const { data } = await axios.delete(`/api/department/${department._id}`, {
        headers: getHeaders(),
      });
      toast.success(data.message || 'Department deleted successfully');
      setDepartments((current) => current.filter((item) => item._id !== department._id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Organisation</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Departments</h1>
        </div>
        <button type="button" onClick={() => setShowForm((current) => !current)} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
          {showForm ? 'Close' : '+ Create department'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-semibold text-slate-700">
            Department name
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Engineering" maxLength={32} autoFocus required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-800 outline-none focus:border-emerald-500 focus:bg-white" />
          </label>
          <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      )}

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-bold text-slate-900">All departments</h2>
          <p className="mt-1 text-sm text-slate-500">{departments.length} department{departments.length === 1 ? '' : 's'}</p>
        </div>
        {loading ? <p className="px-5 py-8 text-sm text-slate-500">Loading departments...</p> : departments.length === 0 ? <p className="px-5 py-8 text-sm text-slate-500">No departments created yet.</p> : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department, index) => (
              <div key={department._id || department.name} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
                <span className="text-sm font-semibold text-slate-400">{index + 1}.</span>
                <p className="min-w-0 flex-1 truncate font-medium text-slate-800">{department.name}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(department)}
                  disabled={deletingId === department._id}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === department._id ? 'Deleting...' : <Trash />}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreateDepartment;