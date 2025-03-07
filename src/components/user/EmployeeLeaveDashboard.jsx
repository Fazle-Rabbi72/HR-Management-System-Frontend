import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const EmployeeLeaveDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee: localStorage.getItem("user_id"),
    start_date: "",
    end_date: "",
    reason: "",
  });

  const authToken = localStorage.getItem("token");

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://hr-management-system-liard.vercel.app/leave_request/leaves/",
        { headers: { Authorization: `Token ${authToken}` } }
      );
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      alert("Failed to fetch leave requests.");
    }
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://hr-management-system-liard.vercel.app/leave_request/leaves/",
        formData,
        { headers: { Authorization: `Token ${authToken}` } }
      );
      setShowForm(false);
      setFormData({
        employee: formData.employee,
        start_date: "",
        end_date: "",
        reason: "",
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request.");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Graph Data
  const leaveStatusCount = leaveRequests.reduce(
    (acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Rejected: 0, Approved: 0 }
  );

  const chartData = {
    labels: ["Pending", "Rejected", "Approved"],
    datasets: [
      {
        label: "Leave Requests",
        data: [
          leaveStatusCount.Pending,
          leaveStatusCount.Rejected,
          leaveStatusCount.Approved,
        ],
        backgroundColor: ["#f39c12", "#e74c3c", "#2ecc71"],
      },
    ],
  };

  return (
    <div className="grid  w-full grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* First Grid: Leave Request Form */}
      <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          {showForm ? "Cancel" : "Leave Request"}
        </button>
        {showForm && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date:
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date:
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason:
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-4"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}

        {/* Leave Status Graph */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Leave Status Graph</h3>
          <Bar data={chartData} />
        </div>
      </div>

      {/* Second Grid: Leave Request List */}
      <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Leave Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Start Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    End Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Reason
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {request.start_date}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {request.end_date}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {request.reason}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <button
                        className={`bg-${
                          request.status === "Pending"
                            ? "yellow"
                            : request.status === "Rejected"
                            ? "red"
                            : "green"
                        }-500 text-white py-1 px-2 rounded`}
                      >
                        {request.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          onClick={fetchLeaveRequests}
          disabled={loading}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "View All"}
        </button>
      </div>
    </div>
  );
};

export default EmployeeLeaveDashboard;
