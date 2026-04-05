import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string; // In production, hash this with bcrypt
  phoneNumber?: number;
  email?: string;
  gender?: string;
  citizenshipId?: string;
  address?: string;
  role: "user" | "admin";
  location?: {
    type: string;
    coordinates: [number, number];
  };
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  email: { type: String },
  gender: { type: String },
  citizenshipId: { type: String },
  address: { type: String },
  image_url: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

// Create a 2dsphere index for geospatial queries
UserSchema.index({ location: "2dsphere" });

export default mongoose.model<IUser>("User", UserSchema);
