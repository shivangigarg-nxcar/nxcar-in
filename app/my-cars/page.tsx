'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Car, Shield, Megaphone } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyCarsSell, getMyCarsSellAds, getMyCarsBuy } from "@lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@hooks/use-auth";
import { useFavorites } from "@hooks/use-favorites";
import { useToast } from "@hooks/use-toast";
import LoginModal from "@components/login-modal";
import { MyCarsTabs, type ActiveTab } from "@components/my-cars/my-cars-tabs";
import { BuyFavoritesGrid } from "@components/my-cars/buy-favorites-grid";
import { SellCarsGrid } from "@components/my-cars/sell-cars-grid";
import { MyAdsGrid } from "@components/my-cars/my-ads-grid";
import { BookInspectionModal } from "@components/my-cars/book-inspection-modal";

const PAGE_SIZE = 8;

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

export default function MyCars() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <MyCarsContent />
    </Suspense>
  );
}

function MyCarsContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const thankYouShown = useRef(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("favorites");
  const [listingSubTab, setListingSubTab] = useState<"sell" | "ads">("sell");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isFavorite, toggleFavorite, syncExternalIds } = useFavorites();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [inspectionCar, setInspectionCar] = useState<any>(null);

  useEffect(() => {
    const thankYouVehicle = searchParams.get("thank_you");
    if (thankYouVehicle && !thankYouShown.current) {
      thankYouShown.current = true;
      setActiveTab("listings");
      setListingSubTab("sell");
      setTimeout(() => {
        toast({
          title: "Thank You!",
          description: "Your documents have been uploaded successfully. Your listing is under review and our team will get back to you shortly.",
        });
      }, 500);
      window.history.replaceState({}, "", "/my-cars");
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [authLoading, isAuthenticated]);
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

      <section className="pt-14 pb-3">
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

      <MyCarsTabs activeTab={activeTab} setActiveTab={setActiveTab} buyCount={buyListings.length} />

      <section className="py-6 bg-background relative min-h-[400px]" role="tabpanel">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
          {activeTab === "favorites" && (
            <BuyFavoritesGrid
              isAuthenticated={isAuthenticated}
              buyLoading={buyLoading}
              buyListings={buyListings}
              buyLazy={buyLazy}
              isFavorite={isFavorite}
              handleToggleFavorite={handleToggleFavorite}
            />
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
                    <SellCarsGrid
                      sellLoading={sellLoading}
                      sellListings={sellListings}
                      sellLazy={sellLazy}
                      onBookInspection={setInspectionCar}
                    />
                  ) : (
                    <MyAdsGrid
                      adsLoading={adsLoading}
                      adListings={adListings}
                      adsLazy={adsLazy}
                    />
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
