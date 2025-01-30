import React from "react";
import SideBar from "./SideBar";
import Headers from "./Headers";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
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
  } 
  else {
    navigate("/");
  }
};

export default Layout;
