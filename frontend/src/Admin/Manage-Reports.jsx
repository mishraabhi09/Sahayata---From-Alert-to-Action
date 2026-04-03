import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/ReportEditModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks,
  Clock,
  ShieldCheck,
  Hammer,
  CheckCircle,
} from "lucide-react";

const REPORT_TYPES = [
  "fire",
  "police",
  "flood",
  "accident",
  "landslide",
  "other",
];
const STATUS_TYPES = ["pending", "verified", "solved", "working"];

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ status: "", type: "" });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get("/api/reports")
      .then((res) => {
        setReports(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Error loading reports", err));
  }, []);

  useEffect(() => {
    let data = [...reports];
    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.type) data = data.filter((r) => r.type === filters.type);
    setFiltered(data);
  }, [filters, reports]);

  const handleEdit = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleUpdate = (updatedReport) => {
    if (updatedReport.deleted) {
      setReports((prev) => prev.filter((r) => r._id !== updatedReport._id));
    } else {
      const updated = reports.map((r) =>
        r._id === updatedReport._id ? updatedReport : r
      );
      setReports(updated);
    }
    setShowModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Admin Reports Panel
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Total",
            color: "bg-gray-100 text-gray-800",
            count: reports.length,
            icon: <ListChecks size={24} />,
          },
          {
            label: "Pending",
            color: "bg-yellow-100 text-yellow-800",
            count: reports.filter((r) => r.status === "pending").length,
            icon: <Clock size={24} />,
          },
          {
            label: "Verified",
            color: "bg-blue-100 text-blue-800",
            count: reports.filter((r) => r.status === "verified").length,
            icon: <ShieldCheck size={24} />,
          },
          {
            label: "Working",
            color: "bg-purple-100 text-purple-800",
            count: reports.filter((r) => r.status === "working").length,
            icon: <Hammer size={24} />,
          },
          {
            label: "Solved",
            color: "bg-green-100 text-green-800",
            count: reports.filter((r) => r.status === "solved").length,
            icon: <CheckCircle size={24} />,
          },
        ].map(({ label, color, count, icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
            className={`rounded-xl p-4 shadow text-center ${color} flex flex-col items-center`}
          >
            <div className="mb-2">{icon}</div>
            <div className="text-sm font-medium">{label} Reports</div>
            <div className="text-2xl font-bold mt-1">{count}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md rounded-xl p-5 mb-8 flex flex-wrap gap-6 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Filter by Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border rounded-md w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {STATUS_TYPES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Filter by Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="p-2 border rounded-md w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {REPORT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setFilters({ status: "", type: "" })}
          className="ml-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md border border-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg ring-1 ring-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Type", "Status", "Description", "Location", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((report, i) => (
                    <motion.tr
                      key={report._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      className="hover:bg-indigo-50/20 transition duration-200 ease-in-out"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 flex items-center gap-2">
                        <img
                          src={`/icons/map-icons-red/${report.type}.svg`}
                          alt={report.type}
                          className="w-5 h-5"
                        />
                        <span className="capitalize">{report.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            report.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : report.status === "verified"
                              ? "bg-blue-100 text-blue-700"
                              : report.status === "working"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {report.description?.slice(0, 40)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {report.location?.coordinates?.[1]},{" "}
                        {report.location?.coordinates?.[0]}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(report)}
                          className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedReport && (
          <motion.div
            key="report-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <Modal
              report={selectedReport}
              onClose={() => setShowModal(false)}
              onUpdate={handleUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
