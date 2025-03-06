import React, { useEffect, useState } from "react";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import {
  Users,
  Briefcase,
  Building,
  CalendarCheck,
  Clock,
  UserCheck,
} from "lucide-react";
import AttendanceDashboard from "../components/AttendanceDashboard";
import EmployeeList from "../components/EmployeeList";
import AdminLeavDashboard from "../components/AdminLeavDashboard";

const AdminDashboard = () => {
  const [tab, setTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [department_name, setDepartmentName] = useState("");
  const [addProject, setAddProject] = useState({
    name: "",
    client: "",
    department: "",
    description: "",
    price: "",
    start_date: "",
    end_date: "",
    status: "Ongoing",
  });

  const [departments, setDepartments] = useState([]);
  const [clients, setClients] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [clientCount, setClientsCount] = useState(0);
  const [leave, setLeave] = useState(0);
  const [leavePending, setLeavePending] = useState(0);

  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://hr-management-system-liard.vercel.app/employees/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`, // যদি API টোকেন দরকার হয়
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // ডিপার্টমেন্ট অনুযায়ী এমপ্লয়িদের সংখ্যা গণনা
        const departmentCounts = {};
        data.forEach((employee) => {
          const dept = employee.department || "Unknown";
          departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });

        // অবজেক্টকে অ্যারের মধ্যে কনভার্ট করা
        const departmentArray = Object.entries(departmentCounts).map(
          ([name, count]) => ({
            name,
            count,
            percentage: Math.min((count / data.length) * 100, 100),
          })
        );

        setDepartment(departmentArray);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [
          employeesRes,
          departmentsRes,
          clientsRes,
          projectRes,
          leaveRes,
          leavePendingRes,
        ] = await Promise.all([
          fetch("https://hr-management-system-liard.vercel.app/employees/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          }),

          fetch("https://hr-management-system-liard.vercel.app/departments/"),
          fetch(
            "https://hr-management-system-liard.vercel.app/project/clients/"
          ),
          fetch(
            "https://hr-management-system-liard.vercel.app/project/projects/"
          ),
          fetch(
            "https://hr-management-system-liard.vercel.app/leave_request/leaves/?approved_today=true",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          ),
          fetch(
            "https://hr-management-system-liard.vercel.app/leave_request/leaves/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          ),
        ]);

        const [
          employees,
          departments,
          clients,
          projects,
          leaves,
          leavesPending,
        ] = await Promise.all([
          employeesRes.json(),
          departmentsRes.json(),
          clientsRes.json(),
          projectRes.json(),
          leaveRes.json(),
          leavePendingRes.json(),
        ]);

        setEmployeeCount(employees.length);
        setDepartments(departments);
        setClients(clients);
        setClientsCount(clients.length);
        setProjectCount(projects.length);
        setLeave(leaves.length);

        const pendingsLeaves = leavesPending.filter(
          (leave) => leave.status === "Pending"
        ).length;
        setLeavePending(pendingsLeaves);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setAddProject((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setAddProject((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleAddDepartment = async () => {
    if (!department_name) {
      alert("Please enter department name");
      return;
    }

    try {
      const response = await fetch(
        "https://hr-management-system-liard.vercel.app/departments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: department_name }),
        }
      );

      if (response.ok) {
        alert("Department added successfully!");
        setIsModalOpen(false);
        setDepartmentName("");
      } else {
        alert("Failed to add department!");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      alert("An error occurred. Please try again!");
    }
  };

  const handleAddProject = async () => {
    if (!addProject.name) {
      alert("Please enter project name");
      return;
    }

    try {
      const response = await fetch(
        "https://hr-management-system-liard.vercel.app/project/projects/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addProject),
        }
      );

      if (response.ok) {
        alert("Project added successfully!");
        setIsModalOpen1(false);
        setAddProject({
          name: "",
          client: "",
          department: "",
          description: "",
          price: "",
          start_date: "",
          end_date: "",
          status: "Ongoing",
        });
      } else {
        alert("Failed to add project!");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("An error occurred. Please try again!");
    }
  };

  const stats = [
    {
      title: "Total Employee",
      value: `${employeeCount}/100`,
      color: "text-green-600",
      icon: <Users size={28} className="text-indigo-500 drop-shadow-lg" />, // Employee Icon
    },
    {
      title: "Total Projects",
      value: `${projectCount}/100`,
      color: "text-red-600",
      icon: <Building size={28} className="text-indigo-500 drop-shadow-lg" />, // Projects Icon
    },
    {
      title: "Total Clients",
      value: `${clientCount}`,
      color: "text-blue-600",
      icon: <UserCheck size={28} className="text-indigo-500 drop-shadow-lg" />, // Clients Icon
    },
    {
      title: "Leave",
      value: `${leave}`,
      color: "text-green-600",
      icon: (
        <CalendarCheck size={28} className="text-indigo-500 drop-shadow-lg" />
      ), // Leave Icon
    },
    {
      title: "Leave Pending",
      value: `${leavePending}`,
      color: "text-yellow-600",
      icon: <Clock size={28} className="text-indigo-500 drop-shadow-lg" />, // Leave Pending Icon
    },
    {
      title: "Job Applicants",
      value: "98",
      color: "text-purple-600",
      icon: <Briefcase size={28} className="text-indigo-500 drop-shadow-lg" />, // Job Applicants Icon
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

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {/* Admin Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between shadow-md p-4 md:p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen1(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 hover:cursor-pointer"
          >
            <FaPlus /> Add Project
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:cursor-pointer"
          >
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
            className="bg-white bg-opacity-80 p-6 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-2xl flex items-center gap-4 hover:cursor-pointer"
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
      {tab === "" && (
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

            {loading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : (
              <div className="space-y-4">
                {department.map((dept, index) => (
                  <div key={index}>
                    <p className="text-gray-600 font-medium mb-1">
                      {dept.name}
                    </p>
                    <div className="w-full bg-gray-200 rounded-lg h-4 overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-600 mt-4">
              <span className="text-orange-500">●</span> No of Employees
              increased by{" "}
              <span className="text-green-600 font-semibold">+20%</span> from
              last Week
            </p>
          </div>
        </div>
      )}

      {tab === "Total Employee" && <EmployeeList />}
      {tab === "Leave Pending" && <AdminLeavDashboard />}

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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

      {/* Add Project Modal */}
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Project</h2>

            {/* Project Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProject();
              }}
              className="space-y-4"
            >
              {/* Double Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    name="name"
                    value={addProject.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client
                  </label>
                  <select
                    id="client"
                    name="client"
                    value={addProject.client}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={addProject.department}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter project price"
                    value={addProject.price}
                    onChange={(e) =>
                      setAddProject({ ...addProject, price: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={addProject.start_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={addProject.end_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={addProject.status}
                    id="status"
                    name="status"
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Description (Full Width) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  name="description"
                  id="description"
                  value={addProject.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  required
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen1(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
