"use client";

import Link from "next/link";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Building2, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface CityPreview {
  id: number;
  name: string;
  slug: string;
  dealerCount: number;
}

const featuredCities: { region: string; gradient: string; cities: CityPreview[] }[] = [
  {
    region: "North",
    gradient: "from-blue-500 to-cyan-500",
    cities: [
      { id: 94, name: "Delhi", slug: "delhi", dealerCount: 124 },
      { id: 86, name: "Gurgaon", slug: "gurgaon", dealerCount: 78 },
      { id: 202, name: "Noida", slug: "noida", dealerCount: 56 },
      { id: 110, name: "Jaipur", slug: "jaipur", dealerCount: 42 },
    ],
  },
  {
    region: "West",
    gradient: "from-orange-500 to-amber-500",
    cities: [
      { id: 279, name: "Mumbai", slug: "mumbai", dealerCount: 156 },
      { id: 287, name: "Pune", slug: "pune", dealerCount: 89 },
      { id: 265, name: "Ahmedabad", slug: "ahmedabad", dealerCount: 67 },
    ],
  },
  {
    region: "South",
    gradient: "from-green-500 to-emerald-500",
    cities: [
      { id: 346, name: "Bangalore", slug: "bangalore", dealerCount: 134 },
      { id: 398, name: "Chennai", slug: "chennai", dealerCount: 98 },
      { id: 407, name: "Hyderabad", slug: "hyderabad", dealerCount: 87 },
    ],
  },
  {
    region: "East",
    gradient: "from-purple-500 to-pink-500",
    cities: [
      { id: 249, name: "Kolkata", slug: "kolkata", dealerCount: 76 },
      { id: 474, name: "Patna", slug: "patna", dealerCount: 34 },
    ],
  },
];

export function DealerNetworkPreview() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0D1117]">
      <div className="container px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified Partner Network
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3" data-testid="heading-dealer-preview">
            Verified Dealer Network
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Access India's most exclusive network of premium pre-owned car dealerships.
          </p>
        </motion.div>

        <div className="space-y-8">
          {featuredCities.map((regionData, regionIndex) => (
            <motion.div 
              key={regionData.region}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: regionIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-8 w-1 rounded-full bg-gradient-to-b ${regionData.gradient}`}></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {regionData.region}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {regionData.cities.map((city) => (
                  <Link 
                    key={city.id} 
                    href={`/dealers/${city.slug}`}
                    data-testid={`link-dealer-city-${city.slug}`}
                  >
                    <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                            {city.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                              {city.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {city.dealerCount} Premium Dealers
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>View Dealers</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                
                {regionIndex === 0 && (
                  <Link href="/dealers" data-testid="link-view-all-dealers">
                    <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20 h-full flex items-center justify-center">
                      <CardContent className="p-4 text-center">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mx-auto mb-2">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-primary">
                          +50 Cities
                        </p>
                        <p className="text-xs text-primary/70 mt-1">
                          View All
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/dealers">
            <button 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-explore-dealers"
            >
              <Building2 className="h-5 w-5" />
              Explore All Dealers
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
