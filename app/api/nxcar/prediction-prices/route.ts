import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicle_id, prediction_price } = body;

    if (!vehicle_id) {
      return NextResponse.json({ error: "vehicle_id is required" }, { status: 400 });
    }

    const authToken = request.cookies.get("auth_token")?.value;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const response = await fetchWithTimeout(`${BASE_URL}/prediction-prices`, {
      method: "POST",
      headers,
      body: JSON.stringify({ vehicle_id, prediction_price }),
    }, 10000);

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prediction prices" }, { status: 500 });
  }
}
