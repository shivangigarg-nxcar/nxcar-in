import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { insertUserCarPreferencesSchema } from '@shared/schema';

export async function GET() {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    const needsCookie = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const preferences = await storage.getUserCarPreferences(sessionId);
    const response = NextResponse.json(preferences || null);
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    const needsCookie = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const body = await request.json();
    const validatedData = insertUserCarPreferencesSchema.parse({
      ...body,
      sessionId,
    });
    const preferences = await storage.upsertUserCarPreferences(validatedData);
    const response = NextResponse.json(preferences);
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
