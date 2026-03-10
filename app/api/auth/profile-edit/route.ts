import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_BASE_URL } from '@lib/constants';
import { db } from '@lib/db';
import { users } from '@shared/models/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let userId = cookieStore.get('user_id')?.value;
    let nxcarUserId = cookieStore.get('nxcar_user_id')?.value;
    let authToken = cookieStore.get('auth_token')?.value;

    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      if (!authToken && headerToken) {
        authToken = headerToken;
      }
    }

    const body = await request.json();
    const { name, dealership_name, email, phone_number, nxcar_user_id: bodyNxcarUserId } = body;

    if (!nxcarUserId && bodyNxcarUserId) {
      nxcarUserId = bodyNxcarUserId;
    }

    if (!userId && !authToken) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ message: "Full name is required" }, { status: 400 });
    }

    if (!nxcarUserId) {
      return NextResponse.json({ message: "Profile update requires a valid session. Please log out and log in again." }, { status: 400 });
    }

    const payload = {
      user_id: nxcarUserId,
      name: name.trim(),
      dealership_name: dealership_name?.trim() || " ",
      email: email?.trim() || "",
      phone_number: phone_number || "",
    };

    console.log('[profile-edit] Calling Nxcar API with payload:', JSON.stringify(payload));

    const response = await fetch(`${AUTH_BASE_URL}/v2/userprofile-edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": authToken } : {}),
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('[profile-edit] Nxcar API response status:', response.status, 'body:', responseText);

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ message: "Profile service error" }, { status: 500 });
    }

    if (response.ok) {
      try {
        if (userId) {
          const updateFields: any = { firstName: name.trim(), updatedAt: new Date() };
          if (email) updateFields.email = email.trim();
          if (phone_number) updateFields.phone = phone_number;
          await db.update(users).set(updateFields).where(eq(users.id, userId));
        }
      } catch (dbErr) {
        console.error('[profile-edit] Local DB update failed:', dbErr);
      }
      return NextResponse.json({ success: true, data, message: "Profile updated successfully" });
    } else {
      return NextResponse.json({ message: data.message || "Failed to update profile" }, { status: response.status >= 400 ? response.status : 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
