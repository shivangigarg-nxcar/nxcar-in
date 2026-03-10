import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { insertNotificationSubscriptionSchema } from '@shared/schema';
import { fromError } from 'zod-validation-error';

export async function GET() {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    const needsCookie = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const subscription = await storage.getNotificationSubscriptionBySession(sessionId);
    const response = NextResponse.json(subscription || null);
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
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
    const subscriptionData = {
      ...body,
      sessionId,
    };

    const result = insertNotificationSubscriptionSchema.safeParse(subscriptionData);
    if (!result.success) {
      return NextResponse.json({ error: fromError(result.error).message }, { status: 400 });
    }

    const subscription = await storage.createNotificationSubscription(result.data);
    const response = NextResponse.json(subscription, { status: 201 });
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
