import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";

const UpdatedProfile = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profile_image: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(
          `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem("user_id")}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem("user_id")}/`,
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
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem("user_id")}/`,
        {
          method: "PATCH",
          headers: { Authorization: `Token ${token}` },
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserData({ ...userData, profile_image: data.profile_image });
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://hr-management-system-liard.vercel.app/employees/${localStorage.getItem("user_id")}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ profile_image: "" }),
        }
      );
      if (response.ok) {
        setUserData({ ...userData, profile_image: "" });
      } else {
        alert("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
      <div className="flex items-center justify-center mb-4">
        {userData.profile_image ? (
          <div className="relative flex items-center gap-2">
            <img
              src={`https://res.cloudinary.com/dwuadnsna/${userData.profile_image}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <button onClick={handleImageDelete} className="text-red-600">
              <FaTrash size={24} />
            </button>
            <label className="text-blue-600 cursor-pointer">
              <FaUpload size={24} />
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-dashed border-2 border-gray-400 p-6 rounded-lg cursor-pointer">
            <FaUpload className="text-gray-500 text-3xl" />
            <input type="file" className="hidden" onChange={handleImageUpload} />
            <span className="text-sm text-gray-600">Upload Image</span>
          </label>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="first_name" value={userData.first_name} onChange={handleInputChange} placeholder="First Name" className="border rounded p-2 w-full" />
        <input type="text" name="last_name" value={userData.last_name} onChange={handleInputChange} placeholder="Last Name" className="border rounded p-2 w-full" />
        <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="Email" className="border rounded p-2 w-full" />
        <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} placeholder="Phone" className="border rounded p-2 w-full" />
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleProfileUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
      </div>
    </div>
  );
};

export default UpdatedProfile;
