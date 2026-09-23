import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import LoadingContainer from '../../Components/LoadingContainer';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  designation: '',
  joiningDate: '',
  salary: '',
  status: 'Active',
};

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = Cookies.get('token');
        const { data } = await axios.get('/api/department', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(data.departments || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load departments');
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }

    try {
      setSaving(true);
      const token = Cookies.get('token');
      const { data } = await axios.post('/api/user/create-user', {
        ...formData,
        role: 'employee',
        salary: Number(formData.salary),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message || 'Employee created successfully');
      navigate('/employees');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    } finally {
      setSaving(false);
    }
  };

  if (departmentsLoading) {
    return <LoadingContainer rows={6} title="Loading employee form..." />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-200 sm:px-8 sm:py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/employees" className="text-sm font-medium text-slate-300 transition hover:text-white">← Back to employees</Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">People operations</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Add new employee</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Create a secure employee account and add them to your organisation directory.</p>
        </div>
        <div className="hidden h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-4xl text-emerald-300 md:flex">+</div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <div className="border-b border-slate-100 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">01 / Account</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Personal and login details</h2>
            <p className="mt-1 text-sm text-slate-500">These details will be used to create the employee login.</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Full name<input className={inputClass} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required /></label>
            <label className="text-sm font-semibold text-slate-700">Email address<input className={inputClass} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" required /></label>
            <label className="text-sm font-semibold text-slate-700">Temporary password<input className={inputClass} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" minLength="6" required /></label>
            <label className="text-sm font-semibold text-slate-700">Phone number<input className={inputClass} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" /></label>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <div className="border-b border-slate-100 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">02 / Employment</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Work information</h2>
            <p className="mt-1 text-sm text-slate-500">Assign the employee to a department and define their role.</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Department<select className={inputClass} name="department" value={formData.department} onChange={handleChange} required><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select></label>
            <label className="text-sm font-semibold text-slate-700">Designation<input className={inputClass} type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Developer" required /></label>
            <label className="text-sm font-semibold text-slate-700">Joining date<input className={inputClass} type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required /></label>
            <label className="text-sm font-semibold text-slate-700">Annual salary<input className={inputClass} type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="500000" min="0" required /></label>
            <label className="text-sm font-semibold text-slate-700">Employment status<select className={inputClass} name="status" value={formData.status} onChange={handleChange}><option value="Active">Active</option><option value="Resigned">Resigned</option></select></label>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate('/employees')} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving || departments.length === 0} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Creating employee...' : 'Create employee'}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;