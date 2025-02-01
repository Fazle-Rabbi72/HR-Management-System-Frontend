import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SalaryDashboard from "./pages/SalaryDashboard";
import EmployeeList from "./components/EmployeeList";
import AdminPayroll from "./components/AdminPayroll";
import Department from "./components/Department";
import HolidayCalendar from "./components/HolidayCalendar";
import AdminLeavDashboard from "./components/AdminLeavDashboard";
import AdminTask from "./components/AdminTask";
import EmployeeLeaveDashboard from "./components/EmployeeLeaveDashboard";
import EmployeeTask from "./components/EmployeeTask";
import UpdateProfile from "./components/UpdateProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Default Route for Layout */}
          <Route index element={<AdminDashboard />} />
          <Route path="employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="salary-dashboard" element={<SalaryDashboard />} />
          <Route path="employee-list" element={<EmployeeList/>}/>
          <Route path="payroll" element={<AdminPayroll/>}/>
          <Route path="departments" element={<Department/>}/>
          <Route path="calendar" element={<HolidayCalendar/>}/>
          <Route path="leave-dashboard" element={<AdminLeavDashboard/>}/>
          <Route path="task" element={<AdminTask/>}/>
          <Route path="employee-leave-dashboard" element={<EmployeeLeaveDashboard/>}/>
          <Route path="employe-task" element={<EmployeeTask/>}/>
          <Route path="update-profile" element={<UpdateProfile/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
