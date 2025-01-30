import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
