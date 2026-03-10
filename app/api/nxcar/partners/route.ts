import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get('city_id');
    if (!cityId) {
      return NextResponse.json({ error: "city_id is required" }, { status: 400 });
    }
    const data = await cachedFetch(`nxcar_partners_${cityId}`, 600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/partners/web-urls?fltr[][city_id]=${cityId}`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch partners");
      return await response.json();
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch partners", allpartners: [] }, { status: 500 });
  }
}
