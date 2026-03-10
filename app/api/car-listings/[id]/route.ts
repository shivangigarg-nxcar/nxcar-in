import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { insertCarListingSchema } from '@shared/schema';
import { fromError } from 'zod-validation-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    const listing = await storage.getCarListingById(numId);
    if (!listing) {
      return NextResponse.json({ error: "Car listing not found" }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car listing" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    const existing = await storage.getCarListingById(numId);
    if (!existing) {
      return NextResponse.json({ error: "Car listing not found" }, { status: 404 });
    }
    if (existing.sessionId && existing.sessionId !== sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const body = await request.json();
    const validation = insertCarListingSchema.partial().safeParse(body);
    
    if (!validation.success) {
      const error = fromError(validation.error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    const updatedListing = await storage.updateCarListing(numId, validation.data);
    if (!updatedListing) {
      return NextResponse.json({ error: "Car listing not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedListing);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update car listing" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    const existing = await storage.getCarListingById(numId);
    if (!existing) {
      return NextResponse.json({ error: "Car listing not found" }, { status: 404 });
    }
    if (existing.sessionId && existing.sessionId !== sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const deleted = await storage.deleteCarListing(numId);
    if (!deleted) {
      return NextResponse.json({ error: "Car listing not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete car listing" }, { status: 500 });
  }
}
