import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicle_id");

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicle_id is required" }, { status: 400 });
    }

    const response = await fetchWithTimeout(
      `${BASE_URL}/getImage?vehicle_id=${vehicleId}`,
      {
        method: "GET",
        headers: { "Accept": "application/json" },
      },
      10000
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
