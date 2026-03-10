import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const data = await cachedFetch('nxcar_inspection_slots', 300, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/inspection-slots`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch inspection slots");
      return await response.json();
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: false, data: [] }, { status: 500 });
  }
}
