import mongoose, { Document, Model, Schema } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IProduct extends Document {
  farmerId: mongoose.Types.ObjectId;      // Reference to User (Farmer)
  name: string;
  category: "vegetables" | "fruits" | "herbs" | "grains" | "other";
  description: string;
  basePrice: number;
  unit: string;                           // e.g. "kg", "bunch", "piece"
  stockQty: number;
  images: string[];                       // Array of image URLs
  status: "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK";
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const ProductSchema = new Schema<IProduct>(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer ID is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: ["vegetables", "fruits", "herbs", "grains", "other"],
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000,
    },
    basePrice: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],   // "kg", "bunch", "piece", "litre"
      default: "kg",
    },
    stockQty: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "OUT_OF_STOCK"],
      default: "PENDING",    // Admin must approve before going live
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
ProductSchema.index({ farmerId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" }); // Full-text search

// ─── Model ────────────────────────────────────────────────────────────────────
const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
