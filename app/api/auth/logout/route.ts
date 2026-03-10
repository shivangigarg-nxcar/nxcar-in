import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_BASE_URL } from '@lib/constants';

const HTTPONLY_COOKIES = ['user_id', 'auth_token', 'nxcar_user_id', 'session_id'];
const PUBLIC_COOKIES = ['role_id'];

const BASE_DELETE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 0,
  expires: new Date(0),
};

function clearAllCookies(response: NextResponse) {
  for (const name of HTTPONLY_COOKIES) {
    response.cookies.set(name, '', { ...BASE_DELETE_OPTIONS, httpOnly: true });
  }
  for (const name of PUBLIC_COOKIES) {
    response.cookies.set(name, '', { ...BASE_DELETE_OPTIONS, httpOnly: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value || "";

    if (token) {
      try {
        await fetch(`${AUTH_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
          body: JSON.stringify({ user_id: nxcarUserId }),
        });
      } catch (e) {
      }
    }

    const response = NextResponse.json({ success: true });
    clearAllCookies(response);
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: true });
    clearAllCookies(response);
    return response;
  }
}
