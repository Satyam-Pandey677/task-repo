import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthLayout from './pages/Auth/AuthLayout';
import LoginPage from './pages/LoginPage';
import Profile from './pages/user/Profile';
import Attendance from './pages/Attendance';
import AdminLayout from './pages/Auth/AdminLayout';
import AllEmployee from './pages/Admin/AllEmployee';
import CreateEmployee from './pages/Admin/createEmployee';


function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<LoginPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route element={<AdminLayout/>}>
          <Route path='/employees' element={<AllEmployee/>}/>
          <Route path='/employees/create' element={<CreateEmployee/>}/>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
