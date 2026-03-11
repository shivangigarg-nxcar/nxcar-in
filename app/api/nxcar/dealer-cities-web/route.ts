import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

const northCities = ["delhi", "gurgaon", "gurugram", "noida", "faridabad", "ghaziabad", "chandigarh", "ludhiana", "jalandhar", "amritsar", "mohali", "panchkula", "jaipur", "lucknow", "meerut", "dehradun", "agra", "varanasi", "kanpur", "allahabad", "prayagraj", "bhopal", "indore", "ajmer", "bathinda", "delhi-ncr"];
const westCities = ["mumbai", "pune", "ahmedabad", "surat", "vadodara", "nagpur", "nashik", "rajkot", "thane", "navi mumbai", "goa", "borivali"];
const southCities = ["chennai", "bangalore", "bengaluru", "hyderabad", "coimbatore", "kochi", "thiruvananthapuram", "trivandrum", "mysore", "mysuru", "visakhapatnam", "vijayawada", "madurai", "rangareddy"];
const eastCities = ["kolkata", "patna", "bhubaneswar", "cuttack", "ranchi", "gorakhpur", "guwahati", "siliguri", "jamshedpur"];

function assignRegion(cityName: string): string {
  const lower = cityName.toLowerCase();
  if (westCities.some(c => lower.includes(c))) return "west";
  if (southCities.some(c => lower.includes(c))) return "south";
  if (eastCities.some(c => lower.includes(c))) return "east";
  return "north";
}

async function fetchDealerCount(cityId: number, retries = 2): Promise<number> {
  const url = `${BASE_URL}/partners/web-urls?fltr%5B%5D%5Bcity_id%5D=${cityId}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {}, 10000);
      if (!response.ok) return 0;
      const data = await response.json();
      const partners = data?.allpartners;
      if (typeof partners === 'string') return 0;
      return Array.isArray(partners) ? partners.length : 0;
    } catch {
      if (attempt === retries) return 0;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return 0;
}

export async function GET() {
  try {
    const data = await cachedFetch('nxcar_dealer_cities_with_counts', 1800, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/available-cities-for-dealerpages`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch dealer cities");
      const citiesData = await response.json();
      const rawCities = citiesData?.data || [];

      const batchSize = 5;
      const results: any[] = [];

      for (let i = 0; i < rawCities.length; i += batchSize) {
        const batch = rawCities.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (city: any) => {
            const cityId = city.city_id;
            const name = city.city_name || city.name || "";
            const dealerCount = await fetchDealerCount(Number(cityId));
            return {
              id: cityId,
              name,
              region: assignRegion(name),
              dealerCount,
              imageUrl: city.city_image || null,
            };
          })
        );
        results.push(...batchResults);
      }

      return results
        .filter((c: any) => c.name)
        .sort((a: any, b: any) => b.dealerCount - a.dealerCount);
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dealer cities:", error);
    return NextResponse.json([], { status: 500 });
  }
}
