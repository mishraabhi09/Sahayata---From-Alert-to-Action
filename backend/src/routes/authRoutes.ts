import { Router } from "express";
import {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getUserById,
  getAllUsersAroundLocation,
  uploadImage,
  verifyUser,
  updateUserRole,
  deleteUser,
  updateProfilePhoto,
  removeProfilePhoto,
} from "../controllers/authController";

import authenticateToken from "../middlewares/authenticateToken";
import requireAdmin from "../middlewares/requireAdmin";
import User from "../models/userModel";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

router.get("/verify", authenticateToken, verifyUser);
router.get("/users/:id", getUserById);
router.get("/users/around", getAllUsersAroundLocation);

// Profile Photo Management
router.put("/profile/photo", authenticateToken, uploadImage, updateProfilePhoto);
router.delete("/profile/photo", authenticateToken, removeProfilePhoto);

// ✅ Admin-only routes
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/users/:id/role", authenticateToken, requireAdmin, updateUserRole);
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);

export default router;
