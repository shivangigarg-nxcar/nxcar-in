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

    let vehicleId = body.vehicle_id ? String(body.vehicle_id) : "";

    if (!vehicleId && body.sell_data) {
      try {
        const sellPayload = { ...body.sell_data };
        if (nxcarUserId && !sellPayload.user_id) {
          sellPayload.user_id = nxcarUserId;
        }

        const sellHeaders: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (authToken) {
          sellHeaders["Authorization"] = authToken;
        }

        const sellResponse = await fetchWithTimeout(
          `${BASE_URL}/sell`,
          {
            method: "POST",
            headers: sellHeaders,
            body: JSON.stringify(sellPayload),
          },
          15000
        );

        const sellData = await sellResponse.json();
        if (sellData?.vehicle_id) {
          vehicleId = String(sellData.vehicle_id);
        } else {
          const isAlreadyListed = Array.isArray(sellData) && sellData.some((msg: string) =>
            typeof msg === 'string' && msg.toLowerCase().includes('already listed')
          );
          if (isAlreadyListed && sellPayload.vehicle_number) {
            try {
              const lookupRes = await fetchWithTimeout(
                `${BASE_URL}/vehicle_details?vehicle_number=${encodeURIComponent(sellPayload.vehicle_number)}&backend=yes&from_crm=1`,
                {},
                10000
              );
              const lookupData = await lookupRes.json();
              if (lookupData?.existing_vehicle_ids?.length > 0) {
                vehicleId = String(lookupData.existing_vehicle_ids[0]);
              }
            } catch (lookupErr) {
              console.error("Vehicle lookup for existing ID failed:", lookupErr);
            }
          }
          if (!vehicleId) {
            console.error("Sell API did not return vehicle_id:", sellData);
          }
        }
      } catch (sellError) {
        console.error("Auto-sell before inspection failed:", sellError);
      }
    }

    const payload: Record<string, string> = {
      user_id: String(body.user_id || ""),
      vehicle_id: vehicleId,
      city: String(body.city || ""),
      inspection_date: String(body.inspection_date || ""),
      pincode: String(body.pincode || ""),
      address: String(body.address || ""),
      time: String(body.time || ""),
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const response = await fetchWithTimeout(
      `${BASE_URL}/userprofile-book-inspection`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      },
      15000
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Nxcar book-inspection API error:", response.status, data);
      let errorMsg = "Failed to book inspection";
      if (typeof data === 'string') {
        errorMsg = data.replace(/<[^>]*>/g, '').trim();
      } else if (Array.isArray(data)) {
        errorMsg = data.map((e: string) => e.replace(/<[^>]*>/g, '').trim()).filter(Boolean).join(', ');
      } else if (data?.message) {
        errorMsg = typeof data.message === 'object' ? Object.values(data.message).join(', ') : data.message;
      } else if (data?.error) {
        errorMsg = typeof data.error === 'object' ? Object.values(data.error).join(', ') : data.error;
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: response.status }
      );
    }

    const responseData = typeof data === 'object' && data !== null ? { ...data } : { data };
    if (vehicleId && !responseData.vehicle_id) {
      responseData.vehicle_id = vehicleId;
    }
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error calling book-inspection API:", error);
    return NextResponse.json(
      { error: "Failed to book inspection. Please try again." },
      { status: 500 }
    );
  }
}
