'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button";
import {
  Building2, Car, Award, Shield, ImageIcon,
  ChevronLeft, ChevronRight, X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@hooks/use-toast";
import { DealerHero } from "@components/dealer-detail/dealer-hero";
import { DealerGalleryScroller } from "@components/dealer-detail/dealer-image-slider";
import { DealerTabs } from "@components/dealer-detail/dealer-tabs";
import { DealerCarCard } from "@components/dealer-detail/dealer-car-card";
import type { DealerCar } from "@components/dealer-detail/dealer-car-card";
import { DealerReviewCard } from "@components/dealer-detail/dealer-review-card";
import type { DealerReview } from "@components/dealer-detail/dealer-review-card";
import { DealerContactForm } from "@components/dealer-detail/dealer-contact-form";
import { DealerServiceGrid } from "@components/dealer-detail/dealer-service-grid";

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

interface DealerData {
  basic: DealerBasic;
  info: DealerInfo;
  teams: DealerTeamMember[];
  reviews: DealerReview[];
}

const whyChooseItems = [
  { title: "Extensive Inventory", icon: Car },
  { title: "Competitive Pricing", icon: Award },
  { title: "Trust & Reliability", icon: Shield },
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

export default function DealerDetail() {
  const params = useParams() as { city: string; dealer: string };
  const citySlug = params.city || "";
  const dealerSlug = params.dealer || "";
  const cityName = citySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const { toast } = useToast();
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("");
  const [showAllReviewsMobile, setShowAllReviewsMobile] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const scrollReviews = (direction: "left" | "right") => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-14 pb-16">
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
            <DealerHero
              dealerInfo={dealerInfo}
              dealerBasic={dealerBasic}
              dealerTeams={dealerTeams}
              dealerImages={dealerImages}
              citySlug={citySlug}
              cityName={cityName}
              carsLoading={carsLoading}
              carsCount={allCars.length}
              onCall={handleCall}
              onWhatsApp={handleWhatsApp}
              onDirection={handleDirection}
              onShare={handleShare}
            />

            <DealerTabs activeTab={activeTab} onTabChange={setActiveTab} showReviews={dealerReviews.length > 0 && !!dealerInfo.rating && parseFloat(dealerInfo.rating) >= 3} />

            <div className="container max-w-7xl mx-auto px-4">
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
                      <DealerCarCard key={car.vehicle_id} car={car} citySlug={citySlug} />
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
                  <div className="hidden md:grid gap-3 grid-cols-2 lg:grid-cols-3">
                    {dealerImages.map((url, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-border"
                        onClick={() => setLightboxImage(url)}
                        data-testid={`img-dealer-gallery-${i}`}
                      >
                        <img src={url} alt={`Dealership ${i + 1}`} className="w-full h-48 object-contain bg-slate-100 dark:bg-white/5" loading="lazy" />
                      </div>
                    ))}
                  </div>
                  <DealerGalleryScroller images={dealerImages} onImageClick={(url) => setLightboxImage(url)} />
                </section>
              )}

              <DealerServiceGrid servicesOffered={dealerInfo.services_offered || []} />

              <DealerContactForm
                dealerInfoId={dealerInfo.dealer_info_id}
                facebookLink={dealerInfo.facebook_link}
                instagramLink={dealerInfo.instagram_link}
                linkedinLink={dealerInfo.linkedin_link}
                youtubeLink={dealerInfo.youtube_link}
                mapQuery={(dealerBasic?.username || "") + ", " + dealerInfo.showroom_address}
                onWhatsApp={handleWhatsApp}
              />

              {dealerReviews.length > 0 && dealerInfo.rating && parseFloat(dealerInfo.rating) >= 3 && (
                <section id="reviews" className="py-8 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Reviews</h2>
                  <div className="relative">
                    <div
                      ref={reviewsRef}
                      className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                      data-testid="reviews-container"
                    >
                      {(isMobile && !showAllReviewsMobile ? dealerReviews.slice(0, 5) : dealerReviews).map((review, i) => (
                        <DealerReviewCard key={i} review={review} />
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
