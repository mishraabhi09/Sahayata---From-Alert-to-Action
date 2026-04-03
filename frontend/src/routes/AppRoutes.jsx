// ✅ AppRoutes.jsx with Framer Motion page transitions
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Signin from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import AdminLogin from "../pages/Auth/AdminLogin";
import AdminSignup from "../pages/Auth/AdminSignup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Welcome from "../pages/Auth/Welcome";
import VerifyOTP from "../pages/Auth/VerifyOTP";
import DashboardHome from "../pages/Dashboard/Home";
import DashboardAlerts from "../pages/Dashboard/Alerts";
import DashboardReports from "../pages/Dashboard/Reports";
import MapPage from "../pages/Dashboard/MapPage";
import ReportForm from "../pages/Reports/ReportForm";
import Navigation from "../layouts/Navigation";
import Profile from "../pages/Dashboard/Profile";
import EmergencyTypeSelection from "../pages/Dashboard/EmergencyTypeSelection";

import Fire from "../contactInfo/Butwal/Fire";
import Police from "../contactInfo/Butwal/Police";
import Flood from "../contactInfo/Butwal/Flood";
import Landslide from "../contactInfo/Butwal/Landslide";
import Other from "../contactInfo/Butwal/Other";
import Accident from "../contactInfo/Butwal/Accident";

import TillotamaFire from "../contactInfo/Tillotama/Fire";
import TillotamaPolice from "../contactInfo/Tillotama/Police";
import TillotamaFlood from "../contactInfo/Tillotama/Flood";
import TillotamaLandslide from "../contactInfo/Tillotama/Landslide";
import TillotamaOther from "../contactInfo/Tillotama/Other";
import TillotamaAccident from "../contactInfo/Tillotama/Accident";

import OmsatiyaFire from "../contactInfo/Omsatiya/Fire";
import OmsatiyaPolice from "../contactInfo/Omsatiya/Police";
import OmsatiyaFlood from "../contactInfo/Omsatiya/Flood";
import OmsatiyaLandslide from "../contactInfo/Omsatiya/Landslide";
import OmsatiyaOther from "../contactInfo/Omsatiya/Other";
import OmsatiyaAccident from "../contactInfo/Omsatiya/Accident";

import SiddharthanagarFire from "../contactInfo/Siddharthanagar/Fire";
import SiddharthanagarPolice from "../contactInfo/Siddharthanagar/Police";
import SiddharthanagarFlood from "../contactInfo/Siddharthanagar/Flood";
import SiddharthanagarLandslide from "../contactInfo/Siddharthanagar/Landslide";
import SiddharthanagarOther from "../contactInfo/Siddharthanagar/Other";
import SiddharthanagarAccident from "../contactInfo/Siddharthanagar/Accident";

import AdminDashboard from "../Admin/Dashboard";
import ManageUsers from "../Admin/Manage-Users";
import ManageReports from "../Admin/Manage-Reports";
import SendAlerts from "../Admin/SendAlerts";
import RequireAdmin from "../Auth/RequireAdmin";
import Unauthorized from "../pages/Unauthorized";
import Logout from "../Auth/Logout";
import AdminLayout from "../layouts/AdminLayout";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public/Auth Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-signin" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

        {/* User Routes with Navigation layout */}
        <Route path="/dashboard" element={<Navigation />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="alerts" element={<DashboardAlerts />} />
          <Route path="reports" element={<DashboardReports />} />
          <Route path="map" element={<MapPage />} />
          <Route path="report" element={<ReportForm />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="emergency-type-selection"
            element={<EmergencyTypeSelection />}
          />
          <Route path="butwal/fire" element={<Fire />} />
          <Route path="butwal/police" element={<Police />} />
          <Route path="butwal/flood" element={<Flood />} />
          <Route path="butwal/landslide" element={<Landslide />} />
          <Route path="butwal/other" element={<Other />} />
          <Route path="butwal/accident" element={<Accident />} />

          <Route path="tillotama/fire" element={<TillotamaFire />} />
          <Route path="tillotama/police" element={<TillotamaPolice />} />
          <Route path="tillotama/flood" element={<TillotamaFlood />} />
          <Route path="tillotama/landslide" element={<TillotamaLandslide />} />
          <Route path="tillotama/other" element={<TillotamaOther />} />
          <Route path="tillotama/accident" element={<TillotamaAccident />} />

          <Route path="omsatiya/fire" element={<OmsatiyaFire />} />
          <Route path="omsatiya/police" element={<OmsatiyaPolice />} />
          <Route path="omsatiya/flood" element={<OmsatiyaFlood />} />
          <Route path="omsatiya/landslide" element={<OmsatiyaLandslide />} />
          <Route path="omsatiya/other" element={<OmsatiyaOther />} />
          <Route path="omsatiya/accident" element={<OmsatiyaAccident />} />

          <Route
            path="siddharthanagar/fire"
            element={<SiddharthanagarFire />}
          />
          <Route
            path="siddharthanagar/police"
            element={<SiddharthanagarPolice />}
          />
          <Route
            path="siddharthanagar/flood"
            element={<SiddharthanagarFlood />}
          />
          <Route
            path="siddharthanagar/landslide"
            element={<SiddharthanagarLandslide />}
          />
          <Route
            path="siddharthanagar/other"
            element={<SiddharthanagarOther />}
          />
          <Route
            path="siddharthanagar/accident"
            element={<SiddharthanagarAccident />}
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout /> 
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="send-alerts" element={<SendAlerts />} />
          <Route path="manage-reports" element={<ManageReports />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default AppRoutes;
