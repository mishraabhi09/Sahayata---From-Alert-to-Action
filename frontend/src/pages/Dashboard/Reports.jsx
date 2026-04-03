// ReportForm.jsx (Enhanced with UI & Animations)
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocalGovernment } from "../../hooks/useLocalGovernment";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import API from "../../api/axios";

const ReportForm = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mediaSource, setMediaSource] = useState("");

  const fileInputRef = useRef(null);
  const localGov = useLocalGovernment();

  const tags = [
    "fire",
    "flood",
    "landslide",
    "accident",
    "garbage",
    "relief",
    "other",
  ];

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setError(t("report.locationError"));
      },
      { enableHighAccuracy: true }
    );
  };

  const handleMediaCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Check if file was recently created (likely from camera)
    const now = Date.now();
    const timeDiff = now - file.lastModified;
    const isCameraPhoto = timeDiff < 10000; // Increased to 10 seconds for better detection

    setMediaSource(isCameraPhoto ? "camera" : "gallery");
    setMediaFile(file);
    setError(''); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!location) {
      getLocation();
      setError(t("report.locationFetching"));
      return;
    }
    if (!mediaFile) {
      setError(t("report.mediaRequired"));
      return;
    }
    if (!description || description.length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }
    if (!tag || !tags.includes(tag)) {
      setError("Invalid type selected.");
      return;
    }

    const formData = new FormData();
    formData.append("type", tag);
    formData.append("description", description);
    formData.append("location", JSON.stringify([location.lat, location.lng]));
    formData.append("image", mediaFile);

    setLoading(true);
    try {
      const response = await API.post("/api/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status !== 201) throw new Error(t("report.submitError"));
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setLocation(null);
      setMediaFile(null);
      setDescription("");
      setTag("");
      setMediaSource("");
    } catch (err) {
      console.error("❌ Report error:", err);
      const errorMessage = err.response?.data?.message || err.message || t("report.submitError");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-gray-800 min-h-screen px-4 pt-4 pb-24 md:pb-8 max-w-xl mx-auto transition-colors duration-300">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Location */}
          <div className="text-center">
            <button
              onClick={getLocation}
              type="button"
              className="bg-[#0047AB] text-white font-medium px-5 py-2 rounded-full flex items-center justify-center mx-auto"
            >
              <img
                src="/icons/location.svg"
                alt="location"
                className="w-4 h-4 mr-2"
              />
              {t("report.getLocation")}
            </button>
            {location && (
              <p className="text-xs text-green-600 mt-1">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Media Upload */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => fileInputRef.current.click()}
            className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg cursor-pointer overflow-hidden border border-gray-300 dark:border-gray-600"
          >
            {mediaFile ? (
              <img
                src={URL.createObjectURL(mediaFile)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img src="/icons/camera.png" alt="Upload" className="w-20 h-16" />
            )}
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            capture="environment"
            onChange={handleMediaCapture}
            className="hidden"
          />

          {mediaFile && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs text-center mb-3 ${
                mediaSource === "camera" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {mediaSource === "camera"
                ? t("report.photoReady")
                : "Gallery photo selected - Ready to submit!"}
            </motion.p>
          )}

          {/* Description */}
          <div className="mb-2">
            <label className="block mb-1 font-medium dark:text-gray-200">
              {t("report.description")}
            </label>
            <textarea
              placeholder={t("report.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tag Select */}
          <div className="mb-2">
            <label className="block mb-1 font-medium dark:text-gray-200">
              {t("report.selectAuthority")}
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("report.selectOption")}</option>
              {tags.map((tagName) => (
                <option key={tagName} value={tagName}>
                  {t(`incidentTypes.${tagName.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 text-center mb-1"
              >
                {error}
              </motion.p>
            )}
            {submitted && (
              <motion.p
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-green-600 text-center mb-1"
              >
                {t("report.success")}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full text-white py-2 rounded-md font-semibold text-lg transition-colors duration-200 ${
              loading ? "bg-gray-400" : "bg-[#e9403e] hover:bg-[#d82e2c]"
            }`}
          >
            {loading ? t("report.submitting") + "..." : t("report.submit")}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportForm;
