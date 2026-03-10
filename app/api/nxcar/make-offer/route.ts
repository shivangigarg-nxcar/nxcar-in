import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicle_id, user_id, offer_amount } = body;

    if (!vehicle_id || !user_id || !offer_amount) {
      return NextResponse.json({ error: "vehicle_id, user_id, and offer_amount are required" }, { status: 400 });
    }

    const authToken = request.cookies.get("auth_token")?.value;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const makeOfferRes = await fetchWithTimeout(`${BASE_URL}/listcar-individual-makeoffer`, {
      method: "POST",
      headers,
      body: JSON.stringify({ vehicle_id, user_id, offer_amount }),
    }, 10000);

    const makeOfferData = await makeOfferRes.json();

    if (!makeOfferRes.ok) {
      return NextResponse.json({
        error: makeOfferData?.message || "Failed to submit offer",
        details: makeOfferData,
      }, { status: 400 });
    }

    let userOfferData = null;
    try {
      const userOfferRes = await fetchWithTimeout(`${BASE_URL}/user-makeoffer`, {
        method: "POST",
        headers,
        body: JSON.stringify({ user_id, vehicle_id }),
      }, 10000);
      userOfferData = await userOfferRes.json();
    } catch {}

    return NextResponse.json({
      success: true,
      makeOffer: makeOfferData,
      userOffer: userOfferData,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit offer" }, { status: 500 });
  }
}
