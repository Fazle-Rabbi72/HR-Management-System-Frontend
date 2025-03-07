import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendancePieChart = ({ data }) => {
  const chartData = {
    labels: ["Present", "Late", "Permission", "Absent"],
    datasets: [
      {
        label: "Attendance Overview",
        data: data,
        backgroundColor: ["#22c55e", "#eab308", "#f97316", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="w-[300px] h-[200px]">
      <Pie data={chartData} options={options} />
    </div>
  );
};

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [clockInData, setClockInData] = useState([]);
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    late: 0,
    permission: 0,
    absent: 0,
  });
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    axios
      .get("https://hr-management-system-liard.vercel.app/attendance/attendance/")
      .then((response) => {
        const data = response.data;
        setClockInData(data);

        const counts = data.reduce(
          (acc, curr) => {
            if (curr.status === "Present") acc.present += 1;
            else if (curr.status === "Late") acc.late += 1;
            else if (curr.status === "Permission") acc.permission += 1;
            else if (curr.status === "Absent") acc.absent += 1;
            return acc;
          },
          { present: 0, late: 0, permission: 0, absent: 0 }
        );
        if (filter === "today") {
          const todayCounts = data.reduce(
            (acc, curr) => {
              if (curr.date === new Date().toISOString().split("T")[0]) {
                if (curr.status === "Present") acc.present += 1;
                else if (curr.status === "Late") acc.late += 1;
                else if (curr.status === "Permission") acc.permission += 1;
                else if (curr.status === "Absent") acc.absent += 1;
              }
              return acc;
            },
            { present: 0, late: 0, permission: 0, absent: 0 }
          );
          setAttendanceCounts(todayCounts);
        } else {
          setAttendanceCounts(counts);
        }
        setAttendanceData(data);
      })
      .catch((error) => console.error("Error fetching attendance data:", error));
  }, [filter]);

  const handleTodayFilter = () => {
    setFilter("today");
  };

  const handleAllAttendance = () => {
    setFilter("all");
  };

  const getFilteredData = () => {
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return clockInData.filter((attendance) => attendance.date === today);
    }
    return clockInData;
  };

  // Modal toggle functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Attendance Overview Card */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Attendance Overview
          </h2>
          <button onClick={handleTodayFilter} className="text-gray-600 text-sm">
            📅 Today
          </button>
        </div>
        <div className="flex flex-col items-center">
          <AttendancePieChart
            data={[
              attendanceCounts.present,
              attendanceCounts.late,
              attendanceCounts.permission,
              attendanceCounts.absent,
            ]}
          />
          <p className="text-xl font-bold text-gray-800 mt-4">
            Total Attendance:{" "}
            {attendanceCounts.present +
              attendanceCounts.late +
              attendanceCounts.permission +
              attendanceCounts.absent}
          </p>
          <div className="mt-2 space-y-1 text-gray-700">
            <p className="text-green-600">
              🟢 Present: {attendanceCounts.present}
            </p>
            <p className="text-yellow-600">🟡 Late: {attendanceCounts.late}</p>
            <p className="text-orange-600">
              🟠 Permission: {attendanceCounts.permission}
            </p>
            <p className="text-red-600">🔴 Absent: {attendanceCounts.absent}</p>
          </div>
          <button
            onClick={openModal} // Open the modal when clicking "View Details"
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Clock-In/Out Section */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Clock-In/Out</h2>
          <button onClick={handleTodayFilter} className="text-gray-600 text-sm">
            📅 Today
          </button>
        </div>
        <div className="space-y-4">
          {getFilteredData().map((attendance, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-800">{` ${attendance.employee_name}`}</p>
                <p className="text-sm text-gray-600">{`Date: ${attendance.date}`}</p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    attendance.status === "Present"
                      ? "bg-green-100 text-green-500"
                      : attendance.status === "Late"
                      ? "bg-yellow-100 text-yellow-500"
                      : "bg-red-100 text-red-500"

                  }`}
                >
                  ⏱ {new Date(attendance.punch_in).toLocaleTimeString()} -{" "}
                  {new Date(attendance.punch_out).toLocaleTimeString()}
                </span>
                {attendance.status === "Late" && (
                  <span className="text-red-500 text-xs mt-1">
                    🔴 Late Arrival
                  </span>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {attendance.total_working_hours}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleAllAttendance}
          className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          View All Attendance
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold text-gray-800">Attendance Details</h2>
            <div className="mt-4 text-gray-700">
              <p>🟢 Present: {attendanceCounts.present}</p>
              <p>🟡 Late: {attendanceCounts.late}</p>
              <p>🟠 Permission: {attendanceCounts.permission}</p>
              <p>🔴 Absent: {attendanceCounts.absent}</p>
              <p className="mt-4 font-semibold text-lg">
                Total Attendance:{" "}
                {attendanceCounts.present +
                  attendanceCounts.late +
                  attendanceCounts.permission +
                  attendanceCounts.absent}
              </p>
            </div>
            <button
              onClick={closeModal} // Close the modal
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
