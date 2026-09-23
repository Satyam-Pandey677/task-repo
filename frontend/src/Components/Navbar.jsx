import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/userApi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAppData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in', { replace: true });
  };

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-md">
            H
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              HRMS
            </p>
            <h1 className="text-lg font-bold text-slate-800">PeopleFlow</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Logout
        </button>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 pr-3">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
            alt="User profile"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
          />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-[11px] text-slate-500">{user?.designation}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;