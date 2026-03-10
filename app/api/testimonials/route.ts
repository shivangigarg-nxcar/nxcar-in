import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '15', 10);
    const testimonials = await storage.getTestimonials(limit);
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}
