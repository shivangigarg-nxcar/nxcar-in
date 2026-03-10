import { NextRequest, NextResponse } from 'next/server';
import { AUTH_BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { phone, login_id } = await request.json();
    if (!phone || !login_id) {
      return NextResponse.json({ message: "Phone and login_id required" }, { status: 400 });
    }


    const response = await fetch(`${AUTH_BASE_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: phone,
        signature: "Team Nxcar",
        login_id: login_id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, message: "OTP resent successfully" });
    } else {
      return NextResponse.json({ message: data.message || "Failed to resend OTP" }, { status: response.status >= 400 ? response.status : 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Failed to resend OTP" }, { status: 500 });
  }
}
