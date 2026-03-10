import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@lib/storage';
import { BASE_URL } from '@lib/constants';

async function callNxcarShortlist(action: 'add' | 'remove', nxcarUserId: string, vehicleId: number, authToken?: string) {
  const endpoint = action === 'add' ? 'user-shortlisted' : 'user-removed-shortlisted';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = authToken;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_id: nxcarUserId, vehicle_id: String(vehicleId) }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await response.text();
    console.log(`Nxcar ${endpoint} response [${response.status}]:`, text.substring(0, 200));
    return response.ok;
  } catch (err) {
    console.error(`Nxcar ${endpoint} error:`, err);
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId: carIdStr } = await params;
    const carId = parseInt(carIdStr);
    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value;
    const authToken = cookieStore.get('auth_token')?.value;

    if (!userId && !nxcarUserId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    let nxcarSuccess = false;
    if (nxcarUserId) {
      nxcarSuccess = await callNxcarShortlist('add', nxcarUserId, carId, authToken);
    }

    let clientMeta: any = {};
    try {
      clientMeta = await request.json();
    } catch {}

    if (userId) {
      try {
        let localCar = await storage.getCarById(carId);

        if (localCar && localCar.imageUrl === "/images/car-sedan.png" && clientMeta.image) {
          const firstImage = clientMeta.image.split(",")[0]?.trim();
          if (firstImage && firstImage.startsWith("http")) {
            await storage.updateCar(carId, { imageUrl: firstImage });
            localCar = await storage.getCarById(carId);
          }
        }

        if (!localCar) {
          let imageUrl = "";
          let carName = "";
          let brand = "Unknown";
          let model = "Unknown";
          let year = new Date().getFullYear();
          let price = 0;
          let fuelType = "Petrol";
          let transmission = "Manual";
          let kilometers = 0;
          let location = "India";

          if (clientMeta.image) {
            const firstImg = clientMeta.image.split(",")[0]?.trim();
            if (firstImg && firstImg.startsWith("http")) imageUrl = firstImg;
          }
          if (clientMeta.name) carName = clientMeta.name;
          if (clientMeta.brand) brand = clientMeta.brand;
          if (clientMeta.model) model = clientMeta.model;
          if (clientMeta.year) year = clientMeta.year;
          if (clientMeta.price) price = Math.round(clientMeta.price);
          if (clientMeta.fuelType) fuelType = clientMeta.fuelType;
          if (clientMeta.transmission) transmission = clientMeta.transmission;
          if (clientMeta.kilometers) kilometers = clientMeta.kilometers;
          if (clientMeta.location) location = clientMeta.location;

          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const detailResponse = await fetch(`${BASE_URL}/listcar-individual`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify({ vehicle_id: String(carId) }),
              signal: controller.signal,
            });
            clearTimeout(timeout);

            if (detailResponse.ok) {
              const data = await detailResponse.json();
              const car = data?.individual;

              if (car && car.vehicle_id) {
                if (!imageUrl) {
                  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                    imageUrl = data.images[0]?.image_url || data.images[0]?.url || "";
                  }
                  if (!imageUrl && car.images) {
                    imageUrl = car.images.split(",")[0]?.trim() || "";
                  }
                }
                if (!carName) carName = `${car.make || ""} ${car.model || ""}`.trim();
                if (brand === "Unknown" && car.make) brand = car.make;
                if (model === "Unknown" && car.model) model = car.model;
                if (car.year) year = parseInt(car.year) || year;
                if (!price && car.price) price = Math.round(parseFloat(car.price) || 0);
                if (car.fuel_type) fuelType = car.fuel_type;
                if (car.transmission) transmission = car.transmission;
                if (car.mileage) kilometers = parseInt(car.mileage) || kilometers;
                if (car.city_name) location = car.city_name;
              }
            }
          } catch {}

          if (!carName) carName = `${brand} ${model}`.trim();
          if (carName === "Unknown Unknown") carName = "Unknown";

          await storage.syncExternalCar(carId, {
            name: carName || "Unknown",
            brand, model, year, price, fuelType, transmission, kilometers, location,
            imageUrl: imageUrl || "/images/car-sedan.png",
            isFeatured: false,
          });
        }

        await storage.addFavorite(userId, carId);
      } catch (localErr) {
        console.error('Local favorite storage error:', localErr);
      }
    }

    return NextResponse.json({ success: true, nxcarSynced: nxcarSuccess }, { status: 201 });
  } catch (error) {
    console.error('Favorite POST error:', error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId: carIdStr } = await params;
    const carId = parseInt(carIdStr);
    if (isNaN(carId)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value;
    const authToken = cookieStore.get('auth_token')?.value;

    if (!userId && !nxcarUserId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    let nxcarSuccess = false;
    if (nxcarUserId) {
      nxcarSuccess = await callNxcarShortlist('remove', nxcarUserId, carId, authToken);
    }

    if (userId) {
      try {
        await storage.removeFavorite(userId, carId);
      } catch (localErr) {
        console.error('Local favorite remove error:', localErr);
      }
    }

    return NextResponse.json({ success: true, nxcarSynced: nxcarSuccess });
  } catch (error) {
    console.error('Favorite DELETE error:', error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
