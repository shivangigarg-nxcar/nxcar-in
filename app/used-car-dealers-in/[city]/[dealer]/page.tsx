'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Skeleton } from "@components/ui/skeleton";
import {
  MapPin, Building2, CheckCircle, ArrowLeft,
  Car, Phone, Star,
  Shield, Award, MessageSquare, Share2,
  Fuel, Gauge, Settings2, ChevronLeft,
  ChevronRight, Send, ImageIcon, Wrench, X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@hooks/use-toast";

interface DealerInfo {
  showroom_name: string;
  showroom_address: string;
  dealership_logo: string | null;
  images: Record<string, string> | string[];
  rating: string;
  years_in_business: string;
  services_offered: string[];
  dealer_info_id: string;
  mobile_number_1: string;
  whatsapp_number: string;
  closing_time: string;
  opening_time: string;
  youtube_link: string;
  facebook_link: string;
  instagram_link: string;
  linkedin_link: string;
  whatsapp_catalog_link: string;
}

interface DealerBasic {
  user_id: string;
  phone_number: string;
  username: string;
}

interface DealerTeamMember {
  name: string;
  designation: string;
  mobile_number: string;
  image: string;
}

interface DealerReview {
  name: string;
  review: string;
  rating: string;
  image: string;
  location: string;
}

interface DealerData {
  basic: DealerBasic;
  info: DealerInfo;
  teams: DealerTeamMember[];
  reviews: DealerReview[];
}

interface DealerCar {
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

function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  let h = parseInt(hours, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minutes} ${period}`;
}

function getFirstChar(name: string): string {
  return (name || "?").charAt(0).toUpperCase();
}

const servicesData = [
  { title: "Used Car Loan", desc: "Get competitive interest rates and quick approvals for your used car loan." },
  { title: "Car Insurance", desc: "Comprehensive insurance plans offering hassle-free coverage." },
  { title: "RC Transfer", desc: "Quick and hassle-free RC transfer service for smooth ownership transition." },
  { title: "Extended Warranty", desc: "Extended warranty plans to drive with peace of mind." },
  { title: "Car Inspection", desc: "Every car undergoes a thorough expert inspection." },
  { title: "RSA(Road Side Assistance)", desc: "24/7 roadside assistance ensuring help is always a call away." },
  { title: "Service History", desc: "Complete transparency with detailed service history." },
];

const whyChooseItems = [
  { title: "Extensive Inventory", icon: Car },
  { title: "Competitive Pricing", icon: Award },
  { title: "Trust & Reliability", icon: Shield },
];

const stickyTabs = [
  { name: "Listing", link: "#listing" },
  { name: "Services", link: "#services" },
  { name: "Photos", link: "#photos" },
  { name: "Contact", link: "#contact" },
  { name: "Reviews", link: "#reviews" },
];

const fetchDealerView = async (dealerSlug: string): Promise<DealerData | null> => {
  const response = await fetch(`/api/nxcar/dealer-view/${dealerSlug}`);
  if (!response.ok) throw new Error("Failed to fetch dealer");
  const data = await response.json();
  return data?.dealer || null;
};

const fetchDealerCars = async (userId: string): Promise<DealerCar[]> => {
  const allCars: DealerCar[] = [];
  let fetchError = false;
  for (let page = 1; page <= 20; page++) {
    try {
      const response = await fetch("/api/nxcar/listallcars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fltr: [{ user_id: userId }], page }),
      });
      if (!response.ok) {
        if (page === 1) fetchError = true;
        break;
      }
      const data = await response.json();
      if (!data.allcars || typeof data.allcars === "string" || !Array.isArray(data.allcars)) break;
      const activeCars = data.allcars.filter((c: any) => c.is_active === "1");
      allCars.push(...activeCars);
      const totalPages = data.pagination?.total_pages ? parseInt(data.pagination.total_pages) : 1;
      if (page >= totalPages) break;
    } catch {
      if (page === 1) fetchError = true;
      break;
    }
  }
  if (fetchError && allCars.length === 0) {
    throw new Error("Failed to fetch dealer car listings");
  }
  return allCars;
};

function HeroSkeleton() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container px-4 max-w-7xl mx-auto py-8 md:py-12">
        <Skeleton className="h-5 w-40 mb-6 bg-white/10" />
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white/10" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-1/2 bg-white/10" />
              </div>
            </div>
            <Skeleton className="h-48 md:hidden rounded-xl bg-white/10" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-32 rounded-lg bg-white/10" />
              <Skeleton className="h-8 w-28 rounded-lg bg-white/10" />
            </div>
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-2/3 bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-md bg-white/10" />
              <Skeleton className="h-9 w-28 rounded-md bg-white/10" />
              <Skeleton className="h-9 w-28 rounded-md bg-white/10" />
            </div>
          </div>
          <Skeleton className="hidden md:block w-[400px] lg:w-[480px] h-[280px] lg:h-[320px] rounded-xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}

function CarCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border">
      <Skeleton className="w-full aspect-[4/3]" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-24" />
      </CardContent>
    </Card>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

function DealerImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  if (!images.length) return null;

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl group"
      data-testid="dealer-image-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((url, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0">
            <img src={url} alt={`Dealer ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid="button-slider-next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-5" : "bg-white/50"}`}
                data-testid={`dot-slider-${i}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CarCard({ car, citySlug }: { car: DealerCar; citySlug: string }) {
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

function ReviewCard({ review }: { review: DealerReview }) {
  const [expanded, setExpanded] = useState(false);
  const words = review.review.split(" ");
  const isLong = words.length > 30;
  const displayText = expanded ? review.review : words.slice(0, 30).join(" ") + (isLong ? "..." : "");

  return (
    <div className="min-w-[280px] sm:min-w-[320px] bg-card rounded-xl p-4 shadow-sm border border-border flex-shrink-0 snap-start">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
          {getFirstChar(review.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-sm font-medium text-amber-500">{review.rating}</span>
            <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
        &ldquo;{displayText}&rdquo;
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} className="text-primary text-xs ml-1 hover:underline" data-testid="button-read-more">
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">{review.name} {review.location}</span>
      </div>
    </div>
  );
}

export default function DealerDetail() {
  const params = useParams() as { city: string; dealer: string };
  const citySlug = params.city || "";
  const dealerSlug = params.dealer || "";
  const cityName = citySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const { toast } = useToast();
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllReviewsMobile, setShowAllReviewsMobile] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "", mobile: "", subject: "", message: "", dealer_info_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { data: dealerData, isLoading, error } = useQuery({
    queryKey: ["dealer-view", dealerSlug],
    queryFn: () => fetchDealerView(dealerSlug),
  });

  const userId = dealerData?.basic?.user_id;

  const { data: allCars = [], isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ["dealer-cars", userId],
    queryFn: () => fetchDealerCars(userId!),
    enabled: !!userId,
    retry: 1,
  });

  const dealerInfo = dealerData?.info;
  const dealerBasic = dealerData?.basic;
  const dealerTeams = dealerData?.teams || [];
  const dealerReviews = dealerData?.reviews || [];

  const dealerImages: string[] = dealerInfo?.images
    ? (Array.isArray(dealerInfo.images)
      ? dealerInfo.images
      : Object.values(dealerInfo.images)).filter(Boolean)
    : [];

  const dealerServices = (dealerInfo?.services_offered || [])
    .map(s => servicesData.find(sd => sd.title.toLowerCase() === s.toLowerCase()))
    .filter(Boolean) as typeof servicesData;

  const visibleServices = showAllServices ? dealerServices : dealerServices.slice(0, 3);

  useEffect(() => {
    if (dealerInfo?.dealer_info_id) {
      setContactForm(prev => ({ ...prev, dealer_info_id: dealerInfo.dealer_info_id }));
    }
  }, [dealerInfo]);

  const handleCall = useCallback(() => {
    const phone = dealerInfo?.whatsapp_number || dealerBasic?.phone_number;
    if (phone) window.location.href = `tel:${phone}`;
  }, [dealerInfo, dealerBasic]);

  const handleWhatsApp = useCallback(() => {
    const phone = dealerInfo?.whatsapp_number;
    if (phone) window.open(`https://api.whatsapp.com/send?phone=${phone}`, "_blank");
  }, [dealerInfo]);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: dealerInfo?.showroom_name || "Dealer", url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: "Copied!", description: "Dealer link copied to clipboard" });
      } catch {}
    }
  }, [dealerInfo, toast]);

  const handleDirection = useCallback(() => {
    const address = dealerInfo?.showroom_address || "";
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`, "_blank");
  }, [dealerInfo]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.mobile.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
      toast({ title: "Error", description: "Please fill all required fields." });
      return;
    }
    if (contactForm.mobile.length < 10) {
      toast({ title: "Error", description: "Please enter a valid mobile number." });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/nxcar/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        toast({ title: "Submitted!", description: "Our team will contact you shortly." });
        setContactForm(prev => ({ ...prev, name: "", mobile: "", subject: "", message: "" }));
      } else {
        toast({ title: "Error", description: "Form not submitted. Please try again." });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollReviews = (direction: "left" | "right") => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-20 pb-16">
        {isLoading && <HeroSkeleton />}

        {error && (
          <div className="text-center py-16 px-4">
            <Building2 className="h-16 w-16 mx-auto text-destructive/60 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load dealer</h3>
            <p className="text-muted-foreground mb-4">Please try again later</p>
            <Link href={`/used-car-dealers-in/${citySlug}`}><Button>Back to {cityName}</Button></Link>
          </div>
        )}

        {!isLoading && !error && !dealerData && (
          <div className="text-center py-16 px-4">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Dealer not found</h3>
            <p className="text-muted-foreground mb-4">This dealer may no longer be available</p>
            <Link href={`/used-car-dealers-in/${citySlug}`}><Button>Back to {cityName}</Button></Link>
          </div>
        )}

        {!isLoading && !error && dealerData && dealerInfo && (
          <>
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
              <div className="container px-4 max-w-7xl mx-auto py-8 md:py-12">
                <Link
                  href={`/used-car-dealers-in/${citySlug}`}
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors text-sm"
                  data-testid="link-back-city"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to {cityName} Dealers
                </Link>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {dealerInfo.dealership_logo ? (
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white overflow-hidden flex-shrink-0">
                          <img
                            src={dealerInfo.dealership_logo}
                            alt={dealerInfo.showroom_name}
                            className="h-full w-full object-cover"
                            data-testid="img-dealer-logo"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl md:text-3xl font-bold text-primary" data-testid="text-dealer-initial">
                            {getFirstChar(dealerInfo.showroom_name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" data-testid="heading-dealer-name">
                          {dealerInfo.showroom_name}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                          {dealerInfo.years_in_business && (
                            <span className="text-sm text-slate-300">{dealerInfo.years_in_business} years in business</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {dealerImages.length > 0 && (
                      <div className="md:hidden h-48 rounded-xl overflow-hidden mb-4">
                        <DealerImageSlider images={dealerImages} />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                        <Car className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium" data-testid="text-dealer-cars">
                          {carsLoading ? "..." : allCars.length} Listed Cars
                        </span>
                      </div>
                      {dealerInfo.rating && dealerInfo.rating !== "0.00" && (
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                          <Star className="h-4 w-4 text-amber-400 fill-current" />
                          <span className="text-sm font-medium">{dealerInfo.rating} Rating</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-slate-300 text-sm mb-4">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                      <span data-testid="text-dealer-address">{dealerInfo.showroom_address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
                      <Phone className="h-4 w-4" />
                      <span>+91{dealerInfo.mobile_number_1 || dealerBasic?.phone_number}</span>
                      {dealerInfo.closing_time && (
                        <span className="ml-2 text-primary">Closes: {formatTime(dealerInfo.closing_time)}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={handleCall} className="bg-primary hover:bg-primary/90" data-testid="button-call-dealer">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleWhatsApp} className="border-green-500 text-green-400 hover:bg-green-500/10" data-testid="button-whatsapp">
                        <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDirection} className="border-slate-500 text-slate-300 hover:bg-white/10" data-testid="button-directions">
                        <MapPin className="h-4 w-4 mr-1" /> Directions
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleShare} className="text-slate-300 hover:bg-white/10" data-testid="button-share">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {dealerImages.length > 0 && (
                    <div className="hidden md:block w-[400px] lg:w-[480px] h-[280px] lg:h-[320px] rounded-xl overflow-hidden flex-shrink-0">
                      <DealerImageSlider images={dealerImages} />
                    </div>
                  )}
                </div>

                {dealerTeams.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3">{dealerInfo.showroom_name}&apos;s Team</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {dealerTeams.map((member, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2 min-w-[200px] flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {member.image ? (
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-primary">{getFirstChar(member.name)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">{member.designation}</p>
                            <p className="text-sm font-medium truncate">{member.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
              <div className="container max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
                {stickyTabs.map(tab => (
                  <a
                    key={tab.name}
                    href={tab.link}
                    onClick={() => setActiveTab(tab.link)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.link
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`tab-${tab.name.toLowerCase()}`}
                  >
                    {tab.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4">
              {/* Listed Cars — single unified section */}
              <section id="listing" className="py-8">
                <h2 className="text-xl font-bold text-foreground mb-4" data-testid="heading-listed-cars">
                  Listed Cars {!carsLoading && `(${allCars.length})`}
                </h2>
                {carsLoading ? (
                  <ListingSkeleton />
                ) : carsError ? (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center">
                      <Car className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground">Unable to load car listings. Please try again later.</p>
                    </CardContent>
                  </Card>
                ) : allCars.length === 0 ? (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center">
                      <Car className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground">No cars currently listed by this dealer.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allCars.map(car => (
                      <CarCard key={car.vehicle_id} car={car} citySlug={citySlug} />
                    ))}
                  </div>
                )}
              </section>

              <section className="py-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Why Choose Us?</h2>
                <div className="grid grid-cols-3 gap-4">
                  {whyChooseItems.map((item, i) => (
                    <Card key={i} className="border-border text-center">
                      <CardContent className="p-4">
                        <item.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {dealerImages.length > 0 && (
                <section id="photos" className="py-8 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    <ImageIcon className="h-5 w-5 inline mr-2 text-muted-foreground" />
                    Dealership Images
                  </h2>
                  <div className={`grid gap-3 ${dealerImages.length % 2 === 1 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
                    {dealerImages.map((url, i) => (
                      <div
                        key={i}
                        className={`rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-border ${
                          dealerImages.length % 2 === 1 && i === dealerImages.length - 1 ? "col-span-2 md:col-span-1" : ""
                        }`}
                        onClick={() => setLightboxImage(url)}
                        data-testid={`img-dealer-gallery-${i}`}
                      >
                        <img src={url} alt={`Dealership ${i + 1}`} className="w-full h-48 object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {dealerServices.length > 0 && (
                <section id="services" className="py-8 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    <Wrench className="h-5 w-5 inline mr-2 text-muted-foreground" />
                    Services Provided
                  </h2>
                  <div className="space-y-3">
                    {visibleServices.map((service, i) => (
                      <Card key={i} className="border-border overflow-hidden">
                        <CardContent className="p-4 md:p-5 flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Wrench className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-0.5 text-sm">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">{service.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {dealerServices.length > 3 && (
                    <button
                      onClick={() => setShowAllServices(!showAllServices)}
                      className="mt-4 text-sm text-primary hover:underline font-medium"
                      data-testid="button-toggle-services"
                    >
                      {showAllServices ? "Show Less" : `View More Services (${dealerServices.length - 3})`}
                    </button>
                  )}
                </section>
              )}

              <section id="contact" className="py-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Contact Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {dealerInfo.facebook_link && (
                        <a href={dealerInfo.facebook_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-facebook">
                          <span className="text-xs font-bold">FB</span>
                        </a>
                      )}
                      {dealerInfo.instagram_link && (
                        <a href={dealerInfo.instagram_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-instagram">
                          <span className="text-xs font-bold">IG</span>
                        </a>
                      )}
                      {dealerInfo.linkedin_link && (
                        <a href={dealerInfo.linkedin_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-linkedin">
                          <span className="text-xs font-bold">IN</span>
                        </a>
                      )}
                      <button onClick={handleWhatsApp} className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-whatsapp-social">
                        <MessageSquare className="h-5 w-5" />
                      </button>
                      {dealerInfo.youtube_link && (
                        <a href={dealerInfo.youtube_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity" data-testid="link-youtube">
                          <span className="text-xs font-bold">YT</span>
                        </a>
                      )}
                    </div>

                    {dealerInfo.youtube_link && (
                      <div className="aspect-video rounded-xl overflow-hidden border border-border">
                        <iframe
                          src={dealerInfo.youtube_link}
                          title="YouTube video player"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          data-testid="iframe-youtube"
                        />
                      </div>
                    )}

                    <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent((dealerBasic?.username || "") + ", " + dealerInfo.showroom_address)}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Dealer Location"
                        data-testid="iframe-map"
                      />
                    </div>
                  </div>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Send an Inquiry</h3>
                      <form onSubmit={handleContactSubmit} className="space-y-3">
                        <Input
                          placeholder="Your Name *"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          data-testid="input-contact-name"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                          <Input
                            className="pl-10"
                            placeholder="Mobile Number *"
                            type="tel"
                            maxLength={10}
                            value={contactForm.mobile}
                            onChange={(e) => setContactForm(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, "") }))}
                            data-testid="input-contact-mobile"
                          />
                        </div>
                        <Input
                          placeholder="Subject *"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                          data-testid="input-contact-subject"
                        />
                        <Textarea
                          placeholder="Your Inquiry *"
                          rows={3}
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          data-testid="input-contact-message"
                        />
                        <Button type="submit" className="w-full" disabled={submitting} data-testid="button-submit-contact">
                          {submitting ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                          Submit
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {dealerReviews.length > 0 && (
                <section id="reviews" className="py-8 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Reviews</h2>
                  <div className="relative">
                    <div
                      ref={reviewsRef}
                      className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                      data-testid="reviews-container"
                    >
                      {(isMobile && !showAllReviewsMobile ? dealerReviews.slice(0, 5) : dealerReviews).map((review, i) => (
                        <ReviewCard key={i} review={review} />
                      ))}
                    </div>
                    {!isMobile && dealerReviews.length > 2 && (
                      <div className="flex items-center gap-3 justify-center mt-4">
                        <button
                          onClick={() => scrollReviews("left")}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors text-foreground"
                          data-testid="button-reviews-left"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => scrollReviews("right")}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors text-foreground"
                          data-testid="button-reviews-right"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {isMobile && dealerReviews.length > 5 && (
                      <button
                        onClick={() => setShowAllReviewsMobile(!showAllReviewsMobile)}
                        className="mt-3 text-sm text-primary hover:underline font-medium block mx-auto"
                        data-testid="button-toggle-reviews-mobile"
                      >
                        {showAllReviewsMobile ? "View Less" : "View More"}
                      </button>
                    )}
                  </div>
                </section>
              )}
            </div>
          </>
        )}

        {isLoading && (
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <ListingSkeleton />
          </div>
        )}
      </main>
      <Footer />

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              data-testid="button-close-lightbox"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Dealer"
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
