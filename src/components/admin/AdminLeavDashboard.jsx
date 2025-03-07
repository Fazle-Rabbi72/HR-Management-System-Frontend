import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const AdminLeavDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://hr-management-system-liard.vercel.app/leave_request/leaves/",
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setLeaves(response.data);
        setFilteredLeaves(response.data);
      })
      .catch((error) => console.error("Error fetching leave data:", error));
  }, []);

  const handleFilter = (status) => {
    if (status === "All") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(leaves.filter((leave) => leave.status === status));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .patch(
        `https://hr-management-system-liard.vercel.app/leave_request/leaves/${id}/`,
        { status: newStatus },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave.id === id ? { ...leave, status: newStatus } : leave
          )
        );
        setFilteredLeaves((prevFiltered) =>
          prevFiltered.map((leave) =>
            leave.id === id ? { ...leave, status: newStatus } : leave
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  const leaveStats = {
    pending: leaves.filter((leave) => leave.status === "Pending").length,
    approved: leaves.filter((leave) => leave.status === "Approved").length,
    rejected: leaves.filter((leave) => leave.status === "Rejected").length,
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center p-6 text-gray-800">Leave Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Left Grid: Pie Chart (1 Column in Large Screens) */}
        <div className="md:col-span-1 p-4  rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-center">
            Leave Status Summary
          </h2>
          <div className="w-48 md:w-60 items-center mt-10">
            <Pie
              data={{
                labels: ["Pending", "Approved", "Rejected"],
                datasets: [
                  {
                    data: [
                      leaveStats.pending,
                      leaveStats.approved,
                      leaveStats.rejected,
                    ],
                    backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Right Grid: Leave Table (2 Columns in Large Screens) */}
        <div className="md:col-span-2 p-6  rounded-lg shadow-lg overflow-auto">
          <h2 className="text-xl font-bold mb-4">All Leave Requests</h2>
          <select
            onChange={(e) => handleFilter(e.target.value)}
            className="shadow shadow-gray-400 p-2 rounded mb-4 w-full"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="overflow-x-auto">
            <table className="w-full text-left shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, index) => (
                  <tr
                    key={leave.id}
                    className={`text-gray-700 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="p-4">{leave.employee_name}</td>
                    <td className="p-4">{leave.department}</td>
                    <td className="p-4">{leave.designation}</td>
                    <td
                      className={`p-4 font-bold ${
                        leave.status === "Pending"
                          ? "text-yellow-500"
                          : leave.status === "Approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="p-4">
                      {leave.status === "Pending" && (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              handleStatusChange(leave.id, "Approved")
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(leave.id, "Rejected")
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeavDashboard;
