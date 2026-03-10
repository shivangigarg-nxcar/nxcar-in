"use client";

import { memo, useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Fuel, Gauge, Settings2, MapPin, Heart, Star, Link2, Car, User, Phone, MessageCircle, Navigation, IndianRupee } from "lucide-react";
import Link from "next/link";
import { getCarDetailUrl } from "@lib/utils";
import { toast } from "sonner";

export interface CarCardData {
  id: number;
  name: string;
  brand: string;
  model: string;
  variant?: string | null;
  year: number;
  price: number;
  emi?: number;
  fuelType: string;
  transmission: string;
  kilometers: number;
  location: string;
  sellerName?: string;
  imageUrl?: string | null;
}

export interface CarCardProps {
  car: CarCardData;
  isFavorite: boolean;
  onToggleFavorite: (carId: number, e: React.MouseEvent) => void;
  ratingsMap: Record<number, { average: number; count: number }>;
  testIdSuffix?: string;
  actionButtons?: React.ReactNode;
  isAuthenticated?: boolean;
  onShowLogin?: () => void;
  compact?: boolean;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function formatKilometers(km: number): string {
  if (km >= 100000) return `${(km / 100000).toFixed(1)}L km`;
  return `${km.toLocaleString("en-IN")} km`;
}

const CarRatingDisplay = memo(function CarRatingDisplay({ carId, ratingsMap, suffix }: { carId: number; ratingsMap: Record<number, { average: number; count: number }>; suffix: string }) {
  const rating = ratingsMap[carId];
  if (!rating || rating.count === 0) return null;

  return (
    <div className="flex items-center gap-1 text-xs" data-testid={`rating-display-${suffix}`}>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{rating.average}</span>
      <span className="text-muted-foreground">({rating.count})</span>
    </div>
  );
});

export const CarCard = memo(function CarCard({ car, isFavorite, onToggleFavorite, ratingsMap, testIdSuffix, actionButtons, isAuthenticated, onShowLogin, compact }: CarCardProps) {
  const detailUrl = getCarDetailUrl(car);
  const suffix = testIdSuffix || String(car.id);

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
      } catch { return ""; }
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
          car_data: { make: car.brand, model: car.model, variant: car.variant || "", year: car.year, price: car.price, fuel_type: car.fuelType, transmission: car.transmission, mileage: car.kilometers },
          seller_details: { username: car.sellerName || "", address: "", phone_number: "", city_name: car.location },
          primaryImage: primaryImage || car.imageUrl || null,
        });
      }
    } catch {
      setSellerData({
        car_data: { make: car.brand, model: car.model, variant: car.variant || "", year: car.year, price: car.price, fuel_type: car.fuelType, transmission: car.transmission, mileage: car.kilometers },
        seller_details: { username: car.sellerName || "", address: "", phone_number: "", city_name: car.location },
        primaryImage: car.imageUrl || null,
      });
    } finally {
      setSellerLoading(false);
    }
  };

  const showSellerButton = !!car.sellerName;

  return (
    <div>
      <Link href={detailUrl} data-testid={`card-car-${suffix}`}>
        <Card className="overflow-hidden cursor-pointer rounded-md hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <div className="relative rounded-t-md overflow-hidden" style={{ aspectRatio: '7 / 5', minHeight: compact ? '120px' : '180px' }}>
            {car.imageUrl ? (
              <img
                src={car.imageUrl}
                alt={`${car.year} ${car.name}`}
                className="w-full h-full object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2">
                <Car className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} text-muted-foreground`} />
                {!compact && <span className="text-xs text-muted-foreground">Image not available</span>}
              </div>
            )}
            <Badge className={`absolute top-1.5 left-1.5 bg-background/90 backdrop-blur-sm text-foreground border-0 ${compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs'}`} data-testid={`badge-year-${suffix}`}>
              {car.year}
            </Badge>
            <div className={`absolute top-1.5 right-1.5 flex gap-1`}>
              {!compact && actionButtons}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(car.id, e); }}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                data-testid={`button-favorite-${suffix}`}
                className={`${compact ? 'p-1.5' : 'p-2'} rounded-full bg-background/70 backdrop-blur-sm border border-border/50 transition-all hover:scale-110`}
              >
                <Heart
                  className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
              </button>
            </div>
            {!compact && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const btn = e.currentTarget;
                  const url = `${window.location.origin}${detailUrl}`;
                  navigator.clipboard.writeText(url).then(() => {
                    btn.classList.add('text-green-500');
                    setTimeout(() => btn.classList.remove('text-green-500'), 1500);
                    toast.success("Selected car link copied");
                  });
                }}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 transition-all hover:scale-110 z-10"
                aria-label="Copy link"
                data-testid={`button-copy-link-${suffix}`}
              >
                <Link2 className="h-4 w-4 text-muted-foreground transition-colors" />
              </button>
            )}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent ${compact ? 'p-2 pt-6' : 'p-3 pt-8'}`}>
              <span className={`text-white font-bold ${compact ? 'text-sm' : 'text-lg'}`} data-testid={`text-price-${suffix}`}>
                {formatPrice(car.price)}
              </span>
            </div>
          </div>
          <CardContent className={compact ? "p-2.5" : "p-4"}>
            <h3 className={`font-bold truncate ${compact ? 'text-xs' : ''}`} data-testid={`text-title-${suffix}`}>
              {car.name}
            </h3>
            {!compact && (
              <p className="text-xs text-muted-foreground truncate mb-3">
                {car.brand} {car.model}
              </p>
            )}
            {compact ? (
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Gauge className="w-2.5 h-2.5 text-primary" />
                  {formatKilometers(car.kilometers)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Fuel className="w-2.5 h-2.5 text-primary" />
                  {car.fuelType}
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Gauge className="w-3.5 h-3.5 text-primary" />
                    <span>{formatKilometers(car.kilometers)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Fuel className="w-3.5 h-3.5 text-primary" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Settings2 className="w-3.5 h-3.5 text-primary" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{car.location}</span>
                  </div>
                </div>
                {showSellerButton ? (
                  <button
                    onClick={handleSellerClick}
                    className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs gap-1 flex items-center justify-between font-medium"
                    data-testid={`button-seller-${suffix}`}
                  >
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {car.sellerName}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] opacity-90">
                      {car.location}<MapPin className="w-3 h-3" />
                    </span>
                  </button>
                ) : (
                  <CarRatingDisplay carId={car.id} ratingsMap={ratingsMap} suffix={suffix} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Link>

      {showSellerButton && (
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
                      alt={`${sellerData.car_data?.make || car.brand} ${sellerData.car_data?.model || car.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                      <p className="text-white font-bold text-lg">
                        {sellerData.car_data?.year || car.year} {sellerData.car_data?.make || car.brand} {sellerData.car_data?.model || car.model}
                      </p>
                      <p className="text-white/80 text-xs">{sellerData.car_data?.variant || car.variant || ""}</p>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {!sellerData.primaryImage && (
                    <div>
                      <p className="font-bold text-lg text-foreground">
                        {sellerData.car_data?.year || car.year} {sellerData.car_data?.make || car.brand} {sellerData.car_data?.model || car.model}
                      </p>
                      <p className="text-xs text-muted-foreground">{sellerData.car_data?.variant || car.variant || ""}</p>
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
                      <p className="font-bold text-foreground">{formatKilometers(Number(sellerData.car_data?.mileage) || car.kilometers)}</p>
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
                        <Settings2 className="w-3.5 h-3.5 text-primary" />
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
                        <p className="text-xs text-muted-foreground">{sellerData.seller_details?.city_name || car.location}</p>
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
                      href={`https://www.google.com/maps/dir//${encodeURIComponent(sellerData.seller_details?.address || sellerData.seller_details?.city_name || car.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs h-10 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10" data-testid={`button-direction-${suffix}`}>
                        <Navigation className="mr-1.5 h-4 w-4" /> Direction
                      </Button>
                    </a>
                    <a
                      href={sellerData.seller_details?.phone_number
                        ? `https://wa.me/91${sellerData.seller_details.phone_number}?text=Hi, I'm interested in the ${sellerData.car_data?.year || car.year} ${sellerData.car_data?.make || car.brand} ${sellerData.car_data?.model || car.model} listed on NxCar.`
                        : `https://wa.me/919355924132?text=Hi, I'm interested in the ${car.year} ${car.brand} ${car.model} listed on NxCar.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs h-10 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10" data-testid={`button-chat-${suffix}`}>
                        <MessageCircle className="mr-1.5 h-4 w-4" /> Chat
                      </Button>
                    </a>
                    <a href={`tel:${sellerData.seller_details?.phone_number || '+919355924132'}`}>
                      <Button size="sm" className="w-full text-xs h-10" data-testid={`button-call-${suffix}`}>
                        <Phone className="mr-1.5 h-4 w-4" /> Call
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});
