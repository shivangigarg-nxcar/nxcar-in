import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const makes = await cachedFetch('nxcar_makes', 1800, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/make`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch makes");
      const data = await response.json();
      return (data.make || []).map((m: any) => ({
        id: parseInt(m.make_id),
        make_name: m.make,
        make_image: m.make_image || null,
      }));
    });
    return NextResponse.json(makes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch makes" }, { status: 500 });
  }
}
