import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp, is_dealer } = body;
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
        is_dealer: is_dealer !== undefined ? String(is_dealer) : "0",
        platform: "web",
      }),
    });
    const data = await response.json();

    const token = data.token || data.access_token;
    const userId = data.user_id ? String(data.user_id) : null;

    const res = NextResponse.json(data);

    if (token) {
      res.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    if (userId) {
      res.cookies.set('nxcar_user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return res;
  } catch (error) {
    console.error("Error verifying dealer OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
