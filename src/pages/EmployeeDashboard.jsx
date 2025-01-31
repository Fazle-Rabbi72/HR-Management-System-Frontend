import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceTable from "../components/AttendanceTable";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("user_id");

  const [attendance, setAttendance] = useState({
    date: "",
    status: "Present",
    punch_in: "",
    punch_out: "",
    employee: employeeId,
  });

  const handleChange = (e) => {
    setAttendance({ ...attendance, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hr-management-system-liard.vercel.app/attendance/attendance/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendance),
        }
      );

      if (response.ok) {
        alert("Attendance submitted successfully!");
      } else {
        alert("Failed to submit attendance!");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  if (!token) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-5 bg-white shadow-md p-6 rounded-lg w-full  mx-auto">
      <p className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Employee Dashboard
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 items-center justify-center w-full"
      >
        {/* Date Field */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={attendance.date}
            onChange={handleChange}
            placeholder="Select date"
            className="border p-2 rounded w-36"
          />
        </div>

        {/* Status Field */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={attendance.status}
            onChange={handleChange}
            className="border p-2 rounded w-36"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>

        {/* Punch In Field */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Punch In</label>
          <input
            type="datetime-local"
            name="punch_in"
            value={attendance.punch_in}
            onChange={handleChange}
            className="border p-2 rounded w-52"
          />
        </div>

        {/* Punch Out Field */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Punch Out</label>
          <input
            type="datetime-local"
            name="punch_out"
            value={attendance.punch_out}
            onChange={handleChange}
            className="border p-2 rounded w-52"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mt-6 hover:cursor-pointer"
        >
          Submit
        </button>
      </form>
      
        <AttendanceTable/>
      
    </div>
  );
};

export default EmployeeDashboard;
