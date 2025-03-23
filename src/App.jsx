import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SalaryDashboard from "./pages/SalaryDashboard";
import EmployeeList from "./components/admin/EmployeeList";
import AdminPayroll from "./components/admin/AdminPayroll";
import Department from "./components/admin/Department";
import HolidayCalendar from "./components/HolidayCalendar";
import AdminLeavDashboard from "./components/admin/AdminLeavDashboard";

import EmployeeLeaveDashboard from "./components/user/EmployeeLeaveDashboard";
import EmployeeTask from "./components/user/EmployeeTask";
import UpdateProfile from "./components/UpdateProfile";
import AdminTask from "./components/admin/AdminTask";
import ProtectedRoute from "./utils/ProtectedRoute";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Common Protected Route with Layout */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Holiday Calendar Accessible by Both Admin and Employee */}
          <Route path="calendar" element={<PrivateRoute><HolidayCalendar /></PrivateRoute>} />

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route index element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="employee-list" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
            <Route path="payroll" element={<PrivateRoute><AdminPayroll /></PrivateRoute>} />
            <Route path="departments" element={<PrivateRoute><Department /></PrivateRoute>} />
            <Route path="leave-dashboard" element={<PrivateRoute><AdminLeavDashboard /></PrivateRoute>} />
            <Route path="task" element={<PrivateRoute><AdminTask /></PrivateRoute>} />
          </Route>

          {/* Protected Routes for Employee */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="employee-dashboard" element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>} />
            <Route path="salary-dashboard" element={<PrivateRoute><SalaryDashboard /></PrivateRoute>} />
            <Route path="employee-leave-dashboard" element={<PrivateRoute><EmployeeLeaveDashboard /></PrivateRoute>} />
            <Route path="employe-task" element={<PrivateRoute><EmployeeTask /></PrivateRoute>} />
            <Route path="update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
