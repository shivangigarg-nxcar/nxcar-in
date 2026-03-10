import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, mobile, subject, message } = body;

    if (!name || !mobile) {
      return NextResponse.json(
        { error: "Name and mobile number are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const response = await fetchWithTimeout(
      `${BASE_URL}/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          subject: subject || "General Inquiry",
          message: message || "",
          ...(body.dealer_info_id ? { dealer_info_id: body.dealer_info_id } : {}),
        }),
      },
      8000
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Contact API error:", response.status, data);
      return NextResponse.json(
        { error: data?.message || "Failed to submit contact details" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Contact proxy error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact details" },
      { status: 500 }
    );
  }
}
