import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function GET(request: NextRequest) {
  try {
    const position = request.nextUrl.searchParams.get('position') || undefined;
    const banners = await storage.getMarketingBanners(position);
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
