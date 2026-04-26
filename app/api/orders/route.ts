import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to complete checkout." },
        { status: 401 }
      );
    }

    const customerId = session.user.id;
    const { items, totalAmount, deliveryAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!totalAmount || !deliveryAddress) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectDB();

    // Verify stock and prepare order items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found.` }, { status: 404 });
      }

      if (product.stockQty < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${item.name}. Available: ${product.stockQty}` }, { status: 400 });
      }

      orderItems.push({
        productId: product._id,
        farmerId: item.farmerId,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPrice,
        unit: item.unit,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
      });
    }

    // Create the order
    const newOrder = await Order.create({
      customerId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      status: "PENDING",
    });

    // Decrease the stock quantity and update totalSold
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stockQty: -item.quantity,
          totalSold: item.quantity,
        },
      });
    }

    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (err: any) {
    console.error("Error processing order:", err);
    return NextResponse.json({ error: "Failed to place order. Please try again later." }, { status: 500 });
  }
}
