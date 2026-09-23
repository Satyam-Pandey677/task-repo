import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppData } from '../../context/userApi';
import Layout from '../Layout/Layout';
import LoadingContainer from '../../Components/LoadingContainer';

const AdminLayout = () => {
  const { user, loading } = useAppData();

  const role = user?.user?.role;

  if (loading) {
    return <LoadingContainer rows={5} title="Loading admin panel..." />;
  }

  if (role !== "hr" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
      <Outlet />
  );
};

export default AdminLayout;
