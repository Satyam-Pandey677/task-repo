import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../../context/userApi';
import ProfileFieldCard from '../../Components/ProfileFieldCard';
import ProfileForm from '../../Components/ProfileForm';
import LoadingContainer from '../../Components/LoadingContainer';

const Profile = () => {
  const { user, loading, fetchUser } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    designation: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        department: typeof user.department === 'object' ? user.department?.name || '' : user.department || '',
        designation: user.designation || '',
      });
    }
  }, [user]);

  if (loading) {
    return <LoadingContainer rows={6} title="Loading profile..." />;
  }

  const employee = user || {};
  const departmentName = typeof employee.department === 'object'
    ? employee.department?.name || 'N/A'
    : employee.department || 'N/A';
  const initials = employee.name
    ? employee.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'EM';

  const profileFields = [
    { label: 'Employee ID', value: employee.employeeID || 'N/A' },
    { label: 'Full Name', value: employee.name || 'N/A' },
    { label: 'Email', value: employee.user?.email || 'N/A' },
    { label: 'Department', value: departmentName },
    { label: 'Designation', value: employee.designation || 'N/A' },
    { label: 'Phone', value: employee.phone || 'N/A' },
    { label: 'Joining Date', value: employee.joiningDate || 'N/A' },
    { label: 'Status', value: employee.status || 'Active' },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const token = Cookies.get('token');

      const { data } = await axios.put('/api/employee/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || 'Profile updated successfully');
      setIsEditing(false);
      await fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <div className="rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white shadow-inner">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-100">My profile</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{employee.name || 'Employee'}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Edit profile
          </button>
        </div>
      </div>

      {isEditing ? (
        <ProfileForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          saving={saving}
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            {profileFields.map((field) => (
              <ProfileFieldCard key={field.label} label={field.label} value={field.value} />
            ))}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Employment overview</h3>
                <p className="mt-1 text-sm text-slate-500">Current role and work status</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {employee.status || 'Active'}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Department</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{departmentName}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Designation</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{employee.designation || 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Joined</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{employee.joiningDate || 'N/A'}</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;