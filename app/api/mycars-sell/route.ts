import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from '@lib/constants';

async function fetchWithRetry(url: string, options: RequestInit, timeoutMs: number, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw new Error('All retries exhausted');
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value;

    if (!authToken || !nxcarUserId) {
      return NextResponse.json([], { status: 200 });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': authToken,
    };

    const response = await fetchWithRetry(
      `${BASE_URL}/v2/userprofile-mycars-sell`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: nxcarUserId }),
      },
      20000
    );

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (!response.ok) {
      console.error('mycars-sell API error:', response.status);
      return NextResponse.json([], { status: 200 });
    }

    if (!contentType.includes('application/json')) {
      console.error('mycars-sell returned non-JSON response:', contentType);
      return NextResponse.json([], { status: 200 });
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('mycars-sell JSON parse error:', parseErr);
      return NextResponse.json([], { status: 200 });
    }

    if (data?.status === false) {
      return NextResponse.json([], { status: 200 });
    }

    const cars = Array.isArray(data) ? data : data?.data || data?.cars || [];
    return NextResponse.json(cars);
  } catch (error) {
    console.error('mycars-sell error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
