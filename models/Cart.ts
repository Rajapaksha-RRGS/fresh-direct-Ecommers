import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Sub-document Interface ───────────────────────────────────────────────────
export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;          // Snapshot at add time
  image: string;         // Snapshot at add time
  unitPrice: number;     // Snapshot at add time
  unit: string;
  quantity: number;
}

// ─── TypeScript Interface ─────────────────────────────────────────────────────
export interface ICart extends Document {
  customerId: mongoose.Types.ObjectId;   // Reference to User (Customer)
  items: ICartItem[];
  totalAmount: number;
  updatedAt: Date;
}

// ─── Sub-document Schema ──────────────────────────────────────────────────────
const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "kg" },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }  // No separate _id for sub-documents
);

// ─── Cart Schema ──────────────────────────────────────────────────────────────
const CartSchema = new Schema<ICart>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   // One cart per customer
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual: auto-calculate totalAmount ─────────────────────────────────────
CartSchema.pre("save", async function () {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
});

// ─── Model ────────────────────────────────────────────────────────────────────
const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
