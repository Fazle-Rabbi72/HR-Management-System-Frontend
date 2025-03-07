import React, { useState } from "react";
import AddEmployeeModal from "../modal/AdminModal/AddEmployeeModal";
import { GoPlus, GoSearch } from "react-icons/go";
import { FaPlus } from "react-icons/fa";
import EmployeTable from "./EmployeTable";

const EmployeeList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEmployee = (employeeData) => {
    console.log("Employee Added:", employeeData);
    // Handle employee data (e.g., send it to API or state)
  };

  return (
    <div>
      <div className="flex mt-5 flex-wrap items-center justify-between bg-white shadow-md p-4 md:p-6 rounded-lg">
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700  hover:cursor-pointer"
          >
            <FaPlus /> Add Employee
          </button>
          <AddEmployeeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddEmployee}
          />
        </div>

        {/* Filter Bar */}
        <div className="relative w-full mt-4 md:mt-0 md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <GoSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Filter..."
          />
        </div>
      </div>
      
        <EmployeTable/>

     
    </div>
  );
};

export default EmployeeList;
