import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 relative px-6 pt-4 flex flex-col items-center justify-center">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2"
        aria-label="Go back"
      >
        <img
          src="/icons/back.png"
          alt="Back"
          className="w-10 h-10 object-contain cursor-pointer hover:scale-110 transition-transform duration-200"
        />
      </button>

      <img
        src="/assets/logo.png"
        alt="Sajilo Sahayata"
        className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-4 hover:rotate-6 transition-all duration-500 cursor-pointer drop-shadow-lg"
        onClick={() => navigate("/")}
      />

      <p className="text-xl font-semibold text-gray-800 mb-10 tracking-wide text-center">
        {t("auth.tagline", "From alert to action — Instantly")}
      </p>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Portal Card */}
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center text-center border-t-4 border-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Portal</h2>
          <p className="text-gray-500 mb-6 text-sm">Report incidents and track alerts</p>
          <div className="space-y-3 w-full">
            <button
              onClick={() => navigate("/signin")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-md font-semibold shadow hover:bg-blue-700 transition"
            >
              {t("auth.login", "Login as User")}
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl text-md font-semibold hover:bg-blue-100 transition"
            >
              {t("auth.register", "Register as User")}
            </button>
          </div>
        </motion.div>

        {/* Admin Portal Card */}
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center text-center border-t-4 border-red-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4V6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h2>
          <p className="text-gray-500 mb-6 text-sm">Manage reports and dispatch operations</p>
          <div className="space-y-3 w-full">
            <button
              onClick={() => navigate("/admin-signin")}
              className="w-full bg-red-600 text-white py-3 rounded-xl text-md font-semibold shadow hover:bg-red-700 transition"
            >
              Login as Admin
            </button>
            <button
              onClick={() => navigate("/admin-signup")}
              className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl text-md font-semibold hover:bg-red-100 transition"
            >
              Register as Admin
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
