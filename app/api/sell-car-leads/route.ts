import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';
import { insertSellCarLeadSchema } from '@shared/schema';
import { fromError } from 'zod-validation-error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = insertSellCarLeadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: fromError(result.error).toString() }, { status: 400 });
    }
    const lead = await storage.createSellCarLead(result.data);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sell car lead" }, { status: 500 });
  }
}
