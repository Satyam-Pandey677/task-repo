import React from 'react';

const ProfileForm = ({ formData, onChange, onSubmit, onCancel, saving, canEditEmployment = true }) => {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Edit profile</h3>
          <p className="mt-1 text-sm text-slate-500">Update your personal and work details.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Full Name</span>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Phone</span>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Department {!canEditEmployment && <span className="text-xs font-normal text-slate-400">(HR/admin only)</span>}</span>
          <input
            type="text"
            name="department"
            value={formData.department || ''}
            onChange={onChange}
            disabled={!canEditEmployment}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-2 block">Designation {!canEditEmployment && <span className="text-xs font-normal text-slate-400">(HR/admin only)</span>}</span>
          <input
            type="text"
            name="designation"
            value={formData.designation || ''}
            onChange={onChange}
            disabled={!canEditEmployment}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
