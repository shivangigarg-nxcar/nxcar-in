import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value;

    const rawBody = await request.json();

    if (nxcarUserId && !rawBody.user_id) {
      rawBody.user_id = nxcarUserId;
    }

    delete rawBody.Year;
    delete rawBody.Ownership;

    const lowercaseFields = ['fule_type', 'transmission'];
    const numericStringFields = ['year', 'ownership', 'mileage', 'make_id', 'model_id', 'variant_id', 'expected_selling_price', 'price', 'fule_id', 'rto_id', 'state_id', 'city', 'vehicletype_id'];

    const body: Record<string, any> = {};
    for (const [key, value] of Object.entries(rawBody)) {
      if (numericStringFields.includes(key) && value !== undefined && value !== null && value !== "") {
        body[key] = String(value);
      } else if (lowercaseFields.includes(key) && typeof value === 'string') {
        body[key] = value.toLowerCase();
      } else {
        body[key] = value;
      }
    }

    if (body.transmission) body.transmission = body.transmission.toLowerCase();
    if (body.fule_type) body.fule_type = body.fule_type.toLowerCase();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const response = await fetchWithTimeout(
      `${BASE_URL}/sell`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
      15000
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Nxcar sell API error:", response.status, data);
      let errorMsg = "Failed to submit car details";
      if (typeof data === 'string') {
        errorMsg = data.replace(/<[^>]*>/g, '').trim();
      } else if (Array.isArray(data)) {
        errorMsg = data.map((e: string) => e.replace(/<[^>]*>/g, '').trim()).filter(Boolean).join(', ');
      } else if (data?.message) {
        errorMsg = data.message;
      } else if (data?.error) {
        errorMsg = data.error;
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error calling sell API:", error);
    return NextResponse.json(
      { error: "Failed to submit car details. Please try again." },
      { status: 500 }
    );
  }
}
