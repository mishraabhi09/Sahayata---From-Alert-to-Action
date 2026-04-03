import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";

const CreateAlertModal = ({ open, onClose, onAlertCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("other");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !location) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/alerts", {
        title,
        description,
        type,
        location,
      });
      if (response.status === 201) {
        onAlertCreated(response.data);
        setTitle("");
        setDescription("");
        setType("other");
        setLocation("");
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to broadcast the alert."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col border dark:border-gray-700"
        >
          <div className="bg-[#155ac1] dark:bg-gray-900 px-4 py-3 flex justify-between items-center text-white border-b dark:border-gray-700">
            <h2 className="text-lg font-bold">Broadcast New Alert</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-red-300 font-bold text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 text-sm rounded border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-gray-200">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fire in Bhaktapur"
                className="w-full border dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-gray-200">
                Location Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ward 5, Suryabinayak"
                className="w-full border dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-gray-200">
                Emergency Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fire">Fire</option>
                <option value="flood">Flood</option>
                <option value="police">Police</option>
                <option value="landslide">Landslide</option>
                <option value="accident">Accident</option>
                <option value="other">Other / Relief</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-gray-200">
                Message / Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Evacuation details, instructions, etc."
                rows="3"
                className="w-full border dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-semibold rounded py-2 transition-colors ${
                  loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? "Broadcasting..." : "📢 Broadcast Alert Now"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateAlertModal;
