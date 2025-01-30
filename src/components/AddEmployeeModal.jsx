import React, { useState, useEffect } from "react";

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [employeeData, setEmployeeData] = useState({
    username: "",
    role: "employee", // Default to 'employee'
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    designation: "",
    date_of_joining: "",
    phone: "",
    address: "",
    profile_image: null,
    password: "", // Added password field
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch departments from the API
    fetch("http://127.0.0.1:8000/departments/")
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setEmployeeData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      formData.append(key, employeeData[key]);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/employees/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Employee added successfully");
        setEmployeeData({
          username: "",
          role: "employee",
          first_name: "",
          last_name: "",
          email: "",
          department: "",
          designation: "",
          date_of_joining: "",
          phone: "",
          address: "",
          profile_image: null,
          password: "",
        });
        onClose();
      } else {
        alert("Failed to add employee");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error while adding employee");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] my-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Employee</h2>
          <button
            className="text-sm text-white  rounded-md bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 px-6 py-2 transition-colors duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={employeeData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Role (ChoiceField) */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={employeeData.role}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={employeeData.first_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={employeeData.last_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={employeeData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Department (ChoiceField with PK) */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={employeeData.department}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-gray-700"
              >
                Designation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={employeeData.designation}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Date of Joining */}
            <div>
              <label
                htmlFor="date_of_joining"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Joining
              </label>
              <input
                type="date"
                id="date_of_joining"
                name="date_of_joining"
                value={employeeData.date_of_joining}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={employeeData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={employeeData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile_image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={employeeData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full p-2 bg-green-600 hover:cursor-pointer text-white rounded-md"
              >
                Add Employee
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
