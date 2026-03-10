'use client';

import { Badge } from "@components/ui/badge";

interface CityHeroProps {
  cityName: string;
  citySlug: string;
  totalListings: number;
}

export function CityHero({ cityName, citySlug, totalListings }: CityHeroProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">
          Used Cars in {cityName || citySlug}
        </h1>
        {totalListings > 0 && (
          <Badge variant="secondary" data-testid="badge-total-count">
            {totalListings.toLocaleString("en-IN")} cars
          </Badge>
        )}
      </div>
    </div>
  );
}
