import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { loginSchema } from '@shared/schema';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { username, password } = result.data;
    const user = await storage.getAdminUserByUsername(username);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const adminSession = JSON.stringify({ isAdmin: true, username });

    const response = NextResponse.json({ success: true, username });
    response.cookies.set('admin_session', adminSession, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
