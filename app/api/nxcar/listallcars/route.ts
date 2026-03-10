import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fltr, page = 1 } = body;

    if (!fltr || !Array.isArray(fltr)) {
      return NextResponse.json({ error: "fltr array is required" }, { status: 400 });
    }

    const cacheKey = `listallcars_${JSON.stringify(fltr)}_p${page}`;

    const data = await cachedFetch(cacheKey, 180, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/listallcars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fltr, page }),
      }, 10000);

      if (!response.ok) throw new Error("Failed to fetch cars");
      return await response.json();
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car listings", allcars: [] }, { status: 500 });
  }
}
