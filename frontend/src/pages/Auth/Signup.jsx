// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import useAuth from "../../stores/useAuth";
// import useRegistration from "../../stores/useRegistration";
// import API from "../../api/axios";
// import { motion } from "framer-motion";

// const Register = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [status, setStatus] = useState(null);
//   const setStepData = useRegistration((state) => state.setStepData);

//   const login = useAuth((state) => state.login);

//   const handleSignup = async () => {
//     setError("");
//     setStatus(null);

//     const nameValid = /^[A-Za-z\s]{3,}$/.test(name.trim());
//     const phoneValid = /^(97|98)\d{8}$/.test(phone);
//     const passwordValid = password.length >= 8;
//     const passwordsMatch = password === confirmPassword;

//     if (!nameValid) return setError(t("register.invalidName"));
//     if (!phoneValid) return setError(t("register.invalidPhone"));
//     if (!passwordValid) return setError(t("register.shortPassword"));
//     if (!passwordsMatch) return setError(t("register.passwordMismatch"));

//     try {
//       const response = await API.post("/auth/register", {
//         username: name,
//         phoneNumber: "+977" + phone,
//         password,
//       });

//       // setStepData({ name, phoneNumber: "+977" + phone });
//       // setStatus("success");
//       // navigate("/verify-otp");
//       navigate("/signin");
//     } catch (err) {
//       console.error("Signup error", err);
//       setStatus("fail");
//       setError(t("register.genericError", "Something went wrong. Try again."));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8 flex items-center justify-center relative">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         aria-label={t("register.back")}
//         className="absolute top-4 left-4 p-2 rounded-full hover:scale-110 transition-transform duration-200"
//       >
//         <img
//           src="/icons/back.png"
//           alt="Back"
//           className="w-8 h-8 object-contain"
//         />
//       </button>

//       {/* Main Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="w-full max-w-md"
//       >
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src="/assets/logo.png"
//             alt="Logo"
//             className="h-12"
//             onClick={() => navigate("/")}
//           />
//         </div>

//         {/* Header */}
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-extrabold text-blue-700">
//             {t("register.title", "Create an account")}
//           </h1>
//           <p className="text-sm text-gray-500 mt-2">
//             {t("register.subtitle", "Welcome! Please enter your details")}
//           </p>
//         </div>

//         {/* Form */}
//         <div className="bg-white p-6 rounded-xl shadow-xl space-y-5 transition-shadow hover:shadow-2xl">
//           {/* Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700"
//             >
//               {t("register.name", "Full Name")}
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder={t("register.namePlaceholder", "Your Name")}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label
//               htmlFor="phone"
//               className="block text-sm font-medium text-gray-700"
//             >
//               {t("register.phone", "Phone Number")}
//             </label>
//             <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
//               <span className="text-sm text-gray-600 mr-2">+977</span>
//               <input
//                 id="phone"
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="9800000000"
//                 maxLength={10}
//                 className="flex-1 outline-none text-sm"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               {t("register.password", "Password")}
//             </label>
//             <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder={t(
//                   "register.passwordPlaceholder",
//                   "Minimum 8 characters"
//                 )}
//                 className="flex-1 outline-none text-sm"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="text-sm text-gray-600 ml-2"
//                 aria-label={
//                   showPassword
//                     ? t("register.hidePassword")
//                     : t("register.showPassword")
//                 }
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="block text-sm font-medium text-gray-700"
//             >
//               {t("register.confirmPassword", "Confirm Password")}
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder={t(
//                 "register.confirmPasswordPlaceholder",
//                 "Re-enter password"
//               )}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
//             />
//           </div>

//           {/* Password Note */}
//           <p className="text-xs text-gray-500">
//             ✅{" "}
//             {t(
//               "register.passwordNote",
//               "Password must be at least 8 characters"
//             )}
//           </p>

//           {/* Error */}
//           {error && <p className="text-sm text-red-500">{error}</p>}

//           {/* Sign Up Button */}
//           <motion.button
//             whileTap={{ scale: 0.97 }}
//             whileHover={{ scale: 1.02 }}
//             onClick={handleSignup}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
//           >
//             {t("register.signup", "Sign Up")}
//           </motion.button>

//           {/* Success */}
//           {status === "success" && (
//             <p className="text-green-600 text-sm mt-2">
//               {t("register.success", "Account created! Redirecting...")}
//             </p>
//           )}
//         </div>

//         {/* Footer */}
//         <p className="text-sm text-center mt-6 text-gray-700">
//           {t("register.haveAccount", "Already have an account?") + " "}
//           <span
//             className="text-blue-600 font-semibold cursor-pointer hover:underline"
//             onClick={() => navigate("/signin")}
//           >
//             {t("register.login", "Log in")}
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import useAuth from "../../stores/useAuth";
// import useRegistration from "../../stores/useRegistration";
// import API from "../../api/axios";
// import { motion } from "framer-motion";

// const Register = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [status, setStatus] = useState(null);

//   const setStepData = useRegistration((state) => state.setStepData);
//   const login = useAuth((state) => state.login);

//   const handleSignup = async () => {
//     setError("");
//     setStatus(null);

//     const nameValid = /^[A-Za-z\s]{3,}$/.test(name.trim());
//     const phoneValid = /^(97|98)\d{8}$/.test(phone);
//     const passwordValid = password.length >= 8;
//     const passwordsMatch = password === confirmPassword;

//     if (!nameValid) return setError(t("register.invalidName"));
//     if (!phoneValid) return setError(t("register.invalidPhone"));
//     if (!passwordValid) return setError(t("register.shortPassword"));
//     if (!passwordsMatch) return setError(t("register.passwordMismatch"));

//     try {
//       const response = await API.post("/auth/register", {
//         username: name,
//         phoneNumber: "+977" + phone,
//         password,
//       });

//       setStatus("success");
//       // Optionally store step data if using multi-step registration
//       // setStepData({ name, phoneNumber: "+977" + phone });
//       navigate("/signin");
//     } catch (err) {
//       console.error("Signup error", err);
//       setStatus("fail");
//       setError(
//         t("register.genericError", "Something went wrong. Try again.")
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8 flex items-center justify-center relative">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         aria-label={t("register.back")}
//         className="absolute top-4 left-4 p-2 rounded-full hover:scale-110 transition-transform duration-200"
//       >
//         <img src="/icons/back.png" alt="Back" className="w-8 h-8" />
//       </button>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="w-full max-w-md"
//       >
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src="/assets/logo.png"
//             alt="Logo"
//             className="h-12 cursor-pointer"
//             onClick={() => navigate("/")}
//           />
//         </div>

//         {/* Header */}
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-extrabold text-blue-700">
//             {t("register.title", "Create an account")}
//           </h1>
//           <p className="text-sm text-gray-500 mt-2">
//             {t("register.subtitle", "Welcome! Please enter your details")}
//           </p>
//         </div>

//         {/* Form */}
//         <div className="bg-white p-6 rounded-xl shadow-xl space-y-5">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               {t("register.name", "Full Name")}
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder={t("register.namePlaceholder", "Your Name")}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               {t("register.phone", "Phone Number")}
//             </label>
//             <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
//               <span className="text-sm text-gray-600 mr-2">+977</span>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="9800000000"
//                 maxLength={10}
//                 className="flex-1 outline-none text-sm"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               {t("register.password", "Password")}
//             </label>
//             <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder={t(
//                   "register.passwordPlaceholder",
//                   "Minimum 8 characters"
//                 )}
//                 className="flex-1 outline-none text-sm"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="text-sm text-gray-600 ml-2"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               {t("register.confirmPassword", "Confirm Password")}
//             </label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder={t(
//                 "register.confirmPasswordPlaceholder",
//                 "Re-enter password"
//               )}
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
//             />
//           </div>

//           {/* Password Note */}
//           <p className="text-xs text-gray-500">
//             ✅ {t(
//               "register.passwordNote",
//               "Password must be at least 8 characters"
//             )}
//           </p>

//           {/* Error */}
//           {error && <p className="text-sm text-red-500">{error}</p>}

//           {/* Sign Up Button */}
//           <motion.button
//             whileTap={{ scale: 0.97 }}
//             whileHover={{ scale: 1.02 }}
//             onClick={handleSignup}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//           >
//             {t("register.signup", "Sign Up")}
//           </motion.button>

//           {/* Success */}
//           {status === "success" && (
//             <p className="text-green-600 text-sm mt-2">
//               {t("register.success", "Account created! Redirecting...")}
//             </p>
//           )}
//         </div>

//         {/* Footer */}
//         <p className="text-sm text-center mt-6 text-gray-700">
//           {t("register.haveAccount", "Already have an account?") + " "}
//           <span
//             className="text-blue-600 font-semibold cursor-pointer hover:underline"
//             onClick={() => navigate("/signin")}
//           >
//             {t("register.login", "Log in")}
//           </span>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import API from "../../api/axios";
import useAuth from "../../stores/useAuth";
import useRegistration from "../../stores/useRegistration";
import { useLocalGovernment } from "../../hooks/useLocalGovernment"; // your custom hook

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);
  const setStepData = useRegistration((state) => state.setStepData);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Use your hook at top-level
  const { localGov, loading: locationLoading } = useLocalGovernment();

  const handleSignup = async () => {
    setError("");
    setStatus(null);
    setIsLoading(true);

    try {
      // Validation
      const nameValid = /^[A-Za-z\s]{3,}$/.test(name.trim());
      const phoneValid = /^(97|98)\d{8}$/.test(phone);
      const passwordValid = password.length >= 8;
      const passwordsMatch = password === confirmPassword;

      if (!nameValid) {
        setError(t("register.invalidName", "Name must be at least 3 characters"));
        setIsLoading(false);
        return;
      }
      if (!phoneValid) {
        setError(t("register.invalidPhone", "Phone number must start with 97 or 98 followed by 8 digits"));
        setIsLoading(false);
        return;
      }
      if (!passwordValid) {
        setError(t("register.shortPassword", "Password must be at least 8 characters"));
        setIsLoading(false);
        return;
      }
      if (!passwordsMatch) {
        setError(t("register.passwordMismatch", "Passwords do not match"));
        setIsLoading(false);
        return;
      }

      console.log("Sending registration request:", {
        username: name,
        phoneNumber: "+977" + phone,
        password
      });

      const response = await API.post("/api/auth/register", {
        username: name,
        phoneNumber: "+977" + phone,
        password
      });

      console.log("Registration successful:", response.data);
      
      // Save registration data
      setStepData({ name, phoneNumber: "+977" + phone });
      
      setStatus("success");
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setStatus("fail");
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t("register.genericError", "Something went wrong. Try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8 flex items-center justify-center relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label={t("register.back")}
        className="absolute top-4 left-4 p-2 rounded-full hover:scale-110 transition-transform duration-200"
      >
        <img src="/icons/back.png" alt="Back" className="w-8 h-8 object-contain" />
      </button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/assets/logo.png" alt="Logo" className="h-12" onClick={() => navigate("/")} />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-700">{t("register.title", "Create an account")}</h1>
          <p className="text-sm text-gray-500 mt-2">{t("register.subtitle", "Welcome! Please enter your details")}</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="bg-white p-6 rounded-xl shadow-xl space-y-5 transition-shadow hover:shadow-2xl">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t("register.name", "Full Name")}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("register.namePlaceholder", "Your Name")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t("register.phone", "Phone Number")}</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
              <span className="text-sm text-gray-600 mr-2">+977</span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9800000000"
                maxLength={10}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("register.password", "Password")}</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("register.passwordPlaceholder", "Minimum 8 characters")}
                className="flex-1 outline-none text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-gray-600 ml-2">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{t("register.confirmPassword", "Confirm Password")}</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("register.confirmPasswordPlaceholder", "Re-enter password")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Password Note */}
          <p className="text-xs text-gray-500">✅ {t("register.passwordNote", "Password must be at least 8 characters")}</p>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex justify-center items-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("register.loading", "Processing...")}
              </>
            ) : (
              t("register.signup", "Sign Up")
            )}
          </motion.button>

          {/* Success */}
          {status === "success" && <p className="text-green-600 text-sm mt-2">{t("register.success", "Account created! Redirecting...")}</p>}
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-700">
          {t("register.haveAccount", "Already have an account?") + " "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/signin")}>
            {t("register.login", "Log in")}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
