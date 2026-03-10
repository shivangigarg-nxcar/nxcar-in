import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);
    const isFeatured = request.nextUrl.searchParams.get('featured') === "true" ? true : undefined;

    const result = await cachedFetch(`cars_homepage_${limit}`, 300, async () => {
      try {
        const externalResponse = await fetchWithTimeout(`${BASE_URL}/homepage-vehicles`, {}, 8000);

        if (externalResponse.ok) {
          const data = await externalResponse.json();
          const allCars = Array.isArray(data) ? data : Object.values(data);

          const carsWithImages = allCars.filter((car: any) =>
            car.primary_image_url && car.primary_image_url.startsWith("http")
          );

          return carsWithImages.slice(0, limit).map((car: any, index: number) => ({
            id: parseInt(car.vehicle_id) || index + 1000,
            name: `${car.make} ${car.model}`,
            brand: car.make || "Unknown",
            model: car.model || "Unknown",
            variant: car.variant || "",
            year: parseInt(car.year) || new Date().getFullYear(),
            price: Math.round(parseFloat(car.price) || 0),
            emi: Math.round(parseFloat(car.emi) || 0),
            fuelType: car.fuel_type || "Petrol",
            transmission: car.transmission || "Manual",
            kilometers: parseInt(car.mileage) || 0,
            ownership: car.ownership || "",
            location: car.city_name || "India",
            sellerName: car.seller_name || "",
            imageUrl: car.primary_image_url,
            isFeatured: true,
            createdAt: new Date(car.created_date || Date.now()),
          }));
        }
      } catch (externalError) {
      }

      const cars = await storage.getCars(limit, isFeatured);
      return cars;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}
