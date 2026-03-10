import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { BASE_URL } from '@lib/constants';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';

async function fetchImageFromListings(carId: number): Promise<string | null> {
  try {
    const allListingsData = await cachedFetch('all_listings_for_images', 300, async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/listallcars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fltr: [] }),
      }, 10000);
      const data = await response.json();
      const cars = data?.allcars;
      if (!Array.isArray(cars)) return {};
      const map: Record<string, string> = {};
      for (const car of cars) {
        if (car.vehicle_id && car.images) {
          const firstImg = String(car.images).split(",")[0]?.trim();
          if (firstImg && firstImg.startsWith("http")) {
            map[String(car.vehicle_id)] = firstImg;
          }
        }
      }
      return map;
    });
    return allListingsData[String(carId)] || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const favorites = await storage.getFavorites(userId);

    const brokenCars = favorites.filter(car => car.imageUrl === '/images/car-sedan.png');
    if (brokenCars.length > 0) {
      const fixPromises = brokenCars.map(async (car) => {
        const imageUrl = await fetchImageFromListings(car.id);
        if (imageUrl) {
          await storage.updateCar(car.id, { imageUrl });
          car.imageUrl = imageUrl;
        }
      });
      await Promise.all(fixPromises);
    }

    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}
