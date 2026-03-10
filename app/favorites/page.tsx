'use client';

import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { useState, useEffect } from "react";
import { Fuel, Gauge, Settings2, MapPin, Heart, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, removeFavorite } from "@lib/api";
import { getCarDetailUrl } from "@lib/utils";
import Link from "next/link";
import { useAuth } from "@hooks/use-auth";
import LoginModal from "@components/login-modal";

export default function Favorites() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
  
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteIds"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16">
          <div className="container px-4 max-w-screen-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </Link>
              <h1 className="text-3xl font-heading font-black text-white uppercase italic tracking-tighter">
                My Favorites <span className="text-primary">.</span>
              </h1>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/5 bg-card">
                    <div className="aspect-[4/3] bg-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      <div className="grid grid-cols-3 gap-1">
                        <div className="h-6 bg-muted rounded animate-pulse" />
                        <div className="h-6 bg-muted rounded animate-pulse" />
                        <div className="h-6 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Heart className="h-16 w-16 text-slate-700 mb-4" />
                <h2 className="text-xl font-bold text-slate-400 mb-2">No favorites yet</h2>
                <p className="text-slate-500 mb-6">Start saving cars you like to view them here</p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 font-bold uppercase" data-testid="button-browse-cars">
                    Browse Cars
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((car) => (
                  <Card key={car.id} className="group overflow-hidden bg-card border-white/5 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.1)]" data-testid={`card-favorite-${car.id}`}>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-white/10 to-transparent p-2 flex items-center justify-center relative">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="h-full w-full object-contain scale-90 transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3 bg-black/80 text-white backdrop-blur border border-white/10 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {car.year}
                      </Badge>
                      <button
                        onClick={() => removeFavoriteMutation.mutate(car.id)}
                        data-testid={`button-remove-favorite-${car.id}`}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 transition-all hover:bg-red-500/80 hover:border-red-500"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-4 relative">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:bg-primary/20"></div>
                      
                      <h3 className="font-heading text-base font-bold text-white mb-2 truncate group-hover:text-primary transition-colors">{car.name}</h3>
                      
                      <div className="flex items-center text-xs text-slate-400 mb-3 font-medium">
                        <MapPin className="h-3 w-3 mr-1 text-primary" /> {car.location}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-500 mb-4 font-mono uppercase">
                        <div className="flex items-center bg-white/5 rounded px-1.5 py-1 border border-white/5">
                          <Gauge className="h-2.5 w-2.5 mr-1.5 text-slate-400" />
                          {car.kilometers} km
                        </div>
                        <div className="flex items-center bg-white/5 rounded px-1.5 py-1 border border-white/5">
                          <Fuel className="h-2.5 w-2.5 mr-1.5 text-slate-400" />
                          {car.fuelType}
                        </div>
                        <div className="flex items-center bg-white/5 rounded px-1.5 py-1 border border-white/5">
                          <Settings2 className="h-2.5 w-2.5 mr-1.5 text-slate-400" />
                          {car.transmission.slice(0, 4)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-primary italic">₹ {(car.price / 100000).toFixed(2)} Lakh</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={getCarDetailUrl(car)}>
                        <Button className="w-full h-9 text-xs font-bold uppercase tracking-wider bg-white/5 text-white hover:bg-primary hover:text-white border border-white/10 transition-all" variant="ghost" data-testid={`button-view-details-${car.id}`}>
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
