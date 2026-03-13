'use client';

import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Fuel, Gauge, Settings2, MapPin, Heart, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { getCarDetailUrl } from "@lib/utils";

const PAGE_SIZE = 8;

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

export function formatPriceShortLabel(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return `${price}`;
}

export function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30";
  }
}

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card border-border rounded-xl animate-pulse">
      <div className="aspect-[4/3] w-full bg-muted" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-6 bg-muted rounded" />
          <div className="h-6 bg-muted rounded" />
          <div className="h-6 bg-muted rounded" />
        </div>
        <div className="h-5 bg-muted rounded w-1/3" />
      </CardContent>
    </Card>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function buildSellDetailUrl(car: any) {
  const name = resolveCarName(car);
  return getCarDetailUrl({
    vehicle_id: car.vehicle_id || car.id,
    city_name: car.city_name,
    city: car.city,
    location: car.location,
    make: car.make || car.brand,
    model: car.model,
    variant: car.variant,
  });
}

export function resolveCarImage(car: any): { url: string; isBrandLogo: boolean } {
  const imgs = car.images;
  const firstImage = Array.isArray(imgs) && imgs.length > 0
    ? (typeof imgs[0] === "string" ? imgs[0] : imgs[0]?.image_url || imgs[0]?.url)
    : typeof imgs === "string" && imgs ? imgs : null;
  const carPhoto = firstImage || car.image_url || car.front_image || car.imageUrl;
  if (carPhoto) return { url: carPhoto, isBrandLogo: false };
  const brandLogo = car.car_make_url || car.make_image;
  if (brandLogo) return { url: brandLogo, isBrandLogo: true };
  return { url: "/images/car-sedan.png", isBrandLogo: false };
}

function resolveCarName(car: any): string {
  const make = car.make || car.make_name || car.brand || "";
  const model = car.model || car.model_name || "";
  return `${make} ${model}`.trim() || car.car_name || "Car";
}

function CarSpecBadges({ mileage, fuelType, transmission }: { mileage: number; fuelType: string; transmission: string }) {
  return (
    <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground mb-4 font-mono uppercase">
      {Number(mileage) > 0 && (
        <div className="flex items-center bg-muted rounded px-1.5 py-1 border border-border">
          <Gauge className="h-2.5 w-2.5 mr-1.5 text-muted-foreground" />
          {(Number(mileage) / 1000).toFixed(0)}k km
        </div>
      )}
      {fuelType && (
        <div className="flex items-center bg-muted rounded px-1.5 py-1 border border-border">
          <Fuel className="h-2.5 w-2.5 mr-1.5 text-muted-foreground" />
          {fuelType}
        </div>
      )}
      {transmission && (
        <div className="flex items-center bg-muted rounded px-1.5 py-1 border border-border">
          <Settings2 className="h-2.5 w-2.5 mr-1.5 text-muted-foreground" />
          {transmission.slice(0, 4)}
        </div>
      )}
    </div>
  );
}

export function BuyCarCard({ car, isFavorited, onToggleFavorite }: { car: any; isFavorited?: boolean; onToggleFavorite?: (carId: number, e: React.MouseEvent) => void }) {
  const carName = resolveCarName(car);
  const resolved = resolveCarImage(car);
  const imageUrl = resolved.url;
  const vehicleId = car.vehicle_id || car.id;
  const year = car.manufacturing_year || car.year || "";
  const variant = car.variant || "";
  const location = car.city_name || car.city || car.location || "";
  const fuelType = car.fule_type || car.fuel_type || car.fuelType || "";
  const transmission = car.transmission || "";
  const mileage = car.mileage || car.kilometers || 0;
  const price = car.expected_selling_price || car.price || car.expectedPrice || 0;

  const detailUrl = getCarDetailUrl({
    vehicle_id: vehicleId,
    city_name: car.city_name,
    city: car.city,
    location: car.location,
    make: car.make || car.brand,
    model: car.model,
    variant: car.variant,
  });

  return (
    <Link href={detailUrl}>
      <Card className="group overflow-hidden bg-card border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.1)] cursor-pointer" data-testid={`card-favorite-${vehicleId}`} role="article">
        <div className="aspect-[7/5] w-full overflow-hidden bg-muted relative flex items-center justify-center">
          <img
            src={imageUrl}
            alt={carName}
            className={`transition-transform duration-500 group-hover:scale-105 ${resolved.isBrandLogo ? "w-24 h-24 object-contain" : "h-full w-full object-contain"}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const brandLogo = car.car_make_url || car.make_image;
              if (brandLogo && target.src !== brandLogo) {
                target.src = brandLogo;
                target.className = "w-24 h-24 object-contain transition-transform duration-500 group-hover:scale-105";
              } else {
                target.src = "/images/car-sedan.png";
              }
            }}
          />
          {year && (
            <Badge className="absolute top-3 left-3 bg-black/80 text-white backdrop-blur border border-border text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {year}
            </Badge>
          )}
          {onToggleFavorite && (
            <button
              onClick={(e) => onToggleFavorite(Number(vehicleId), e)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur hover:bg-black/80 transition-colors z-10"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              data-testid={`button-toggle-favorite-${vehicleId}`}
            >
              <Heart className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          )}
        </div>
        <CardContent className="p-4 relative">
          <h3 className="font-heading text-base font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors" data-testid={`text-car-name-${vehicleId}`}>
            {carName}
          </h3>
          {variant && <p className="text-xs text-muted-foreground mb-2 truncate">{variant}</p>}
          {location && (
            <div className="flex items-center text-xs text-muted-foreground mb-3 font-medium">
              <MapPin className="h-3 w-3 mr-1 text-primary" /> {location}
            </div>
          )}
          <CarSpecBadges mileage={mileage} fuelType={fuelType} transmission={transmission} />
          {Number(price) > 0 && (
            <span className="text-lg font-black text-primary italic" data-testid={`text-car-price-${vehicleId}`}>
              {formatPrice(Number(price))}
            </span>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="flex-1 h-9 text-xs font-bold uppercase tracking-wider bg-muted text-foreground hover:bg-primary hover:text-white border border-border transition-all" variant="ghost" data-testid={`button-view-details-${vehicleId}`}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function SellCarCard({ car, onBookInspection }: { car: any; onBookInspection: (car: any) => void }) {
  const carName = resolveCarName(car);
  const resolved = resolveCarImage(car);
  const imageUrl = resolved.url;
  const isBrandLogo = resolved.isBrandLogo;
  const vehicleId = car.vehicle_id || car.id;
  const status = car.status || car.sell_status || "pending";
  const year = car.year || car.manufacturing_year || "";
  const variant = car.variant || "";
  const location = car.city_name || car.city || car.location || "";
  const fuelType = car.fule_type || car.fuel_type || car.fuelType || "";
  const transmission = car.transmission || "";
  const mileage = car.mileage || car.kilometers || 0;
  const price = car.expected_selling_price || car.price || car.expectedPrice || 0;
  const sellerLower = parseFloat(car.seller_lower_price) || 0;
  const sellerUpper = parseFloat(car.seller_upper_price) || 0;

  const detailUrl = `${buildSellDetailUrl(car)}?from=sell`;

  return (
    <Link href={detailUrl}>
      <Card className="group overflow-hidden bg-card border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.1)] cursor-pointer" data-testid={`card-sell-${vehicleId}`} role="article">
        <div className="aspect-[7/5] w-full overflow-hidden bg-muted relative flex items-center justify-center">
          <img
            src={imageUrl}
            alt={carName}
            className={`transition-transform duration-500 group-hover:scale-105 ${isBrandLogo ? "w-24 h-24 object-contain" : "h-full w-full object-contain"}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const brandLogo = car.car_make_url || car.make_image;
              if (brandLogo && target.src !== brandLogo) {
                target.src = brandLogo;
                target.className = "w-24 h-24 object-contain transition-transform duration-500 group-hover:scale-105";
              } else {
                target.src = "/images/car-sedan.png";
              }
            }}
          />
          {year && (
            <Badge className="absolute top-3 left-3 bg-black/80 text-white backdrop-blur border border-border text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {year}
            </Badge>
          )}
          <Badge className={`absolute top-3 right-3 border text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${getStatusColor(status)}`} data-testid={`badge-sell-status-${vehicleId}`}>
            {status}
          </Badge>
        </div>
        <CardContent className="p-4 relative">
          <h3 className="font-heading text-base font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors" data-testid={`text-sell-name-${vehicleId}`}>
            {carName}
          </h3>
          {variant && <p className="text-xs text-muted-foreground mb-2 truncate">{variant}</p>}
          {location && (
            <div className="flex items-center text-xs text-muted-foreground mb-3 font-medium">
              <MapPin className="h-3 w-3 mr-1 text-primary" /> {location}
            </div>
          )}
          <CarSpecBadges mileage={mileage} fuelType={fuelType} transmission={transmission} />
          {sellerLower > 0 && sellerUpper > 0 ? (
            <div data-testid={`text-sell-price-${vehicleId}`}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Estimated Price</p>
              <span className="text-lg font-black text-primary italic">
                ₹ {formatPriceShortLabel(sellerLower)} - {formatPriceShortLabel(sellerUpper)}
              </span>
            </div>
          ) : Number(price) > 0 ? (
            <span className="text-lg font-black text-primary italic" data-testid={`text-sell-price-${vehicleId}`}>
              {formatPrice(Number(price))}
            </span>
          ) : null}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookInspection(car); }}
            variant="outline"
            className="w-full h-9 text-xs font-bold uppercase tracking-wider border-primary/30 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            data-testid={`button-book-inspection-${vehicleId}`}
          >
            <ClipboardCheck className="h-4 w-4" /> Book Inspection
          </Button>
          {car.is_active === "1" ? (
            <span className="self-end text-[10px] font-bold uppercase tracking-wider text-green-600" data-testid={`text-active-status-${vehicleId}`}>Active Listing</span>
          ) : car.is_active === "0" ? (
            <span className="self-end text-[10px] font-bold uppercase tracking-wider text-red-500" data-testid={`text-active-status-${vehicleId}`}>Inactive Listing</span>
          ) : null}
        </CardFooter>
      </Card>
    </Link>
  );
}

export function AdCarCard({ car }: { car: any }) {
  const carName = resolveCarName(car);
  const resolved = resolveCarImage(car);
  const imageUrl = resolved.url;
  const isBrandLogo = resolved.isBrandLogo;
  const vehicleId = car.vehicle_id || car.id;
  const status = car.status || car.sell_status || "pending";
  const year = car.year || car.manufacturing_year || "";
  const variant = car.variant || "";
  const location = car.city_name || car.city || car.location || "";
  const fuelType = car.fule_type || car.fuel_type || car.fuelType || "";
  const transmission = car.transmission || "";
  const mileage = car.mileage || car.kilometers || 0;
  const price = car.price || car.expected_selling_price || car.expectedPrice || 0;

  const detailUrl = buildSellDetailUrl(car);

  return (
    <Link href={detailUrl}>
      <Card className="group overflow-hidden bg-card border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.1)] cursor-pointer" data-testid={`card-ad-${vehicleId}`} role="article">
        <div className="aspect-[7/5] w-full overflow-hidden bg-muted relative flex items-center justify-center">
          <img
            src={imageUrl}
            alt={carName}
            className={`transition-transform duration-500 group-hover:scale-105 ${isBrandLogo ? "w-24 h-24 object-contain" : "h-full w-full object-contain"}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const brandLogo = car.car_make_url || car.make_image;
              if (brandLogo && target.src !== brandLogo) {
                target.src = brandLogo;
                target.className = "w-24 h-24 object-contain transition-transform duration-500 group-hover:scale-105";
              } else {
                target.src = "/images/car-sedan.png";
              }
            }}
          />
          {year && (
            <Badge className="absolute top-3 left-3 bg-black/80 text-white backdrop-blur border border-border text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {year}
            </Badge>
          )}
          <Badge className={`absolute top-3 right-3 border text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${getStatusColor(status)}`} data-testid={`badge-ad-status-${vehicleId}`}>
            {status}
          </Badge>
        </div>
        <CardContent className="p-4 relative">
          <h3 className="font-heading text-base font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors" data-testid={`text-ad-name-${vehicleId}`}>
            {carName}
          </h3>
          {variant && <p className="text-xs text-muted-foreground mb-2 truncate">{variant}</p>}
          {location && (
            <div className="flex items-center text-xs text-muted-foreground mb-3 font-medium">
              <MapPin className="h-3 w-3 mr-1 text-primary" /> {location}
            </div>
          )}
          <CarSpecBadges mileage={mileage} fuelType={fuelType} transmission={transmission} />
          <div className="flex items-end justify-between">
            {Number(price) > 0 ? (
              <span className="text-lg font-black text-primary italic" data-testid={`text-ad-price-${vehicleId}`}>
                {formatPrice(Number(price))}
              </span>
            ) : <span />}
            {car.is_active === "1" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-600" data-testid={`text-ad-active-status-${vehicleId}`}>Active Listing</span>
            ) : car.is_active === "0" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500" data-testid={`text-ad-active-status-${vehicleId}`}>Inactive Listing</span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
