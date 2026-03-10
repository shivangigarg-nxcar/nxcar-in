import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '12', 10);
    const locations = await storage.getNxcarLocations(limit);
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
