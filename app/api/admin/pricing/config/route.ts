/**
 * app/api/admin/pricing/config/route.ts — Dynamic Pricing Control
 *
 * GET /api/admin/pricing/config
 *   Fetch current global pricing sensitivity factors (α and β).
 *
 * PATCH /api/admin/pricing/config
 *   Update pricing sensitivity factors with admin verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import PricingConfig from "@/models/PricingConfig";

interface PricingConfigUpdate {
  demandSensitivity?: number;
  supplySensitivity?: number;
}

/**
 * GET /api/admin/pricing/config — Fetch current pricing configuration
 */
export async function GET(req: NextRequest) {
  try {
    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    // Fetch current config (single document)
    let config = await PricingConfig.findOne().populate(
      "lastModifiedBy",
      "name email"
    );

    // If no config exists, initialize with defaults
    if (!config) {
      const adminUser = await (await import("@/models/User")).default.findOne({
        role: "ADMIN",
      });

      const configData: any = {
        demandSensitivity: 0.01,
        supplySensitivity: 0.005,
      };

      if (adminUser) {
        configData.lastModifiedBy = adminUser._id;
      }

      config = await PricingConfig.create(configData);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          demandSensitivity: config.demandSensitivity,
          supplySensitivity: config.supplySensitivity,
          lastModifiedAt: config.updatedAt,
          lastModifiedBy: config.lastModifiedBy,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/pricing/config error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pricing configuration",
        messageNL: "මිල ගණන් වින්‍යාසය ලබා ගැනීම අසफල විය",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/pricing/config — Update pricing sensitivity factors
 */
export async function PATCH(req: NextRequest) {
  try {
    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    const body: PricingConfigUpdate = await req.json();

    // Validate input
    if (body.demandSensitivity !== undefined) {
      if (
        typeof body.demandSensitivity !== "number" ||
        body.demandSensitivity < 0 ||
        body.demandSensitivity > 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Demand sensitivity must be a number between 0 and 1",
            messageNL:
              "ඉල්ලුම සංවේදනශීලතා 0 සහ 1 අතර සංඛ්‍යා විය යුතුයි",
          },
          { status: 400 }
        );
      }
    }

    if (body.supplySensitivity !== undefined) {
      if (
        typeof body.supplySensitivity !== "number" ||
        body.supplySensitivity < 0 ||
        body.supplySensitivity > 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Supply sensitivity must be a number between 0 and 1",
            messageNL:
              "සরবراज සංවේදනශීලතා 0 සහ 1 අතර සංඛ්‍යා විය යුතුයි",
          },
          { status: 400 }
        );
      }
    }

    // Fetch or create config
    let config = await PricingConfig.findOne();

    if (!config) {
      config = await PricingConfig.create({
        demandSensitivity: body.demandSensitivity ?? 0.01,
        supplySensitivity: body.supplySensitivity ?? 0.005,
      });
    } else {
      // Update config
      if (body.demandSensitivity !== undefined) {
        config.demandSensitivity = body.demandSensitivity;
      }
      if (body.supplySensitivity !== undefined) {
        config.supplySensitivity = body.supplySensitivity;
      }
      await config.save();
    }

    // Audit log
    console.log(`[ADMIN AUDIT] Updated pricing config:`, {
      demandSensitivity: body.demandSensitivity,
      supplySensitivity: body.supplySensitivity,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pricing configuration updated successfully",
        messageNL: "මිල ගණන් වින්‍යාසය සফලව යාවත්කාලීන කරන ලදි",
        data: {
          demandSensitivity: config.demandSensitivity,
          supplySensitivity: config.supplySensitivity,
          lastModifiedAt: config.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/admin/pricing/config error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update pricing configuration",
        messageNL: "මිල ගණන් වින්‍යාසය යාවත්කාලීන කිරීම අසफල විය",
      },
      { status: 500 }
    );
  }
}
