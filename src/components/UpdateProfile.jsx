import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri";
import { TbTrash, TbCameraPlus } from "react-icons/tb";

const UpdatedProfile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profile_image: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    const token = localStorage.getItem("token");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    const token = localStorage.getItem("token");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      alert("New password and confirm password do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://hr-management-system-liard.vercel.app/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(passwords),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswords({ old_password: "", new_password: "", confirm_password: "" });
        setShowPasswordFields(false);
      } else {
        alert("Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-lg font-semibold mb-4">Update Profile</h2>

      {/* Profile Image Section */}
      <div className="relative flex justify-center mb-4">
        <div className="relative w-24 h-24">
          {/* Profile Image */}
          {userData.profile_image ? (
            <img
              src={`https://res.cloudinary.com/dwuadnsna/${userData.profile_image}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-400 flex justify-center items-center rounded-full">
              No Image
            </div>
          )}

          {/* Loader Icon */}
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full">
              <RiLoader2Fill className="text-yellow-400 text-3xl animate-spin" />
            </div>
          )}

          {/* Delete Icon */}
          {userData.profile_image && (
            <button
              onClick={handleImageDelete}
              className="absolute right-0 bottom-0 bg-red-500 hover:bg-red-700 text-white p-1 rounded-full"
              aria-label="Delete image"
            >
              <TbTrash className="h-5 w-5" />
            </button>
          )}

          {/* Upload Icon */}
          {!userData.profile_image && (
            <>
              <input
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="absolute right-0 bottom-0 bg-green-500 hover:bg-green-700 text-white p-1 rounded-full cursor-pointer"
              >
                <TbCameraPlus className="h-5 w-5" />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          value={userData.first_name}
          onChange={(e) =>
            setUserData({ ...userData, first_name: e.target.value })
          }
          placeholder="First Name"
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          name="last_name"
          value={userData.last_name}
          onChange={(e) =>
            setUserData({ ...userData, last_name: e.target.value })
          }
          placeholder="Last Name"
          className="border rounded p-2 w-full"
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={(e) =>
            setUserData({ ...userData, email: e.target.value })
          }
          placeholder="Email"
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={(e) =>
            setUserData({ ...userData, phone: e.target.value })
          }
          placeholder="Phone"
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => alert("Profile Updated!")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Save
        </button>
      </div>

      {/* Change Password Button */}
      <div className="mt-4">
        <button onClick={() => setShowPasswordFields(!showPasswordFields)} className="px-4 py-2 bg-red-500 text-white rounded w-full">
          {showPasswordFields ? "Cancel" : "Change Password"}
        </button>
      </div>

      {/* Password Change Fields */}
      {showPasswordFields && (
        <div className="mt-4 border p-4 rounded-lg">
          {["old", "new", "confirm"].map((type) => (
            <div key={type} className="relative mb-3">
              <input
                type={showPassword[type] ? "text" : "password"}
                placeholder={type === "old" ? "Old Password" : type === "new" ? "New Password" : "Confirm Password"}
                value={passwords[`${type}_password`]}
                onChange={(e) => setPasswords({ ...passwords, [`${type}_password`]: e.target.value })}
                className="border rounded p-2 w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword({ ...showPassword, [type]: !showPassword[type] })}
              >
                {showPassword[type] ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          ))}

          <button onClick={handlePasswordChange} className="px-4 py-2 bg-blue-500 text-white rounded w-full" disabled={loading}>
            {loading ? "Changing..." : "Update Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdatedProfile;
