import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { workshopName, ownerName, phone, email, city, services, yearsInBusiness } = body;

    if (!ownerName || !phone) {
      return NextResponse.json(
        { error: "Owner name and phone number are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const serviceLine = Array.isArray(services) ? services.join(", ") : "";
    const addressParts = [
      city || "",
      yearsInBusiness ? `${yearsInBusiness} years experience` : "",
      serviceLine ? `Services: ${serviceLine}` : "",
    ].filter(Boolean).join(", ");

    const response = await fetch(`${BASE_URL}/partners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: workshopName || ownerName,
        name: ownerName,
        email: email || "",
        phone_number: phone,
        address: addressParts || "N/A",
        city_id: "1",
        state_id: "1",
        pincode: "000000",
        is_dealer: "0",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Service Partner API error:", response.status, data);
      return NextResponse.json(
        { error: data?.message || data?.error || "Failed to submit service partner application" },
        { status: response.status }
      );
    }

    if (data.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 409 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Service partner proxy error:", error);
    return NextResponse.json(
      { error: "Failed to submit service partner application" },
      { status: 500 }
    );
  }
}
