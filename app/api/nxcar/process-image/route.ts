import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.vehicle_id) {
      return NextResponse.json({ error: 'vehicle_id is required' }, { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/vehicles/process-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify({
        vehicle_id: body.vehicle_id,
        type: body.type || 'both',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Process image API error:', response.status, data);
      return NextResponse.json({ error: data?.message || 'Failed to process images' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Process image error:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
}
