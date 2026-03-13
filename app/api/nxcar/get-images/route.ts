import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const vehicleId = request.nextUrl.searchParams.get('vehicle_id');

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicle_id is required' }, { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/getImage?vehicle_id=${vehicleId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
