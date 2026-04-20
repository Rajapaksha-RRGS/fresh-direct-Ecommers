import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";

// ─── Validation ────────────────────────────────────────────────────────────────
const statusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"] as const, {
    error: "Status must be either APPROVED or REJECTED.",
  }),
  /** Optional: record which admin approved (pass logged-in admin's userId) */
  approvedBy: z.string().optional(),
});

// ─── PATCH /api/admin/farmers/[id]/status ──────────────────────────────────────
// Updates a farmer's status and, on APPROVAL, sets approvedAt timestamp.
//
// TODO: Protect with session/JWT middleware — only ADMIN role should reach this.
// Example middleware stub:
//   const session = await getSession(req);
//   if (session?.user?.role !== "ADMIN") return 401;
//
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Validate body
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { status, approvedBy } = parsed.data;

    // 2. Connect DB
    await connectDB();

    // 3. Build update payload
    const updatePayload: Record<string, unknown> = { status };

    if (status === "APPROVED") {
      updatePayload.approvedAt = new Date();
      updatePayload.isVerified = true;
      if (approvedBy) updatePayload.approvedBy = approvedBy;
    } else {
      // REJECTED — clear any previous approval data
      updatePayload.approvedAt = null;
      updatePayload.approvedBy = null;
      updatePayload.isVerified = false;
    }

    // 4. Find and update
    const updated = await FarmerProfile.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    ).populate("userId", "name email mobile nic role");

    if (!updated) {
      return NextResponse.json(
        { message: "Farmer profile not found." },
        { status: 404 },
      );
    }

    // 5. Return updated farmer profile
    return NextResponse.json(
      {
        message:
          status === "APPROVED"
            ? "Farmer account approved successfully."
            : "Farmer account has been rejected.",
        farmer: updated,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("[PATCH /api/admin/farmers/[id]/status]", err);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}

// ─── GET /api/admin/farmers/[id]/status (convenience read) ────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const profile = await FarmerProfile.findById(id)
      .select("status approvedAt approvedBy isVerified farmName location")
      .populate("userId", "name email");

    if (!profile) {
      return NextResponse.json(
        { message: "Farmer profile not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ farmer: profile }, { status: 200 });
  } catch (err: unknown) {
    console.error("[GET /api/admin/farmers/[id]/status]", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
