import { NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET() {
  try {
    const states = await cachedFetch('nxcar_states', 3600, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/state`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch states");
      const data = await response.json();
      const stateList = data.state || data || [];
      return Array.isArray(stateList) ? stateList.map((s: any) => ({
        state_id: s.state_id,
        state_name: s.state_name,
      })) : [];
    });
    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
