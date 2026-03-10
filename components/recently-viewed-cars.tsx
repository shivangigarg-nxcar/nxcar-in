"use client";

import { useMemo } from "react";
import { Button } from "@components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBatchRatings } from "@lib/api";
import { useRecentlyViewed } from "@hooks/use-recently-viewed";
import { useFavorites } from "@hooks/use-favorites";
import { CarCard } from "./shared/car-card";

export function RecentlyViewedCars() {
  const { recentlyViewedCars, clearRecentlyViewed, isLoading } = useRecentlyViewed();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const recentCarIds = useMemo(() => recentlyViewedCars.map((car) => car.id), [recentlyViewedCars]);
  const { data: ratingsMap = {} } = useQuery({
    queryKey: ["batchRatings", "recently", recentCarIds],
    queryFn: () => getBatchRatings(recentCarIds),
    enabled: recentCarIds.length > 0,
    staleTime: 60000,
  });

  if (isLoading || recentlyViewedCars.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white dark:bg-[#10161d] relative overflow-hidden" data-testid="section-recently-viewed">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 via-transparent to-gray-100/40 dark:from-slate-950/35 dark:via-transparent dark:to-blue-950/25"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/15 rounded-full blur-[100px]"></div>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Recently Viewed <span className="text-primary">.</span>
          </h2>
          <Button 
            variant="ghost" 
            onClick={clearRecentlyViewed}
            aria-label="Clear recently viewed history"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 font-medium"
            data-testid="button-clear-history"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recentlyViewedCars.map((car) => (
              <CarouselItem key={car.id} className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4" data-testid={`card-recently-viewed-${car.id}`}>
                <CarCard
                  car={car}
                  isFavorite={favoriteIds.includes(car.id)}
                  onToggleFavorite={toggleFavorite}
                  ratingsMap={ratingsMap}
                  testIdSuffix={`recently-${car.id}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex bg-white dark:bg-card text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:bg-primary hover:border-primary hover:text-white" />
          <CarouselNext className="hidden md:flex bg-white dark:bg-card text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:bg-primary hover:border-primary hover:text-white" />
        </Carousel>
      </div>
    </section>
  );
}
