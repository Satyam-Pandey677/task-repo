import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppData } from '../context/userApi';
import EmployeeDashboard from './user/EmployeeDashboard';
import HrDashboard from './user/HrDashboard';

const getHeaders = () => ({ Authorization: `Bearer ${Cookies.get('token')}` });
const formatTime = (val) => (val ? new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--');
const formattedDate = new Intl.DateTimeFormat([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

const HeroBanner = ({ title, subtitle }) => (
  <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-200 sm:p-8">
    <div className="relative z-10 max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{formattedDate}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{subtitle}</p>
    </div>
    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-28 border-emerald-400/20" />
    <div className="absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-emerald-400/10" />
  </section>
);



const Dashboard = () => {
  const { user, loading } = useAppData();
  const role = user?.user?.role;

  if (loading) {
    return <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">Loading your dashboard...</div>;
  }

  if (role === 'employee') return <EmployeeDashboard />;
  if (role === 'hr' || role === 'admin') return <HrDashboard />;

  return <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">Dashboard is not available for this account.</div>;
};

export default Dashboard;