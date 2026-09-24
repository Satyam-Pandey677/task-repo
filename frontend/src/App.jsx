import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthLayout from './pages/Auth/AuthLayout';
import LoginPage from './pages/LoginPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import Profile from './pages/user/Profile';
import Attendance from './pages/Attendance';
import AdminLayout from './pages/Auth/AdminLayout';
import AllEmployee from './pages/Admin/AllEmployee';
import CreateEmployee from './pages/Admin/CreateEmployee';
import CreateDepartment from './pages/Auth/CreateDepartment';
import EmployeeDetails from './pages/Admin/EmployeeDetails';
import AttendanceCalendar from './pages/AttendanceCalendar';
import Leave from './pages/Leave';


function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance-calendar" element={<AttendanceCalendar />} />
        <Route path="/leave" element={<Leave />} />
        <Route element={<AdminLayout/>}>
          <Route path='/employees' element={<AllEmployee/>}/>
          <Route path='/employees/create' element={<CreateEmployee/>}/>
          <Route path='/employees/:employeeId' element={<EmployeeDetails/>}/>
          <Route path="/create-department" element={<CreateDepartment/>}/>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
