import { NextRequest, NextResponse } from 'next/server';
import { db } from '@lib/db';
import { carReviews } from '@shared/schema';
import { sql, inArray } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { carIds } = await request.json();
    if (!Array.isArray(carIds) || carIds.length === 0) {
      return NextResponse.json({});
    }
    
    const ratings = await db
      .select({
        carId: carReviews.carId,
        average: sql<number>`ROUND(AVG(${carReviews.rating})::numeric, 1)`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(carReviews)
      .where(inArray(carReviews.carId, carIds.map(Number)))
      .groupBy(carReviews.carId);

    const ratingsMap: Record<number, { average: number; count: number }> = {};
    for (const id of carIds) {
      ratingsMap[id] = { average: 0, count: 0 };
    }
    for (const r of ratings) {
      ratingsMap[r.carId] = { average: Number(r.average), count: r.count };
    }

    return NextResponse.json(ratingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }
}
