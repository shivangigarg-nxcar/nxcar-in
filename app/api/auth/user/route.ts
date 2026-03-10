import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@lib/db';
import { users } from '@shared/models/auth';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    const roleId = cookieStore.get('role_id')?.value || null;

    return NextResponse.json(
      { user: { ...user[0], role_id: roleId } },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
