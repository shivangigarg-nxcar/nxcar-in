import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  const stateId = request.nextUrl.searchParams.get('state_id');
  if (!stateId) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const rtos = await cachedFetch(`nxcar_rto_${stateId}`, 3600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/rto?state_id=${stateId}`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch RTOs");
      const data = await response.json();
      const rtoList = data.rto || data || [];
      return Array.isArray(rtoList) ? rtoList.map((r: any) => ({
        rto_id: r.rto_id,
        state_code: r.state_code,
        rto_number: r.rto_number,
        rto_location: r.rto_location,
      })) : [];
    });
    return NextResponse.json(rtos);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
