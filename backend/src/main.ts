// import express from "express";
// import connectDB from "./config/db";
// import authRoutes from "./routes/authRoutes";
// import alertRoutes from "./routes/alertRoutes";
// import reportRoutes from "./routes/reportRoutes";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// const app = express();

// dotenv.config();
// // Middleware
// app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // Serve static files from the uploads directory
// app.use(cors({
//    origin: [process.env.CLIENT_URL || "http://localhost:5173"], // frontend dev server
//   credentials: true 
// })); // Apply CORS middleware with the configuration
// app.use(express.json());
// app.use(cookieParser());
// app.use("/api/auth", authRoutes);

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api", reportRoutes);
// app.use("/api/alerts", alertRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

// Import other modules after env config
import connectDB from "./config/db";
import "./config/cloudinary"; // Initialize Cloudinary config
import authRoutes from "./routes/authRoutes";
import alertRoutes from "./routes/alertRoutes";
import reportRoutes from "./routes/reportRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // Serve static files

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);

// Start server after DB connection
const PORT = Number(process.env.PORT) || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit with failure
  });

