import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const ids = await storage.getFavoriteCarIds(userId);
    return NextResponse.json(ids);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch favorite IDs" }, { status: 500 });
  }
}
