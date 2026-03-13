'use client';

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { useCarComparison, type ComparisonCar } from "@hooks/use-car-comparison";
import { toast as sonnerToast } from "sonner";
import {
  Car, MapPin, Fuel, Gauge, Heart, User,
  Phone, MessageCircle, Navigation, IndianRupee, Link2, GitCompare, CalendarDays
} from "lucide-react";

export interface CarListing {
  id: string;
  image: string | null;
  makeYear: number;
  make: string;
  model: string;
  variant: string;
  kilometersDriven: number;
  fuelType: string;
  transmission: string;
  price: number;
  listingDate: string;
  sellerName: string;
  sellerWebUrl?: string;
  city: string;
  ownership: string;
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}

export function formatKilometers(km: number): string {
  if (km >= 100000) return `${(km / 100000).toFixed(1)} Lakh km`;
  return `${km.toLocaleString("en-IN")} km`;
}

function formatListingDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "today";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return "1 month ago";
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildCarDetailSlug(make: string, model: string, variant: string, vehicleId: string): string {
  const combined = `${make} ${model} ${variant}`.trim();
  return `${toSlug(combined)}-${vehicleId}`;
}

export function CarListingCard({ car, citySlug, isFavorited, onToggleFavorite, isAuthenticated, onShowLogin }: { car: CarListing; citySlug?: string; isFavorited?: boolean; onToggleFavorite?: (carId: number, carData: CarListing) => void; isAuthenticated?: boolean; onShowLogin?: () => void; }) {
  const [imgError, setImgError] = useState(false);
  const { addToCompare, removeFromCompare, isInComparison, isComparisonFull } = useCarComparison();
  const firstImage = car.image ? car.image.split(",")[0].trim() : null;
  const detailUrl = citySlug
    ? `/used-cars/${citySlug}/${buildCarDetailSlug(car.make, car.model, car.variant, car.id)}`
    : `/car/${car.id}`;

  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerData, setSellerData] = useState<{
    car_data: any;
    seller_details: any;
    primaryImage: string | null;
  } | null>(null);

  const getUserId = (): string => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("authState");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.nxcar_user_id || parsed.user_id || "";
      } catch {}
    }
    return "";
  };

  const handleSellerClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      onShowLogin?.();
      return;
    }

    const userId = getUserId();
    if (!userId) {
      onShowLogin?.();
      return;
    }

    setSellerModalOpen(true);
    setSellerLoading(true);
    setSellerData(null);

    try {
      const [sellerRes, imageRes] = await Promise.all([
        fetch("/api/nxcar/showsellerinfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicle_id: car.id, user_id: userId }),
        }),
        fetch(`/api/nxcar/getImage?vehicle_id=${car.id}`),
      ]);

      const sellerJson = await sellerRes.json();
      const imageJson = await imageRes.json();

      let primaryImage: string | null = null;
      const imgArr = Array.isArray(imageJson) ? imageJson
        : imageJson?.images && Array.isArray(imageJson.images) ? imageJson.images
        : imageJson?.data && Array.isArray(imageJson.data) ? imageJson.data
        : [];
      if (imgArr.length > 0) {
        const primary = imgArr.find((img: any) => img.is_primary === "1" || img.is_primary === 1);
        primaryImage = primary?.image_url || primary?.url || imgArr[0]?.image_url || imgArr[0]?.url || null;
      }

      if (sellerJson?.status && sellerJson?.data) {
        setSellerData({
          car_data: sellerJson.data.car_data,
          seller_details: sellerJson.data.seller_details,
          primaryImage,
        });
      } else {
        setSellerData({
          car_data: { make: car.make, model: car.model, variant: car.variant, year: car.makeYear, price: car.price, fuel_type: car.fuelType, transmission: car.transmission, mileage: car.kilometersDriven },
          seller_details: { username: car.sellerName, address: "", phone_number: "", city_name: car.city },
          primaryImage: primaryImage || firstImage,
        });
      }
    } catch {
      setSellerData({
        car_data: { make: car.make, model: car.model, variant: car.variant, year: car.makeYear, price: car.price, fuel_type: car.fuelType, transmission: car.transmission, mileage: car.kilometersDriven },
        seller_details: { username: car.sellerName, address: "", phone_number: "", city_name: car.city },
        primaryImage: firstImage,
      });
    } finally {
      setSellerLoading(false);
    }
  };

  return (
    <div data-testid={`card-listing-${car.id}`}>
      <Link href={detailUrl}>
        <Card className="overflow-hidden cursor-pointer hover-elevate rounded-md">
          <div className="relative rounded-t-md overflow-hidden" style={{ aspectRatio: '7 / 5', minHeight: '180px' }}>
            {imgError || !firstImage ? (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2">
                <Car className="w-12 h-12 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Image not available</span>
              </div>
            ) : (
              <img
                src={firstImage}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            )}
            <Badge className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground border-0 text-xs" data-testid={`badge-year-${car.id}`}>
              {car.makeYear}
            </Badge>
            <div className="absolute top-2 right-2 flex gap-1.5 z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isInComparison(car.id)) {
                        removeFromCompare(car.id);
                      } else {
                        const compCar: ComparisonCar = {
                          id: car.id,
                          name: `${car.make} ${car.model}`,
                          brand: car.make,
                          model: car.model,
                          variant: car.variant,
                          year: car.makeYear,
                          price: car.price,
                          fuelType: car.fuelType,
                          transmission: car.transmission,
                          kilometers: car.kilometersDriven,
                          location: car.city,
                          imageUrl: firstImage || "",
                          ownership: car.ownership,
                        };
                        addToCompare(compCar);
                      }
                    }}
                    disabled={isComparisonFull && !isInComparison(car.id)}
                    aria-label={isInComparison(car.id) ? 'Remove from comparison' : 'Add to comparison'}
                    data-testid={`button-compare-${car.id}`}
                    className={`p-2 rounded-full backdrop-blur border transition-all ${
                      isInComparison(car.id)
                        ? 'bg-[#0EA9B2] border-[#0EA9B2] text-white'
                        : 'bg-background/70 border-border/50 text-muted-foreground hover:bg-[#0EA9B2]/80 hover:border-[#0EA9B2] hover:text-white'
                    } ${isComparisonFull && !isInComparison(car.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <GitCompare className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isInComparison(car.id) ? 'Added to compare' : isComparisonFull ? 'Max 3 cars' : 'Add to compare'}
                </TooltipContent>
              </Tooltip>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite?.(Number(car.id), car);
                }}
                className="p-2 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 transition-all hover:scale-110"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                data-testid={`button-favorite-${car.id}`}
              >
                <Heart className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              </button>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.currentTarget;
                const url = `${window.location.origin}${detailUrl}`;
                navigator.clipboard.writeText(url).then(() => {
                  btn.classList.add('text-green-500');
                  setTimeout(() => btn.classList.remove('text-green-500'), 1500);
                  sonnerToast.success("Selected car link copied");
                });
              }}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 transition-all hover:scale-110 z-10"
              aria-label="Copy link"
              data-testid={`button-copy-link-${car.id}`}
            >
              <Link2 className="h-4 w-4 text-muted-foreground transition-colors" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
              <span className="text-white font-bold text-lg" data-testid={`text-price-${car.id}`}>
                {formatPrice(car.price)}
              </span>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold truncate" data-testid={`text-title-${car.id}`}>
              {car.make} {car.model}
            </h3>
            <p className="text-xs text-muted-foreground truncate mb-3" data-testid={`text-variant-${car.id}`}>
              {car.variant}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Gauge className="w-3.5 h-3.5 text-primary" />
                <span data-testid={`text-km-${car.id}`}>{formatKilometers(car.kilometersDriven)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Fuel className="w-3.5 h-3.5 text-primary" />
                <span data-testid={`text-fuel-${car.id}`}>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Car className="w-3.5 h-3.5 text-primary" />
                <span data-testid={`text-transmission-${car.id}`}>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span data-testid={`text-city-${car.id}`}>{car.city}</span>
              </div>
              {car.listingDate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
                  <CalendarDays className="w-3.5 h-3.5 text-primary" />
                  <span data-testid={`text-listing-date-${car.id}`}>Listed {formatListingDate(car.listingDate)}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSellerClick}
              className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs gap-1 flex items-center justify-between font-medium"
              data-testid={`button-seller-${car.id}`}
            >
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {car.sellerName}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] opacity-90">
                {car.city}<MapPin className="w-3 h-3" />
              </span>
            </button>
          </CardContent>
        </Card>
      </Link>

      <Dialog open={sellerModalOpen} onOpenChange={setSellerModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Dealer Details</DialogTitle>
          <DialogDescription className="sr-only">Dealer information and contact details for this car.</DialogDescription>

          {sellerLoading ? (
            <div className="p-0">
              <Skeleton className="w-full rounded-none" style={{ aspectRatio: '16/9' }} />
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-[72px] rounded-lg" />
                  <Skeleton className="h-[72px] rounded-lg" />
                  <Skeleton className="h-[72px] rounded-lg" />
                  <Skeleton className="h-[72px] rounded-lg" />
                </div>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Skeleton className="h-10 rounded-md" />
                  <Skeleton className="h-10 rounded-md" />
                  <Skeleton className="h-10 rounded-md" />
                </div>
              </div>
            </div>
          ) : sellerData ? (
            <div>
              {sellerData.primaryImage && (
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={sellerData.primaryImage}
                    alt={`${sellerData.car_data?.make || car.make} ${sellerData.car_data?.model || car.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                    <p className="text-white font-bold text-lg">
                      {sellerData.car_data?.year || car.makeYear} {sellerData.car_data?.make || car.make} {sellerData.car_data?.model || car.model}
                    </p>
                    <p className="text-white/80 text-xs">{sellerData.car_data?.variant || car.variant}</p>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4">
                {!sellerData.primaryImage && (
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {sellerData.car_data?.year || car.makeYear} {sellerData.car_data?.make || car.make} {sellerData.car_data?.model || car.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{sellerData.car_data?.variant || car.variant}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <IndianRupee className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Price</span>
                    </div>
                    <p className="font-bold text-foreground">{formatPrice(Number(sellerData.car_data?.price) || car.price)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Gauge className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Driven</span>
                    </div>
                    <p className="font-bold text-foreground">{formatKilometers(Number(sellerData.car_data?.mileage) || car.kilometersDriven)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Fuel className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Fuel</span>
                    </div>
                    <p className="font-bold text-foreground text-sm">{sellerData.car_data?.fuel_type || car.fuelType}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Car className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Transmission</span>
                    </div>
                    <p className="font-bold text-foreground text-sm">{sellerData.car_data?.transmission || car.transmission}</p>
                  </div>
                </div>

                {sellerData.car_data?.emi && Number(sellerData.car_data.emi) > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">EMI starting from</span>
                    <span className="font-bold text-primary">₹{Number(sellerData.car_data.emi).toLocaleString("en-IN")}/mo</span>
                  </div>
                )}

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{sellerData.seller_details?.username || car.sellerName}</p>
                      <p className="text-xs text-muted-foreground">{sellerData.seller_details?.city_name || car.city}</p>
                    </div>
                  </div>

                  {sellerData.seller_details?.address && (
                    <div className="flex gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-muted-foreground text-xs leading-relaxed">{sellerData.seller_details.address}</p>
                    </div>
                  )}

                  {sellerData.seller_details?.phone_number && (
                    <div className="flex gap-2 text-sm items-center">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <p className="text-muted-foreground text-xs">+91 {sellerData.seller_details.phone_number}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <a
                    href={`https://www.google.com/maps/dir//${encodeURIComponent(sellerData.seller_details?.address || sellerData.seller_details?.city_name || car.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs h-10 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10" data-testid={`button-direction-${car.id}`}>
                      <Navigation className="mr-1.5 h-4 w-4" /> Direction
                    </Button>
                  </a>
                  <a
                    href={sellerData.seller_details?.phone_number
                      ? `https://wa.me/91${sellerData.seller_details.phone_number}?text=Hi, I'm interested in the ${sellerData.car_data?.year || car.makeYear} ${sellerData.car_data?.make || car.make} ${sellerData.car_data?.model || car.model} listed on NxCar.`
                      : `https://wa.me/919355924133?text=Hi, I'm interested in the ${car.makeYear} ${car.make} ${car.model} listed on NxCar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs h-10 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10" data-testid={`button-chat-${car.id}`}>
                      <MessageCircle className="mr-1.5 h-4 w-4" /> Chat
                    </Button>
                  </a>
                  <a href={`tel:${sellerData.seller_details?.phone_number || '+919355924133'}`}>
                    <Button size="sm" className="w-full text-xs h-10" data-testid={`button-call-${car.id}`}>
                      <Phone className="mr-1.5 h-4 w-4" /> Call
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="w-full" style={{ aspectRatio: "7/5" }} />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
