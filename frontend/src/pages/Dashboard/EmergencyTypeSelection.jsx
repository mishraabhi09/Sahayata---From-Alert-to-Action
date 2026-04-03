import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocalGovStore } from "../../stores/localGovStore";

const emergencyTypes = [
  { type: "fire", phone: "101", icon: "/icons/fire-red.svg", labelKey: "emergency.fire" },
  { type: "police", phone: "100", icon: "/icons/police-red.svg", labelKey: "emergency.police" },
  { type: "flood", phone: "1149", icon: "/icons/flood-red.svg", labelKey: "emergency.flood" },
  { type: "accident", phone: "102", icon: "/icons/accident-red.svg", labelKey: "emergency.accident" },
  { type: "landslide", phone: "1149", icon: "/icons/landslide-red.svg", labelKey: "emergency.landslide" },
  { type: "other", phone: "100", icon: "/icons/others-red.svg", labelKey: "emergency.other" },
];

const EmergencyTypeSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { localGov } = useLocalGovStore();

  const handleSelect = (type) => {
    navigate(`/dashboard/${localGov}/${type}`);
  };

  return (
    <motion.div
      className="relative min-h-screen bg-[#f4f7fe] text-gray-800 px-4 pt-4 pb-24 md:pb-8 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label={t("register.back")}
          className="absolute top-[-1] left-[-2px] p-2"
        >
          <motion.img
            src="/icons/back.png"
            alt="Back"
            className="w-8 h-8 object-contain cursor-pointer hover:scale-110 transition-transform duration-200"
            whileHover={{ scale: 1.1 }}
          />
        </button>
        <h2 className="text-lg font-semibold mx-auto">
          {t("selectEmergencyType")}
        </h2>
      </motion.div>

      {/* Emergency grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {emergencyTypes.map(({ type, phone, icon, labelKey }, index) => (
          <motion.div
            key={type}
            className="bg-white rounded-xl shadow hover:shadow-md transition flex flex-col overflow-hidden"
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 10 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Primary Action: Direct Call */}
            <a 
              href={`tel:${phone}`}
              className="px-4 py-6 flex flex-col items-center justify-center flex-1 cursor-pointer group"
            >
              <motion.img
                src={icon}
                alt={type}
                className="w-20 h-20 mb-3 group-hover:scale-110 transition-transform"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
              <span className="text-sm font-bold text-gray-800 text-center uppercase tracking-wide">
                {t(labelKey)}
              </span>
              <span className="text-xs font-semibold text-red-600 mt-1 bg-red-50 px-2 py-0.5 rounded-full">
                Call {phone}
              </span>
            </a>

            {/* Secondary Action: Digital Report */}
            <button 
              onClick={() => handleSelect(type)}
              className="bg-gray-50 border-t w-full py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Report Digitally ➔
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EmergencyTypeSelection;
