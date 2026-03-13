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

    const response = await fetch(`${BASE_URL}/userprofile-edit-mycar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Edit mycar API error:', response.status, data);
      const errorMsg = data?.message || data?.error || 'Failed to update car details';
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Edit mycar error:', error);
    return NextResponse.json({ error: 'Failed to update car details' }, { status: 500 });
  }
}
