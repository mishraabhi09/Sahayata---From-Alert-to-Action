import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, 
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Bell,
  Users,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: <Home size={18} /> },
    { label: "Dashboard", to: "/admin", icon: <LayoutDashboard size={18} /> },
    {
      label: "Manage Users",
      to: "/admin/manage-users",
      icon: <Users size={18} />,
    },
    {
      label: "Manage Reports",
      to: "/admin/manage-reports",
      icon: <FileText size={18} />,
    },
    {
      label: "Manage Alerts",
      to: "/admin/send-alerts",
      icon: <Bell size={18} />,
    },
    { label: "Logout", to: "/logout", icon: <LogOut size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white bg-gray-800 p-2 rounded shadow-lg"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 bg-gray-900 text-white flex flex-col transform transition-all duration-300 ease-in-out
        ${collapsed ? "md:w-16" : "md:w-64"}
        ${
          mobileOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!collapsed && (
              <h2 className="text-lg font-bold truncate">Admin Panel</h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white hidden md:block ml-auto"
              aria-label="Toggle collapse"
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 transition text-sm ${
                  location.pathname === item.to
                    ? "bg-gray-700 text-white font-semibold"
                    : "text-gray-300"
                }`}
                title={collapsed ? item.label : ""}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {!collapsed && (
            <p className="text-xs text-gray-500 p-4 border-t border-gray-700">
              © 2025 Sajilo Sahayata
            </p>
          )}
        </div>
      </aside>

      {/* Spacer for desktop - pushes main content */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      />
    </>
  );
}
