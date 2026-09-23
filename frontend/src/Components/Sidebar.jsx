import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppData } from '../context/userApi';

const sharedMenuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Profile', path: '/profile' },
  { label: 'Attendance', path: '/attendance' },
  { label: 'Departments', path: '/create-department' },
];

const Sidebar = ({ onClose }) => {
  const { user } = useAppData();
  const role = user?.user?.role;
  const menuItems = role === 'admin' || role === 'hr'
    ? [...sharedMenuItems, { label: 'All Employees', path: '/employees' }]
    : sharedMenuItems;

  return (
    <aside className="h-screen w-72 border-r border-slate-200 bg-slate-50 px-4 py-6 shadow-xl md:w-64 md:shadow-none">
      <div className="mb-6 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
            H
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">HRMS</p>
            <h2 className="text-base font-bold text-slate-800">PeopleFlow</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-lg text-slate-600 md:hidden"
        >
          ✕
        </button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`
            }
          >
            <span>{item.label}</span>
            <span className="h-2 w-2 rounded-full bg-current opacity-80" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;