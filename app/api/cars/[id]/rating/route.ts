import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

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
    const rating = await storage.getCarAverageRating(carId);
    return NextResponse.json(rating);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}
