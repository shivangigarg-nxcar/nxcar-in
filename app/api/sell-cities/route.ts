import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const data = await cachedFetch(
      'sell-cities',
      600,
      async () => {
        const response = await fetchWithTimeout(`${BASE_URL}/city`, {}, 10000);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        return response.json();
      }
    );

    if (data?.success && Array.isArray(data.city)) {
      return NextResponse.json({ success: true, cities: data.city });
    }

    return NextResponse.json({ success: false, cities: [] });
  } catch (error) {
    console.error("Error fetching sell cities:", error);
    return NextResponse.json(
      { success: false, cities: [], error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
