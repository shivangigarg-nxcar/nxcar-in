"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Car,
  Sparkles,
  Zap,
  Check,
  Wrench,
  ChevronDown,
  Radio,
  Sofa,
  ExternalLink,
  Shield,
  Loader2,
  CheckCircle2,
  XCircle,
  Calculator,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import LoginModal from "@components/login-modal";
import { useAuth } from "@hooks/use-auth";
import { useToast } from "@hooks/use-toast";
import dynamic from "next/dynamic";
const EMICalculator = dynamic(() => import("@components/car-detail/emi-calculator").then(m => ({ default: m.EMICalculator })), { ssr: false, loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" /> });
import { CarSummary } from "@components/car-detail/car-summary";
import { PriceMap } from "@components/car-detail/price-map";
import { ImageGallery } from "@components/car-detail/image-gallery";
import { MakeOfferModal } from "@components/car-detail/make-offer-modal";
import { CarSpecsGrid } from "@components/car-detail/car-specs-grid";
import { SellerActionSidebar } from "@components/car-detail/seller-action-sidebar";
import { MobileActionBar } from "@components/car-detail/mobile-action-bar";
import { DocumentUploadSection } from "@components/car-detail/document-upload-section";
import { AddOnServices } from "@components/car-detail/add-on-services";

interface CarDetail {
  id: string;
  images: string[];
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  predictionPrice: string;
  emi: number;
  kilometersDriven: number;
  fuelType: string;
  transmission: string;
  seats: number;
  ownership: string;
  city: string;
  rtoLocation: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  listingDate: string;
  status: string;
  specs: {
    engineCC: number;
    cylinders: number;
    bodyType: string;
    color: string;
    grossWeight: number;
    unladenWeight: number;
    wheelbase: number;
    registrationDate: string;
    registrationNumber: string;
    insuranceProvider: string;
    insuranceExpiry: string;
    manufacturingDate: string;
  };
  features: { name: string; category: string }[];
  insights: { heading: string; body: string }[];
  detailedSpecs?: { name: string; value: string; category: string }[];
  priceMap?: {
    buyerLower: number;
    buyerUpper: number;
    sellerLower: number;
    sellerUpper: number;
  };
  carscope: {
    inspectionReportUrl: string | null;
    rcFrontUrl: string | null;
    rcBackUrl: string | null;
    rcDetails: any | null;
    warrantyPackages: string[];
    insuranceQuotes: any | null;
    warrantyPrices: Record<string, string>;
  } | null;
}

function formatPriceNoSymbol(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
}

function formatKilometers(km: number): string {
  if (km >= 100000) return `${(km / 100000).toFixed(1)} Lakh km`;
  return `${km.toLocaleString("en-IN")} km`;
}

function formatEmi(emi: number): string {
  return `₹${Math.round(emi).toLocaleString("en-IN")}/mo`;
}

const categoryConfig: Record<string, { icon: any; color: string }> = {
  Safety: { icon: Shield, color: "text-red-500 bg-red-50 dark:bg-red-500/10" },
  Comfort: {
    icon: Sparkles,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  },
  Interior: {
    icon: Sofa,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  },
  Exterior: {
    icon: ExternalLink,
    color: "text-green-500 bg-green-50 dark:bg-green-500/10",
  },
  Entertainment: {
    icon: Radio,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
  },
};

async function fetchCarDetail(vehicleId: string): Promise<CarDetail> {
  const res = await fetch(`/api/buy/car/${vehicleId}`);
  if (res.ok) return res.json();

  const fallbackRes = await fetch(`/api/cars/${vehicleId}`);
  if (fallbackRes.ok) {
    const car = await fallbackRes.json();
    if (car && !car.error) {
      return {
        id: String(car.id),
        images: car.imageUrl ? [car.imageUrl] : [],
        make: car.brand || "",
        model: car.model || "",
        variant: "",
        year: car.year || 0,
        price: car.price || 0,
        predictionPrice: "",
        emi: 0,
        kilometersDriven: car.kilometers || 0,
        fuelType: car.fuelType || "",
        transmission: car.transmission || "",
        seats: 0,
        ownership: "",
        city: car.location || "",
        rtoLocation: "",
        sellerName: "",
        sellerPhone: "",
        sellerAddress: "",
        listingDate: car.createdAt || "",
        status: "Active",
        specs: {
          engineCC: 0,
          cylinders: 0,
          bodyType: "",
          color: "",
          grossWeight: 0,
          unladenWeight: 0,
          wheelbase: 0,
          registrationDate: "",
          registrationNumber: "",
          insuranceProvider: "",
          insuranceExpiry: "",
          manufacturingDate: "",
        },
        features: [],
        insights: [],
        carscope: null,
      };
    }
  }

  throw new Error("Failed to fetch car details");
}

async function fetchCarImages(vehicleId: string): Promise<string[]> {
  const res = await fetch(`/api/buy/car/${vehicleId}/images`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.images || [];
}

export default function BuyCarDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSell = searchParams.get("from") === "sell";
  const citySlug = (params?.city as string) || "";
  const carSlug = (params?.car as string) || "";
  const vehicleId = carSlug.substring(carSlug.lastIndexOf("-") + 1);

  const hasHistory = useRef(false);
  useEffect(() => {
    hasHistory.current = window.history.length > 1;
  }, []);

  const goBack = useCallback(() => {
    if (hasHistory.current) {
      router.back();
    } else {
      router.push(`/used-cars/${citySlug}`);
    }
  }, [router, citySlug]);

  const [currentImage, setCurrentImage] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [specsExpanded, setSpecsExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<{
    predicted_price: string;
    suggested_prices: string[];
    highest_offer: number;
    total_offers: number;
  } | null>(null);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerResult, setOfferResult] = useState<"success" | "error" | null>(
    null,
  );
  const [offerError, setOfferError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackResult, setCallbackResult] = useState<{
    status: boolean;
    message: string;
    callback_requested: number;
  } | null>(null);
  const [callbackError, setCallbackError] = useState("");

  const {
    data: car,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["buyCarDetail", vehicleId],
    queryFn: () => fetchCarDetail(vehicleId),
    enabled: !!vehicleId,
  });

  const { data: extraImages = [] } = useQuery({
    queryKey: ["buyCarImages", vehicleId],
    queryFn: () => fetchCarImages(vehicleId),
    enabled: !!vehicleId,
  });

  const allImages = useMemo(() => {
    const carImages = car?.images || [];
    const merged = [...carImages];
    for (const img of extraImages) {
      if (!merged.includes(img)) merged.push(img);
    }
    return merged;
  }, [car?.images, extraImages]);

  const handlePrevImage = useCallback(() => {
    setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  useEffect(() => {
    setCurrentImage(0);
  }, [vehicleId]);

  const specsEntries = useMemo(() => {
    if (!car?.specs) return [];
    const entries: { label: string; value: string }[] = [];
    const s = car.specs;
    if (s.engineCC)
      entries.push({ label: "Engine", value: `${s.engineCC} CC` });
    if (s.cylinders)
      entries.push({ label: "Cylinders", value: `${s.cylinders}` });
    if (s.bodyType) entries.push({ label: "Body Type", value: s.bodyType });
    if (car.seats) entries.push({ label: "Seats", value: `${car.seats}` });
    if (s.color) entries.push({ label: "Color", value: s.color });
    if (s.grossWeight)
      entries.push({ label: "Gross Weight", value: `${s.grossWeight} kg` });
    if (s.unladenWeight)
      entries.push({ label: "Unladen Weight", value: `${s.unladenWeight} kg` });
    if (s.wheelbase)
      entries.push({ label: "Wheelbase", value: `${s.wheelbase} mm` });
    if (s.registrationDate)
      entries.push({ label: "Registration Date", value: s.registrationDate });
    if (s.registrationNumber)
      entries.push({ label: "Registration No.", value: s.registrationNumber });
    if (s.manufacturingDate)
      entries.push({ label: "Manufacturing Date", value: s.manufacturingDate });
    return entries;
  }, [car]);

  const groupedFeatures = useMemo(() => {
    if (!car?.features?.length) return {};
    const groups: Record<string, string[]> = {};
    for (const f of car.features) {
      const cat = f.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f.name);
    }
    return groups;
  }, [car?.features]);

  const InsightsSection = () => {
    if (!car?.insights?.length) return null;
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="font-semibold">AI Insights</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {car.insights.map((insight, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{insight.heading}</p>
                <p className="text-sm text-muted-foreground">{insight.body}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

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

  const handleMakeOfferClick = async () => {
    if (!car) return;
    setOfferModalOpen(true);
    setOfferLoading(true);
    setSelectedOffer("");
    setOfferResult(null);
    setOfferError("");
    setPredictionData(null);

    try {
      const res = await fetch("/api/nxcar/prediction-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: car.id,
          prediction_price: car.predictionPrice || String(car.price),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPredictionData(data);
      } else {
        setOfferError(
          "Unable to load price suggestions. You can still enter your offer manually.",
        );
        setPredictionData({
          predicted_price: String(car.price),
          suggested_prices: [],
          highest_offer: 0,
          total_offers: 0,
        });
      }
    } catch {
      setOfferError("Unable to load price suggestions.");
      setPredictionData({
        predicted_price: String(car.price),
        suggested_prices: [],
        highest_offer: 0,
        total_offers: 0,
      });
    } finally {
      setOfferLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!car || !selectedOffer) return;
    const userId = getUserId();
    if (!userId) {
      setOfferError("Please log in to make an offer.");
      return;
    }

    setOfferSubmitting(true);
    setOfferError("");

    try {
      const res = await fetch("/api/nxcar/make-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: car.id,
          user_id: userId,
          offer_amount: selectedOffer,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOfferResult("success");
      } else {
        setOfferResult("error");
        setOfferError(
          data.error || "Failed to submit your offer. Please try again.",
        );
      }
    } catch {
      setOfferResult("error");
      setOfferError("Something went wrong. Please try again.");
    } finally {
      setOfferSubmitting(false);
    }
  };

  const submitCallbackRequest = async (userId: string) => {
    if (!car) return;
    setCallbackLoading(true);
    setCallbackResult(null);
    setCallbackError("");

    try {
      const res = await fetch("/api/nxcar/request-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          vehicle_id: car.id,
        }),
      });
      const data = await res.json();
      setCallbackResult(data);
    } catch {
      setCallbackError("Something went wrong. Please try again.");
    } finally {
      setCallbackLoading(false);
    }
  };

  const getNxcarUserId = (): string => {
    if (typeof window === "undefined") return "";
    const direct = localStorage.getItem("nxcar_user_id");
    if (direct) return direct;
    const stored = localStorage.getItem("authState");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.nxcar_user_id) return String(parsed.nxcar_user_id);
      } catch {}
    }
    return "";
  };

  const handleRequestCallback = () => {
    if (!car) return;
    const nxcarUserId = getNxcarUserId();
    if (!nxcarUserId) {
      setShowLoginModal(true);
      return;
    }
    submitCallbackRequest(nxcarUserId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
          <div className="container max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-24 hidden sm:block" />
          </div>
        </div>
        <main className="container max-w-screen-xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-[7/5] w-full rounded-md" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-md" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-96 rounded-md" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-screen-xl mx-auto px-6 py-24 text-center">
          <Car className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2" data-testid="text-not-found">
            Car Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Button data-testid="button-back-to-listings" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-screen-xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery
              images={allImages}
              currentImage={currentImage}
              onPrevImage={handlePrevImage}
              onNextImage={handleNextImage}
              onSelectImage={setCurrentImage}
              altText={`${car.make} ${car.model}`}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: "Year", value: `${car.year}` },
                {
                  icon: Gauge,
                  label: "Kilometers",
                  value: formatKilometers(car.kilometersDriven),
                },
                { icon: Fuel, label: "Fuel Type", value: car.fuelType },
                {
                  icon: Settings2,
                  label: "Transmission",
                  value: car.transmission,
                },
              ]
                .filter((item) => item.value && item.value !== "0")
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border p-3 bg-gradient-to-br from-primary/5"
                    data-testid={`spec-card-${item.label.toLowerCase().replace(/ /g, "-")}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
            </div>

            {car.detailedSpecs && car.detailedSpecs.length > 0 && (
              <CarSummary detailedSpecs={car.detailedSpecs} />
            )}

            {car.priceMap && (car.priceMap.buyerLower > 0 || car.priceMap.buyerUpper > 0) && (
              <PriceMap
                priceMap={car.priceMap}
                askingPrice={car.price}
                year={car.year}
                make={car.make}
                model={car.model}
              />
            )}

            <CarSpecsGrid
              specsEntries={specsEntries}
              showAllSpecs={showAllSpecs}
              onToggleShowAll={() => setShowAllSpecs(!showAllSpecs)}
              specsExpanded={specsExpanded}
              onToggleExpanded={() => setSpecsExpanded(!specsExpanded)}
              insuranceProvider={car.specs?.insuranceProvider}
              insuranceExpiry={car.specs?.insuranceExpiry}
            />

            {Object.keys(groupedFeatures).length > 0 && (
              <Card data-testid="features-card">
                <CardHeader
                  className="pb-3 cursor-pointer select-none"
                  onClick={() => setFeaturesExpanded(!featuresExpanded)}
                  data-testid="button-toggle-features-section"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="font-semibold">Features</h2>
                    <Badge variant="secondary" className="ml-1">
                      {car.features.length}
                    </Badge>
                    <ChevronDown className={`ml-auto h-5 w-5 text-muted-foreground transition-transform duration-200 ${featuresExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
                {featuresExpanded && (
                  <CardContent className="space-y-4">
                    {Object.entries(groupedFeatures).map(
                      ([category, features]) => {
                        const config = categoryConfig[category] || {
                          icon: Wrench,
                          color: "text-muted-foreground bg-muted",
                        };
                        const CategoryIcon = config.icon;
                        return (
                          <div key={category}>
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center ${config.color}`}
                              >
                                <CategoryIcon className="h-3.5 w-3.5" />
                              </div>
                              <h4 className="text-sm font-semibold">
                                {category}
                              </h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1.5 ml-8">
                              {features.map((feat, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                                  {feat}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </CardContent>
                )}
              </Card>
            )}

            <div className="lg:hidden">
              <InsightsSection />
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <SellerActionSidebar
                car={car}
                formatPriceNoSymbol={formatPriceNoSymbol}
                formatKilometers={formatKilometers}
                formatEmi={formatEmi}
                onMakeOfferClick={handleMakeOfferClick}
                onRequestCallback={handleRequestCallback}
                callbackLoading={callbackLoading}
              />

              <div className="hidden lg:block mt-6">
                <InsightsSection />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="container max-w-screen-xl mx-auto px-4 py-8 space-y-10">
        <section data-testid="section-emi-calculator">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" data-testid="text-emi-calculator-title">
            <Calculator className="h-6 w-6 text-primary" />
            EMI Calculator
          </h2>
          <EMICalculator carPrice={car.price} />
        </section>

        <AddOnServices />
      </div>

      {fromSell && (
        <DocumentUploadSection vehicleId={vehicleId} car={car} />
      )}

      <MobileActionBar
        price={car.price}
        emi={car.emi}
        sellerPhone={car.sellerPhone}
        formatPriceNoSymbol={formatPriceNoSymbol}
        formatEmi={formatEmi}
        onMakeOfferClick={handleMakeOfferClick}
      />

      <MakeOfferModal
        open={offerModalOpen}
        onOpenChange={(open) => {
          setOfferModalOpen(open);
          if (!open) {
            setOfferResult(null);
            setOfferError("");
            setSelectedOffer("");
          }
        }}
        car={car}
        offerLoading={offerLoading}
        offerSubmitting={offerSubmitting}
        offerResult={offerResult}
        offerError={offerError}
        selectedOffer={selectedOffer}
        predictionData={predictionData}
        onSelectedOfferChange={setSelectedOffer}
        onSubmitOffer={handleSubmitOffer}
        onRetry={() => {
          setOfferResult(null);
          setOfferError("");
        }}
      />

      <Dialog open={callbackResult !== null || callbackError !== ""} onOpenChange={(open) => { if (!open) { setCallbackResult(null); setCallbackError(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="sr-only">Callback Request</DialogTitle>
          <DialogDescription className="sr-only">Result of your callback request</DialogDescription>
          {callbackError ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Request Failed</h3>
              <p className="text-sm text-muted-foreground" data-testid="text-callback-error">{callbackError}</p>
              <Button onClick={() => setCallbackError("")} className="w-full" data-testid="button-callback-close">
                Close
              </Button>
            </div>
          ) : callbackResult ? (
            <div className="text-center space-y-4 py-4">
              {callbackResult.status ? (
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground" data-testid="text-callback-title">
                {callbackResult.status ? "Callback Requested!" : "Already Requested"}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-callback-message">{callbackResult.message}</p>
              <Button onClick={() => setCallbackResult(null)} className="w-full" data-testid="button-callback-close">
                Close
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {showLoginModal && (
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onSuccess={() => {
            setShowLoginModal(false);
            const nxcarUserId = getNxcarUserId();
            if (nxcarUserId) {
              submitCallbackRequest(nxcarUserId);
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
