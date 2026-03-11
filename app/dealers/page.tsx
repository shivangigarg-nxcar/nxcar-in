'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { MapPin, Search, Building2, CheckCircle, Users, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CityData {
  id: number;
  name: string;
  region: "north" | "west" | "south" | "east";
  dealerCount?: number;
}

const northCities = ["delhi", "gurgaon", "gurugram", "noida", "faridabad", "ghaziabad", "chandigarh", "ludhiana", "jalandhar", "amritsar", "mohali", "panchkula", "jaipur", "lucknow", "meerut", "dehradun", "gautam buddha nagar", "agra", "varanasi", "kanpur", "allahabad", "prayagraj", "bhopal", "indore"];
const westCities = ["mumbai", "pune", "ahmedabad", "surat", "vadodara", "nagpur", "nashik", "rajkot", "thane", "navi mumbai", "goa"];
const southCities = ["chennai", "bangalore", "bengaluru", "hyderabad", "coimbatore", "kochi", "thiruvananthapuram", "trivandrum", "mysore", "mysuru", "visakhapatnam", "vijayawada", "madurai"];
const eastCities = ["kolkata", "patna", "bhubaneswar", "cuttack", "ranchi", "gorakhpur", "guwahati", "siliguri", "jamshedpur"];

function assignRegion(cityName: string): "north" | "west" | "south" | "east" {
  const lower = cityName.toLowerCase();
  if (westCities.some(c => lower.includes(c))) return "west";
  if (southCities.some(c => lower.includes(c))) return "south";
  if (eastCities.some(c => lower.includes(c))) return "east";
  return "north";
}

const regionLabels = {
  north: { title: "North India", color: "from-blue-500 to-cyan-500" },
  west: { title: "West India", color: "from-orange-500 to-amber-500" },
  south: { title: "South India", color: "from-green-500 to-emerald-500" },
  east: { title: "East India", color: "from-purple-500 to-pink-500" },
};

export default function DealerNetwork() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch("/api/nxcar/dealer-cities-web");
        const data = await res.json();
        let rawCities: any[] = [];
        if (Array.isArray(data)) {
          rawCities = data;
        } else if ((data.success || data.status === "success") && Array.isArray(data.data)) {
          rawCities = data.data;
        }
        if (rawCities.length > 0) {
          const mapped: CityData[] = rawCities.map((city: any) => ({
            id: city.id || city.city_id || Math.random(),
            name: city.name || city.city_name || city.city || "",
            region: city.region || assignRegion(city.name || city.city_name || city.city || ""),
            dealerCount: city.dealerCount || city.dealer_count || 0,
          })).filter((c: CityData) => c.name);
          setCities(mapped);
        }
      } catch {
        setCities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCities = {
    north: filteredCities.filter(c => c.region === "north"),
    west: filteredCities.filter(c => c.region === "west"),
    south: filteredCities.filter(c => c.region === "south"),
    east: filteredCities.filter(c => c.region === "east"),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0D1117] font-sans">
      <Navbar />
      <main className="pt-16 pb-16">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container px-4 max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1" data-testid="badge-verified-network">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Partner Network
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4" data-testid="heading-dealer-network">
                Verified Dealer Network
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
                Access India's most exclusive network of premium pre-owned car dealerships.
                All dealers are verified for quality and customer satisfaction.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 max-w-3xl mx-auto mb-10">
                <div className="text-center p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-primary mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-total-dealers">500+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Verified Dealers</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-primary mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-total-cities">50+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Cities Covered</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-primary mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">10L+</p>
                  <p className="text-xs sm:text-sm text-slate-500">Happy Customers</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-primary mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Trusted</p>
                  <p className="text-xs sm:text-sm text-slate-500">Verified Dealers</p>
                </div>
              </div>

              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 focus:ring-primary"
                  data-testid="input-search-city"
                />
              </div>
            </motion.div>

            <div className="space-y-12">
              {(Object.keys(regionLabels) as Array<keyof typeof regionLabels>).map((region, regionIndex) => (
                groupedCities[region].length > 0 && (
                  <motion.div 
                    key={region}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: regionIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`h-10 w-1 rounded-full bg-gradient-to-b ${regionLabels[region].color}`}></div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid={`heading-region-${region}`}>
                        {regionLabels[region].title}
                      </h2>
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                        {groupedCities[region].length} Cities
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {groupedCities[region].map((city) => (
                        <Link 
                          key={city.id} 
                          href={`/dealers/${city.name.toLowerCase().replace(/ /g, '-')}`}
                          data-testid={`link-city-${city.name.toLowerCase().replace(/ /g, '-')}`}
                        >
                          <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 overflow-hidden">
                            <CardContent className="p-4 relative">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg">
                                  {city.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                    {city.name}
                                  </p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    View Dealers
                                  </p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </div>

            {loading && (
              <div className="space-y-12">
                {[1, 2].map((section) => (
                  <div key={section}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-10 w-1 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                      <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                            <div className="flex-1">
                              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
                              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredCities.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <MapPin className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No cities found</h3>
                <p className="text-slate-500">Try searching with a different city name</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
