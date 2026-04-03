import { Navigate } from "react-router-dom";
import useAuth from "../stores/useAuth"; // adjust if path differs
import { useEffect, useState } from "react";

export default function RequireAdmin({ children }) {
  const user = useAuth((state) => state.user);
  const autoLogin = useAuth((state) => state.autoLogin);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    autoLogin().finally(() => setLoading(false));
  }, [autoLogin]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/admin-signin" />;
  if (user.role !== "admin") return <Navigate to="/unauthorized" />;

  return children;
}
