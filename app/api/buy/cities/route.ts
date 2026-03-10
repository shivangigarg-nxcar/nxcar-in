import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

async function fetchCitiesWithRetry(retries = 2): Promise<any[]> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/available-cities`, {}, 20000);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        return data.data.map((city: any) => ({
          city_id: city.city_id,
          city_name: city.city_name,
          city_image: city.city_image,
          v_cnt: city.v_cnt,
        }));
      }
      return [];
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return [];
}

export async function GET() {
  try {
    const cities = await cachedFetch('buy_cities', 600, () => fetchCitiesWithRetry());
    return NextResponse.json({ status: "success", cities });
  } catch (error) {
    return NextResponse.json({ status: "error", error: "Unable to fetch cities. Please try again later.", cities: [] }, { status: 500 });
  }
}
