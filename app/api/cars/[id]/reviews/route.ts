import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { insertCarReviewSchema } from '@shared/schema';
import { fromError } from 'zod-validation-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carId = parseInt(id);
    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }
    const reviews = await storage.getCarReviews(carId);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carId = parseInt(id);
    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    const needsCookie = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const body = await request.json();
    const reviewData = {
      ...body,
      carId,
      sessionId,
    };

    const result = insertCarReviewSchema.safeParse(reviewData);
    if (!result.success) {
      return NextResponse.json({ error: fromError(result.error).message }, { status: 400 });
    }

    const review = await storage.createCarReview(result.data);
    const response = NextResponse.json(review, { status: 201 });
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
