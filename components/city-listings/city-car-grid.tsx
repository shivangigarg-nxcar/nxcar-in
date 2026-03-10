'use client';

import { useCallback } from "react";
import { Button } from "@components/ui/button";
import { Car, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import {
  type Filters,
  ActiveFiltersBar, SearchBar
} from "@components/buy-cars/filter-sidebar";
import { type CarListing, CarListingCard, LoadingSkeleton } from "@components/buy-cars/car-listing-card";

interface CityCarGridProps {
  listings: CarListing[];
  totalListings: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  citySlug: string;
  filters: Filters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRemoveFilter: (key: string, value?: string) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onMobileFilterOpen: () => void;
  favoriteIds: number[];
  onToggleFavorite: (carId: number, carData?: CarListing) => void;
  isAuthenticated: boolean;
  onShowLogin: () => void;
}

export function CityCarGrid({
  listings,
  totalListings,
  currentPage,
  totalPages,
  isLoading,
  citySlug,
  filters,
  searchQuery,
  onSearchChange,
  onRemoveFilter,
  onClearFilters,
  onPageChange,
  onMobileFilterOpen,
  favoriteIds,
  onToggleFavorite,
  isAuthenticated,
  onShowLogin,
}: CityCarGridProps) {
  const emptyStateNoResults = !isLoading && listings.length === 0 && !!filters.cityId;

  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-8" data-testid="pagination">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="min-h-[44px] min-w-[44px]"
          aria-label="Previous page"
          data-testid="button-prev-page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((page, i) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => onPageChange(page)}
              className="min-h-[44px] min-w-[44px]"
              aria-current={page === currentPage ? "page" : undefined}
              data-testid={`button-page-${page}`}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="min-h-[44px] min-w-[44px]"
          aria-label="Next page"
          data-testid="button-next-page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }, [totalPages, currentPage, onPageChange]);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onMobileFilterOpen}
          className="shrink-0 lg:hidden"
          aria-label="Open filters"
          data-testid="button-mobile-filter"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <ActiveFiltersBar
        filters={filters}
        onRemoveFilter={onRemoveFilter}
        onClearAll={onClearFilters}
      />

      {totalListings > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {listings.length} of {totalListings.toLocaleString("en-IN")} results
          </p>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : emptyStateNoResults ? (
        <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="empty-state-no-results">
          <Car className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No cars found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn't find any cars matching your current filters. Try adjusting your search criteria.
          </p>
          <Button onClick={onClearFilters} data-testid="button-clear-filters-empty">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.map((car) => (
              <CarListingCard key={car.id} car={car} citySlug={citySlug} isFavorited={favoriteIds.includes(Number(car.id))} onToggleFavorite={onToggleFavorite} isAuthenticated={isAuthenticated} onShowLogin={onShowLogin} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}
