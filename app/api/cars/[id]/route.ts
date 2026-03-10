import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id);

    const localCar = await storage.getCarById(numId);
    if (localCar) {
      return NextResponse.json(localCar);
    }

    try {
      const allCars = await cachedFetch('cars_list_all', 300, async () => {
        const externalResponse = await fetchWithTimeout(`${BASE_URL}/listallcars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }, 8000);

        if (!externalResponse.ok) {
          throw new Error(`External API responded with ${externalResponse.status}`);
        }

        const data = await externalResponse.json();
        return data.allcars || [];
      });

      const externalCar = allCars.find((car: any) => parseInt(car.vehicle_id) === numId);

      if (externalCar && externalCar.images && externalCar.images.startsWith("http")) {
        const transformedCar = {
          id: parseInt(externalCar.vehicle_id),
          name: `${externalCar.make} ${externalCar.model}`,
          brand: externalCar.make || "Unknown",
          model: externalCar.model || "Unknown",
          year: parseInt(externalCar.year) || new Date().getFullYear(),
          price: Math.round(parseFloat(externalCar.price) || 0),
          fuelType: externalCar.fuel_type || "Petrol",
          transmission: externalCar.transmission || "Manual",
          kilometers: parseInt(externalCar.mileage) || 0,
          location: externalCar.city_name || "India",
          imageUrl: externalCar.images,
          isFeatured: false,
          createdAt: new Date(externalCar.created_date || Date.now()),
        };
        return NextResponse.json(transformedCar);
      }
    } catch (externalError) {
    }

    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}
