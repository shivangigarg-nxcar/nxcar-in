import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';

const AI_API_URL = process.env.NXCAR_AI_API_URL || 'https://ai.nxcar.in';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetchWithTimeout(
      `${AI_API_URL}/fetch-car-data`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      15000
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid response from AI API' }, { status: 502 });
    }

    if (!response.ok || data.status === 'error') {
      return NextResponse.json({ error: data.message || 'Failed to fetch chart data' }, { status: response.ok ? 404 : response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching car chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
