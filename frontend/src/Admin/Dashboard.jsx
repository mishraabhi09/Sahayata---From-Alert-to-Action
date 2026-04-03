import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { motion } from "framer-motion";
import API from "../api/axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reportRes, userRes, alertRes] = await Promise.all([
          API.get("/api/reports"),
          API.get("/api/auth/users"),
          API.get("/api/alerts"),
        ]);
        setReports(reportRes.data);
        setUsers(userRes.data);
        setAlerts(alertRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, []);

  const totalReports = reports.length;
  const totalUsers = users.length;
  const totalAlerts = alerts.length;

  const reportStatusCounts = {
    pending: 0,
    verified: 0,
    solved: 0,
    working: 0,
  };
  const reportTypeCounts = {};
  reports.forEach((r) => {
    reportStatusCounts[r.status] = (reportStatusCounts[r.status] || 0) + 1;
    reportTypeCounts[r.type] = (reportTypeCounts[r.type] || 0) + 1;
  });

  const userRoleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const alertsByDate = alerts.reduce((acc, alert) => {
    const date = new Date(alert.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const alertDates = Object.keys(alertsByDate);
  const alertCounts = Object.values(alertsByDate);

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Admin Dashboard
        </h1>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {[
          { label: "Total Reports", count: totalReports },
          { label: "Pending Reports", count: reportStatusCounts.pending },
          { label: "Verified Reports", count: reportStatusCounts.verified },
          { label: "Solved Reports", count: reportStatusCounts.solved },
          { label: "Working Reports", count: reportStatusCounts.working },
          { label: "Total Users", count: totalUsers },
          { label: "Total Alerts", count: totalAlerts },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="text-sm text-gray-500">{card.label}</div>
            <div className="text-2xl font-semibold text-indigo-700">
              {card.count}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart for Report Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold mb-3">Reports by Status</h2>
          <Pie
            data={{
              labels: Object.keys(reportStatusCounts),
              datasets: [
                {
                  data: Object.values(reportStatusCounts),
                  backgroundColor: [
                    "#facc15", // yellow
                    "#3b82f6", // blue
                    "#10b981", // green
                    "#a855f7", // purple
                  ],
                },
              ],
            }}
          />
        </motion.div>

        {/* Bar Chart for Report Types */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold mb-3">Reports by Type</h2>
          <Bar
            data={{
              labels: Object.keys(reportTypeCounts),
              datasets: [
                {
                  label: "Reports",
                  data: Object.values(reportTypeCounts),
                  backgroundColor: "#6366f1",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </motion.div>

        {/* Pie Chart for User Roles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-5 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold mb-3">Users by Role</h2>
          <Pie
            data={{
              labels: Object.keys(userRoleCounts),
              datasets: [
                {
                  data: Object.values(userRoleCounts),
                  backgroundColor: ["#f87171", "#60a5fa", "#34d399"],
                },
              ],
            }}
          />
        </motion.div>

        {/* Line Chart for Alerts Over Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-5 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold mb-3">Alerts Over Time</h2>
          <Line
            data={{
              labels: alertDates,
              datasets: [
                {
                  label: "Alerts",
                  data: alertCounts,
                  borderColor: "#f59e0b",
                  backgroundColor: "rgba(251, 191, 36, 0.2)",
                  tension: 0.3,
                },
              ],
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
