import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { insertPlatformFeedbackSchema } from '@shared/schema';
import { fromError } from 'zod-validation-error';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    const needsCookie = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const body = await request.json();
    const feedbackData = {
      ...body,
      sessionId,
      userAgent: request.headers.get("user-agent") || null,
    };

    const result = insertPlatformFeedbackSchema.safeParse(feedbackData);
    if (!result.success) {
      return NextResponse.json({ error: fromError(result.error).message }, { status: 400 });
    }

    const feedback = await storage.createPlatformFeedback(result.data);
    const response = NextResponse.json(feedback, { status: 201 });
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
