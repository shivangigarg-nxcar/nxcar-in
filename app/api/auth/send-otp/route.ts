import { NextRequest, NextResponse } from 'next/server';
import { AUTH_BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ message: "Valid 10-digit Indian phone number required" }, { status: 400 });
    }


    const response = await fetch(`${AUTH_BASE_URL}/mobile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: phone,
        signature: "nxcar",
      }),
    });

    const responseText = await response.text();

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ message: "OTP service error" }, { status: 500 });
    }

    const loginId = data.login_id || data.id;
    if (response.ok && (data.status === true || loginId)) {
      return NextResponse.json({ success: true, login_id: loginId, message: data.message || "OTP sent successfully" });
    } else {
      return NextResponse.json({ message: data.message || "Failed to send OTP" }, { status: response.status >= 400 ? response.status : 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
