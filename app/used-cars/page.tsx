'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { useToast } from "@hooks/use-toast";
import { cn } from "@lib/utils";
import {
  Search, Car, MapPin, CheckCircle, Shield, ArrowRight,
  ChevronsUpDown, Check, TrendingUp, Star, Zap, Sparkles
} from "lucide-react";

interface City {
  city_id: string;
  city_name: string;
  city_image: string;
  v_cnt: string;
}

const cityImageMap: Record<string, string> = {
  ahmadabad: "/images/buy/cities/ahmadabad.png",
  amritsar: "/images/buy/cities/amritsar.png",
  bangalore: "/images/buy/cities/bangalore.png",
  chandigarh: "/images/buy/cities/chandigarh.png",
  chennai: "/images/buy/cities/chennai.png",
  delhi: "/images/buy/cities/delhi.png",
  faridabad: "/images/buy/cities/faridabad.png",
  ghaziabad: "/images/buy/cities/ghaziabad.png",
  gurgaon: "/images/buy/cities/gurgaon.png",
  hyderabad: "/images/buy/cities/hyderabad.png",
  jaipur: "/images/buy/cities/jaipur.png",
  kolkata: "/images/buy/cities/kolkata.png",
  lucknow: "/images/buy/cities/lucknow.png",
  mumbai: "/images/buy/cities/mumbai.png",
  noida: "/images/buy/cities/noida.png",
  pune: "/images/buy/cities/pune.png",
};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCityImage(cityName: string): string | null {
  const key = cityName.toLowerCase().replace(/\s+/g, "");
  return cityImageMap[key] || null;
}

function CityCombobox({
  cities,
  onSelect,
  placeholder = "Search & select your city...",
}: {
  cities: City[];
  onSelect: (cityName: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal bg-black/80 border-white/20 text-white hover:bg-black/90 hover:text-white"
          data-testid="select-city"
        >
          <span className="text-white/60">{placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-popover border border-border shadow-xl" align="start">
        <Command className="bg-popover">
          <CommandInput placeholder="Search city..." data-testid="input-city-search" className="text-foreground" />
          <CommandList className="bg-popover">
            <CommandEmpty className="text-muted-foreground">No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.city_id}
                  value={city.city_name}
                  onSelect={() => {
                    onSelect(city.city_name);
                    setOpen(false);
                  }}
                  data-testid={`option-city-${city.city_id}`}
                  className="text-foreground"
                >
                  <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                  <span className="flex-1">{city.city_name}</span>
                  <span className="text-xs text-muted-foreground">{city.v_cnt} cars</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function UsedCarsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadCities(attempt = 0) {
      try {
        const r = await fetch("/api/buy/cities");
        const data = await r.json();
        if (cancelled) return;
        if (data.status === "error") {
          if (attempt < 2) {
            setTimeout(() => loadCities(attempt + 1), 2000);
          } else {
            toast({ title: "Unable to fetch cities", description: data.error || "Please try again later.", variant: "destructive" });
          }
          return;
        }
        const list = data.status === "success" ? (data.cities || []) : Array.isArray(data) ? data : (data.cities || []);
        if (list.length > 0) {
          setCities(list);
        } else if (attempt < 2) {
          setTimeout(() => loadCities(attempt + 1), 2000);
        }
      } catch {
        if (!cancelled && attempt < 2) {
          setTimeout(() => loadCities(attempt + 1), 2000);
        } else if (!cancelled) {
          toast({ title: "Unable to fetch cities", description: "Please try again later.", variant: "destructive" });
        }
      }
    }
    loadCities();
    return () => { cancelled = true; };
  }, []);

  const handleCitySelect = (cityName: string) => {
    router.push(`/used-cars/${toSlug(cityName)}`);
  };

  const [showAllCities, setShowAllCities] = useState(false);
  const totalCarsCount = cities.reduce((sum, c) => sum + parseInt(c.v_cnt || "0", 10), 0);
  const popularCities = cities
    .filter((c) => parseInt(c.v_cnt || "0", 10) >= 100)
    .sort((a, b) => parseInt(b.v_cnt || "0", 10) - parseInt(a.v_cnt || "0", 10));
  const remainingCities = cities
    .filter((c) => parseInt(c.v_cnt || "0", 10) < 100 && parseInt(c.v_cnt || "0", 10) > 0)
    .sort((a, b) => parseInt(b.v_cnt || "0", 10) - parseInt(a.v_cnt || "0", 10));

  const howItWorks = [
    { img: "/images/buy/step-search-opt.webp", title: "Search Cars", desc: "Browse thousands of verified used cars across 50+ cities in India." },
    { img: "/images/buy/step-compare-opt.webp", title: "Compare & Choose", desc: "Compare prices, specs, and features to find your perfect match." },
    { img: "/images/buy/step-buy-opt.webp", title: "Connect & Buy", desc: "Connect directly with verified sellers and close the deal." },
  ];

  const whyChoose = [
    { icon: Shield, title: "Verified Listings", desc: "Every car is verified for authenticity and quality." },
    { icon: TrendingUp, title: "Best Prices", desc: "Competitive pricing with transparent market data." },
    { icon: Star, title: "Trusted Sellers", desc: "We partner with trusted dealers and verified sellers." },
    { icon: Zap, title: "Instant Connect", desc: "Connect with sellers directly, no middlemen." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 py-6 pt-16">
        <div className="space-y-12">
          <div className="relative rounded-2xl overflow-hidden min-h-[400px]">
            <img
              src="/images/buy/hero-bg.webp"
              alt="Buy Used Cars"
              className="absolute inset-0 w-full h-full object-cover bg-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="relative z-10 p-5 sm:p-8 md:p-12 flex flex-col justify-center min-h-[350px] sm:min-h-[400px]">
              <div className="max-w-2xl">
                <Badge className="bg-white/15 backdrop-blur-sm text-white border-0 rounded-full mb-4 gap-1" data-testid="badge-hero">
                  <Sparkles className="w-3 h-3" /> India's Trusted Used Car Platform
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" data-testid="text-hero-title">
                  Find Your Perfect{" "}
                  <span className="bg-gradient-to-r from-[#4BA8A0] to-[#56C5B8] bg-clip-text text-transparent">
                    Pre-Owned Car
                  </span>
                </h1>
                <p className="text-slate-300 mb-6 sm:mb-8 text-sm sm:text-lg max-w-xl">
                  Browse thousands of verified used cars across India. Select your city to get started with the best deals.
                </p>
                <div className="max-w-xs mt-4">
                  <CityCombobox
                    cities={cities}
                    onSelect={handleCitySelect}
                    placeholder="Search & select your city..."
                  />
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4BA8A0]/20 flex items-center justify-center">
                      <Car className="w-4 h-4 sm:w-5 sm:h-5 text-[#56C5B8]" />
                    </div>
                    <div>
                      <div className="text-base sm:text-xl font-bold text-white" data-testid="text-stat-cars">{totalCarsCount.toLocaleString("en-IN")}+</div>
                      <div className="text-[10px] sm:text-xs text-slate-400">Cars Listed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4BA8A0]/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#56C5B8]" />
                    </div>
                    <div>
                      <div className="text-base sm:text-xl font-bold text-white" data-testid="text-stat-cities">{cities.length}+</div>
                      <div className="text-[10px] sm:text-xs text-slate-400">Cities Covered</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4BA8A0]/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#56C5B8]" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">100%</div>
                      <div className="text-xs text-slate-400">Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {popularCities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" data-testid="text-popular-cities-title">Popular Cities</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-1.5">
                {popularCities.map((city) => {
                  const cityImg = getCityImage(city.city_name);
                  return (
                    <button
                      key={city.city_id}
                      onClick={() => handleCitySelect(city.city_name)}
                      className="rounded-lg border bg-card hover:border-primary/50 transition-all overflow-hidden group hover-elevate"
                      data-testid={`button-city-card-${city.city_id}`}
                    >
                      {cityImg ? (
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={cityImg}
                            alt={city.city_name}
                            loading="eager"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="p-1.5 text-center">
                        <div className="font-medium text-[11px] leading-tight truncate">{city.city_name}</div>
                        <div className="text-[9px] text-muted-foreground">{city.v_cnt} cars</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {remainingCities.length > 0 && (
                <>
                  {showAllCities && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">More Cities</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-1.5">
                        {remainingCities.map((city) => {
                          const cityImg = getCityImage(city.city_name);
                          return (
                            <button
                              key={city.city_id}
                              onClick={() => handleCitySelect(city.city_name)}
                              className="rounded-lg border bg-card hover:border-primary/50 transition-all overflow-hidden group hover-elevate"
                              data-testid={`button-city-card-${city.city_id}`}
                            >
                              {cityImg ? (
                                <div className="aspect-square overflow-hidden">
                                  <img
                                    src={cityImg}
                                    alt={city.city_name}
                                    loading="eager"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-square bg-muted flex items-center justify-center">
                                  <MapPin className="h-6 w-6 text-primary" />
                                </div>
                              )}
                              <div className="p-1.5 text-center">
                                <div className="font-medium text-[11px] leading-tight truncate">{city.city_name}</div>
                                <div className="text-[9px] text-muted-foreground">{city.v_cnt} cars</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCities(!showAllCities)}
                      className="rounded-xl px-6"
                      data-testid="button-toggle-more-cities"
                    >
                      {showAllCities ? "Show Less" : `More Cities (${remainingCities.length})`}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-6 text-center" data-testid="text-how-it-works-title">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {howItWorks.map((step, i) => (
                <div
                  key={i}
                  className="text-center rounded-xl border bg-card overflow-hidden hover-elevate"
                  data-testid={`card-how-it-works-${i}`}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={step.img}
                      alt={step.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="text-xs text-primary font-semibold mb-1">Step {i + 1}</div>
                    <h3 className="font-bold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-6 text-center" data-testid="text-why-choose-title">Why Choose NxCar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whyChoose.map((item, i) => (
                <Card key={i} className="p-6 text-center" data-testid={`card-why-choose-${i}`}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center py-6 sm:py-8 px-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to Find Your Car?</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">Select a city above to start browsing verified used cars.</p>
            <ArrowRight className="h-6 w-6 text-primary mx-auto animate-bounce" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
