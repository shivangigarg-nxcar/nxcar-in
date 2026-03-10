import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealer: string }> }
) {
  try {
    const { dealer } = await params;
    if (!dealer) {
      return NextResponse.json({ error: "dealer slug is required" }, { status: 400 });
    }

    const data = await cachedFetch(`dealer_view_${dealer}`, 300, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/dealer-view/${dealer}`, {}, 10000);
      if (response.status === 404) {
        return { dealer: null };
      }
      if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
      const json = await response.json();
      if (!json?.dealer) {
        return { dealer: null };
      }
      return json;
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dealer details" }, { status: 500 });
  }
}
