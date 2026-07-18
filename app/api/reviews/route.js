import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Menu from "@/models/menu";
import { authenticateRequest } from "@/lib/auth";

// GET /api/reviews?menuItemId=xxx
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get("menuItemId");

    if (!menuItemId) {
      return Response.json({ error: "menuItemId is required" }, { status: 400 });
    }

    const reviews = await Review.find({ menuItem: menuItemId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return Response.json({ reviews });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews — requires login
export async function POST(request) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json(
        { error: "Please login to write a review" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { menuItemId, rating, comment } = body;

    if (!menuItemId || !rating) {
      return Response.json(
        { error: "menuItemId and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Upsert: update existing review or create new one
    const review = await Review.findOneAndUpdate(
      { menuItem: menuItemId, user: user.userId },
      {
        menuItem: menuItemId,
        user: user.userId,
        userName: user.name,
        rating: Number(rating),
        comment: comment || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recalculate average rating for the menu item
    const stats = await Review.aggregate([
      { $match: { menuItem: review.menuItem } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Menu.findByIdAndUpdate(menuItemId, {
        averageRating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    return Response.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return Response.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
