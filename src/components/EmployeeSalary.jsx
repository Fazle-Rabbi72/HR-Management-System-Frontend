import React, { useEffect, useState } from "react";

const EmployeeSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch Employee ID from LocalStorage
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("user_id");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    }
  }, []);

  // Fetch Employee Details
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `https://hr-management-system-liard.vercel.app/employees/${employeeId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setEmployeeDetails(data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  // Fetch Employee Salaries
  useEffect(() => {
    if (!employeeId) return;

    const fetchSalaries = async () => {
      try {
        let apiUrl = `https://hr-management-system-liard.vercel.app/payroll/payslips/?employee=${employeeId}`;

        if (yearFilter) {
          apiUrl += `&year=${yearFilter}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setSalaries(data);
        setFilteredSalaries(showAll ? data : data.slice(0, 12));
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
    };

    fetchSalaries();
  }, [employeeId, yearFilter]);

  // Open Modal
  const openModal = (salary) => {
    setSelectedSalary(salary);
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSalary(null);
  };

  // Print Payslip
  const printPayslip = () => {
    const modalContent = document.getElementById("payslip-modal-content");

    if (!modalContent) {
      console.error("Modal content not found!");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip</title>
          <style>
            /* Hide the print buttons */
            .print-buttons {
              display: none;
            }
            /* Make the modal content look like the printed version */
            .print-container {
              padding: 20px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: 1fr 1fr; /* Double Grid */
              gap: 20px;
            }
            .grid-container div {
              margin-bottom: 10px;
            }
            /* For smaller screens, it will stack into a single column */
            @media (max-width: 768px) {
              .grid-container {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div id="payslip-modal-content" class="grid-container">
              ${modalContent.innerHTML}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 mb-20">
      <h2 className="text-xl font-bold mb-3">Employee Salary</h2>

      {/* Year Filter Input */}
      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter Year (e.g., 2025)"
          className="border px-3 py-2 rounded-md w-64"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        />
      </div>

      {/* Salary Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase">
              <th className="border p-3">Basic Salary</th>
              <th className="border p-3">Bonus</th>
              <th className="border p-3">Deduction</th>
              <th className="border p-3">Tax</th>
              <th className="border p-3">Month</th>
              <th className="border p-3">Year</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Net Salary</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((sal) => (
              <tr
                key={sal.id}
                className="text-center border hover:bg-gray-100 transition duration-300"
              >
                <td className="border p-3">{sal.basic_salary}</td>
                <td className="border p-3">{sal.bonus}</td>
                <td className="border p-3">{sal.deductions}</td>
                <td className="border p-3">{sal.tax}</td>
                <td className="border p-3">{sal.month}</td>
                <td className="border p-3">{sal.year}</td>
                <td className="border p-3">
                  <span
                    className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
                      sal.paid ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {sal.paid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="border p-3">{sal.net_salary}</td>
                <td className="border p-3">
                  <button
                    onClick={() => openModal(sal)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                  >
                    Generate Payslip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      {salaries.length > 12 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-800 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
          >
            {showAll ? "View Less" : "View All"}
          </button>
        </div>
      )}

      {/* Payslip Modal */}
      {showModal && selectedSalary && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            id="payslip-modal-content"
            className="bg-white p-8 rounded-lg shadow-xl w-3/4 sm:w-1/2"
          >
            <h3 className="text-3xl font-semibold text-center text-blue-600 mb-6">
              Payslip
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Employee Details */}
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">Employee Details</h4>
                {employeeDetails ? (
                  <>
                    <p>
                      <strong>Name:</strong> {employeeDetails.first_name}{" "}
                      {employeeDetails.last_name}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {employeeDetails.department_name}
                    </p>
                    <p>
                      <strong>Position:</strong> {employeeDetails.designation}
                    </p>
                    <p>
                      <strong>Email:</strong> {employeeDetails.email}
                    </p>
                  </>
                ) : (
                  <p>Loading employee details...</p>
                )}
              </div>

              {/* Salary Details */}
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">Salary Details</h4>
                <p>
                  <strong>Basic Salary:</strong> {selectedSalary.basic_salary}
                </p>
                <p>
                  <strong>Bonus:</strong> {selectedSalary.bonus}
                </p>
                <p>
                  <strong>Deduction:</strong> {selectedSalary.deductions}
                </p>
                <p>
                  <strong>Tax:</strong> {selectedSalary.tax}
                </p>
                <p>
                  <strong>Month:</strong> {selectedSalary.month}
                </p>
                <p>
                  <strong>Year:</strong> {selectedSalary.year}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedSalary.paid === true ? "Paid" : "Unpaid"}
                </p>
                <p>
                  <strong>Net Salary:</strong> {selectedSalary.net_salary}
                </p>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-6">
              <p>
                <strong>Signature:</strong> __________________________
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-center gap-6 print-buttons">
              <button
                onClick={printPayslip}
                className="bg-blue-500 text-white px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
              >
                Print Payslip
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-8 py-3 rounded-md shadow-md hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;
