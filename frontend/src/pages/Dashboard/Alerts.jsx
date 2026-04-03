import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import API from "../../api/axios";

const Alerts = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await API.get("/api/alerts");
        setAlerts(response.data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertColor = (type) => {
    switch (type) {
      case "fire":
      case "accident":
      case "landslide":
        return "bg-red-100 text-red-800 border-red-400 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700";
      case "flood":
      case "police":
        return "bg-yellow-100 text-yellow-800 border-yellow-400 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700";
      case "other":
        return "bg-green-100 text-green-800 border-green-400 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";
    }
  };

  return (
    <div className="p-4 pb-24 md:pb-8 max-w-3xl mx-auto transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">{t("alerts.title")}</h2>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border-l-4 p-4 shadow-sm rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse h-24 border-gray-400 dark:border-gray-600"></div>
          ))
        ) : alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 dark:text-gray-400">{t("alerts.noAlerts") || "No active alerts."}</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className={`border-l-4 p-4 shadow-sm rounded-md ${getAlertColor(
                alert.type
              )}`}
            >
              <div className="flex flex-wrap justify-between items-start gap-1 mb-1">
                <h3 className="text-base sm:text-lg font-semibold">{alert.title}</h3>
                <span className="text-xs opacity-70 shrink-0">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium opacity-80 mb-1 capitalize border-b border-black/10 dark:border-white/10 pb-1 w-fit">{alert.type}</p>
              <p className="text-sm">{alert.description}</p>
              <div className="text-xs opacity-80 mt-2 flex items-center gap-1">
                📍 {alert.location}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
