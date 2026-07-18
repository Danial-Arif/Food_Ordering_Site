import connectDB from "@/lib/mongodb";
import Menu from "@/models/menu";
import { authenticateRequest, requireAdmin } from "@/lib/auth";

// GET /api/menu — public, supports ?category=&search=
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filter = { available: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Menu.find(filter)
      .sort({ category: 1, name: 1 })
      .lean();

    return Response.json({ items });
  } catch (error) {
    console.error("Menu GET error:", error);
    return Response.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

// POST /api/menu — admin only (or any logged-in user if role === admin)
export async function POST(request) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return Response.json({ error: "Unauthorized — admin only" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, description, price, category, image, discount, stock } = body;

    if (!name || !price || !category) {
      return Response.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const item = await Menu.create({
      name,
      description: description || "",
      price: Number(price),
      category,
      image: image || "",
      discount: Number(discount) || 0,
      stock: Number(stock) || 100,
      addedBy: user.userId,
    });

    return Response.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Menu POST error:", error);
    return Response.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
