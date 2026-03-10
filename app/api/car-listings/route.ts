import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { insertCarListingSchema } from '@shared/schema';
import { fromError } from 'zod-validation-error';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50', 10);
    const cookieStore = await cookies();
    const sessionId = request.nextUrl.searchParams.get('session_id') || cookieStore.get('session_id')?.value;

    let listings;
    if (sessionId) {
      listings = await storage.getCarListingsBySession(sessionId, limit);
    } else {
      listings = await storage.getCarListings(limit, true);
    }
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car listings" }, { status: 500 });
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
    const listingData = {
      ...body,
      sessionId,
    };

    const result = insertCarListingSchema.safeParse(listingData);
    if (!result.success) {
      return NextResponse.json({ error: fromError(result.error).toString() }, { status: 400 });
    }

    const listing = await storage.createCarListing(result.data);
    const response = NextResponse.json(listing, { status: 201 });
    if (needsCookie) {
      response.cookies.set('session_id', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to create car listing" }, { status: 500 });
  }
}
