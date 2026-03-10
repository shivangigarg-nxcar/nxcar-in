import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, vehicle_number, user_id } = body;
    if (!vehicle_number) {
      return NextResponse.json({ error: "vehicle_number is required" }, { status: 400 });
    }

    const authToken = request.cookies.get("auth_token")?.value
      || request.headers.get("x-auth-token")
      || (process.env.NXCAR_AUTH_TOKEN || "");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const payload: Record<string, string> = {
      phone_number: phone_number || "",
      vehicle_number,
    };
    if (user_id) {
      payload.user_id = String(user_id);
    }

    const response = await fetch(`${BASE_URL}/user-service-challans-check`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking challan:", error);
    return NextResponse.json({ error: "Failed to check challan" }, { status: 500 });
  }
}
