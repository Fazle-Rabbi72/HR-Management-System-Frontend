import React, { useState, useEffect } from "react";

const AdminPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [filter, setFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectEmployee, setSelectEmployee] = useState([]);
  const [newPayroll, setNewPayroll] = useState({
    employee: "",
    basic_salary: "",
    bonus: "",
    tax: "",
    deductions: "",
  });

  const [newPayslip, setNewPayslip] = useState({
    month: "January",
    year: "",
    basic_salary: "",
    bonus: "",
    deductions: "",
    tax: "",
    paid: false,
  });

  const handlePayslipChange = (e) => {
    const { name, value } = e.target;
    setNewPayslip((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddPayslip = () => {
    fetch("https://hr-management-system-liard.vercel.app/payroll/payslips/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newPayslip),
    })
      .then((res) => res.json())
      .then((data) => {
        setPayslips([...payslips, data]);
        setShowPayslipModal(false);
        setNewPayslip({
          employee: "",
          month: "",
          year: "",
          basic_salary: "",
          bonus: "",
          deductions: "",
          tax: "",
          net_salary: "",
          paid: false,
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetch("https://hr-management-system-liard.vercel.app/employees/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSelectEmployee(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const filterUrl = filter
      ? `https://hr-management-system-liard.vercel.app/payroll/payrolls/?employee=${filter}`
      : `https://hr-management-system-liard.vercel.app/payroll/payrolls/`;

    fetch(filterUrl, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPayrolls(data))
      .catch((err) => console.error(err));
  }, [filter]); // Run this effect whenever the 'filter' state changes.

  useEffect(() => {
    fetch("https://hr-management-system-liard.vercel.app/payroll/payslips/")
      .then((res) => res.json())
      .then((data) => setPayslips(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPayroll((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddPayroll = () => {
    fetch("https://hr-management-system-liard.vercel.app/payroll/payrolls/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPayroll),
    })
      .then((res) => res.json())
      .then((data) => {
        setPayrolls([...payrolls, data]);
        setShowModal(false);
      })
      .catch((err) => console.error(err));
  };

  const handleDeletePayroll = (id) => {
    fetch(
      `https://hr-management-system-liard.vercel.app/payroll/payrolls/${id}/`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        setPayrolls(payrolls.filter((payroll) => payroll.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleUpdatePayroll = () => {
    fetch(
      `https://hr-management-system-liard.vercel.app/payroll/payrolls/${selectedPayroll.id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPayroll),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPayrolls(
          payrolls.map((payroll) => (payroll.id === data.id ? data : payroll))
        );
        setShowUpdateModal(false);
      })
      .catch((err) => console.error(err));
  };

  const handleTogglePaidStatus = async (payslipId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Unpaid হলে Paid, আর Paid হলে Unpaid

      const response = await fetch(
        `https://hr-management-system-liard.vercel.app/payroll/payslips/${payslipId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paid: updatedStatus }), // শুধু paid ফিল্ড আপডেট করবো
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update paid status");
      }

      // লোকাল state আপডেট করা (UI তে সাথে সাথে পরিবর্তন আনার জন্য)
      setPayslips((prevPayslips) =>
        prevPayslips.map((payslip) =>
          payslip.id === payslipId
            ? { ...payslip, paid: updatedStatus }
            : payslip
        )
      );
    } catch (error) {
      console.error("Error updating paid status:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mt-6 mb-4 text-center">Payroll Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payroll Management */}
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <input
              type="number"
              placeholder="Filter by Employee ID"
              className=" shadow shadow-gray-400 p-2 rounded mb-2 md:mb-0 md:w-1/2"
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mt-2 md:mt-0"
              onClick={() => setShowModal(true)}
            >
              Add Payroll
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra shadow-md ">
              {/* Table Header */}
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Basic Salary</th>
                  <th className="p-3">Deduction</th>
                  <th className="p-3">Tax</th>
                  <th className="p-3">Bonus</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {payrolls.length > 0 ? (
                  payrolls.map((payroll) => (
                    <tr key={payroll.id} className="hover">
                      <td className="p-3">{payroll.employee_name}</td>
                      <td className="p-3">{payroll.basic_salary}</td>
                      <td className="p-3">{payroll.deductions}</td>
                      <td className="p-3">{payroll.tax}</td>
                      <td className="p-3">{payroll.bonus}</td>
                      <td className="p-3 flex mt-3 gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => {
                            setSelectedPayroll(payroll);
                            setShowPayslipModal(true);
                          }}
                        >
                          Payslip
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => {
                            setSelectedPayroll(payroll);
                            setShowUpdateModal(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => handleDeletePayroll(payroll.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No payroll data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payslip Management */}
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex justify-between mb-4">
            <select
              className="shadow shadow-gray-400 p-2 rounded"
              onChange={(e) => setPaidFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Paid</option>
              <option value="false">Unpaid</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full table-auto shadow-md ">
              {/* Table Header */}
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Net Salary</th>
                  <th className="p-3">Paid Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {payslips
                  .filter((item) =>
                    paidFilter ? item.paid.toString() === paidFilter : true
                  )
                  .map((payslip) => (
                    <tr
                      key={payslip.id}
                      className="hover:bg-gray-100 transition"
                    >
                      <td className="p-3">{payslip.employee_name}</td>
                      <td className="p-3">{payslip.net_salary}</td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            handleTogglePaidStatus(payslip.id, payslip.paid)
                          }
                          className={`btn btn-sm text-white font-bold px-4 py-2 rounded ${
                            payslip.paid
                              ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                          disabled={payslip.paid}
                        >
                          {payslip.paid ? "Paid" : "Unpaid"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Add Payroll Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4 text-center">
                Add Payroll
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Employee Selection */}
                <div>
                  <label
                    htmlFor="employee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee
                  </label>
                  <select
                    id="employee"
                    name="employee"
                    value={newPayroll.employee}
                    className="border p-2 w-full mb-2"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {selectEmployee.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.username}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="basic_salary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    id="basic_salary"
                    name="basic_salary"
                    value={newPayroll.basic_salary}
                    placeholder="Basic Salary"
                    onChange={handleChange}
                    className="border p-2 w-full mb-2"
                  />
                </div>

                {/* Salary Input */}
                <div>
                  <label
                    htmlFor="bonus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bonus
                  </label>
                  <input
                    type="number"
                    id="bonus"
                    name="bonus"
                    value={newPayroll.bonus}
                    placeholder="Bonus"
                    onChange={handleChange}
                    className="border p-2 w-full mb-2"
                  />
                  <label
                    htmlFor="tax"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax
                  </label>
                  <input
                    id="tax"
                    type="number"
                    name="tax"
                    placeholder="Tax"
                    value={newPayroll.tax}
                    className="border p-2 w-full mb-2"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <label
                htmlFor="deductions"
                className="block text-sm font-medium text-gray-700"
              >
                Deduction
              </label>
              <input
                type="number"
                id="deductions"
                name="deductions"
                value={newPayroll.deductions}
                placeholder="Deduction"
                onChange={handleChange}
                className="border p-2 w-full mb-2"
              />

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleAddPayroll}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Payroll Modal */}
        {showUpdateModal && selectedPayroll && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4 text-center">
                Update Payroll
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Employee Selection */}
                <div>
                  <label
                    htmlFor="employee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee
                  </label>
                  <select
                    id="employee"
                    name="employee"
                    value={selectedPayroll.employee}
                    className="border p-2 w-full mb-2"
                    onChange={(e) =>
                      setSelectedPayroll({
                        ...selectedPayroll,
                        employee: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Employee</option>
                    {selectEmployee.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="basic_salary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    id="basic_salary"
                    name="basic_salary"
                    value={selectedPayroll.basic_salary}
                    placeholder="Basic Salary"
                    onChange={(e) =>
                      setSelectedPayroll({
                        ...selectedPayroll,
                        basic_salary: e.target.value,
                      })
                    }
                    className="border p-2 w-full mb-2"
                  />
                </div>

                {/* Salary Input */}
                <div>
                  <label
                    htmlFor="bonus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bonus
                  </label>
                  <input
                    type="number"
                    id="bonus"
                    name="bonus"
                    value={selectedPayroll.bonus}
                    placeholder="Bonus"
                    onChange={(e) =>
                      setSelectedPayroll({
                        ...selectedPayroll,
                        bonus: e.target.value,
                      })
                    }
                    className="border p-2 w-full mb-2"
                  />
                  <label
                    htmlFor="tax"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax
                  </label>
                  <input
                    id="tax"
                    type="number"
                    name="tax"
                    placeholder="Tax"
                    value={selectedPayroll.tax}
                    onChange={(e) =>
                      setSelectedPayroll({
                        ...selectedPayroll,
                        tax: e.target.value,
                      })
                    }
                    className="border p-2 w-full mb-2"
                  />
                </div>
              </div>
              <label
                htmlFor="deductions"
                className="block text-sm font-medium text-gray-700"
              >
                Deduction
              </label>
              <input
                type="number"
                id="deductions"
                name="deductions"
                value={selectedPayroll.deductions}
                placeholder="Deduction"
                onChange={(e) =>
                  setSelectedPayroll({
                    ...selectedPayroll,
                    deductions: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleUpdatePayroll}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payslip Modal */}
        {showPayslipModal && selectedPayroll && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4 text-center">
                Add Payslip
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Month (Dropdown) */}
                <div>
                  <label
                    htmlFor="month"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Month
                  </label>
                  <select
                    id="month"
                    name="month"
                    value={newPayslip.month}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={newPayslip.year}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                    placeholder="Year"
                  />
                </div>

                {/* Basic Salary */}
                <div>
                  <label
                    htmlFor="basic_salary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    id="basic_salary"
                    name="basic_salary"
                    value={newPayslip.basic_salary}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                    placeholder="Basic Salary"
                  />
                </div>

                {/* Bonus */}
                <div>
                  <label
                    htmlFor="bonus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bonus
                  </label>
                  <input
                    type="number"
                    id="bonus"
                    name="bonus"
                    value={newPayslip.bonus}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                    placeholder="Bonus"
                  />
                </div>

                {/* Tax */}
                <div>
                  <label
                    htmlFor="tax"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax
                  </label>
                  <input
                    type="number"
                    id="tax"
                    name="tax"
                    value={newPayslip.tax}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                    placeholder="Tax"
                  />
                </div>

                {/* Deductions */}
                <div>
                  <label
                    htmlFor="deductions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Deductions
                  </label>
                  <input
                    type="number"
                    id="deductions"
                    name="deductions"
                    value={newPayslip.deductions}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                    placeholder="Deductions"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee
                  </label>
                  <select
                    id="employee"
                    name="employee"
                    value={newPayslip.employee}
                    className="border p-2 w-full mb-2"
                    onChange={handlePayslipChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {selectEmployee.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.username}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Paid Status (Full Width) */}
                <div>
                  <label
                    htmlFor="paid"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Paid Status
                  </label>
                  <select
                    id="paid"
                    name="paid"
                    value={newPayslip.paid}
                    onChange={handlePayslipChange}
                    className="border p-2 w-full"
                  >
                    <option value={false}>Unpaid</option>
                    <option value={true}>Paid</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleAddPayslip}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowPayslipModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayroll;
