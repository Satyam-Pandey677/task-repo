import React from 'react';

const ProfileFieldCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
};

export default ProfileFieldCard;
