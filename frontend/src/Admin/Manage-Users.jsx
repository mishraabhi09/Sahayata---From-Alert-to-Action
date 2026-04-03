import { useEffect, useState } from "react";
import API from "../api/axios";
import { Trash2, Shield, Search } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ visible: false, action: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/auth/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!modal.action) return;
    await modal.action();
    setModal({ visible: false, action: null });
  };

  const confirmAction = (message, action) => {
    setModal({ visible: true, message, action });
  };

  const handleRoleChange = (userId, newRole) => {
    confirmAction(
      `Are you sure you want to make this user ${newRole}?`,
      async () => {
        try {
          await API.put(`/api/auth/users/${userId}/role`, { role: newRole });
          setUsers((prev) =>
            prev.map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );
          setFilteredUsers((prev) =>
            prev.map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );
          toast.success("Role updated successfully");
        } catch (err) {
          console.error("Failed to update role", err);
          toast.error("Failed to update role");
        }
      }
    );
  };

  const handleDeleteUser = (id) => {
    confirmAction("Are you sure you want to delete this user?", async () => {
      try {
        await API.delete(`/api/auth/users/${id}`);
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setFilteredUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        console.error("Failed to delete user", err);
        toast.error("Failed to delete user");
      }
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredUsers(
      users.filter(
        (u) =>
          u.username?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.phoneNumber?.toLowerCase().includes(query)
      )
    );
  };

  return (
    <>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Manage Users
          </h1>
        </div>

        <div className="flex items-center bg-white border rounded-md px-3 py-1.5 shadow-sm">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, email or phone"
            className="outline-none text-sm"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="overflow-x-auto bg-white rounded-2xl shadow-lg ring-1 ring-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Name", "Email", "Phone", "Role", "Actions"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-indigo-50/20 transition duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        <Shield size={14} />
                        {user.role === "admin" ? "Make User" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirmation
              </h2>
              <p className="text-sm text-gray-600 mb-6">{modal.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModal({ visible: false, action: null })}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
