import { Request, Response } from "express";
import Report from "../models/reportModel";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import cloudinary from "../config/cloudinary";

export const createReport = async (req: Request, res: Response) => {
  const allowedTypes = [
    "fire",
    "flood",
    "landslide",
    "accident",
    "garbage",
    "relief",
    "other",
  ];

  try {
    const { type, description, location } = req.body;
    
    console.log("📥 Report submission data:", { type, description, location, hasFile: !!req.file });

    if (!type || typeof type !== "string" || !allowedTypes.includes(type)) {
      console.log("❌ Invalid type:", type, "Allowed:", allowedTypes);
      return res.status(400).json({
        message: `Invalid type. It must be one of: ${allowedTypes.join(", ")}.`,
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.length < 10
    ) {
      return res.status(400).json({
        message:
          "Description must be a string and at least 10 characters long.",
      });
    }

    const parsedLocation = JSON.parse(location);
    if (!parsedLocation) {
      return res
        .status(400)
        .json({ message: "Location must be a valid JSON string." });
    }

    let imageUrl = "";
    let imageId = "";

    if (req.file) {
      console.log("📷 Processing file upload:", req.file.filename, req.file.path);
      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "reports",
        });

        imageUrl = uploadResult.secure_url;
        imageId = uploadResult.public_id;
        console.log("✅ File uploaded to Cloudinary:", imageUrl);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload failed:", uploadError);
        return res.status(400).json({ 
          message: "Image upload failed", 
          error: uploadError.message 
        });
      }
    }

    const report = new Report({
      type,
      description,
      location: { coordinates: parsedLocation },
      imageUrl,
      imageId,
    });

    await report.save();

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(400).json({ message: "Error creating report", error });
  }
};

export const verifyReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    report.status = "verified";
    report.verifiedBy = req.user.id;
    await report.save();
    res.json({ message: "Report verified", report });
  } catch (error) {
    res.status(400).json({ message: "Error verifying report", error });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: "Error fetching reports", error });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: "Error fetching report", error });
  }
};

dayjs.extend(relativeTime);

export const getAllReportLocations = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find(
      {},
      {
        location: 1,
        type: 1,
        _id: 1,
        createdAt: 1,
      }
    );
    const formattedReports = reports.map((report) => {
      return {
        id: report._id,
        title: `${
          report.type.charAt(0).toUpperCase() + report.type.slice(1)
        } reported`,
        type: report.type,
        lat: report.location.coordinates[0],
        lng: report.location.coordinates[1],
        time: dayjs(report.createdAt).fromNow(),
      };
    });
    console.log("Formatted Reports:", formattedReports);
    res.json(formattedReports);
  } catch (error) {
    res.status(400).json({ message: "Error fetching report locations", error });
  }
};

export const changeReportStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    report.status = status;
    await report.save();
    res.json({ message: "Report status updated", report });
  } catch (error) {
    res.status(400).json({ message: "Error updating report status", error });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Error deleting report", error });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, description, status, location } = req.body;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (type) report.type = type;
    if (description) report.description = description;
    if (status) report.status = status;
    if (location && Array.isArray(location)) {
      report.location.coordinates = location;
    }

    // ✅ Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (report.imageId) {
        await cloudinary.uploader.destroy(report.imageId);
      }

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "reports",
      });

      report.imageUrl = uploadResult.secure_url;
      report.imageId = uploadResult.public_id;
    }

    await report.save();

    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Error updating report", error });
  }
};
