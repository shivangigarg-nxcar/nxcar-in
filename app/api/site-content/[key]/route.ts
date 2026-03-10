import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const content = await storage.getSiteContentByKey(key);
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 });
  }
}
