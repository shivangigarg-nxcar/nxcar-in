import { NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function GET() {
  try {
    const content = await storage.getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 });
  }
}
