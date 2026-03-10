import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId: reviewIdStr } = await params;
    const reviewId = parseInt(reviewIdStr);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Review not found or not authorized" }, { status: 404 });
    }

    const deleted = await storage.deleteCarReview(reviewId, sessionId);
    if (!deleted) {
      return NextResponse.json({ error: "Review not found or not authorized" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
