import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const years = await cachedFetch('nxcar_years', 3600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/year`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch years");
      const data = await response.json();
      return (data.year || []).map((y: number, index: number) => ({
        id: index + 1,
        year: y,
      }));
    });
    return NextResponse.json(years);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch years" }, { status: 500 });
  }
}
