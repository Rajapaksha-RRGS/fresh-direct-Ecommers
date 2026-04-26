import mongoose, { Document, Model, Schema } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IProduct extends Document {
  farmerId: mongoose.Types.ObjectId; // Reference to User (Farmer)
  name: string;
  category: "vegetables" | "fruits" | "herbs" | "grains" | "other";
  description: string;
  unit: string; // e.g. "kg", "bunch", "piece"
  images: string[]; // Array of image URLs
  status: "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK";
  tags?: string[];

  // --- Dynamic Pricing & Analytics Fields ---
  basePrice: number; // ගොවියා ඉල්ලන අවම මිල (Price Floor)
  currentPrice: number; // පද්ධතිය මගින් ගණනය කරන සජීවී මිල (Live Price)
  stockQty: number; // දැනට පවතින සැපයුම (Current Supply)
  demandScore: number; // ඉල්ලුම මනින දර්ශකය (Popularity/Demand Score)
  totalViews: number; // කී දෙනෙක් මේ භාණ්ඩය බැලුවාද?
  totalSold: number; // මේ දක්වා විකුණා ඇති මුළු ප්‍රමාණය

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
    unit: {
      type: String,
      required: [true, "Unit is required"],
      default: "kg",
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "OUT_OF_STOCK"],
      default: "PENDING",
    },
    tags: {
      type: [String],
      default: [],
    },

    // --- Pricing & Market Logic ---
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    currentPrice: {
      type: Number,
      required: [true, "Current price is required"],
      min: [0, "Current price cannot be negative"],
      
    },
    stockQty: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    demandScore: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
ProductSchema.index({ farmerId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

// ─── Pre-save Hook (Initial Price Set) ────────────────────────────────────────
// මුලින්ම product එකක් හදද්දී currentPrice එක basePrice එකට සමාන කරනවා
ProductSchema.pre("save", async function () {
  if (this.isNew) {
    this.currentPrice = this.basePrice;
  }
});

// ─── Model ────────────────────────────────────────────────────────────────────
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;