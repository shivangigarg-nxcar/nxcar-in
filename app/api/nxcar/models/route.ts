import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const makeId = request.nextUrl.searchParams.get('make_id');
    if (!makeId) {
      return NextResponse.json({ error: "make_id is required" }, { status: 400 });
    }
    const models = await cachedFetch(`nxcar_models_${makeId}`, 1800, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/model?make_id=${makeId}`, {}, 8000);
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      return (data.model || []).map((m: any) => ({
        id: parseInt(m.model_id),
        model_name: m.model,
        make_id: parseInt(makeId),
      }));
    });
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
