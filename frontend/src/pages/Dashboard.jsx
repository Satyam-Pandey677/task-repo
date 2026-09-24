import React from 'react';
import { useAppData } from '../context/userApi';
import EmployeeDashboard from './user/EmployeeDashboard';
import HrDashboard from './user/HrDashboard';

const Dashboard = () => {
  const { user, loading } = useAppData();
  const role = user?.user?.role;

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
        Loading your dashboard...
      </div>
    );
  }

  if (role === 'employee') return <EmployeeDashboard />;
  if (role === 'hr' || role === 'admin') return <HrDashboard />;

  return (
    <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
      Dashboard is not available for this account.
    </div>
  );
};

export default Dashboard;