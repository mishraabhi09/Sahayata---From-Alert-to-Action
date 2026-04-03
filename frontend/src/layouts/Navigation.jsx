import { useState, useEffect, useRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import ProfileDrawer from "../pages/Dashboard/Profile";
import useAuth from "../stores/useAuth";
import { useLocalGovStore } from "../stores/localGovStore";

const NavigationLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { localGov } = useLocalGovStore();

  const user = useAuth((state) => state.user);

  const [prevScrollY, setPrevScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const currentPath = location.pathname;

  const underlineRef = useRef(null);
  const buttonRefs = useRef([]);

  const isActive = (path) => {
    if (path === "/home") {
      return currentPath === "/" || currentPath === "/dashboard/home";
    }
    return currentPath.includes(path);
  };

  const navItems = [
    { path: "/home", index: 0 },
    { path: "/reports", index: 1 },
    { path: "/map", index: 2 },
    { path: "/settings", index: 3 },
  ];

  const activeIndex =
    navItems.find((item) =>
      item.path !== "/settings" ? isActive(item.path) : false
    )?.index ?? (showProfileDrawer ? 3 : -1);

  // Move underline on activeIndex change (mobile bottom nav only)
  useEffect(() => {
    if (activeIndex >= 0 && buttonRefs.current[activeIndex]) {
      const button = buttonRefs.current[activeIndex];
      const rect = button.getBoundingClientRect();
      const parentRect = button.parentNode?.getBoundingClientRect();
      if (!parentRect) return;
      const left = rect.left - parentRect.left + rect.width / 2 - 10;
      if (underlineRef.current) {
        underlineRef.current.style.left = `${left}px`;
      }
    }
  }, [activeIndex]);

  // Auto hide/show nav on scroll (mobile)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowBottomNav(prevScrollY > currentScroll || currentScroll < 10);
      setPrevScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  const userName = user?.username || t("navigation.citizen");

  const sideNavItems = [
    { path: "/dashboard/home", icon: "/icons/home-icon.svg", labelKey: "navigation.home", matchPath: "/home" },
    { path: "/dashboard/reports", icon: "/icons/emergency-icon.svg", labelKey: "navigation.report", matchPath: "/reports" },
    { path: "/dashboard/map", icon: "/icons/location-icon.svg", labelKey: "navigation.map", matchPath: "/map" },
  ];

  return (
    <div className="relative min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full flex flex-col md:flex-row">
      {/* ===== DESKTOP SIDEBAR (md+) ===== */}
      <aside className="hidden md:flex flex-col bg-[#155ac1] dark:bg-slate-900 text-white w-64 min-h-screen fixed left-0 top-0 z-50 shadow-xl border-r dark:border-gray-800">
        {/* Logo & Brand */}
        <div
          className="flex items-center gap-3 px-5 py-5 border-b border-blue-400 cursor-pointer"
          onClick={() => navigate("/dashboard/home")}
        >
          <img src="/assets/logo.png" alt="Logo" className="w-11 h-11 rounded-full" />
          <div>
            <div className="font-extrabold text-base leading-tight">Sajilo Sahayata</div>
            <div className="text-xs text-blue-200 truncate max-w-[130px]">
              {localGov || "Detecting location..."}
            </div>
          </div>
        </div>

        {/* User greeting */}
        <div className="px-5 py-4 border-b border-blue-400">
          <p className="text-xs text-blue-200">{t("navigation.hello")},</p>
          <p className="font-semibold text-sm truncate">{userName}!</p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {sideNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive(item.matchPath)
                  ? "bg-yellow-300 text-blue-900 font-bold shadow"
                  : "text-white hover:bg-blue-500"
              }`}
            >
              <img src={item.icon} alt={t(item.labelKey)} className="w-6 h-6" />
              {t(item.labelKey)}
            </button>
          ))}

          {/* Settings/Profile */}
          <button
            onClick={() => setShowProfileDrawer(true)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              showProfileDrawer
                ? "bg-yellow-300 text-blue-900 font-bold shadow"
                : "text-white hover:bg-blue-500"
            }`}
          >
            <img src="/icons/setting-icon.svg" alt={t("navigation.settings")} className="w-6 h-6" />
            {t("navigation.settings")}
          </button>
        </nav>

        <div className="px-5 py-4 text-xs text-blue-300 border-t border-blue-400">
          © 2025 Sajilo Sahayata
        </div>
      </aside>

      {/* ===== CONTENT AREA ===== */}
      <div className="flex flex-col flex-1 md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* ===== MOBILE Top Navbar ===== */}
        <div className="md:hidden text-white bg-[#155ac1] dark:bg-slate-900 px-4 py-2 relative flex items-start justify-between border-b dark:border-gray-800">
          <div>
            <div className="text-lg font-extrabold">{t("navigation.hello")},</div>
            <div className="text-sm">{userName}!</div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-2 text-center">
            <p className="text-xs text-blue-100 max-w-[180px] truncate">
              {localGov || "Detecting location..."}
            </p>
          </div>
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => navigate("/dashboard/home")}
          />
        </div>

        {/* ===== DESKTOP Top Bar ===== */}
        <div className="hidden md:flex items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-3 shadow-sm transition-colors duration-300">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {localGov || "Detecting your local government..."}
          </div>
          <button
            onClick={() => setShowProfileDrawer(true)}
            className="flex items-center gap-2 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full px-4 py-1.5 text-sm text-blue-700 dark:text-blue-300 font-medium transition"
          >
            <img src="/icons/setting-icon.svg" alt="Profile" className="w-5 h-5" />
            {userName}
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 pt-1 pb-20 md:pb-4">
          <Outlet />
        </main>
      </div>

      {/* ===== MOBILE Bottom Navbar ===== */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#155ac1] dark:bg-slate-900 border-t dark:border-gray-800 shadow-md transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative flex items-center justify-around py-1 px-3">
          {/* Underline indicator */}
          <div
            ref={underlineRef}
            className="absolute bottom-0 h-1 bg-yellow-300 transition-all duration-300 ease-in-out"
            style={{ width: "20px", top: "45px", borderRadius: "40px" }}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[0] = el)}
            icon="/icons/home-icon.svg"
            label={t("navigation.home")}
            active={isActive("/home")}
            onClick={() => navigate("/dashboard/home")}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[1] = el)}
            icon="/icons/emergency-icon.svg"
            label={t("navigation.report")}
            active={isActive("/reports")}
            onClick={() => navigate("/dashboard/reports")}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[2] = el)}
            icon="/icons/location-icon.svg"
            label={t("navigation.map")}
            active={isActive("/map")}
            onClick={() => navigate("/dashboard/map")}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[3] = el)}
            icon="/icons/setting-icon.svg"
            label={t("navigation.settings")}
            active={showProfileDrawer}
            onClick={() => setShowProfileDrawer(true)}
          />
        </div>
      </nav>

      {/* Profile Drawer */}
      <ProfileDrawer
        open={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />
    </div>
  );
};

// NavButton with forwardRef (mobile only)
const NavButton = forwardRef(({ icon, label, active, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-1 transition duration-200 cursor-pointer hover:scale-110 ${
      active
        ? "text-yellow-300 scale-110 font-bold"
        : "text-white hover:text-red-500"
    }`}
  >
    <img src={icon} alt={label} className="w-9 h-9 sm:w-10 sm:h-10" />
    <span className="text-xs">{label}</span>
  </button>
));

export default NavigationLayout;
