import mongoose, { Document, Model, Schema } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IFarmerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  farmName: string;
  location: string;
  cropTypes: string[];
  bio?: string;
  certifications?: string[];
  profileImage?: string;
  isVerified: boolean;
  whatsappEnabled: boolean;
  bankDetails: {
    accountName: string;
    bank: string;
    branch: string;
    accountNumber: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  approvedAt: Date | null;
  approvedBy: mongoose.Types.ObjectId | null;
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
    cropTypes: {
      type: [String],
      required: [true, "At least one crop type is required"],
      default: [],
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
      type: String, // URL to Cloudinary / S3
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin must verify farmer
    },
    whatsappEnabled: {
      type: Boolean,
      default: false,
    },
    bankDetails: {
      accountName: { type: String, required: true, trim: true },
      bank:         { type: String, required: true, trim: true },
      branch:       { type: String, required: true, trim: true },
      accountNumber:{ type: String, required: true, trim: true },
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING", // අලුතින් register වෙද්දී auto වැටෙන අගය
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// NOTE: userId is already unique: true in schema definition,
// so no need to add it again here (prevents duplicate index warnings)
FarmerProfileSchema.index({ status: 1 });
FarmerProfileSchema.index({ isVerified: 1 });
FarmerProfileSchema.index({ createdAt: -1 }); // For sorting by newest first

// ─── Model ────────────────────────────────────────────────────────────────────
const FarmerProfile: Model<IFarmerProfile> =
  mongoose.models.FarmerProfile ||
  mongoose.model<IFarmerProfile>("FarmerProfile", FarmerProfileSchema);

export default FarmerProfile;
