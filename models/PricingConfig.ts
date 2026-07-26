/**
 * models/PricingConfig.ts — Global Pricing Configuration
 *
 * Stores admin-controlled sensitivity factors for dynamic pricing.
 *
 * ── v1 fields (preserved) ────────────────────────────────────────────────────
 *   demandSensitivity  (α) — legacy linear formula factor
 *   supplySensitivity  (β) — legacy linear formula factor
 *   lastModifiedBy         — audit reference
 *
 * ── v2 fields (additive, no breaking changes) ────────────────────────────────
 *   Demand multipliers: demandHighFactor / demandMediumFactor / demandLowFactor
 *   Supply thresholds : supplyLowThreshold / supplyHighThreshold (percent)
 *   Supply multipliers: supplyLowFactor / supplyHighFactor
 *   Clamps            : minMultiplier / maxMultiplier
 *
 * Singleton pattern — always use findOne() / findOneAndUpdate(); there should
 * only ever be ONE document in this collection.
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPricingConfig extends Document {
  // ── v1 Legacy fields (kept intact) ─────────────────────────────────────────
  /** Demand sensitivity: how much demandScore affects price (default: 0.01) */
  demandSensitivity: number;

  /** Supply sensitivity: how much stockQty reduces price (default: 0.005) */
  supplySensitivity: number;

  /** Admin who last modified this config */
  lastModifiedBy?: mongoose.Types.ObjectId;

  // ── v2 Demand-tier multipliers ──────────────────────────────────────────────
  /** Price multiplier when demand is High   (default: 1.18) */
  demandHighFactor: number;

  /** Price multiplier when demand is Medium (default: 1.0) */
  demandMediumFactor: number;

  /** Price multiplier when demand is Low    (default: 0.88) */
  demandLowFactor: number;

  // ── v2 Supply-tier thresholds & multipliers ─────────────────────────────────
  /** Supply% below which "low supply" surcharge applies  (default: 30) */
  supplyLowThreshold: number;

  /** Supply% above which "high supply" discount applies  (default: 60) */
  supplyHighThreshold: number;

  /** Price multiplier when supply% < supplyLowThreshold  (default: 1.10) */
  supplyLowFactor: number;

  /** Price multiplier when supply% > supplyHighThreshold (default: 0.92) */
  supplyHighFactor: number;

  // ── v2 Global clamps ────────────────────────────────────────────────────────
  /** Minimum combined multiplier (default: 0.7  → never more than 30% below base) */
  minMultiplier: number;

  /** Maximum combined multiplier (default: 1.3  → never more than 30% above base) */
  maxMultiplier: number;

  // ── Metadata ────────────────────────────────────────────────────────────────
  createdAt: Date;
  updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>(
  {
    // ── v1 Legacy ─────────────────────────────────────────────────────────────
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
      required: false, // relaxed: not all creation paths have an admin user
    },

    // ── v2 Demand-tier multipliers ─────────────────────────────────────────────
    demandHighFactor: {
      type: Number,
      default: 1.18,
      min: [0.1, "demandHighFactor must be positive"],
    },
    demandMediumFactor: {
      type: Number,
      default: 1.0,
      min: [0.1, "demandMediumFactor must be positive"],
    },
    demandLowFactor: {
      type: Number,
      default: 0.88,
      min: [0.1, "demandLowFactor must be positive"],
    },

    // ── v2 Supply thresholds ───────────────────────────────────────────────────
    supplyLowThreshold: {
      type: Number,
      default: 30,
      min: [0, "supplyLowThreshold must be ≥ 0"],
      max: [100, "supplyLowThreshold must be ≤ 100"],
    },
    supplyHighThreshold: {
      type: Number,
      default: 60,
      min: [0, "supplyHighThreshold must be ≥ 0"],
      max: [100, "supplyHighThreshold must be ≤ 100"],
    },

    // ── v2 Supply-tier multipliers ─────────────────────────────────────────────
    supplyLowFactor: {
      type: Number,
      default: 1.10,
      min: [0.1, "supplyLowFactor must be positive"],
    },
    supplyHighFactor: {
      type: Number,
      default: 0.92,
      min: [0.1, "supplyHighFactor must be positive"],
    },

    // ── v2 Global clamps ───────────────────────────────────────────────────────
    minMultiplier: {
      type: Number,
      default: 0.7,
      min: [0.1, "minMultiplier must be positive"],
    },
    maxMultiplier: {
      type: Number,
      default: 1.3,
      min: [0.1, "maxMultiplier must be positive"],
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
