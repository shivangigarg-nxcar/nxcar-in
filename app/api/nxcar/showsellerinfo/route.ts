import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicle_id } = body;

    if (!vehicle_id) {
      return NextResponse.json({ error: "vehicle_id is required" }, { status: 400 });
    }

    const authToken = request.cookies.get("auth_token")?.value;
    const nxcarUserId = request.cookies.get("nxcar_user_id")?.value;

    if (!authToken || !nxcarUserId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authToken,
    };

    const response = await fetchWithTimeout(`${BASE_URL}/showsellerinfo`, {
      method: "POST",
      headers,
      body: JSON.stringify({ vehicle_id, user_id: nxcarUserId }),
    }, 10000);

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seller info" }, { status: 500 });
  }
}
