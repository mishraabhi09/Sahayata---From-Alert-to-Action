// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:ml-0 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminLayout;
