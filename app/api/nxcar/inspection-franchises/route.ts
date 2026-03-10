import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city_id } = body;
    if (!city_id) {
      return NextResponse.json({ error: "city_id is required" }, { status: 400 });
    }
    const data = await cachedFetch(`nxcar_inspection_franchises_${city_id}`, 600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/v2/inspection-franchise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city_id }),
      }, 8000);
      if (!response.ok) throw new Error("Failed to fetch inspection franchises");
      return await response.json();
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: false, message: "Failed to fetch franchises", data: [] }, { status: 500 });
  }
}
