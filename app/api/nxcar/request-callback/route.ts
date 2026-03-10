import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value;

    const body = await request.json();

    if (nxcarUserId && !body.user_id) {
      body.user_id = nxcarUserId;
    }

    if (!body.user_id || !body.vehicle_id) {
      return NextResponse.json({ error: "user_id and vehicle_id are required" }, { status: 400 });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const response = await fetchWithTimeout(
      `${BASE_URL}/user-requestcallback`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: body.user_id,
          vehicle_id: body.vehicle_id,
        }),
      },
      8000
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Request callback API error:", response.status, data);
      let errorMsg = "Failed to submit callback request";
      if (data?.message) {
        errorMsg = data.message;
      } else if (data?.error) {
        errorMsg = data.error;
      }
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Request callback proxy error:", error);
    return NextResponse.json({ error: "Failed to submit callback request" }, { status: 500 });
  }
}
