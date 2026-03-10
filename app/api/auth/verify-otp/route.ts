import { NextRequest, NextResponse } from 'next/server';
import { AUTH_BASE_URL } from '@lib/constants';
import { db } from '@lib/db';
import { users } from '@shared/models/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();
    if (!phone || !otp) {
      return NextResponse.json({ message: "Phone and OTP required" }, { status: 400 });
    }


    const response = await fetch(`${AUTH_BASE_URL}/otpVerification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: phone,
        otp: String(otp),
        is_consent: "1",
        is_dealer: "0",
        platform: "web",
      }),
    });

    const responseText = await response.text();

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ message: "Verification service error" }, { status: 500 });
    }

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Invalid OTP" }, { status: 400 });
    }

    const token = data.token || data.access_token;
    const nxcarUserId = data.user_id ? String(data.user_id) : null;

    const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

    let user;
    const nxcarUsername = data.username || null;

    if (existing.length > 0) {
      const updateFields: any = { updatedAt: new Date() };
      if (nxcarUsername && !existing[0].firstName) {
        updateFields.firstName = nxcarUsername;
      }
      const [updated] = await db
        .update(users)
        .set(updateFields)
        .where(eq(users.id, existing[0].id))
        .returning();
      user = updated;
    } else {
      const [created] = await db
        .insert(users)
        .values({ phone, firstName: nxcarUsername })
        .returning();
      user = created;
    }


    const res = NextResponse.json({
      success: true,
      user: {
        ...user,
        nxcar_user_id: nxcarUserId,
        username: data.username || null,
        role_id: data.role_id || null,
        is_dealer: data.is_dealer || false,
        isVerified: data.isVerified,
        first_login: data.first_login ?? null,
        platform: data.platform || "web",
      },
      token: token,
      expires_at: data.expires_at || null,
    });

    res.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    if (token) {
      res.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (nxcarUserId) {
      res.cookies.set('nxcar_user_id', nxcarUserId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (data.role_id) {
      res.cookies.set('role_id', String(data.role_id), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}
