import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const model_id = request.nextUrl.searchParams.get('model_id');
    const fuel_type = request.nextUrl.searchParams.get('fuel_type');
    if (!model_id || !fuel_type) {
      return NextResponse.json({ error: "model_id and fuel_type are required" }, { status: 400 });
    }
    const variants = await cachedFetch(`nxcar_variants_${model_id}_${fuel_type}`, 1800, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/specific-variant?model_id=${model_id}&fuel_type=${fuel_type}`, {}, 8000);
      if (!response.ok) return [];
      const data = await response.json();
      if (data.status === false || !data.variant) return [];
      const mapped = (data.variant || []).map((v: any) => ({
        id: parseInt(v.variant_id || v.id),
        variant_name: v.variant || v.variant_name,
        model_id: parseInt(model_id),
      }));
      return Array.isArray(mapped) ? mapped : [];
    });
    return NextResponse.json(variants);
  } catch (error) {
    return NextResponse.json([]);
  }
}
