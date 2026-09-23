import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthLayout from './pages/Auth/AuthLayout';
import LoginPage from './pages/LoginPage';
import Profile from './pages/user/Profile';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<LoginPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
      </Route>
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
