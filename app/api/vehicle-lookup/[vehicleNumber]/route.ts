import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vehicleNumber: string }> }
) {
  try {
    const { vehicleNumber } = await params;
    const cleanNumber = vehicleNumber.toUpperCase().replace(/\s/g, '');

    const data = await cachedFetch(`vehicle_lookup_${cleanNumber}`, 1800, async () => {
      const response = await fetchWithTimeout(
        `${BASE_URL}/vehicle_details?vehicle_number=${cleanNumber}&backend=yes&from_crm=1`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        8000
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle details: ${response.status}`);
      }

      return await response.json();
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicle details" }, { status: 500 });
  }
}
