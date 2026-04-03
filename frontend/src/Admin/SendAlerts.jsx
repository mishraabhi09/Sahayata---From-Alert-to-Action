import { useEffect, useState } from "react";
import API from "../api/axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AlertModal from "../components/AlertModal";

export default function ManageAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/api/alerts");
      setAlerts(res.data);
    } catch (err) {
      toast.error("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      await API.delete(`/api/alerts/${id}`);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      toast.success("Alert deleted");
    } catch (err) {
      toast.error("Failed to delete alert");
    }
  };

  const handleModalOpen = (alert = null) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedAlert(null);
    setShowModal(false);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (selectedAlert) {
        const res = await API.put(`/api/alerts/${selectedAlert._id}`, data);
        setAlerts((prev) =>
          prev.map((a) => (a._id === selectedAlert._id ? res.data : a))
        );
        toast.success("Alert updated");
      } else {
        const res = await API.post("/api/alerts", data);
        setAlerts((prev) => [res.data, ...prev]);
        toast.success("Alert created");
      }
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      handleModalClose();
    }
  };

  return (
    <>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Manage Alerts
        </h1>
        <button
          onClick={() => handleModalOpen()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow text-sm"
        >
          <Plus size={16} /> Create Alert
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        className="overflow-x-auto bg-white rounded-2xl shadow-lg ring-1 ring-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Title", "Type", "Location", "Time", "Actions"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading alerts...
                </td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No alerts found.
                </td>
              </tr>
            ) : (
              alerts.map((alert, index) => (
                <motion.tr
                  key={alert._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-indigo-50/20 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {alert.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {alert.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {alert.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleModalOpen(alert)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(alert._id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AlertModal
        open={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={selectedAlert}
      />
    </>
  );
}
