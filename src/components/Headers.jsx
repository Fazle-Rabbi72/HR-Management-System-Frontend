import React, { useState, useEffect } from "react";
import { GoBell, GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Headers = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
  });

  const navigate = useNavigate();

  // 🔹 Logged-in user এর API থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem("user_id")}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData({
            first_name: data.first_name,
            last_name: data.last_name,
            profile_image: data.profile_image,
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // 🔹 Logout Function
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

  return (
    <header className="flex flex-wrap items-center justify-between bg-white shadow-md p-4 md:p-6 rounded-lg">
      {/* Welcome Section */}
      <div className="flex flex-col">
        <h1 className="text-sm text-gray-500">Welcome Back!</h1>
        <p className="text-lg md:text-xl font-semibold text-gray-800">
          {userData.first_name
            ? `${userData.first_name} ${userData.last_name}`
            : "Admin"}
        </p>
      </div>

      {/* Search Bar */}
      
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

      {/* Notifications and Profile */}
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        {/* Notification Bell */}
        <button className="relative text-gray-600 hover:text-indigo-500">
          <GoBell size={28} />
          <span className="absolute top-0 right-0 -mt-1 -mr-2 flex items-center justify-center bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full border-2 border-white">
            9
          </span>
        </button>

        {/* Profile Picture with Dropdown */}
        <div className="relative">
          {userData.profile_image ? (
            <img
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:shadow-lg cursor-pointer"
              src={`https://res.cloudinary.com/dwuadnsna/${userData.profile_image}`}
              alt="Profile"
            />
          ) : (
            <img
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:shadow-lg cursor-pointer"
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
            />
          )}
          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
    </header>
  );
};

export default Headers;
