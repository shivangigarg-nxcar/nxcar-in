import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const cities = await cachedFetch('nxcar_cities', 3600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/city`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      const cityList = data.city || data || [];
      return Array.isArray(cityList) ? cityList.map((c: any) => ({
        city_id: c.city_id,
        city_name: c.city_name,
        inspection_available: c.inspection_available,
      })) : [];
    });
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
