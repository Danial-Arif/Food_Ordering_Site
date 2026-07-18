import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { authenticateRequest } from "@/lib/auth";

// GET /api/orders — user gets own orders, admin gets all
export async function GET(request) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = {};
    if (user.role !== "admin") {
      filter.user = user.userId;
    }
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return Response.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders — requires login
export async function POST(request) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json(
        { error: "Please login to place an order" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { items, deliveryAddress, phone, notes } = body;

    if (!items || items.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!deliveryAddress) {
      return Response.json(
        { error: "Delivery address is required" },
        { status: 400 }
      );
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: user.userId,
      userName: user.name,
      userEmail: user.email,
      items: items.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),
      totalPrice,
      deliveryAddress,
      phone: phone || "",
      notes: notes || "",
    });

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return Response.json({ error: "Failed to place order" }, { status: 500 });
  }
}
