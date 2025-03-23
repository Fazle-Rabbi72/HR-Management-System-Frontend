import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const role = localStorage.getItem("role"); // লোকাল স্টোরেজ থেকে role নেওয়া
  
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
