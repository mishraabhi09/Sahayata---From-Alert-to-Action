import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://abhimish1611_db_user:SgUGOgst82i5R7Bf@cluster1.ebqnlzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
