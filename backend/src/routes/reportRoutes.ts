import { Router } from "express";
import {
  createReport,
  verifyReport,
  getAllReports,
  getReportById,
  getAllReportLocations,
  changeReportStatus,
  deleteReport,
  updateReport,
} from "../controllers/reportController";
import { uploadImage } from "../controllers/authController";
import authenticateToken from "../middlewares/authenticateToken";

const router = Router();

router.post("/", uploadImage, createReport);
router.put("/verify/:id", authenticateToken, verifyReport);
router.get("/", getAllReports);
router.get("/locations", getAllReportLocations);
router.get("/:id", getReportById);
router.put("/:id/status", changeReportStatus);
router.delete("/:id", authenticateToken, deleteReport);
router.put("/:id", authenticateToken, updateReport);

export default router;
