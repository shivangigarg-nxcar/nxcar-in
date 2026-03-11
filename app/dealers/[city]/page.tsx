'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { 
  MapPin, Search, Building2, CheckCircle, ArrowLeft, 
  Car, Phone, ExternalLink, Star, Users
} from "lucide-react";
import { motion } from "framer-motion";

interface Dealer {
  username: string;
  web_url: string;
  address: string;
  dealer_info_id: string;
  city_name: string;
  dealership_logo: string | null;
  vehicle_count: string;
}

interface ApiResponse {
  allpartners: Dealer[];
}

const cityIdMap: Record<string, number> = {
  "delhi": 94,
  "gurgaon": 86,
  "noida": 202,
  "faridabad": 76,
  "ghaziabad": 128,
  "chandigarh": 58,
  "ludhiana": 36,
  "jalandhar": 35,
  "amritsar": 37,
  "mohali": 57,
  "panchkula": 93,
  "jaipur": 110,
  "lucknow": 129,
  "meerut": 130,
  "dehradun": 59,
  "gautam-buddha-nagar": 159,
  "mumbai": 279,
  "pune": 287,
  "ahmedabad": 265,
  "surat": 266,
  "vadodara": 273,
  "nagpur": 278,
  "chennai": 398,
  "bangalore": 346,
  "hyderabad": 407,
  "coimbatore": 369,
  "kochi": 329,
  "thiruvananthapuram": 330,
  "kolkata": 249,
  "patna": 474,
  "bhubaneswar": 465,
  "cuttack": 466,
  "ranchi": 315,
  "gorakhpur": 162,
};

const fetchDealers = async (cityId: number): Promise<Dealer[]> => {
  const response = await fetch(`/api/nxcar/partners?city_id=${cityId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dealers');
  }
  const data: ApiResponse = await response.json();
  // Handle case where API returns "No Data to Show" string instead of array
  if (!data.allpartners || !Array.isArray(data.allpartners)) {
    return [];
  }
  return data.allpartners;
};

export default function CityDealers() {
  const params = useParams() as { city: string };
  const citySlug = params.city || "";
  const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cityId = cityIdMap[citySlug.toLowerCase()] || 94;

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dealers = [], isLoading, error } = useQuery({
    queryKey: ["dealers", cityId],
    queryFn: () => fetchDealers(cityId),
  });

  const filteredDealers = dealers.filter(dealer =>
    dealer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVehicles = dealers.reduce((acc, d) => acc + parseInt(d.vehicle_count || "0"), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0D1117] font-sans">
      <Navbar />
      <main className="pt-16 pb-16">
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          
          <div className="container px-4 max-w-7xl mx-auto relative z-10">
            <Link href="/dealers" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors" data-testid="link-back-dealers">
              <ArrowLeft className="h-4 w-4" />
              Back to All Cities
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 px-4 py-1" data-testid="badge-premium-dealers">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Premium Dealers
                  </Badge>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white" data-testid="heading-city-name">
                    Used Car Dealers in {cityName}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {dealers.length} Verified Dealers
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 min-w-[100px]">
                    <Building2 className="h-6 w-6 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold text-slate-900 dark:text-white" data-testid="text-dealer-count">{dealers.length}</p>
                    <p className="text-xs text-slate-500">Dealers</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 min-w-[100px]">
                    <Car className="h-6 w-6 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold text-slate-900 dark:text-white" data-testid="text-vehicle-count">{totalVehicles}</p>
                    <p className="text-xs text-slate-500">Cars Available</p>
                  </div>
                </div>
              </div>

              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search dealers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50"
                  data-testid="input-search-dealer"
                />
              </div>
            </motion.div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">Failed to load dealers</h3>
                <p className="text-slate-500">Please try again later</p>
              </div>
            )}

            {!isLoading && !error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDealers.map((dealer, index) => (
                  <motion.div
                    key={dealer.dealer_info_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      href={`/used-car-dealers-in/${citySlug}/${dealer.web_url}`}
                      data-testid={`link-dealer-${dealer.dealer_info_id}`}
                    >
                      <Card className="group cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 overflow-hidden h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden shrink-0">
                              {dealer.dealership_logo ? (
                                <img 
                                  src={dealer.dealership_logo} 
                                  alt={dealer.username}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : (
                                <span className="text-2xl font-bold text-primary">
                                  {dealer.username.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                  {dealer.username}
                                </h3>
                                <Badge variant="secondary" className="shrink-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex items-start gap-1">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                {dealer.address}
                              </p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                                  <Car className="h-4 w-4" />
                                  {dealer.vehicle_count} Cars
                                </div>
                                <div className="flex items-center gap-1 text-sm text-amber-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  4.5
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs text-slate-400">{dealer.city_name}</span>
                            <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                              View Details <ExternalLink className="h-3 w-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!isLoading && !error && filteredDealers.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No dealers found</h3>
                <p className="text-slate-500">
                  {searchQuery ? "Try a different search term" : `No verified dealers in ${cityName} yet`}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
