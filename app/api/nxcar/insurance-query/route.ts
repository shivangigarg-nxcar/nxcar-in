import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, vehicle_number } = body;
    if (!vehicle_number) {
      return NextResponse.json({ error: "vehicle_number is required" }, { status: 400 });
    }
    const response = await fetch(`${BASE_URL}/user-service-insurance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone_number || "", vehicle_number }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking insurance:", error);
    return NextResponse.json({ error: "Failed to check insurance" }, { status: 500 });
  }
}
