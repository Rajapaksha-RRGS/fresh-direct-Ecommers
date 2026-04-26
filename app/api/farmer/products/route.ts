/**
 * GET /api/farmer/products?page=1&perPage=10
 * POST /api/farmer/products
 *
 * GET: Lists paginated products for the farmer (10 per page by default)
 * POST: Creates a new product linked to the current farmer
 *
 * POST Body: ICreateProductRequest (name, category, description, basePrice, stockQty, images, tags)
 * Images should be pre-uploaded URLs from Cloudinary (use /api/farmer/upload-signature for signing)
 *
 * Returns: IProductsListResponse (GET) or IProductResponse (POST)
 * Errors: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error
 */

import { NextRequest, NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import FarmerProfile from "@/models/FarmerProfile";
import {
  ICreateProductRequest,
  IProductResponse,
  IProductsListResponse,
} from "@/types/farmerApi";

// ───── GET: List Products ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // Step 2: Parse pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "10")));
    const skip = (page - 1) * perPage;

    // Step 3: Connect to database
    await connectDB();

    // Step 4: Fetch paginated products
    const products = await Product.find({ farmerId })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ farmerId });

    // Step 5: Format response
    const formattedProducts: IProductResponse[] = products.map((p) => ({
      id: p._id.toString(),
      farmerId: p.farmerId.toString(),
      name: p.name,
      category: p.category,
      description: p.description,
      unit: p.unit,
      images: p.images,
      status: p.status,
      tags: p.tags,
      basePrice: p.basePrice,
      currentPrice: p.currentPrice,
      stockQty: p.stockQty,
      demandScore: p.demandScore,
      totalViews: p.totalViews,
      totalSold: p.totalSold,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    const response: IProductsListResponse = {
      products: formattedProducts,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ───── POST: Create Product ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // Step 2: Verify farmer profile is approved
    await connectDB();

    const farmerProfile = await FarmerProfile.findOne({ userId: farmerId });
    if (!farmerProfile) {
      return NextResponse.json(
        { error: "Not Found", message: "Farmer profile not found" },
        { status: 404 }
      );
    }

    if (farmerProfile.status !== "APPROVED") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: `Cannot add products while account status is ${farmerProfile.status}. Wait for approval.`,
        },
        { status: 403 }
      );
    }

    // Step 3: Parse request body
    let body: ICreateProductRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Step 4: Validate required fields
    const { name, category, description, unit, basePrice, stockQty, images, tags } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Bad Request", message: "Product name is required" },
        { status: 400 }
      );
    }

    if (!category || !["vegetables", "fruits", "herbs", "grains", "other"].includes(category)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Valid category is required" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Bad Request", message: "Description is required" },
        { status: 400 }
      );
    }

    if (!unit || typeof unit !== "string") {
      return NextResponse.json(
        { error: "Bad Request", message: "Unit is required" },
        { status: 400 }
      );
    }

    const price = Number(basePrice);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "Base price must be a positive number" },
        { status: 400 }
      );
    }

    const stock = Number(stockQty);
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "Stock quantity must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "At least one product image is required" },
        { status: 400 }
      );
    }

    // Step 5: Create product
    const newProduct = new Product({
      farmerId,
      name: name.trim(),
      category,
      description: description.trim(),
      unit: unit.trim(),
      basePrice: price,
      currentPrice: price, // Initial current price is same as base price
      stockQty: stock,
      images,
      tags: tags || [],
      status: "PENDING", // New products start in PENDING approval
    });

    await newProduct.save();

    // Step 6: Format and return response
    const response: IProductResponse = {
      id: newProduct._id.toString(),
      farmerId: newProduct.farmerId.toString(),
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      unit: newProduct.unit,
      images: newProduct.images,
      status: newProduct.status,
      tags: newProduct.tags,
      basePrice: newProduct.basePrice,
      currentPrice: newProduct.currentPrice,
      stockQty: newProduct.stockQty,
      demandScore: newProduct.demandScore,
      totalViews: newProduct.totalViews,
      totalSold: newProduct.totalSold,
      createdAt: newProduct.createdAt.toISOString(),
      updatedAt: newProduct.updatedAt.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
