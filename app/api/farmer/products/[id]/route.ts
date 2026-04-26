/**
 * PATCH /api/farmer/products/[id]
 * DELETE /api/farmer/products/[id]
 *
 * PATCH: Updates an existing product (only if farmer owns it)
 * DELETE: Deletes a product (only if farmer owns it)
 *
 * Returns: IProductResponse (PATCH) or { success: true } (DELETE)
 * Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error
 */

import { NextRequest, NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { IUpdateProductRequest, IProductResponse } from "@/types/farmerApi";

// ───── PATCH: Update Product ───────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // Step 2: Connect to database
    await connectDB();

    // Step 3: Fetch and verify ownership
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Not Found", message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.farmerId.toString() !== farmerId) {
      return NextResponse.json(
        { error: "Forbidden", message: "You do not own this product" },
        { status: 403 }
      );
    }

    // Step 4: Parse update body
    let body: IUpdateProductRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Step 5: Update fields (only if provided)
    if (body.name !== undefined) product.name = body.name.trim();
    if (body.description !== undefined) product.description = body.description.trim();
    if (body.category !== undefined) product.category = body.category;
    if (body.unit !== undefined) product.unit = body.unit.trim();
    if (body.basePrice !== undefined) {
      const price = Number(body.basePrice);
      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { error: "Bad Request", message: "Base price must be positive" },
          { status: 400 }
        );
      }
      product.basePrice = price;
    }
    if (body.stockQty !== undefined) {
      const stock = Number(body.stockQty);
      if (!Number.isFinite(stock) || stock < 0) {
        return NextResponse.json(
          { error: "Bad Request", message: "Stock quantity must be non-negative" },
          { status: 400 }
        );
      }
      product.stockQty = stock;
    }
    if (body.images !== undefined) product.images = body.images;
    if (body.tags !== undefined) product.tags = body.tags;
    if (body.status !== undefined) {
      // Only allow self-update to OUT_OF_STOCK; other status changes are admin-only
      if (body.status === "OUT_OF_STOCK") {
        product.status = body.status;
      }
    }

    // Step 6: Save and return
    await product.save();

    const response: IProductResponse = {
      id: product._id.toString(),
      farmerId: product.farmerId.toString(),
      name: product.name,
      category: product.category,
      description: product.description,
      unit: product.unit,
      images: product.images,
      status: product.status,
      tags: product.tags,
      basePrice: product.basePrice,
      currentPrice: product.currentPrice,
      stockQty: product.stockQty,
      demandScore: product.demandScore,
      totalViews: product.totalViews,
      totalSold: product.totalSold,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ───── DELETE: Delete Product ──────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // Step 2: Connect to database
    await connectDB();

    // Step 3: Fetch and verify ownership
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Not Found", message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.farmerId.toString() !== farmerId) {
      return NextResponse.json(
        { error: "Forbidden", message: "You do not own this product" },
        { status: 403 }
      );
    }

    // Step 4: Delete product
    await Product.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
