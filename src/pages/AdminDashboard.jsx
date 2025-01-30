import React, { useState } from "react";
import {
  FaUsers,
  FaChartLine,
  FaProjectDiagram,
  FaDollarSign,
  FaSuitcase,
  FaUserTie,
  FaPlus,
  FaCalendarAlt,
} from "react-icons/fa";
import AttendanceDashboard from "../components/AttendanceDashboard";
import EmployeeList from "../components/EmployeeList";
const AdminDashboard = () => {
  const [tab, setTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [department_name, setDepartmentName] = useState("");


  const handleAddDepartment = async () => {
    if (!department_name) {
      alert("Please enter department name");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/departments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: department_name }),
      });

      if (response.ok) {
        alert("Department added successfully!");
        setIsModalOpen(false);
        setDepartmentName(""); // ইনপুট ফিল্ড খালি করা
      } else {
        alert("Failed to add department!");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      alert("An error occurred. Please try again!");
    }
  };







  const stats = [
    {
      title: "Total Employee",
      value: "92/99",
      change: "+2.1%",
      color: "text-green-600",
      icon: <FaUsers size={24} className="text-indigo-500" />,
    },
    {
      title: "Total Projects",
      value: "90/94",
      change: "-2.1%",
      color: "text-red-600",
      icon: <FaProjectDiagram size={24} className="text-indigo-500" />,
    },
    {
      title: "Total Clients",
      value: "69/86",
      change: "-11.2%",
      color: "text-red-600",
      icon: <FaUserTie size={24} className="text-indigo-500" />,
    },
    {
      title: "Leave",
      value: "$2144",
      change: "+10.2%",
      color: "text-green-600",
      icon: <FaDollarSign size={24} className="text-indigo-500" />,
    },
    {
      title: "Leave Pending",
      value: "$5,544",
      change: "+2.1%",
      color: "text-green-600",
      icon: <FaChartLine size={24} className="text-indigo-500" />,
    },
    {
      title: "Job Applicants",
      value: "98",
      change: "+2.1%",
      color: "text-green-600",
      icon: <FaSuitcase size={24} className="text-indigo-500" />,
    },
  ];

  const jobApplicants = [
    {
      name: "Brian Villalobos",
      experience: "5+ Years",
      location: "USA",
      role: "UI/UX Designer",
      color: "bg-teal-500",
    },
    {
      name: "Anthony Lewis",
      experience: "4+ Years",
      location: "USA",
      role: "Python Developer",
      color: "bg-blue-500",
    },
    {
      name: "Stephan Peralt",
      experience: "6+ Years",
      location: "USA",
      role: "Android Developer",
      color: "bg-pink-500",
    },
    {
      name: "Doglas Martini",
      experience: "2+ Years",
      location: "USA",
      role: "React Developer",
      color: "bg-purple-500",
    },
  ];

  console.log(tab);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Admin Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between shadow-md p-4 md:p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700  hover:cursor-pointer">
            <FaPlus /> Add Project
          </button>
          <button onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700  hover:cursor-pointer">
            <FaPlus /> Add Department
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => setTab(stat.title)}
            className="bg-white bg-opacity-80 p-6 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-2xl flex items-center gap-4  hover:cursor-pointer"
          >
            <div className="p-3 bg-indigo-100 rounded-full">{stat.icon}</div>
            <div>
              <h2 className="text-gray-600 font-semibold">{stat.title}</h2>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {stat.value}
              </p>
              <p className={`text-sm ${stat.color} font-medium`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* extra page */}
      {tab == "" && (
        <div>
          <div className="mt-10 bg-white p-6 shadow-lg rounded-xl">
            <AttendanceDashboard />
          </div>

          {/* Job Applicants Section */}
          <div className="mt-10 bg-white p-6 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Job Applicants
              </h2>
            </div>
            <div className="space-y-4">
              {jobApplicants.map((applicant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {applicant.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Exp: {applicant.experience} • {applicant.location}
                    </p>
                  </div>
                  <span
                    className={`text-white px-3 py-1 rounded-full ${applicant.color}`}
                  >
                    {applicant.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Employees By Department */}
          <div className="mt-10 bg-white p-6 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Employees By Department
              </h2>
              <button className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">
                <FaCalendarAlt /> This Week
              </button>
            </div>
            <div className="space-y-4">
              {[
                "UI/UX",
                "Development",
                "Management",
                "HR",
                "Testing",
                "Marketing",
              ].map((dept, index) => (
                <div key={index}>
                  <p className="text-gray-600 font-medium mb-1">{dept}</p>
                  <div className="w-full bg-gray-200 rounded-lg h-4 overflow-hidden">
                    <div
                      className={`h-full bg-orange-500`}
                      style={{ width: `${Math.random() * 100 + 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <span className="text-orange-500">●</span> No of Employees
              increased by{" "}
              <span className="text-green-600 font-semibold">+20%</span> from
              last Week
            </p>
          </div>
        </div>
      )}

      {tab == "Total Employee" && <EmployeeList />}

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Department</h2>
            <input
              type="text"
              placeholder="Enter department name"
              value={department_name}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
