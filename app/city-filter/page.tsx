'use client';

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const VALID_CITY_SLUGS = [
  "delhi", "new-delhi", "mumbai", "bangalore", "bengaluru", "hyderabad", 
  "chennai", "kolkata", "pune", "jaipur", "lucknow", "gurgaon", "gurugram",
  "noida", "ghaziabad", "faridabad", "chandigarh", "ahmedabad", "amritsar"
];

function CityFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const citySlug = searchParams.get("filters") || "";

  useEffect(() => {
    if (citySlug && VALID_CITY_SLUGS.includes(citySlug.toLowerCase())) {
      router.push(`/used-cars?city=${citySlug}`);
    } else {
      router.push("/used-cars");
    }
  }, [citySlug, router]);

  return null;
}

export default function CityFilter() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] flex items-center justify-center" data-testid="city-filter-redirect">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden border border-white/5 bg-slate-50 dark:bg-slate-900/50">
              <div className="aspect-[4/3] bg-white dark:bg-slate-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white dark:bg-slate-800 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-white dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                <div className="h-5 bg-white dark:bg-slate-800 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Suspense>
        <CityFilterContent />
      </Suspense>
    </div>
  );
}
