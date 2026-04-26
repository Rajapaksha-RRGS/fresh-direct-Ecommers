import mongoose, { Document, Model, Schema } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  /** National Identity Card — stored on farmers (unique, sparse) */
  nic?: string;
  /** Mobile number — stored on farmers (unique, sparse) */
  mobile?: string;
  role: "CUSTOMER" | "FARMER" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Never return password in queries by default
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    nic: {
      type: String,
      trim: true,
      sparse: true, // unique only when defined
      unique: true,
    },
    mobile: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "FARMER", "ADMIN"],
      default: "CUSTOMER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Auto createdAt & updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// NOTE: email, nic, mobile are already unique: true in schema definition,
// so no need to add them again here (prevents duplicate index warnings)
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

