import mongoose, { Document, Model, Schema } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IFarmerProfile extends Document {
  userId: mongoose.Types.ObjectId;   // Reference to User
  farmName: string;
  location: string;
  bio?: string;
  certifications?: string[];
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const FarmerProfileSchema = new Schema<IFarmerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
      maxlength: 150,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    certifications: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String, // URL (Cloudinary)
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin must verify farmer
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
FarmerProfileSchema.index({ userId: 1 });
FarmerProfileSchema.index({ isVerified: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────
const FarmerProfile: Model<IFarmerProfile> =
  mongoose.models.FarmerProfile ||
  mongoose.model<IFarmerProfile>("FarmerProfile", FarmerProfileSchema);

export default FarmerProfile;
