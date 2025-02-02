import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://hr-management-system-liard.vercel.app/reset-password/request/",
        { email }
      );
      onSuccess(email); // Trigger the next modal (OTP verification)
    } catch (err) {
      setError("Failed to send reset password request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;