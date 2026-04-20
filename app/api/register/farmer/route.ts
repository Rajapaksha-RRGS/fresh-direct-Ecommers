import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import FarmerProfile from "@/models/FarmerProfile";

// ─── Zod validation schema (mirrors the front-end form payload) ───────────────
const farmerRegistrationSchema = z.object({
  // ── Step 1: Account Details ──────────────────────────────────────────────
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  nic: z
    .string()
    .regex(
      /^(\d{9}[vVxX]|\d{12})$/,
      "Invalid NIC (e.g. 901234567V or 199012345678)",
    ),
  mobile: z
    .string()
    .regex(/^0[0-9]{9}$/, "Invalid mobile number (e.g. 0771234567)"),
  whatsappEnabled: z.boolean().default(false),

  // ── Step 2: Farm Profile ─────────────────────────────────────────────────
  farmName: z
    .string()
    .min(3, "Farm name must be at least 3 characters")
    .max(150, "Farm name too long"),
  location: z
    .string()
    .min(5, "Please enter your full farm address / district")
    .max(300, "Address too long"),
  cropTypes: z.array(z.string()).min(1, "Select at least one crop type"),
  bio: z.string().max(1000, "Bio must be under 1000 characters").optional(),

  // ── Step 3: Bank Details ──────────────────────────────────────────────────
  bankDetails: z.object({
    accountName:   z.string().min(3, "Account name is required"),
    bank:          z.string().min(1, "Please select your bank"),
    branch:        z.string().min(2, "Branch name is required"),
    accountNumber: z
      .string()
      .min(8, "Account number must be at least 8 digits")
      .regex(/^\d+$/, "Account number must contain only digits"),
  }),

  role: z.literal("FARMER").default("FARMER"),
});

// ─── POST /api/register/farmer ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Parse & validate request body
    const body = await req.json();
    const parsed = farmerRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // 2. Connect to database
    await connectDB();

    // 3. Uniqueness checks — email, NIC, mobile
    const [existingEmail, existingNic, existingMobile] = await Promise.all([
      User.findOne({ email: data.email.toLowerCase() }),
      User.findOne({ nic:   data.nic }),
      User.findOne({ mobile: data.mobile }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 400 },
      );
    }
    if (existingNic) {
      return NextResponse.json(
        { message: "An account with this NIC number already exists." },
        { status: 400 },
      );
    }
    if (existingMobile) {
      return NextResponse.json(
        { message: "An account with this mobile number already exists." },
        { status: 400 },
      );
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 5. Create User document (role = FARMER)
    const user = await User.create({
      name:         data.name,
      email:        data.email.toLowerCase(),
      passwordHash,
      nic:          data.nic,
      mobile:       data.mobile,
      role:         "FARMER",
      isActive:     true,
    });

    // 6. Create FarmerProfile document (status defaults to PENDING)
    await FarmerProfile.create({
      userId:          user._id,
      farmName:        data.farmName,
      location:        data.location,
      cropTypes:       data.cropTypes,
      bio:             data.bio ?? "",
      whatsappEnabled: data.whatsappEnabled,
      bankDetails:     data.bankDetails,
      // status, isVerified, approvedAt, approvedBy — all use schema defaults
    });

    // 7. Return success (201 Created)
    return NextResponse.json(
      {
        message:
          "ලියාපදිංචිය සාර්ථකයි. පරිපාලක අනුමැතියෙන් පසු ඔබට ප්‍රවේශ විය හැක.",
        userId: user._id.toString(),
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("[POST /api/register/farmer]", err);

    // Handle MongoDB duplicate key (race condition safety net)
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          message:
            "An account with that email, NIC, or mobile number already exists.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
