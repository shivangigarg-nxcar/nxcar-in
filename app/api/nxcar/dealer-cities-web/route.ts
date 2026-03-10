import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const data = await cachedFetch('nxcar_dealer_cities_web', 600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/available-cities-for-dealerpages`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch dealer cities");
      return await response.json();
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dealer cities:", error);
    return NextResponse.json({ error: "Failed to fetch dealer cities", data: [] }, { status: 500 });
  }
}
