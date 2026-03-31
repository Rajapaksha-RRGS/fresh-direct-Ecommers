import mongoose, { Document, Model, Schema } from "mongoose";

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IReview extends Document {
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;    // Must have purchased to review
  rating: number;                      // 1 - 5 stars
  comment?: string;
  isVerified: boolean;                 // Verified purchase
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const ReviewSchema = new Schema<IReview>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,   // Linked to a real order = verified
    },
  },
  {
    timestamps: true,
  }
);

// ─── Prevent duplicate reviews per product per customer ───────────────────────
ReviewSchema.index({ customerId: 1, productId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ rating: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────
const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
