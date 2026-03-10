'use client';

import Link from "next/link";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Fuel, Gauge, Settings2 } from "lucide-react";

export interface DealerCar {
  vehicle_id: string;
  make: string;
  model: string;
  variant: string;
  year: string;
  price: number;
  mileage: string;
  fuel_type: string;
  transmission: string;
  city_name: string;
  images: string;
  ownership: string;
  seller_name: string;
  emi: number;
  updated_date: string;
  is_active: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} L`;
  return price.toLocaleString("en-IN");
}

function formatEmi(emi: number): string {
  return Math.floor(emi).toLocaleString("en-IN");
}

function getCarDetailUrl(car: DealerCar, citySlug: string): string {
  const make = slugify(car.make || "");
  const model = slugify(car.model || "");
  const variant = slugify(car.variant || "");
  const combined = [make, model, variant].filter(Boolean).join("-");
  const carSlug = combined ? `${combined}-${car.vehicle_id}` : `car-${car.vehicle_id}`;
  return `/used-cars/${citySlug}/${carSlug}`;
}

function resolveCarImages(images: string): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  if (images.startsWith("http")) return [images];
  return [];
}

export function DealerCarCard({ car, citySlug }: { car: DealerCar; citySlug: string }) {
  const images = resolveCarImages(car.images);
  const mainImage = images[0] || "/images/car-placeholder.jpg";
  const price = typeof car.price === "number" ? car.price : parseFloat(String(car.price)) || 0;
  const emi = typeof car.emi === "number" ? car.emi : parseFloat(String(car.emi)) || 0;

  return (
    <Link href={getCarDetailUrl(car, citySlug)} data-testid={`card-dealer-car-${car.vehicle_id}`}>
      <Card className="overflow-hidden border-border hover:border-primary/40 hover:shadow-md transition-all group h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={mainImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/car-placeholder.jpg"; }}
          />
          <Badge className="absolute top-2 left-2 bg-black/60 text-white text-[10px] border-0">
            {car.year}
          </Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {car.make} {car.model}
          </h3>
          <p className="text-xs text-muted-foreground truncate mb-2">{car.variant}</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 flex-wrap">
            <span className="flex items-center gap-0.5"><Gauge className="h-3 w-3" /> {parseInt(car.mileage || "0").toLocaleString()} km</span>
            <span className="flex items-center gap-0.5"><Fuel className="h-3 w-3" /> {car.fuel_type}</span>
            <span className="flex items-center gap-0.5"><Settings2 className="h-3 w-3" /> {car.transmission}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-bold text-primary" data-testid={`text-price-${car.vehicle_id}`}>
              ₹ {formatPrice(price)}
            </p>
            {emi > 0 && (
              <p className="text-[10px] text-muted-foreground">EMI ₹{formatEmi(emi)}/mo</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
