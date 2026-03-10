'use client';

import { useState, useCallback, useEffect } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Fuel, Gauge, Settings2, MapPin, Heart, Car, Shield, Megaphone, Loader2, ChevronDown, ClipboardCheck, X, Calendar, Clock, MapPinned, CheckCircle2, FileText, ArrowRight, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyCarsSell, getMyCarsSellAds, getMyCarsBuy } from "@lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@hooks/use-toast";
import { useAuth } from "@hooks/use-auth";
import { useFavorites } from "@hooks/use-favorites";
import LoginModal from "@components/login-modal";

const PAGE_SIZE = 8;

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function formatPriceShortLabel(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return `${price}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30";
  }
}

function CardSkeleton() {
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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function LoadMoreButton({ visible, onClick, loading }: { visible: boolean; onClick: () => void; loading?: boolean }) {
  if (!visible) return null;
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onClick}
        variant="outline"
        className="px-8 py-3 text-sm font-semibold uppercase tracking-wider border-border hover:border-primary hover:text-primary transition-all gap-2"
        disabled={loading}
        data-testid="button-load-more"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /></>
        ) : (
          <><ChevronDown className="h-4 w-4" /> Load More</>
        )}
      </Button>
    </div>
  );
}

function useLazyList<T>(items: T[]) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, items.length));
      setLoadingMore(false);
    }, 300);
  }, [items.length]);

  return { visibleItems, hasMore, loadMore, loadingMore };
}

function BuyCarCard({ car, isFavorited, onToggleFavorite }: { car: any; isFavorited?: boolean; onToggleFavorite?: (carId: number, e: React.MouseEvent) => void }) {
  const carName = `${car.make || ''} ${car.model || ''}`.trim() || car.car_name || "Car";
  const imageUrl = car.images || car.front_image || car.image_url || car.imageUrl || "/images/car-sedan.png";
  const vehicleId = car.vehicle_id || car.id;
  const year = car.manufacturing_year || car.year || "";
  const variant = car.variant || "";
  const location = car.city_name || car.city || car.location || "";
  const fuelType = car.fule_type || car.fuel_type || car.fuelType || "";
  const transmission = car.transmission || "";
  const mileage = car.mileage || car.kilometers || 0;
  const price = car.expected_selling_price || car.price || car.expectedPrice || 0;

  const citySlug = (location || "india").toLowerCase().replace(/\s+/g, "-");
  const nameSlug = carName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const detailUrl = `/used-cars/${citySlug}/${nameSlug}${year ? year : ""}-${vehicleId}`;

  return (
    <Link href={detailUrl}>
      <Card className="group overflow-hidden bg-card border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.1)] cursor-pointer" data-testid={`card-favorite-${vehicleId}`} role="article">
        <div className="aspect-[7/5] w-full overflow-hidden bg-muted relative">
          <img src={imageUrl} alt={carName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "/images/car-sedan.png"; }} />
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

function buildSellDetailUrl(car: any) {
  const carName = `${car.make || ''} ${car.model || ''}`.trim();
  const vehicleId = car.vehicle_id || car.id;
  const year = car.year || car.manufacturing_year || "";
  const location = car.city_name || car.city || car.location || "";
  const citySlug = (location || "india").toLowerCase().replace(/\s+/g, "-");
  const nameSlug = carName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/used-cars/${citySlug}/${nameSlug}${year ? year : ""}-${vehicleId}`;
}

interface InspectionSlot {
  slot_id: string;
  slot_name: string;
  slot_time: string;
  is_available: boolean;
}

interface SellCity {
  city_id: string;
  city_name: string;
  inspection_available: boolean;
}

function BookInspectionModal({ car, onClose }: { car: any; onClose: () => void }) {
  const { toast } = useToast();
  const router = useRouter();
  const vehicleId = car.vehicle_id || car.id;
  const carName = `${car.make || ''} ${car.model || ''}`.trim();
  const location = car.city_name || car.city || car.location || "";
  const docUploadUrl = `${buildSellDetailUrl(car)}?from=sell`;

  const [city, setCity] = useState(location);
  const [inspectionDate, setInspectionDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: slotsData } = useQuery({
    queryKey: ["inspection-slots"],
    queryFn: async () => {
      const res = await fetch("/api/nxcar/inspection-slots");
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      return (data.data || []) as InspectionSlot[];
    },
  });

  const { data: citiesData } = useQuery({
    queryKey: ["sell-cities"],
    queryFn: async () => {
      const res = await fetch("/api/sell-cities");
      if (!res.ok) throw new Error("Failed to fetch cities");
      const json = await res.json();
      return (json.cities || json || []) as SellCity[];
    },
  });

  const slots = slotsData || [];
  const cities = (citiesData || []).filter(c => c.inspection_available !== false);

  function getMinDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  function formatDateForApi(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  }

  async function handleSubmit() {
    if (!city || !inspectionDate || !timeSlot || !address) {
      toast({ title: "Missing details", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const pincodeMatch = address.match(/\b(\d{6})\b/);
    const pincode = pincodeMatch ? pincodeMatch[1] : "";

    setSubmitting(true);
    try {
      const selectedSlot = slots.find(s => s.slot_id === timeSlot);
      const res = await fetch("/api/book-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          city,
          inspection_date: formatDateForApi(inspectionDate),
          pincode,
          address,
          time: selectedSlot?.slot_name || timeSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book inspection");
      }

      setSuccess(true);
      toast({ title: "Inspection Booked!", description: `Your inspection for ${carName} has been scheduled.` });
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground" data-testid="text-book-inspection-title">Book Inspection</h2>
              <p className="text-xs text-muted-foreground">{carName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" data-testid="button-close-inspection-modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1" data-testid="text-inspection-success">Inspection Booked!</h3>
            <p className="text-sm text-muted-foreground mb-5">
              We'll contact you to confirm the inspection for your {carName}.
            </p>

            <div className="w-full bg-muted/50 rounded-2xl p-4 border border-border/50 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                <span className="text-sm font-semibold text-foreground">Next Step</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Upload Documents</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Upload your RC copy, insurance, PAN card and payment details to speed up the selling process.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    router.push(docUploadUrl);
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-sm font-semibold gap-2"
                  data-testid="button-upload-now"
                >
                  <Upload className="w-4 h-4" />
                  Upload Now
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl h-11 text-sm font-semibold border-border hover:bg-muted"
                  data-testid="button-upload-later"
                >
                  I'll Do It Later
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              You can always upload documents from your car's detail page
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MapPinned className="w-3.5 h-3.5 text-primary" /> City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                data-testid="select-inspection-city"
              >
                <option value="">Select city</option>
                {cities.map(c => (
                  <option key={c.city_id} value={c.city_name}>{c.city_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Inspection Date
              </label>
              <Input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                min={getMinDate()}
                className="rounded-xl"
                data-testid="input-inspection-date"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {slots.length > 0 ? slots.filter(s => s.is_available).map(slot => (
                  <button
                    key={slot.slot_id}
                    type="button"
                    onClick={() => setTimeSlot(slot.slot_id)}
                    className={`px-2 py-2.5 rounded-xl text-xs font-medium transition-all border text-center ${
                      timeSlot === slot.slot_id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                    data-testid={`button-slot-${slot.slot_id}`}
                  >
                    <div className="font-semibold">{slot.slot_name}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{slot.slot_time}</div>
                  </button>
                )) : (
                  <>{[1, 2, 3].map((i) => (<div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />))}</>

                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MapPinned className="w-3.5 h-3.5 text-primary" /> Address
              </label>
              <textarea
                placeholder="Full address for inspection"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                data-testid="input-inspection-address"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white rounded-xl py-3 mt-2"
              data-testid="button-submit-inspection"
            >
              {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</>) : "Book Inspection"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function resolveCarImage(car: any): string {
  const imgs = car.images;
  const firstImage = Array.isArray(imgs) && imgs.length > 0
    ? (typeof imgs[0] === "string" ? imgs[0] : imgs[0]?.image_url || imgs[0]?.url)
    : typeof imgs === "string" && imgs ? imgs : null;
  return firstImage || car.image_url || car.front_image || car.imageUrl || car.car_make_url || "/images/car-sedan.png";
}

function SellCarCard({ car, onBookInspection }: { car: any; onBookInspection: (car: any) => void }) {
  const carName = `${car.make || ''} ${car.model || ''}`.trim();
  const imageUrl = resolveCarImage(car);
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
        <div className="aspect-[7/5] w-full overflow-hidden bg-muted relative">
          <img src={imageUrl} alt={carName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "/images/car-sedan.png"; }} />
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
        <CardFooter className="p-4 pt-0 gap-2">
          <Button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookInspection(car); }}
            variant="outline"
            className="w-full h-9 text-xs font-bold uppercase tracking-wider border-primary/30 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            data-testid={`button-book-inspection-${vehicleId}`}
          >
            <ClipboardCheck className="h-4 w-4" /> Book Inspection
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

function AdCarCard({ car }: { car: any }) {
  const carName = `${car.make || ''} ${car.model || ''}`.trim();
  const imageUrl = resolveCarImage(car);
  const vehicleId = car.vehicle_id || car.id;
  const status = car.status || car.sell_status || "pending";
  const year = car.year || car.manufacturing_year || "";
  const variant = car.variant || "";
  const location = car.city_name || car.city || car.location || "";
  const fuelType = car.fule_type || car.fuel_type || car.fuelType || "";
  const transmission = car.transmission || "";
  const mileage = car.mileage || car.kilometers || 0;
  const price = car.expected_selling_price || car.price || car.expectedPrice || 0;

  const detailUrl = buildSellDetailUrl(car);

  return (
    <Link href={detailUrl}>
      <Card className="group overflow-hidden bg-card border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.1)] cursor-pointer" data-testid={`card-ad-${vehicleId}`} role="article">
        <div className="aspect-[7/5] w-full overflow-hidden bg-muted relative">
          <img src={imageUrl} alt={carName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "/images/car-sedan.png"; }} />
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
          {Number(price) > 0 && (
            <span className="text-lg font-black text-primary italic" data-testid={`text-ad-price-${vehicleId}`}>
              {formatPrice(Number(price))}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MyCars() {
  const [activeTab, setActiveTab] = useState<"favorites" | "listings">("favorites");
  const [listingSubTab, setListingSubTab] = useState<"sell" | "ads">("sell");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, syncExternalIds } = useFavorites();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [inspectionCar, setInspectionCar] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);
  const queryClient = useQueryClient();

  const { data: buyListings = [], isLoading: buyLoading } = useQuery({
    queryKey: ["mycars-buy"],
    queryFn: getMyCarsBuy,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (buyListings.length > 0) {
      const vehicleIds = buyListings
        .map((car: any) => Number(car.vehicle_id || car.id))
        .filter((id: number) => !isNaN(id) && id > 0);
      if (vehicleIds.length > 0) {
        syncExternalIds(vehicleIds);
      }
    }
  }, [buyListings, syncExternalIds]);

  const handleToggleFavorite = useCallback((carId: number, e?: React.MouseEvent) => {
    toggleFavorite(carId, e);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["mycars-buy"] });
    }, 1500);
  }, [toggleFavorite, queryClient]);

  const { data: sellListings = [], isLoading: sellLoading } = useQuery({
    queryKey: ["mycars-sell"],
    queryFn: getMyCarsSell,
    enabled: isAuthenticated,
  });

  const { data: adListings = [], isLoading: adsLoading } = useQuery({
    queryKey: ["mycars-sell-ads"],
    queryFn: getMyCarsSellAds,
    enabled: isAuthenticated,
  });

  const buyLazy = useLazyList(buyListings);
  const sellLazy = useLazyList(sellListings);
  const adsLazy = useLazyList(adListings);

  return (
    <div className="min-h-screen bg-background" data-testid="my-cars-page">
      <Navbar />

      <section className="pt-20 pb-3">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="text-page-title">My Cars</h1>
              <p className="text-xs text-muted-foreground" data-testid="text-page-subtitle">Your saved and listed vehicles</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-3 bg-background border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <div className="flex gap-4" role="tablist" aria-label="Car sections">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "favorites" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-testid="tab-favorites"
              role="tab"
              aria-selected={activeTab === "favorites"}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              Favorites
              {buyListings.length > 0 && (
                <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
                  {buyListings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "listings" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-testid="tab-listings"
              role="tab"
              aria-selected={activeTab === "listings"}
            >
              <Car className="h-4 w-4 inline mr-2" />
              My Listings
            </button>
          </div>
        </div>
      </section>

      <section className="py-6 bg-background relative min-h-[400px]" role="tabpanel">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
          {activeTab === "favorites" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-bold text-muted-foreground mb-2">Login to see favorites</h2>
                  <p className="text-muted-foreground mb-6">Sign in to view your saved cars.</p>
                </div>
              ) : buyLoading ? (
                <SkeletonGrid />
              ) : buyListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-bold text-muted-foreground mb-2" data-testid="text-empty-favorites">No favorites yet</h2>
                  <p className="text-muted-foreground mb-6">Browse cars to add favorites.</p>
                  <Link href="/used-cars">
                    <Button className="bg-primary hover:bg-primary/90 font-bold uppercase" data-testid="button-browse-cars">Browse Cars</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="grid-favorites">
                    {buyLazy.visibleItems.map((car: any, index: number) => (
                      <motion.div
                        key={car.vehicle_id || car.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (index % PAGE_SIZE) * 0.05 }}
                      >
                        <BuyCarCard car={car} isFavorited={isFavorite(Number(car.vehicle_id || car.id))} onToggleFavorite={handleToggleFavorite} />
                      </motion.div>
                    ))}
                  </div>
                  <LoadMoreButton visible={buyLazy.hasMore} onClick={buyLazy.loadMore} loading={buyLazy.loadingMore} />
                  {buyListings.length > 0 && (
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      Showing {buyLazy.visibleItems.length} of {buyListings.length} cars
                    </p>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === "listings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Car className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-bold text-muted-foreground mb-2">Login to see your listings</h2>
                  <p className="text-muted-foreground mb-6">Sign in to manage your cars.</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setListingSubTab("sell")}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all border ${
                        listingSubTab === "sell" ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid="subtab-sell"
                    >
                      <Shield className="h-4 w-4" />
                      Sell
                      {sellListings.length > 0 && (
                        <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">{sellListings.length}</span>
                      )}
                    </button>
                    <button
                      onClick={() => setListingSubTab("ads")}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all border ${
                        listingSubTab === "ads" ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid="subtab-ads"
                    >
                      <Megaphone className="h-4 w-4" />
                      Ads
                      {adListings.length > 0 && (
                        <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">{adListings.length}</span>
                      )}
                    </button>
                  </div>

                  {listingSubTab === "sell" ? (
                    sellLoading ? (
                      <SkeletonGrid />
                    ) : sellListings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-bold text-muted-foreground mb-2" data-testid="text-empty-sell">No sell listings yet</h2>
                        <p className="text-muted-foreground mb-6">Cars submitted for selling will appear here.</p>
                        <Link href="/sell-used-car">
                          <Button className="bg-primary hover:bg-primary/90 font-bold uppercase" data-testid="button-sell-car">Sell Your Car</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="grid-sell-listings">
                          {sellLazy.visibleItems.map((car: any, index: number) => (
                            <motion.div
                              key={car.vehicle_id || car.id || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: (index % PAGE_SIZE) * 0.05 }}
                            >
                              <SellCarCard car={car} onBookInspection={setInspectionCar} />
                            </motion.div>
                          ))}
                        </div>
                        <LoadMoreButton visible={sellLazy.hasMore} onClick={sellLazy.loadMore} loading={sellLazy.loadingMore} />
                        {sellListings.length > 0 && (
                          <p className="text-center text-xs text-muted-foreground mt-4">
                            Showing {sellLazy.visibleItems.length} of {sellListings.length} cars
                          </p>
                        )}
                      </>
                    )
                  ) : (
                    adsLoading ? (
                      <SkeletonGrid />
                    ) : adListings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Megaphone className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-bold text-muted-foreground mb-2" data-testid="text-empty-ads">No ad listings yet</h2>
                        <p className="text-muted-foreground mb-6">Your ad listings will appear here.</p>
                        <Link href="/sell-used-car">
                          <Button className="bg-primary hover:bg-primary/90 font-bold uppercase" data-testid="button-sell-car-ad">Sell Your Car</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="grid-ad-listings">
                          {adsLazy.visibleItems.map((car: any, index: number) => (
                            <motion.div
                              key={car.vehicle_id || car.id || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: (index % PAGE_SIZE) * 0.05 }}
                            >
                              <AdCarCard car={car} />
                            </motion.div>
                          ))}
                        </div>
                        <LoadMoreButton visible={adsLazy.hasMore} onClick={adsLazy.loadMore} loading={adsLazy.loadingMore} />
                        {adListings.length > 0 && (
                          <p className="text-center text-xs text-muted-foreground mt-4">
                            Showing {adsLazy.visibleItems.length} of {adListings.length} cars
                          </p>
                        )}
                      </>
                    )
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {inspectionCar && (
          <BookInspectionModal car={inspectionCar} onClose={() => setInspectionCar(null)} />
        )}
      </AnimatePresence>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
