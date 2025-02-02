import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const AdminLeavDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);

  useEffect(() => {
    axios
      .get("https://hr-management-system-liard.vercel.app/leave_request/leaves/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
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
          prevLeaves.map((leave) => (leave.id === id ? { ...leave, status: newStatus } : leave))
        );
        setFilteredLeaves((prevFiltered) =>
          prevFiltered.map((leave) => (leave.id === id ? { ...leave, status: newStatus } : leave))
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left Grid: Pie Chart (1 Column in Large Screens) */}
      <div className="md:col-span-1 p-4 border rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-center">Leave Status Summary</h2>
        <div className="w-48 md:w-60 items-center mt-10">
          <Pie
            data={{
              labels: ["Pending", "Approved", "Rejected"],
              datasets: [
                {
                  data: [leaveStats.pending, leaveStats.approved, leaveStats.rejected],
                  backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>

      {/* Right Grid: Leave Table (2 Columns in Large Screens) */}
      <div className="md:col-span-2 p-6 border rounded-lg shadow-lg overflow-auto">
        <h2 className="text-xl font-bold mb-4">All Leave Requests</h2>
        <select
          onChange={(e) => handleFilter(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Designation</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="text-center border">
                  <td className="p-3 border">{leave.employee_name}</td>
                  <td className="p-3 border">{leave.department}</td>
                  <td className="p-3 border">{leave.designation}</td>
                  <td className="p-3 border">{leave.status}</td>
                  <td className="p-3 border">
                    {leave.status === "Pending" && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleStatusChange(leave.id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(leave.id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
  );
};

export default AdminLeavDashboard;
