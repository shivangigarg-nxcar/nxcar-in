import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone_number, address, city_id, state_id, pincode, is_dealer } = body;
    if (!name || !phone_number) {
      return NextResponse.json({ error: "name and phone_number are required" }, { status: 400 });
    }
    if (!city_id || !state_id) {
      return NextResponse.json({ error: "city and state are required" }, { status: 400 });
    }
    const response = await fetch(`${BASE_URL}/partners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: phone_number,
        name,
        email: email || "",
        phone_number,
        address: address || "",
        city_id: String(city_id),
        state_id: String(state_id),
        pincode: pincode || "",
        is_dealer: is_dealer ? "1" : "0",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error registering partner:", error);
    return NextResponse.json({ error: "Failed to register partner" }, { status: 500 });
  }
}
