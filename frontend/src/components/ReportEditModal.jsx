import React, { useState } from "react";
import API from "../api/axios";

const REPORT_TYPES = [
  "fire",
  "police",
  "flood",
  "accident",
  "landslide",
  "other",
];
const STATUS_TYPES = ["pending", "verified", "solved", "working"];

export default function ReportEditModal({ report, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    type: report.type,
    description: report.description,
    status: report.status,
    lat: report.location.coordinates[1],
    lng: report.location.coordinates[0],
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await API.delete(`/api/reports/${report._id}`);
      onClose();
      onUpdate({ _id: report._id, deleted: true }); // signal deletion
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const body = {
        type: formData.type,
        description: formData.description,
        status: formData.status,
        location: [parseFloat(formData.lng), parseFloat(formData.lat)],
      };

      await API.put(`/api/reports/${report._id}`, body);

      onUpdate({
        ...report,
        ...formData,
        status: formData.status,
        location: { coordinates: [formData.lng, formData.lat] },
      });
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000090] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Edit Report</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Longitude</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              {STATUS_TYPES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {report.imageUrl && (
              <img
                src={`http://localhost:3000/${report.imageUrl}`}
                alt="report"
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
