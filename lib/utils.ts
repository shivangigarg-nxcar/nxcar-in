import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCarDetailUrl(car: { id?: number | string; vehicle_id?: number | string; name?: string; make?: string; model?: string; variant?: string; year?: number | string; manufacturing_year?: number | string; location?: string; city_name?: string; city?: string }): string {
  const vehicleId = car.vehicle_id || car.id || "";
  const cityRaw = car.city_name || car.city || car.location || "all";
  const city = slugify(cityRaw) || "all";

  let carName = car.name || "";
  if (!carName) {
    const parts = [car.make, car.model].filter(Boolean);
    carName = parts.join(" ");
  }
  const slug = slugify(carName) || "car";
  return `/used-cars/${city}/${slug}-${vehicleId}`;
}
