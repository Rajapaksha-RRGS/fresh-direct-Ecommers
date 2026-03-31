import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Sub-document Interface ───────────────────────────────────────────────────
export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  name: string;        // Price snapshot at order time
  image: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  subtotal: number;
}

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
  };
  paymentId?: mongoose.Types.ObjectId;
  trackingInfo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-document Schema ──────────────────────────────────────────────────────
const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "kg" },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// ─── Order Schema ─────────────────────────────────────────────────────────────
const OrderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    trackingInfo: {
      type: String,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ "items.farmerId": 1 });
OrderSchema.index({ createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────
const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
