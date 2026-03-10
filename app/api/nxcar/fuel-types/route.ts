import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const fuelTypes = await cachedFetch('nxcar_fuel_types', 3600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/v2/fuel-type`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch fuel types");
      const data = await response.json();
      return (data.fule_type || []).map((f: any) => ({
        id: parseInt(f.fuel_id),
        fuel_type: f.fuel_type,
      }));
    });
    return NextResponse.json(fuelTypes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fuel types" }, { status: 500 });
  }
}
