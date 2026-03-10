'use client';

import { Heart, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { BuyCarCard, SkeletonGrid } from "./dashboard-car-card";

const PAGE_SIZE = 8;

function LoadMoreButton({ visible, onClick, loading }: { visible: boolean; onClick: () => void; loading?: boolean }) {
  if (!visible) return null;
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onClick}
        variant="outline"
        className="px-8 py-3 text-sm font-semibold uppercase tracking-wider border-border hover:border-primary hover:text-primary transition-all gap-2"
        disabled={loading}
        data-testid="button-load-more"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /></>
        ) : (
          <><ChevronDown className="h-4 w-4" /> Load More</>
        )}
      </Button>
    </div>
  );
}

export function BuyFavoritesGrid({
  isAuthenticated,
  buyLoading,
  buyListings,
  buyLazy,
  isFavorite,
  handleToggleFavorite,
}: {
  isAuthenticated: boolean;
  buyLoading: boolean;
  buyListings: any[];
  buyLazy: { visibleItems: any[]; hasMore: boolean; loadMore: () => void; loadingMore: boolean };
  isFavorite: (id: number) => boolean;
  handleToggleFavorite: (carId: number, e?: React.MouseEvent) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground mb-2">Login to see favorites</h2>
          <p className="text-muted-foreground mb-6">Sign in to view your saved cars.</p>
        </div>
      ) : buyLoading ? (
        <SkeletonGrid />
      ) : buyListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground mb-2" data-testid="text-empty-favorites">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">Browse cars to add favorites.</p>
          <Link href="/used-cars">
            <Button className="bg-primary hover:bg-primary/90 font-bold uppercase" data-testid="button-browse-cars">Browse Cars</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="grid-favorites">
            {buyLazy.visibleItems.map((car: any, index: number) => (
              <motion.div
                key={car.vehicle_id || car.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % PAGE_SIZE) * 0.05 }}
              >
                <BuyCarCard car={car} isFavorited={isFavorite(Number(car.vehicle_id || car.id))} onToggleFavorite={handleToggleFavorite} />
              </motion.div>
            ))}
          </div>
          <LoadMoreButton visible={buyLazy.hasMore} onClick={buyLazy.loadMore} loading={buyLazy.loadingMore} />
          {buyListings.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Showing {buyLazy.visibleItems.length} of {buyListings.length} cars
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}
