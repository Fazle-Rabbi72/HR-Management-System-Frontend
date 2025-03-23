import React, { useEffect } from "react";
import SideBar from "./SideBar";
import Headers from "./Headers";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <div className="flex">
        <SideBar />
        <div className="w-full ml-16 md:ml-56">
          <Headers />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
