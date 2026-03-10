import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCarDetailUrl(car: { id: number | string; name: string; location?: string }): string {
  const city = slugify(car.location || "all") || "all";
  const slug = slugify(car.name) || "car";
  return `/used-cars/${city}/${slug}-${car.id}`;
}
