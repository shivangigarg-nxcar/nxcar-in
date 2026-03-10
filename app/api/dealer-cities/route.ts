import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '12', 10);
    const cities = await storage.getDealerCities(limit);
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dealer cities" }, { status: 500 });
  }
}
