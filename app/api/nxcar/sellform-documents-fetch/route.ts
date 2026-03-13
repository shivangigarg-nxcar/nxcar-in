import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicle_id');
    const createdBy = searchParams.get('created_by');

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicle_id is required' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('vehicle_id', vehicleId);
    if (createdBy) {
      params.append('created_by', createdBy);
    }

    const response = await fetch(`${BASE_URL}/sellform-documents-fetch?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
    });

    const rawText = await response.text();
    console.log('Documents fetch RAW response:', rawText);
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('Documents fetch: non-JSON response');
      return NextResponse.json({ error: 'Invalid response from documents API' }, { status: 500 });
    }

    if (!response.ok) {
      console.error('Documents fetch API error:', response.status, data);
      return NextResponse.json({ error: data?.message || 'Failed to fetch documents' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Documents fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
