"use client";

import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { ChevronDown, Building2, Trophy, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface DealerCityData {
  id: number;
  name: string;
  region: string;
  dealerCount: number;
  imageUrl?: string | null;
}

async function fetchRealDealerCities(): Promise<DealerCityData[]> {
  const response = await fetch("/api/nxcar/dealer-cities-web");
  if (!response.ok) throw new Error("Failed to fetch dealer cities");
  return response.json();
}

export function CityGrid() {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(false);
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ["dealer-cities-real"],
    queryFn: fetchRealDealerCities,
    staleTime: 30 * 60 * 1000,
  });

  const displayCities = mobileExpanded ? cities : cities.slice(0, 4);
  const desktopDisplayCities = desktopExpanded ? cities : cities.slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#111a22] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 dark:bg-teal-500/15 rounded-full blur-[120px]"></div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 sm:mb-12">
            <div className="h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
                <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sm:hidden space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800/50 p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#111a22] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 dark:bg-teal-500/15 rounded-full blur-[120px]"></div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-800 dark:text-white uppercase italic tracking-tighter mb-3 sm:mb-4">
              Verified <span className="text-primary">Dealer Network</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-400 max-w-xl font-medium">
              Access India's most exclusive network of premium pre-owned car dealerships.
            </p>
          </div>
        </div>

        <div className="hidden sm:block">
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            <AnimatePresence>
              {desktopDisplayCities.map((city) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={city.id}
                >
                  <Link 
                    href={`/dealers/${city.name.toLowerCase().replace(/ /g, '-')}`}
                    data-testid={`link-dealer-city-${city.name.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <Card className="group cursor-pointer bg-white dark:bg-card border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,169,178,0.15)] relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 dark:bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-primary/10 dark:group-hover:bg-primary/20"></div>
                      
                      <div className="p-3 sm:p-6">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-white/5">
                            {city.region}
                          </span>
                        </div>
                        
                        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                          {city.name}
                        </h3>
                        
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                          <Trophy className="h-3 w-3 mr-1.5 text-primary" />
                          Premium Dealers
                        </div>
                        
                        <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-end">
                          <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {cities.length > 8 && (
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setDesktopExpanded(!desktopExpanded)}
                className="group bg-transparent border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border-primary hover:text-primary uppercase tracking-wider font-bold"
              >
                {desktopExpanded ? "Show Less Cities" : "View All Cities"}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${desktopExpanded ? "rotate-180" : ""}`} />
              </Button>
            </div>
          )}
        </div>

        <div className="sm:hidden">
          <div className="space-y-2.5">
            <AnimatePresence>
              {displayCities.map((city) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  key={city.id}
                >
                  <Link 
                    href={`/dealers/${city.name.toLowerCase().replace(/ /g, '-')}`}
                    data-testid={`link-dealer-city-${city.name.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <Card className="group cursor-pointer bg-white dark:bg-card border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all duration-200 overflow-hidden">
                      <div className="flex items-center gap-3.5 p-3.5">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {city.name}
                          </h3>
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <Trophy className="h-3 w-3 mr-1 text-primary" />
                            Premium Dealers
                            <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                            <span className="text-slate-400 dark:text-slate-500 uppercase text-[10px] font-semibold tracking-wider">{city.region}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {cities.length > 4 && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="group bg-transparent border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border-primary hover:text-primary uppercase tracking-wider font-bold text-xs"
              >
                {mobileExpanded ? "Show Less" : `View All ${cities.length} Cities`}
                <ChevronDown className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-300 ${mobileExpanded ? "rotate-180" : ""}`} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
