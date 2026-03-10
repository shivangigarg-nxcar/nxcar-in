import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSessionCookie = cookieStore.get('admin_session')?.value;

    if (adminSessionCookie) {
      try {
        const session = JSON.parse(adminSessionCookie);
        if (session.isAdmin) {
          return NextResponse.json({ isAdmin: true, username: session.username });
        }
      } catch {
        // Invalid cookie
      }
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
