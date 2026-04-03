import React, { useState } from "react";
import axios from "axios";

const ReportDetailModal = ({ report, onClose, onStatusChange }) => {
  if (!report) return null;
  const [status, setStatus] = useState(report.status || "pending");
  const [loading, setLoading] = useState(false);

  const statusOptions = ["pending", "working", "resolved", "rejected"];

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/reports/${report._id || report.id}/status`, { status });
      if (onStatusChange) onStatusChange();
      onClose();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center font-sans">
      <div className="bg-white w-full max-w-md mx-2 rounded-xl p-5 overflow-y-auto max-h-[90vh] shadow-xl space-y-4">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>

        {/* Report Summary Section */}
        <div className="flex border-2 border-blue-500 rounded-md p-4">
          {/* Left: Icon + Title */}
          <div className="flex gap-3 items-start">
            <img
              src={report.icon || "https://via.placeholder.com/40"}
              alt="Issue Icon"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-1">
                {report.title}
                <span className="ml-1 w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              </div>
              <div className="text-sm text-gray-600">
                {" "}
                {report.location?.coordinates
                  ? `Lat: ${report.location.coordinates[1].toFixed(
                      4
                    )}, Lng: ${report.location.coordinates[0].toFixed(4)}`
                  : "Location not available"}
              </div>

              <div className="flex gap-2 mt-2 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                  #{report.id}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                  {report.timeAgo}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Reporter Info */}
          <div className="text-sm text-right leading-relaxed">
            <div className="font-semibold underline text-gray-700 mb-1">
              Reported By:
            </div>
            <div>
              <b>Name:</b> {report.reporter?.name}
            </div>
            <div>
              <b>Phone:</b> {report.reporter?.phone}
            </div>
            <div>
              <b>Date:</b> {report.date}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="font-semibold text-gray-800 mb-1">Description</div>
          <div className="border-2 border-blue-500 rounded-md p-3 text-sm text-gray-700">
            {report.description}
          </div>
        </div>

        {/* Attachments */}
        <div>
          <div className="font-semibold text-gray-800 mb-1">Attachments</div>
          <div className="border-2 border-blue-500 rounded-md p-3 space-y-2">
            {report.attachments?.photo && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">realtime_img.jpg</span>
                <button className="bg-gray-200 text-sm px-4 py-1 rounded-full text-gray-700 hover:bg-gray-300">
                  View
                </button>
              </div>
            )}
            {report.attachments?.audio && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  realtime_audio.mp3
                </span>
                <button className="bg-gray-200 text-sm px-4 py-1 rounded-full text-gray-700 hover:bg-gray-300">
                  View
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real Time Location */}
        {report.mapImage && (
          <div>
            <div className="font-semibold text-gray-800 mb-1">
              Real Time Location
            </div>
            <div className="border-2 border-blue-500 rounded-md p-1">
              <img
                src={report.mapImage}
                alt="Map"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-800">Update Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-blue-600 outline-none text-white px-3 py-2 rounded-md text-sm cursor-pointer capitalize"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt} className="capitalize">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-full text-sm hover:bg-gray-400 disabled:opacity-50"
            disabled={loading}
          >
            Close
          </button>
          <button 
            onClick={handleUpdateStatus}
            disabled={loading || status === report.status}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
