import React, { useState } from "react";
import axios from "axios";

const OTPVerificationModal = ({ isOpen, onClose, email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://hr-management-system-liard.vercel.app/reset-password/verify-otp/",
        { email, otp }
      );
      onSuccess(otp); // Trigger the next modal (reset password)
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationModal;