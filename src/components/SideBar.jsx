import React, { useState } from "react";

import { LuBox, LuUsers, LuMessageSquare, LuCalendar, LuTrello } from "react-icons/lu";
import { FaMoneyBill, FaSuitcase } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [acitiveLink, setActiveLink] = useState(0);
  const [hoverdItem, setHoverdItem] = useState(null);
  const handaleclick = (index) => {
    setActiveLink(index);
  };
  const SIDEBAR_LINKS = [
    { id: 1, path: "/dashboard", name: "Dashboard", icon: <LuBox /> },
    { id: 2, path: "/dashboard/employee-list", name: "Employees", icon: <LuUsers /> },
    { id: 3, path: "/dashboard/leave-dashboard", name: "Leaves", icon: <LuMessageSquare /> },
    { id: 5, path: "/dashboard/task", name: "Tasks", icon: <LuTrello /> },
    { id: 5, path: "/dashboard/departments", name: "Departments", icon: <LuTrello /> },
    { id: 5, path: "/dashboard/payroll", name: "Payroll", icon: <FaMoneyBill /> },
    { id: 6, path: "/dashboard/calendar", name: "Calendar", icon: <LuCalendar /> },
  ];
  
  const SIDEBAR_EMPLOYEE_LINKS = [
    { id: 1, path: "/dashboard/employee-dashboard", name: "Dashboard", icon: <LuBox /> },
    { id: 4, path: "/dashboard/employee-leave-dashboard", name: "Leaves", icon: <LuMessageSquare /> },
    { id: 5, path: "/dashboard/employe-task", name: "Tasks", icon: <FaSuitcase /> },
    { id: 5, path: "/dashboard/salary-dashboard", name: "Salary", icon: <FaMoneyBill /> },
    { id: 6, path: "/dashboard/calendar", name: "Calendar", icon: <LuCalendar /> },
  ];

  return (
    <div className="w-16 md:w-56 fixed top-0  left-0 z-10 pt-8 px-4 h-screen border-r border-gray-200 bg-white">
      {/* Logo Section */}
      <div className="flex justify-center items-center py-2 md:py-3 border-b border-gray-200 ">
        <img
          src="https://cdn.vectorstock.com/i/500p/29/87/hrm-human-resource-management-icon-label-badge-vector-44362987.jpg"
          alt="logo"
          className="w-8 h-8 md:w-20 md:h-15 rounded-full object-cover shadow-md"
        />
        <h1 className="hidden md:block text-lg font-bold text-gray-700 ml-4">
          HRM System
        </h1>
      </div>

      {/* Links */}
      {localStorage.getItem("role") == "employee" && (
        <ul className="mt-6 space-y-6">
          {SIDEBAR_EMPLOYEE_LINKS.map((link, index) => (
            <li
              key={index}
              className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${
                acitiveLink === index ? "bg-indigo-100 text-indigo-500" : ""
              }`}
              onMouseEnter={() => setHoverdItem(index)}
              onMouseLeave={() => setHoverdItem(null)}
            >
              <Link
                to={link.path}
                className="flex items-center md:space-x-5"
                onClick={() => handaleclick(index)}
              >
                <span>{link.icon}</span>
                <span className="text-sm text-gray-500 hidden md:flex">
                  {link.name}
                </span>
              </Link>

              {/* tooltip for hover item */}
              {hoverdItem === index && (
              <span className="absolute left-16 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg md:hidden">
                {link.name}
              </span>
            )}
            </li>
          ))}
        </ul>
      )}
      {localStorage.getItem("role") == "admin" && (
        <ul className="mt-6 space-y-6">
          {SIDEBAR_LINKS.map((link, index) => (
            <li
              key={index}
              className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${
                acitiveLink === index ? "bg-indigo-100 text-indigo-500" : ""
              }`}
              onMouseEnter={() => setHoverdItem(index)}
              onMouseLeave={() => setHoverdItem(null)}
            >
              <Link
                to={link.path}
                className="flex items-center md:space-x-5"
                onClick={() => handaleclick(index)}
              >
                <span>{link.icon}</span>
                <span className="text-sm text-gray-500 hidden md:flex">
                  {link.name}
                </span>
              </Link>

              {/* tooltip for hover item */}
              {hoverdItem === index && (
              <span className="absolute left-16 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg md:hidden">
                {link.name}
              </span>
            )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SideBar;
