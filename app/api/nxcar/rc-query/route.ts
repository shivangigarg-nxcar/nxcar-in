import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, vehicle_number } = body;
    if (!vehicle_number) {
      return NextResponse.json({ error: "vehicle_number is required" }, { status: 400 });
    }

    const authToken = request.cookies.get("auth_token")?.value
      || request.headers.get("x-auth-token")
      || "";

    if (!authToken) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const response = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "RC Check",
        mobile: phone_number || "",
        subject: "RC Check Request",
        message: `RC Check request for vehicle: ${vehicle_number}`,
      }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error submitting RC query:", error);
    return NextResponse.json({ error: "Failed to submit RC query" }, { status: 500 });
  }
}
