import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AttendanceTable = ({ employeeId }) => {
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/attendance/attendance/by_employee/?employee_id=${localStorage.getItem("user_id")}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/employees/${localStorage.getItem("user_id")}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchAttendance();
    fetchEmployee();
  }, [employeeId]);

  // Filter attendance by date
  const filteredAttendance = searchDate
    ? attendance.filter((att) => att.date.includes(searchDate))
    : attendance;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAttendance = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);

  // Export Attendance Data as CSV
  const exportCSV = () => {
    const csvHeader = "ID,Date,Status,Punch In,Punch Out,Total Working Hours\n";
    const csvRows = attendance
      .map((att) =>
        [
          att.id,
          att.date,
          att.status,
          att.punch_in ? new Date(att.punch_in).toLocaleTimeString() : "N/A",
          att.punch_out ? new Date(att.punch_out).toLocaleTimeString() : "N/A",
          att.total_working_hours,
        ].join(",")
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "attendance_report.csv");
  };

  // Export Attendance Data as PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    if (employee) {
      doc.setFontSize(16);
      doc.text("Employee Attendance Report", 10, 10);

      doc.setFontSize(12);
      doc.text(`Employee Name: ${employee.first_name + " " + employee.last_name}`, 10, 20);
      doc.text(`Employee ID: ${employee.id}`, 10, 30);
      doc.text(`Designation: ${employee.designation}`, 10, 40);
      doc.text(`Department: ${employee.department}`, 10, 50);
      doc.text(`Email: ${employee.email}`, 10, 60);
    }

    const tableColumn = ["Date", "Status", "Punch In", "Punch Out", "Total Hours"];
    const tableRows = attendance.map((att) => [
      att.date,
      att.status,
      att.punch_in ? new Date(att.punch_in).toLocaleTimeString() : "N/A",
      att.punch_out ? new Date(att.punch_out).toLocaleTimeString() : "N/A",
      att.total_working_hours,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: employee ? 70 : 20, // Employee data থাকলে 70px থেকে শুরু হবে
    });

    doc.save("attendance_report.pdf");
  };

  return (
    <div className="w-full mt-5">
      {/* Search and Export Buttons */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
  <h2 className="text-2xl font-bold text-purple-700 text-center md:text-left">
    Employee Attendance
  </h2>
  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
    <input
      type="date"
      value={searchDate}
      onChange={(e) => setSearchDate(e.target.value)}
      className="border rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <div className="flex gap-3 w-full md:w-auto">
      <button
        onClick={exportCSV}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full md:w-auto hover:bg-blue-600 transition duration-300"
      >
        Export CSV
      </button>
      <button
        onClick={exportPDF}
        className="bg-green-500 text-white px-6 py-3 rounded-lg w-full md:w-auto hover:bg-green-600 transition duration-300"
      >
        Export PDF
      </button>
    </div>
  </div>
</div>


      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-purple-600 text-white text-sm md:text-base">
              <th className="p-2 md:p-3">Date</th>
              <th className="p-2 md:p-3">Status</th>
              <th className="p-2 md:p-3">Punch In</th>
              <th className="p-2 md:p-3">Punch Out</th>
              <th className="p-2 md:p-3">Total Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {currentAttendance.length > 0 ? (
              currentAttendance.map((att) => (
                <tr key={att.id} className="border-b hover:bg-gray-50 text-center text-sm md:text-base">
                  <td className="p-2 md:p-3">{att.date}</td>
                  <td className="p-2 md:p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs md:text-sm ${
                        att.status === "Present" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">{new Date(att.punch_in).toLocaleTimeString()}</td>
                  <td className="p-2 md:p-3">{new Date(att.punch_out).toLocaleTimeString()}</td>
                  <td className="p-2 md:p-3">{att.total_working_hours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-lg mx-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= filteredAttendance.length}
          className="bg-gray-300 px-4 py-2 rounded-lg mx-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
