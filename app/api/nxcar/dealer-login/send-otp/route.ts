import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile } = body;
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Valid 10-digit mobile number required" }, { status: 400 });
    }
    const response = await fetch(`${BASE_URL}/mobile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, signature: "nxfin" }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending dealer OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
