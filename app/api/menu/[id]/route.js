import connectDB from "@/lib/mongodb";
import Menu from "@/models/menu";
import { requireAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Menu.findById(id).lean();

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json({ item });
  } catch (error) {
    console.error("Menu GET [id] error:", error);
    return Response.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await request.json();

    const update = {};
    if (body.name) update.name = body.name;
    if (body.description !== undefined) update.description = body.description;
    if (body.price) update.price = Number(body.price);
    if (body.category) update.category = body.category;
    if (body.image !== undefined) update.image = body.image;
    if (body.discount !== undefined) update.discount = Number(body.discount);
    if (body.stock !== undefined) update.stock = Number(body.stock);
    if (body.available !== undefined) update.available = body.available;

    const item = await Menu.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json({ item });
  } catch (error) {
    console.error("Menu PUT [id] error:", error);
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const item = await Menu.findByIdAndDelete(id);

    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    return Response.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Menu DELETE [id] error:", error);
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
