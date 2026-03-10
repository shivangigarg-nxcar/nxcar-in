"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Bell, GitCompare } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCars, getBatchRatings } from "@lib/api";
import { useCarComparison, type ComparisonCar } from "@hooks/use-car-comparison";
import { useFavorites } from "@hooks/use-favorites";
import { useAuth } from "@hooks/use-auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { NotificationSubscriptionModal } from "./notification-subscription-modal";
import LoginModal from "@components/login-modal";
import { CarCard } from "./shared/car-card";

function CompareButton({ car, isInComparison, removeFromCompare, addToCompare, isComparisonFull }: {
  car: any;
  isInComparison: (id: number) => boolean;
  removeFromCompare: (id: number) => void;
  addToCompare: (car: ComparisonCar) => void;
  isComparisonFull: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (isInComparison(car.id)) {
              removeFromCompare(car.id);
            } else {
              const compCar: ComparisonCar = {
                id: car.id,
                name: car.name,
                brand: car.brand,
                model: car.model,
                variant: car.variant || "",
                year: car.year,
                price: car.price,
                fuelType: car.fuelType,
                transmission: car.transmission,
                kilometers: car.kilometers,
                location: car.location,
                imageUrl: car.imageUrl,
                ownership: car.ownership || "",
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
  );
}

export function CarStrip({ title, featured }: { title: string; featured?: boolean }) {
  const { addToCompare, removeFromCompare, isInComparison, isComparisonFull } = useCarComparison();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLoginModal = useCallback(() => setShowLoginModal(true), []);
  
  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars", featured],
    queryFn: () => getCars(20, featured),
  });

  const carIds = useMemo(() => cars.map((car) => car.id), [cars]);
  const { data: ratingsMap = {} } = useQuery({
    queryKey: ["batchRatings", carIds],
    queryFn: () => getBatchRatings(carIds),
    enabled: carIds.length > 0,
    staleTime: 60000,
  });

  const mobileCars = cars.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-slate-100 dark:bg-[#0d1117] relative">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="h-7 sm:h-8 w-48 sm:w-56 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="h-8 sm:h-9 w-24 sm:w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="hidden sm:block h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-3 overflow-hidden -mx-4 px-4 sm:hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[46%] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-100 dark:bg-[#0d1117] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 via-transparent to-blue-100/30 dark:from-blue-950/30 dark:via-transparent dark:to-blue-950/20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none"></div>
      <div className="absolute top-10 right-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            {title} <span className="text-primary">.</span>
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              onClick={() => setNotificationModalOpen(true)}
              variant="outline" 
              className="border-[#0EA9B2] text-[#0EA9B2] hover:bg-[#0EA9B2] hover:text-white font-bold uppercase tracking-wider group text-xs sm:text-sm"
              data-testid="button-get-notified"
            >
              <Bell className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Get Notified
            </Button>
            <Button variant="link" asChild className="text-primary hover:text-slate-900 dark:hover:text-white font-bold uppercase tracking-wider group text-xs sm:text-sm" data-testid="button-view-inventory">
              <Link href="/used-cars">
                View Inventory <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        <NotificationSubscriptionModal 
          open={notificationModalOpen} 
          onOpenChange={setNotificationModalOpen} 
        />

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scrollbar-hide sm:hidden">
          {mobileCars.map((car) => (
            <div key={car.id} className="flex-shrink-0 w-[46%] snap-start">
              <CarCard
                car={car}
                compact
                isFavorite={favoriteIds.includes(car.id)}
                onToggleFavorite={toggleFavorite}
                ratingsMap={ratingsMap}
                isAuthenticated={isAuthenticated}
                onShowLogin={openLoginModal}
                actionButtons={
                  <CompareButton
                    car={car}
                    isInComparison={isInComparison}
                    removeFromCompare={removeFromCompare}
                    addToCompare={addToCompare}
                    isComparisonFull={isComparisonFull}
                  />
                }
              />
            </div>
          ))}
        </div>

        <div className="hidden sm:block">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {cars.map((car) => (
                <CarouselItem key={car.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <CarCard
                    car={car}
                    isFavorite={favoriteIds.includes(car.id)}
                    onToggleFavorite={toggleFavorite}
                    ratingsMap={ratingsMap}
                    isAuthenticated={isAuthenticated}
                    onShowLogin={openLoginModal}
                    actionButtons={
                      <CompareButton
                        car={car}
                        isInComparison={isInComparison}
                        removeFromCompare={removeFromCompare}
                        addToCompare={addToCompare}
                        isComparisonFull={isComparisonFull}
                      />
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-white dark:bg-card text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:bg-primary hover:border-primary hover:text-white" />
            <CarouselNext className="hidden md:flex bg-white dark:bg-card text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:bg-primary hover:border-primary hover:text-white" />
          </Carousel>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      )}
    </section>
  );
}
