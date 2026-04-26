/**
 * models/PricingConfig.ts — Global Pricing Configuration
 *
 * Stores admin-controlled sensitivity factors (α and β) for dynamic pricing.
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPricingConfig extends Document {
  // Demand Sensitivity: how much demand score affects price (default: 0.01)
  demandSensitivity: number;

  // Supply Sensitivity: how much stock quantity reduces price (default: 0.005)
  supplySensitivity: number;

  // Metadata
  lastModifiedBy: mongoose.Types.ObjectId; // Admin who last modified
  createdAt: Date;
  updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>(
  {
    demandSensitivity: {
      type: Number,
      required: true,
      default: 0.01,
      min: [0, "Demand sensitivity must be non-negative"],
      max: [1, "Demand sensitivity must not exceed 1"],
    },
    supplySensitivity: {
      type: Number,
      required: true,
      default: 0.005,
      min: [0, "Supply sensitivity must be non-negative"],
      max: [1, "Supply sensitivity must not exceed 1"],
    },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PricingConfig: Model<IPricingConfig> =
  mongoose.models.PricingConfig ||
  mongoose.model<IPricingConfig>("PricingConfig", PricingConfigSchema);

export default PricingConfig;
