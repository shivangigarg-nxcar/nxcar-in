import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, loanType, income } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    try {
      await storage.createSellCarLead({
        carNumber: `LOAN-${loanType || 'general'}`,
        name,
        phone,
      });
    } catch {
    }

    try {
      await fetch('https://api.nxcar.in/v2/loan_enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          loan_type: loanType || 'pre-owned-purchase',
          income: income || '',
        }),
      });
    } catch {
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process loan application" },
      { status: 500 }
    );
  }
}
