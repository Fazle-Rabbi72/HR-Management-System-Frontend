import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import ForgotPasswordModal from "../components/modal/ForgotPasswordModal";
import OTPVerificationModal from "../components/modal/OTPVerificationModal";
import ResetPasswordModal from "../components/modal/ResetPasswordModal";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isOTPVerificationModalOpen, setIsOTPVerificationModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      username_or_email: usernameOrEmail,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://hr-management-system-liard.vercel.app/login/",
        loginData
      );
      const { token, user_id, username, role } = response.data;

      // Store token and user details
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      setError("");
      setIsModalOpen(true);

      // Navigate based on user role after a short delay
      setTimeout(() => {
        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "manager") {
          navigate("/manager-dashboard");
        } else if (role === "employee") {
          navigate("/dashboard/employee-dashboard");
        }
      }, 2000);
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div>
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome to HRM
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Username or Email
              </label>
              <input
                type="text"
                id="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter your username or email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute mt-3 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              <a
                href="#"
                onClick={() => setIsForgotPasswordModalOpen(true)}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </p>
            <hr />
            <p className="border-2 border-dashed border-gray-500 p-4 text-center text-gray-700 font-semibold">
              Username: admin, password: 123<br />
              Username: fazle_rabbi, password: fazle1234
            </p>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSuccess={(email) => {
          setEmail(email);
          setIsOTPVerificationModalOpen(true); // Open OTP verification modal
        }}
      />
      <OTPVerificationModal
        isOpen={isOTPVerificationModalOpen}
        onClose={() => setIsOTPVerificationModalOpen(false)}
        email={email}
        onSuccess={(otp) => {
          setOtp(otp);
          setIsResetPasswordModalOpen(true); // Open reset password modal
        }}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        email={email}
        otp={otp}
      />
    </div>
  );
};

export default Login;