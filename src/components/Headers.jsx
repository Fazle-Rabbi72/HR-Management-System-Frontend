import React, { useState, useEffect } from "react";
import { GoBell, GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Headers = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
    email: "",
    phone: "",
  });

  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      setRole(role);
      if (!token) return;

      try {
        const response = await fetch(
          `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem(
            "user_id"
          )}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem(
          "user_id"
        )}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        setModalOpen(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between bg-white shadow-md p-2 md:p-2 rounded-lg">
      <div className="flex flex-col">
        <h1 className="text-sm text-gray-500">Welcome Back!</h1>
        <p className="text-lg md:text-xl font-semibold text-gray-800">
          {userData.first_name} {userData.last_name}
        </p>
      </div>

      {role === "admin" ? (
        <div className="relative w-full mt-4 md:mt-0 md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <GoSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Search..."
          />
        </div>
      ) : role === "employee" ? (
        <div className="relative w-full mt-4 md:mt-0 md:w-1/3">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Employee Dashboard
          </h1>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <button className="relative text-gray-600 hover:text-indigo-500">
          <GoBell size={28} />
          <span className="absolute top-0 right-0 -mt-1 -mr-2 flex items-center justify-center bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full border-2 border-white">
            9
          </span>
        </button>

        <div className="relative">
          <img
            className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:shadow-lg cursor-pointer"
            src={
              userData.profile_image
                ? `https://res.cloudinary.com/dwuadnsna/${userData.profile_image}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <li
                onClick={() => navigate("/dashboard/update-profile")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="border rounded p-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Headers;
