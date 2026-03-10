'use client';

import { Heart, Car } from "lucide-react";

export type ActiveTab = "favorites" | "listings";

export function MyCarsTabs({
  activeTab,
  setActiveTab,
  buyCount,
}: {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  buyCount: number;
}) {
  return (
    <section className="py-3 bg-background border-b border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex gap-4" role="tablist" aria-label="Car sections">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "favorites" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            data-testid="tab-favorites"
            role="tab"
            aria-selected={activeTab === "favorites"}
          >
            <Heart className="h-4 w-4 inline mr-2" />
            Favorites
            {buyCount > 0 && (
              <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
                {buyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "listings" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            data-testid="tab-listings"
            role="tab"
            aria-selected={activeTab === "listings"}
          >
            <Car className="h-4 w-4 inline mr-2" />
            My Listings
          </button>
        </div>
      </div>
    </section>
  );
}
