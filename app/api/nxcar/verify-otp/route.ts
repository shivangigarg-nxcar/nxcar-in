import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp } = body;
    if (!mobile || !otp) {
      return NextResponse.json({ error: "mobile and otp are required" }, { status: 400 });
    }
    const response = await fetch(`${BASE_URL}/otpVerification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile,
        otp: String(otp),
        is_consent: "1",
        is_dealer: "0",
        platform: "web",
      }),
    });
    const data = await response.json();

    if (response.ok && (data.token || data.access_token)) {
      return NextResponse.json({ verified: true, message: "OTP verified successfully" });
    }

    return NextResponse.json(
      { verified: false, error: data.message || "Invalid OTP" },
      { status: response.ok ? 200 : response.status }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
