import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppData } from '../../context/userApi';
import Layout from '../Layout/Layout';

const AuthLayout = () => {
  const { user,isAuth, loading } = useAppData();
  console.log(user)

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default AuthLayout;
