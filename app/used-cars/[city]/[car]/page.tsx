"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import {
  ArrowLeft,
  Car,
  Calculator,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import LoginModal from "@components/login-modal";
import { useAuth } from "@hooks/use-auth";
import dynamic from "next/dynamic";
const EMICalculator = dynamic(() => import("@components/car-detail/emi-calculator").then(m => ({ default: m.EMICalculator })), { ssr: false, loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" /> });
import { CarSummary } from "@components/car-detail/car-summary";
import { PriceMap } from "@components/car-detail/price-map";
import { ImageGallery } from "@components/car-detail/image-gallery";
import { MakeOfferModal } from "@components/car-detail/make-offer-modal";
import { CarSpecsGrid } from "@components/car-detail/car-specs-grid";
import { SellerActionSidebar } from "@components/car-detail/seller-action-sidebar";
import { DocumentUploadSection } from "@components/car-detail/document-upload-section";
import { AddOnServices } from "@components/car-detail/add-on-services";
import { QuickSpecs } from "@components/car-detail/quick-specs";
import { CarFeatures } from "@components/car-detail/car-features";
import { InsightsSection } from "@components/car-detail/insights-section";
import { useCarActions } from "@hooks/use-car-actions";
import type { CarDetail } from "@components/car-detail/car-detail-types";
import { formatPriceNoSymbol, formatKilometers, formatEmi } from "@components/car-detail/car-detail-types";

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
    if (s.engineCC) entries.push({ label: "Engine", value: `${s.engineCC} CC` });
    if (s.cylinders) entries.push({ label: "Cylinders", value: `${s.cylinders}` });
    if (s.bodyType) entries.push({ label: "Body Type", value: s.bodyType });
    if (car.seats) entries.push({ label: "Seats", value: `${car.seats}` });
    if (s.color) entries.push({ label: "Color", value: s.color });
    if (s.grossWeight) entries.push({ label: "Gross Weight", value: `${s.grossWeight} kg` });
    if (s.unladenWeight) entries.push({ label: "Unladen Weight", value: `${s.unladenWeight} kg` });
    if (s.wheelbase) entries.push({ label: "Wheelbase", value: `${s.wheelbase} mm` });
    if (s.registrationDate) entries.push({ label: "Registration Date", value: s.registrationDate });
    if (s.registrationNumber) entries.push({ label: "Registration No.", value: s.registrationNumber });
    if (s.manufacturingDate) entries.push({ label: "Manufacturing Date", value: s.manufacturingDate });
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

  const {
    offerModalOpen,
    offerLoading,
    predictionData,
    selectedOffer,
    setSelectedOffer,
    offerSubmitting,
    offerResult,
    offerError,
    showLoginModal,
    setShowLoginModal,
    callbackLoading,
    callbackResult,
    callbackError,
    handleMakeOfferClick,
    handleSubmitOffer,
    handleRequestCallback,
    handleOfferModalClose,
    handleOfferRetry,
    handleCallbackDialogClose,
    handleLoginSuccess,
  } = useCarActions(car);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="sticky top-20 z-40 mt-20 bg-background/95 backdrop-blur border-b">
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
        <main className="container max-w-screen-xl mx-auto px-6 pt-24 pb-12 text-center">
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

      <main className="max-w-screen-xl mx-auto px-3 sm:px-4 pt-24 pb-4 sm:pb-6 overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
            <ImageGallery
              images={allImages}
              currentImage={currentImage}
              onPrevImage={handlePrevImage}
              onNextImage={handleNextImage}
              onSelectImage={setCurrentImage}
              altText={`${car.make} ${car.model}`}
            />

            <div className="lg:hidden">
              <SellerActionSidebar
                car={car}
                priceMap={car.priceMap}
                formatPriceNoSymbol={formatPriceNoSymbol}
                formatKilometers={formatKilometers}
                formatEmi={formatEmi}
                onMakeOfferClick={handleMakeOfferClick}
                onRequestCallback={handleRequestCallback}
                callbackLoading={callbackLoading}
              />
            </div>

            <QuickSpecs
              year={car.year}
              kilometersDriven={car.kilometersDriven}
              fuelType={car.fuelType}
              transmission={car.transmission}
            />

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
                variant={car.variant}
                city={car.city}
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

            <CarFeatures
              groupedFeatures={groupedFeatures}
              totalCount={car.features.length}
              expanded={featuresExpanded}
              onToggleExpanded={() => setFeaturesExpanded(!featuresExpanded)}
            />

            <div className="lg:hidden">
              <InsightsSection insights={car.insights} />
            </div>
          </div>

          <div className="hidden lg:block space-y-6">
            <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <SellerActionSidebar
                car={car}
                priceMap={car.priceMap}
                formatPriceNoSymbol={formatPriceNoSymbol}
                formatKilometers={formatKilometers}
                formatEmi={formatEmi}
                onMakeOfferClick={handleMakeOfferClick}
                onRequestCallback={handleRequestCallback}
                callbackLoading={callbackLoading}
              />

              <div className="hidden lg:block mt-6">
                <InsightsSection insights={car.insights} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-10 overflow-hidden">
        <section data-testid="section-emi-calculator">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2" data-testid="text-emi-calculator-title">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            EMI Calculator
          </h2>
          <EMICalculator carPrice={car.price} />
        </section>

        <AddOnServices />
      </div>

      {fromSell && (
        <DocumentUploadSection vehicleId={vehicleId} car={car} />
      )}

      <MakeOfferModal
        open={offerModalOpen}
        onOpenChange={handleOfferModalClose}
        car={car}
        offerLoading={offerLoading}
        offerSubmitting={offerSubmitting}
        offerResult={offerResult}
        offerError={offerError}
        selectedOffer={selectedOffer}
        predictionData={predictionData}
        onSelectedOfferChange={setSelectedOffer}
        onSubmitOffer={handleSubmitOffer}
        onRetry={handleOfferRetry}
      />

      <Dialog open={callbackResult !== null || callbackError !== ""} onOpenChange={handleCallbackDialogClose}>
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
              <Button onClick={() => handleCallbackDialogClose(false)} className="w-full" data-testid="button-callback-close">
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
              <Button onClick={() => handleCallbackDialogClose(false)} className="w-full" data-testid="button-callback-close">
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
          onSuccess={handleLoginSuccess}
        />
      )}

      <Footer />
    </div>
  );
}
