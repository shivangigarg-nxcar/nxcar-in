'use client';

import { Shield, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { SellCarCard, SkeletonGrid } from "./dashboard-car-card";

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

export function SellCarsGrid({
  sellLoading,
  sellListings,
  sellLazy,
  onBookInspection,
}: {
  sellLoading: boolean;
  sellListings: any[];
  sellLazy: { visibleItems: any[]; hasMore: boolean; loadMore: () => void; loadingMore: boolean };
  onBookInspection: (car: any) => void;
}) {
  if (sellLoading) return <SkeletonGrid />;

  if (sellListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-muted-foreground mb-2" data-testid="text-empty-sell">No sell listings yet</h2>
        <p className="text-muted-foreground mb-6">Cars submitted for selling will appear here.</p>
        <Link href="/sell-used-car">
          <Button className="bg-primary hover:bg-primary/90 font-bold uppercase" data-testid="button-sell-car">Sell Your Car</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="grid-sell-listings">
        {sellLazy.visibleItems.map((car: any, index: number) => (
          <motion.div
            key={car.vehicle_id || car.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % PAGE_SIZE) * 0.05 }}
          >
            <SellCarCard car={car} onBookInspection={onBookInspection} />
          </motion.div>
        ))}
      </div>
      <LoadMoreButton visible={sellLazy.hasMore} onClick={sellLazy.loadMore} loading={sellLazy.loadingMore} />
      {sellListings.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Showing {sellLazy.visibleItems.length} of {sellListings.length} cars
        </p>
      )}
    </>
  );
}
