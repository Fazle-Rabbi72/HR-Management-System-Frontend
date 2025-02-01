import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const EmployeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch(
        "https://hr-management-system-liard.vercel.app/employees/"
      );
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    const response = await fetch(
      `https://hr-management-system-liard.vercel.app/employees/${id}/`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      setEmployees(employees.filter((employee) => employee.id !== id));
      setFilteredEmployees(
        filteredEmployees.filter((employee) => employee.id !== id)
      );
    }
  };

  const handleView = (employee) => {
    setModalType("view");
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  const handleUpdate = (employee) => {
    setModalType("update");
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  // PDF Generate Function (Table Format)
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 10);

    const tableColumn = ["ID", "Name", "Role", "Department", "Date of Joining"];
    const tableRows = employees.map((emp) => [
      emp.id,
      `${emp.first_name} ${emp.last_name}`,
      emp.role,
      emp.department_name,
      emp.date_of_joining,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("employee_list.pdf");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="mt-5 p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Employee List</h2>
        <button
          onClick={generatePDF}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Download PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg border border-gray-200">
          <thead>
            <tr className="bg-purple-600 text-white text-left text-sm uppercase tracking-wider">
              <th className="p-4">Photo</th>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Date of Joining</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentEmployees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-100">
                <td className="p-4">
                  <img
                    src={`https://res.cloudinary.com/dwuadnsna/${employee.profile_image}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                  />
                </td>
                <td className="p-4 whitespace-nowrap">{`${employee.first_name} ${employee.last_name}`}</td>
                <td className="p-4 whitespace-nowrap">{employee.role}</td>
                <td className="p-4 whitespace-nowrap">
                  {employee.department_name}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {employee.date_of_joining}
                </td>
                <td className="p-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleView(employee)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-xs md:text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdate(employee)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-xs md:text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-xs md:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-lg mx-2"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= filteredEmployees.length}
          className="bg-gray-300 px-4 py-2 rounded-lg mx-2"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
            {modalType === "view" && (
              <div>
                <h2 className="text-lg font-bold">
                  {currentEmployee.first_name} {currentEmployee.last_name}
                </h2>
                <p>Email: {currentEmployee.email}</p>
                <p>Role: {currentEmployee.role}</p>
                <p>Department: {currentEmployee.department_name}</p>
                <p>Designation: {currentEmployee.designation}</p>
                <p>Date of Joining: {currentEmployee.date_of_joining}</p>
                <p>Address: {currentEmployee.address}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
            {modalType === "update" && (
              <div>
                <h2 className="text-lg font-bold">Update Employee</h2>
                <p>**(Update form will be added later)**</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeTable;
