import ReportCard from "../../components/ReportCard";
import SummaryCard from "../../components/SummaryCard";
import ProfileDrawer from "../../pages/Dashboard/Profile";
import ReportDetailModal from "../../components/ReportDetailModal";
import CreateAlertModal from "../../components/CreateAlertModal";

import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [report, setReport] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        const data = response.data;
        setReport(data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };
    fetchData();
  }, []);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Live analytics
  const inProgress = report.filter(r => r.status === "working" || r.status === "pending").length;
  const resolved = report.filter(r => r.status === "solved" || r.status === "verified").length;
  const rejected = report.filter(r => r.status === "rejected").length;

  const filteredReports = report.filter(r => 
    (r._id && r._id.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.type && r.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/reports");
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-0">
      <header className="w-full flex justify-between items-center mb-4 bg-[#155ac1] p-4 pl-16 md:pl-4 text-white rounded-md shadow">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAlertModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow transition"
          >
            📢 Broadcast Alert
          </button>
          <img src="/icons/admin-profile.png" alt="Profile" className="w-6 h-6 cursor-pointer" onClick={() => setShowProfileDrawer(true)} />
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 px-4">
        <SummaryCard count={report.length} label="Total Reports" />
        <SummaryCard count={inProgress} label="In Progress" />
        <SummaryCard count={resolved} label="Resolved" />
        <SummaryCard count={rejected} label="Rejected" />
      </div>

      <div className="px-4 mb-2 font-semibold text-gray-800">Incident Reports</div>

      <div className="px-4 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, Status, or Type"
          className="border text-sm w-full px-3 py-1.5 rounded-md text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <div className="px-4 pb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredReports.map((rep) => (
            <ReportCard
              key={rep._id}
              {...rep}
              onView={() => setSelectedReport(rep)}
            />
          ))}
        </div>
      </div>

      <button className="text-center w-full py-2 text-blue-700 text-sm">
        Load More ▼
      </button>

      <ProfileDrawer
        open={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />

      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusChange={fetchReports}
      />

      {/* Broadcast Alert Modal */}
      {showAlertModal && (
        <CreateAlertModal 
          open={showAlertModal} 
          onClose={() => setShowAlertModal(false)}
          onAlertCreated={(newAlert) => {
            alert(`Successfully broadcasted: ${newAlert.title}`);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
