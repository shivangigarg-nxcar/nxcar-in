import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const colors = await cachedFetch('nxcar_colors', 3600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/color`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch colors");
      const data = await response.json();
      return (data.owner || []).map((c: any) => ({
        id: c.color_id,
        name: c.color_name,
        code: c.color_code,
      }));
    });
    return NextResponse.json(colors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch colors" }, { status: 500 });
  }
}
