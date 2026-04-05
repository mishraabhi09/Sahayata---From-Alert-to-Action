import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import usePreferences from "../../stores/UsePreference.jsx";
import { useNavigate } from "react-router-dom";
import useAuth from "../../stores/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalGovStore } from "../../stores/localGovStore";
import API from "../../api/axios";
import { useRef } from "react";

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "tween",
      duration: 0.35,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "tween",
      duration: 0.25,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const ProfileDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { localGov } = useLocalGovStore();
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    citizenshipId: "",
    address: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    language,
    setLanguage,
  } = usePreferences();

  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const autoLogin = useAuth((state) => state.autoLogin);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/welcome");
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPendingRemove(false);
    setShowPhotoOptions(false);
  };

  const handleSetRemovePending = () => {
    setPendingRemove(true);
    setPendingFile(null);
    setPreviewUrl(null);
    setShowPhotoOptions(false);
  };

  const handleCancelChanges = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    setPendingRemove(false);
  };

  const handleSaveChanges = async () => {
    setIsSavingPhoto(true);
    try {
      if (pendingRemove) {
        await API.delete("/api/auth/profile/photo");
      } else if (pendingFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("image", pendingFile);
        await API.put("/api/auth/profile/photo", formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      await autoLogin(); // Refresh user data locally and globally
      setPendingFile(null);
      setPreviewUrl(null);
      setPendingRemove(false);
    } catch (error) {
      console.error("Failed to update photo:", error);
      alert("Failed to update profile photo.");
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleEditProfileToggle = () => {
    if (!isEditing && user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        gender: user.gender || "",
        citizenshipId: user.citizenshipId || "",
        address: user.address || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await API.put("/api/auth/profile", formData);
      await autoLogin(); // Re-fetch user to reflect changes
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile details:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 bg-gray-500 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            className="fixed top-0 right-0 h-full w-[90vw] sm:w-[380px] bg-white dark:bg-gray-900 z-50 shadow-lg flex flex-col transition-colors duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 shrink-0">
              <button
                onClick={onClose}
                aria-label={t("profile.back")}
                className="text-2xl text-gray-700 dark:text-gray-200"
              >
                ←
              </button>
              <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
              <span className="w-6" />
            </div>

            {/* Content */}
            <motion.div
              className="overflow-y-auto p-4 space-y-4 text-sm text-gray-800 dark:text-gray-200 flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* User Info */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full relative bg-cover bg-center bg-no-repeat cursor-pointer shadow border-2 border-transparent hover:border-gray-200 transition-all z-10"
                    onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                    style={{
                      backgroundImage: `url(${
                        previewUrl
                          ? previewUrl
                          : pendingRemove
                          ? '/assets/dummy/krishna.jpg' 
                          : user?.image_url || '/assets/dummy/krishna.jpg'
                      })`,
                      opacity: pendingRemove ? 0.5 : 1
                    }}
                  >
                    <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition border dark:border-gray-600">
                      ✏️
                    </button>
                  </div>
                  
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  
                  {/* Photo Edit Dropdown */}
                  <AnimatePresence>
                    {showPhotoOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-[102px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-1 w-36 text-sm z-[100] border dark:border-gray-700"
                      >
                        <button 
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition"
                          onClick={() => {
                            setShowPhotoOptions(false);
                            if (fileInputRef.current) {
                               fileInputRef.current.click();
                            }
                          }}
                        >
                          📷 Change Photo
                        </button>
                        {(user?.image_url || pendingFile) && !pendingRemove && (
                          <button 
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 transition"
                            onClick={handleSetRemovePending}
                          >
                            🗑️ Remove Photo
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Save / Cancel Photo Buttons */}
                <AnimatePresence>
                  {(pendingFile || pendingRemove) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 mt-4"
                    >
                      <button 
                        onClick={handleSaveChanges}
                        disabled={isSavingPhoto}
                        className="px-4 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition flex items-center justify-center min-w-[80px]"
                      >
                        {isSavingPhoto ? (
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button 
                        onClick={handleCancelChanges}
                        disabled={isSavingPhoto}
                        className="px-4 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="mt-2 text-lg font-bold dark:text-white">
                  {user?.username || "Guest"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {user?.role || "Not logged in"}
                </p>
                <p className="text-sm dark:text-gray-300">
                  📍 {localGov || "Detecting your local government..."}
                </p>
              </motion.div>

              {user && (
                <motion.div
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">User Details</h3>
                    <button 
                      onClick={handleEditProfileToggle} 
                      className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                    >
                      {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </button>
                  </div>

                  {isEditing ? (
                    <motion.div className="space-y-3" initial={{opacity:0}} animate={{opacity:1}}>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Username</label>
                        <input name="username" value={formData.username} onChange={handleProfileChange} className="w-full text-sm p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number (Read-only)</label>
                        <input value={user.phoneNumber || ""} disabled className="w-full text-sm p-1.5 border rounded bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
                        <input name="email" value={formData.email} onChange={handleProfileChange} className="w-full text-sm p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleProfileChange} className="w-full text-sm p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Citizenship ID</label>
                        <input name="citizenshipId" value={formData.citizenshipId} onChange={handleProfileChange} className="w-full text-sm p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Address</label>
                        <input name="address" value={formData.address} onChange={handleProfileChange} className="w-full text-sm p-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition"
                        >
                          {isSavingProfile ? "Saving..." : "Save Details"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {[
                        { label: t("profile.phone"), value: user.phoneNumber },
                        { label: t("profile.email"), value: user.email },
                        { label: t("profile.gender"), value: user.gender },
                        { label: t("profile.citizenship"), value: user.citizenshipId },
                        { label: t("profile.address"), value: user.address },
                      ].map((info, idx) => (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, y: 5 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <InfoRow label={info.label} value={info.value || "N/A"} />
                        </motion.div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}

              {/* Preferences */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                <SelectRow
                  label={t("profile.language")}
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: "en", label: "English" },
                    { value: "ne", label: "नेपाली" },
                    { value: "hi", label: "हिन्दी" },
                    { value: "kn", label: "ಕನ್ನಡ" },
                    { value: "bn", label: "বাংলা" },
                  ]}
                />
                <SelectRow
                  label={t("profile.fontSize")}
                  value={fontSize}
                  onChange={setFontSize}
                  options={[
                    { value: "sm", label: "Small" },
                    { value: "base", label: "Default" },
                    { value: "lg", label: "Large" },
                    { value: "xl", label: "Extra Large" },
                  ]}
                />
                <SelectRow
                  label={t("profile.fontFamily")}
                  value={fontFamily}
                  onChange={setFontFamily}
                  options={[
                    { value: "poppins", label: "Poppins" },
                    { value: "arial", label: "Arial" },
                    { value: "sans", label: "Sans" },
                    { value: "serif", label: "Serif" },
                    { value: "mono", label: "Monospace" },
                    { value: "montserrat", label: "Montserrat" },
                  ]}
                />
                <label className="block text-sm font-medium">
                  {t("profile.theme")}
                  <button
                    onClick={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                    className="block w-full bg-gray-100 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded py-1 mt-1"
                  >
                    {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
                  </button>
                </label>
              </div>

              {/* Community Text */}
              <motion.div
                className="bg-white dark:bg-gray-800 text-center text-md font-medium p-3 rounded-lg shadow border dark:border-gray-700"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🤝 {t("profile.community")}
              </motion.div>

              {/* Admin Button */}
              {user?.role === "admin" && (
                <motion.div
                  className="text-center mt-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/admin");
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    🛠 Admin Dashboard
                  </button>
                </motion.div>
              )}

              {/* Auth Button */}
              <motion.div
                className="text-center mt-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
                  >
                    {t("auth.logout") || "Logout"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/welcome");
                    }}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                  >
                    {t("auth.login") || "Login"}
                  </button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="dark:text-gray-200">{value}</span>
  </div>
);

const SelectRow = ({ label, value, onChange, options }) => (
  <label className="block text-sm font-medium">
    {label}
    <select
      className="w-full mt-1 border dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

export default ProfileDrawer;
