import React, { useEffect, useState } from "react";
import axios from "axios";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const API_URL = "https://hr-management-system-liard.vercel.app/departments/";

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_URL);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleUpdate = (id) => {
    const newName = prompt("Enter new department name:");
    if (newName) {
      axios
        .put(`${API_URL}${id}/`, { name: newName })
        .then(() => fetchDepartments())
        .catch((error) => console.error("Error updating department:", error));
    }
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      axios
        .delete(`${API_URL}${id}/`)
        .then(() => fetchDepartments())
        .catch((error) => console.error("Error deleting department:", error));
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      axios
        .post(API_URL, { name: newDepartment })
        .then(() => {
          setNewDepartment("");
          setShowModal(false);
          fetchDepartments();
        })
        .catch((error) => console.error("Error adding department:", error));
    }
  };

  // Filter departments based on search query
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  return (
    <div className="p-6 mt-6 bg-gray-100 rounded-lg shadow-lg w-full  mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Department List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          + Add Department
        </button>
      </div>
      
      {/* Search Input */}
      <input
        type="text"
        className="w-full shadow shadow-gray-400 p-2 rounded mb-3"
        placeholder="Search department..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {currentDepartments.length > 0 ? (
        <table className="w-full shadow-gray-400 bg-white rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 text-left">SL No</th>
              <th className="p-3 text-left">Department Name</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDepartments.map((dept, index) => (
              <tr key={dept.id} className="shadow shadow-gray-100 hover:bg-gray-100">
                <td className="p-3">{indexOfFirstItem + index + 1}</td>
                <td className="p-3">{dept.name}</td>
                <td className="p-3">
                  <button
                    className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleUpdate(dept.id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleRemove(dept.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No departments found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button
          className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">Add New Department</h3>
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              placeholder="Enter department name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddDepartment}
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

export default Department;