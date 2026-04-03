import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../stores/useAuth";
import API from "../../api/axios";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const login = useAuth((state) => state.login);

  const handleLogin = async () => {
    setError("");
    setStatus(null);

    const fullPhone = "+977" + phone;
    const isValidPhone = /^[0-9]{10}$/.test(phone);
    const isValidPassword = password.length >= 6;

    if (!isValidPhone) return setError("Invalid phone number");
    if (!isValidPassword) return setError("Password too short");

    try {
      const res = await API.post("/api/auth/admin/login", {
        phone: fullPhone,
        password,
      });

      const { user, token } = res.data;

      login(user, token); // ✅ Store in Zustand
      setStatus("success");
      setTimeout(() => navigate("/admin"), 1000); // Admin Dashboard
    } catch (err) {
      console.error("Admin Login error:", err);
      // Show specific message if not admin
      if (err.response && err.response.data && err.response.data.message) {
         setError(err.response.data.message);
      } else {
         setError("Login failed. Check phone or password.");
      }
      setStatus("fail");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-6 py-8 relative flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2"
      >
        <img
          src="/icons/back.png"
          alt="Back"
          className="w-8 h-8 object-contain hover:scale-110 transition-transform duration-200"
        />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center justify-center mt-6">
        <motion.img
          src="/assets/logo.png"
          alt="Logo"
          className="h-12 mb-4 cursor-pointer hover:rotate-12 transition-transform duration-300 drop-shadow-md"
          onClick={() => navigate("/")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        />
        <motion.h1
          className="text-2xl font-extrabold text-red-700 uppercase tracking-wider"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          System Admin
        </motion.h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Authorized personnel only
        </p>
      </div>

      {/* Form Container */}
      <motion.div
        className="w-full max-w-sm bg-white mt-6 p-6 rounded-xl shadow-lg mx-auto space-y-5 text-left border-t-4 border-red-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-gray-700"
          >
            Admin Phone Number
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-red-400">
            <span className="text-sm text-gray-600 mr-2 font-bold">+977</span>
            <input
              id="phone"
              type="tel"
              placeholder="9800000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 outline-none text-sm font-medium"
              maxLength={10}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-gray-700"
          >
            Passcode
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-red-400">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your admin passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 text-sm ml-2"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-red-600 cursor-pointer"
            />
            Remember token
          </label>
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-red-600 cursor-pointer hover:underline"
          >
            Forgot passcode?
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600 font-bold bg-red-50 p-2 rounded">{error}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-200 uppercase tracking-widest text-sm"
        >
          Secure Authenticate
        </button>

        {/* Feedback */}
        {status === "success" && (
          <p className="text-green-600 text-sm mt-2 font-bold text-center">
            Authentication successful! Initializing Dashboard...
          </p>
        )}
      </motion.div>

      {/* Bottom Register Link */}
      <p className="text-sm text-center mt-6 text-gray-700 font-medium">
        Need an admin account?{" "}
        <span
          className="text-red-700 font-bold cursor-pointer hover:underline"
          onClick={() => navigate("/admin-signup")}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default AdminLogin;
