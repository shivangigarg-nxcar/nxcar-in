'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { useToast } from "@hooks/use-toast";
import { MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@hooks/use-auth";
import { useFavorites } from "@hooks/use-favorites";
import LoginModal from "@components/login-modal";
import {
  type City, type Filters, type FilterOptions,
  defaultFilterOptions, FilterPanel, MobileFilterSheet
} from "@components/buy-cars/filter-sidebar";
import { type CarListing, LoadingSkeleton } from "@components/buy-cars/car-listing-card";
import { CityHero } from "@components/city-listings/city-hero";
import { CityCarGrid } from "@components/city-listings/city-car-grid";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function UsedCarsCityPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const citySlug = params.city as string;

  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [matchedCity, setMatchedCity] = useState<City | null>(null);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [listings, setListings] = useState<CarListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const handleToggleFavorite = useCallback((carId: number, carData?: CarListing) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const meta = carData ? {
      image: carData.image || undefined,
      name: `${carData.make} ${carData.model}`.trim(),
      brand: carData.make,
      model: carData.model,
      year: carData.makeYear,
      price: carData.price,
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      kilometers: carData.kilometersDriven,
      location: carData.city,
    } : undefined;
    toggleFavorite(carId, undefined, meta);
  }, [isAuthenticated, toggleFavorite]);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const effectiveFilterOptions = filterOptions || defaultFilterOptions;

  const urlInitialized = useRef(false);
  const fetchIdRef = useRef(0);
  const makeModelsRef = useRef<Record<string, string[]>>({});

  useEffect(() => {
    makeModelsRef.current = filterOptions?.makeModels || {};
  }, [filterOptions?.makeModels]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    let initialPage = 1;
    if (pageParam) {
      const p = parseInt(pageParam, 10);
      if (!isNaN(p) && p > 0) initialPage = p;
    }
    setCurrentPage(initialPage);

    const makesParam = searchParams.get("make");
    const modelsParam = searchParams.get("models");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minYearParam = searchParams.get("minYear");
    const maxYearParam = searchParams.get("maxYear");
    const searchParam = searchParams.get("search");

    const urlFilters: Partial<Filters> = {};
    if (makesParam) urlFilters.makes = makesParam.split("-").filter(Boolean);
    if (modelsParam) urlFilters.models = modelsParam.split("_").filter(Boolean);
    if (minPriceParam) { const v = parseInt(minPriceParam, 10); if (!isNaN(v)) urlFilters.minPrice = v; }
    if (maxPriceParam) { const v = parseInt(maxPriceParam, 10); if (!isNaN(v)) urlFilters.maxPrice = v; }
    if (minYearParam) { const v = parseInt(minYearParam, 10); if (!isNaN(v)) urlFilters.minYear = v; }
    if (maxYearParam) { const v = parseInt(maxYearParam, 10); if (!isNaN(v)) urlFilters.maxYear = v; }
    if (searchParam) setSearchQuery(searchParam);

    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }

    setTimeout(() => { urlInitialized.current = true; }, 0);
  }, []);

  useEffect(() => {
    if (!urlInitialized.current) return;

    const url = new URL(window.location.href);
    ['make', 'models', 'minYear', 'maxYear', 'search', 'minPrice', 'maxPrice', 'page'].forEach(k => url.searchParams.delete(k));

    if (filters.makes && filters.makes.length > 0) url.searchParams.set("make", filters.makes.join("-"));
    if (filters.models && filters.models.length > 0) url.searchParams.set("models", filters.models.join("_"));
    if (filters.minYear !== undefined) url.searchParams.set("minYear", filters.minYear.toString());
    if (filters.maxYear !== undefined) url.searchParams.set("maxYear", filters.maxYear.toString());
    if (debouncedSearch) url.searchParams.set("search", debouncedSearch);
    if (filters.minPrice !== undefined) url.searchParams.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined) url.searchParams.set("maxPrice", filters.maxPrice.toString());
    if (currentPage > 1) url.searchParams.set("page", currentPage.toString());

    window.history.replaceState({}, "", url.toString());
  }, [filters, currentPage, debouncedSearch]);

  useEffect(() => {
    fetch("/api/buy/cities")
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "error" || (!data.cities?.length && !Array.isArray(data))) {
          setCitiesLoaded(true);
          setCityNotFound(true);
          toast({ title: "Unable to fetch cities", description: data.error || "Please try again later.", variant: "destructive" });
          return;
        }
        let citiesList: City[] = [];
        if (data.status === "success") citiesList = data.cities || [];
        else if (Array.isArray(data)) citiesList = data;
        else if (data.cities) citiesList = data.cities;
        setCities(citiesList);
        setCitiesLoaded(true);

        const found = citiesList.find((c) => toSlug(c.city_name) === citySlug);
        if (found) {
          setMatchedCity(found);
          setFilters((prev) => ({ ...prev, cityId: found.city_id, cityName: found.city_name }));
        } else {
          setCityNotFound(true);
        }
      })
      .catch(() => {
        setCitiesLoaded(true);
        setCityNotFound(true);
        toast({ title: "Unable to fetch cities", description: "Please try again later.", variant: "destructive" });
      });
  }, [citySlug]);

  useEffect(() => {
    if (!filters.cityId) {
      setFilterOptions(null);
      return;
    }
    let retryCount = 0;
    const maxRetries = 2;
    const fetchFilterOptions = () => {
      fetch(`/api/buy/filter-options?cityId=${filters.cityId}`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          if (data.error && retryCount < maxRetries) {
            retryCount++;
            setTimeout(fetchFilterOptions, 1000 * retryCount);
            return;
          }
          setFilterOptions(data);
        })
        .catch(() => {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(fetchFilterOptions, 1000 * retryCount);
          } else {
            toast({ title: "Unable to load filters", description: "Please try again later.", variant: "destructive" });
          }
        });
    };
    fetchFilterOptions();
  }, [filters.cityId]);

  const doFetchListings = useCallback(
    (pageToFetch: number, currentFilters: Filters, search: string) => {
      if (!currentFilters.cityId) return;

      const id = ++fetchIdRef.current;
      setIsLoading(true);

      const currentMakeModels = makeModelsRef.current;
      const selectedMakes = currentFilters.makes || [];
      const selectedModels = currentFilters.models || [];

      let effectiveModels: string[] = [];
      if (selectedMakes.length > 0 && selectedModels.length > 0) {
        const allModels = new Set<string>();
        for (const make of selectedMakes) {
          const modelsForMake = currentMakeModels[make] || [];
          const hasExplicitModels = selectedModels.some((m) => modelsForMake.includes(m));
          if (hasExplicitModels) {
            selectedModels.filter((m) => modelsForMake.includes(m)).forEach((m) => allModels.add(m));
          } else if (selectedMakes.length > 1) {
            modelsForMake.forEach((m) => allModels.add(m));
          }
        }
        effectiveModels = Array.from(allModels);
      }

      const apiParams = new URLSearchParams();
      apiParams.set("cityId", currentFilters.cityId);
      if (currentFilters.cityName) apiParams.set("cityName", currentFilters.cityName);
      if (selectedMakes.length > 0) apiParams.set("makes", selectedMakes.join(","));
      if (effectiveModels.length > 0) apiParams.set("models", effectiveModels.join(","));
      if (currentFilters.minPrice !== undefined) apiParams.set("minPrice", currentFilters.minPrice.toString());
      if (currentFilters.maxPrice !== undefined) apiParams.set("maxPrice", currentFilters.maxPrice.toString());
      if (currentFilters.minYear !== undefined) apiParams.set("minYear", currentFilters.minYear.toString());
      if (currentFilters.maxYear !== undefined) apiParams.set("maxYear", currentFilters.maxYear.toString());
      if (search) apiParams.set("search", search);
      apiParams.set("page", pageToFetch.toString());

      fetch(`/api/buy/listings?${apiParams.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          if (id !== fetchIdRef.current) return;
          setListings(data.listings || []);
          setTotalListings(data.total || 0);
          setCurrentPage(data.page || 1);
          setTotalPages(data.totalPages || 0);
        })
        .catch(() => {
          if (id === fetchIdRef.current) {
            setListings([]);
            setTotalListings(0);
            setTotalPages(0);
            toast({ title: "Unable to load listings", description: "Please try again later.", variant: "destructive" });
          }
        })
        .finally(() => {
          if (id === fetchIdRef.current) setIsLoading(false);
        });
    },
    []
  );

  const filtersChangedPageRef = useRef(currentPage);
  filtersChangedPageRef.current = currentPage;

  useEffect(() => {
    if (filters.cityId) {
      doFetchListings(filtersChangedPageRef.current, filters, debouncedSearch);
    } else {
      setListings([]);
      setTotalListings(0);
      setTotalPages(0);
    }
  }, [filters, debouncedSearch]);

  const handleCityChange = useCallback((cityId: string, cityName: string) => {
    const newSlug = toSlug(cityName);
    router.push(`/used-cars/${newSlug}`);
  }, [router]);

  const handleFilterChange = useCallback((update: Partial<Filters>) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...update }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setCurrentPage(1);
    setFilters((prev) => ({ cityId: prev.cityId, cityName: prev.cityName }));
    setSearchQuery("");
  }, []);

  const handleRemoveFilter = useCallback((key: string, value?: string) => {
    setCurrentPage(1);
    setFilters((prev) => {
      const next = { ...prev };
      switch (key) {
        case "city":
          router.push("/used-cars");
          return {};
        case "make":
          if (value) {
            const makeModels = effectiveFilterOptions.makeModels[value] || [];
            next.makes = (prev.makes || []).filter((m) => m !== value);
            next.models = (prev.models || []).filter((m) => !makeModels.includes(m));
          }
          break;
        case "model":
          if (value) {
            next.models = (prev.models || []).filter((m) => m !== value);
          }
          break;
        case "price":
          delete next.minPrice;
          delete next.maxPrice;
          break;
        case "year":
          delete next.minYear;
          delete next.maxYear;
          break;
      }
      return next;
    });
  }, [effectiveFilterOptions, router]);

  const handleApplyMobileFilters = useCallback((newFilters: Filters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    doFetchListings(page, filters, debouncedSearch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters, debouncedSearch, doFetchListings]);

  const handleShowLogin = useCallback(() => setShowLoginModal(true), []);

  if (!citiesLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-4 py-6 pt-16">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="hidden lg:block w-72 shrink-0">
              <Skeleton className="h-96 w-full rounded-md" />
            </aside>
            <div className="flex-1">
              <LoadingSkeleton />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cityNotFound) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-16 pt-20 text-center">
          <MapPin className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">City Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find a city matching "{citySlug}". Please check the URL or browse all available cities.
          </p>
          <Link href="/used-cars">
            <Button>
              <ArrowRight className="mr-2 h-4 w-4" /> Browse All Cities
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 py-6 pt-16">
        <CityHero
          cityName={matchedCity?.city_name || citySlug}
          citySlug={citySlug}
          totalListings={totalListings}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-14">
              <FilterPanel
                filters={filters}
                filterOptions={effectiveFilterOptions}
                cities={cities}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onCityChange={handleCityChange}
              />
            </div>
          </aside>

          <CityCarGrid
            listings={listings}
            totalListings={totalListings}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            citySlug={citySlug}
            filters={filters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRemoveFilter={handleRemoveFilter}
            onClearFilters={handleClearFilters}
            onPageChange={handlePageChange}
            onMobileFilterOpen={() => setMobileFilterOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            isAuthenticated={isAuthenticated}
            onShowLogin={handleShowLogin}
          />
        </div>
      </main>
      <Footer />

      <MobileFilterSheet
        filters={filters}
        filterOptions={effectiveFilterOptions}
        cities={cities}
        onApplyFilters={handleApplyMobileFilters}
        onCityChange={handleCityChange}
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
      />
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
