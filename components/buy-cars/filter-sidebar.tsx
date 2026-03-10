'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";
import { SlidersHorizontal, ChevronDown, RotateCcw, X } from "lucide-react";

export type { City, Filters, PriceGroup, FilterOptions } from "./filter-types";
export { defaultFilterOptions, formatPriceShort } from "./filter-types";
export { SearchBar } from "./search-bar";
export { MobileFilterSheet } from "./mobile-filter-sheet";

import type { City, Filters, FilterOptions } from "./filter-types";
import { formatPriceShort } from "./filter-types";
import { CityCombobox } from "./city-combobox";
import { useFilterLogic, MakeModelFilterSection } from "./make-model-filter";
import { PriceFilterSection } from "./price-filter";
import { YearFilterSection } from "./year-filter";

export function FilterPanel({
  filters,
  filterOptions,
  cities,
  onFilterChange,
  onClearFilters,
  onCityChange,
}: {
  filters: Filters;
  filterOptions: FilterOptions;
  cities: City[];
  onFilterChange: (update: Partial<Filters>) => void;
  onClearFilters: () => void;
  onCityChange: (cityId: string, cityName: string) => void;
}) {
  const [expandedMakes, setExpandedMakes] = useState<Set<string>>(new Set());
  const { isMakeFullySelected, isMakePartiallySelected } = useFilterLogic(filterOptions.makeModels);

  const priceRange = filterOptions.priceRange;
  const yearRange = filterOptions.yearRange;

  const [localPriceValues, setLocalPriceValues] = useState<[number, number]>([
    filters.minPrice ?? priceRange.min,
    filters.maxPrice ?? priceRange.max,
  ]);
  const [localYearValues, setLocalYearValues] = useState<[number, number]>([
    filters.minYear ?? yearRange.min,
    filters.maxYear ?? yearRange.max,
  ]);

  useEffect(() => {
    setLocalPriceValues([
      filters.minPrice ?? priceRange.min,
      filters.maxPrice ?? priceRange.max,
    ]);
  }, [filters.minPrice, filters.maxPrice, priceRange.min, priceRange.max]);

  useEffect(() => {
    setLocalYearValues([
      filters.minYear ?? yearRange.min,
      filters.maxYear ?? yearRange.max,
    ]);
  }, [filters.minYear, filters.maxYear, yearRange.min, yearRange.max]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.makes && filters.makes.length > 0) count += filters.makes.length;
    if (filters.models && filters.models.length > 0) count += filters.models.length;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minYear !== undefined || filters.maxYear !== undefined) count++;
    return count;
  }, [filters]);

  const toggleMakeExpand = useCallback((make: string) => {
    setExpandedMakes((prev) => {
      const next = new Set(prev);
      if (next.has(make)) next.delete(make);
      else next.add(make);
      return next;
    });
  }, []);

  const toggleMake = useCallback(
    (make: string, checked: boolean) => {
      const currentMakes = filters.makes || [];
      const currentModels = filters.models || [];
      const modelsForMake = filterOptions.makeModels[make] || [];

      if (checked) {
        const newMakes = currentMakes.includes(make) ? currentMakes : [...currentMakes, make];
        onFilterChange({ makes: newMakes });
      } else {
        const newMakes = currentMakes.filter((m) => m !== make);
        const newModels = currentModels.filter((m) => !modelsForMake.includes(m));
        onFilterChange({ makes: newMakes, models: newModels });
      }
    },
    [filters.makes, filters.models, filterOptions.makeModels, onFilterChange]
  );

  const isModelChecked = useCallback(
    (model: string, make: string) => {
      const currentMakes = filters.makes || [];
      const currentModels = filters.models || [];
      if (currentModels.includes(model)) return true;
      if (currentMakes.includes(make) && !currentModels.some((m) => (filterOptions.makeModels[make] || []).includes(m))) return true;
      return false;
    },
    [filters.makes, filters.models, filterOptions.makeModels]
  );

  const toggleModel = useCallback(
    (model: string, make: string, checked: boolean) => {
      const currentMakes = filters.makes || [];
      const currentModels = filters.models || [];
      const modelsForMake = filterOptions.makeModels[make] || [];
      const makeIsSelected = currentMakes.includes(make);
      const hasExplicitModels = currentModels.some((m) => modelsForMake.includes(m));

      let newModels: string[];
      let newMakes: string[];

      if (checked) {
        if (makeIsSelected && !hasExplicitModels) {
          newModels = [...currentModels, model];
        } else {
          newModels = [...currentModels, model];
        }
        newMakes = makeIsSelected ? currentMakes : [...currentMakes, make];
      } else {
        if (makeIsSelected && !hasExplicitModels) {
          newModels = [...currentModels, ...modelsForMake.filter((m) => m !== model)];
          newMakes = currentMakes;
        } else {
          newModels = currentModels.filter((m) => m !== model);
          const anyModelStillSelected = newModels.some((m) => modelsForMake.includes(m));
          newMakes = anyModelStillSelected ? currentMakes : currentMakes.filter((m) => m !== make);
        }
      }
      onFilterChange({ makes: newMakes, models: newModels });
    },
    [filters.makes, filters.models, filterOptions.makeModels, onFilterChange]
  );

  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({
    makeModel: true,
    price: true,
    year: true,
  });

  const toggleSection = useCallback((key: string) => {
    setSectionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <Card className="max-h-[calc(100vh-120px)] flex flex-col">
      <CardHeader className="p-4 pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold">Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs h-5 px-1.5" data-testid="badge-filter-count">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-primary text-xs h-7" data-testid="button-clear-filters">
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3 overflow-y-auto flex-1 min-h-0">
        <div>
          <Label className="text-[10px] text-primary font-semibold mb-1.5 block">City</Label>
          <CityCombobox
            cities={cities}
            value={filters.cityId || ""}
            onValueChange={onCityChange}
          />
        </div>

        {filters.cityId && (
          <>
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("makeModel")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                data-testid="section-toggle-make-model"
              >
                <Label className="text-[10px] text-primary font-semibold cursor-pointer">Make & Model</Label>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !sectionOpen.makeModel && "-rotate-90")} />
              </button>
              {sectionOpen.makeModel && (
                <div className="px-2 py-1">
                  <MakeModelFilterSection
                    filterOptions={filterOptions}
                    filters={filters}
                    expandedMakes={expandedMakes}
                    onToggleMakeExpand={toggleMakeExpand}
                    onToggleMake={toggleMake}
                    onToggleModel={toggleModel}
                    isModelChecked={isModelChecked}
                    isMakeFullySelected={isMakeFullySelected}
                    isMakePartiallySelected={isMakePartiallySelected}
                  />
                </div>
              )}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                data-testid="section-toggle-price"
              >
                <Label className="text-[10px] text-primary font-semibold cursor-pointer">Price Range</Label>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !sectionOpen.price && "-rotate-90")} />
              </button>
              {sectionOpen.price && (
                <PriceFilterSection
                  priceGroups={filterOptions.priceGroups}
                  priceRange={priceRange}
                  localPriceValues={localPriceValues}
                  currentMinPrice={filters.minPrice}
                  currentMaxPrice={filters.maxPrice}
                  onLocalPriceChange={setLocalPriceValues}
                  onPriceCommit={(v) => onFilterChange({ minPrice: v[0], maxPrice: v[1] })}
                  onPriceGroupClick={(group, isActive) => {
                    if (isActive) {
                      onFilterChange({ minPrice: undefined, maxPrice: undefined });
                      setLocalPriceValues([priceRange.min, priceRange.max]);
                    } else {
                      onFilterChange({ minPrice: group.min, maxPrice: group.max ?? priceRange.max });
                      setLocalPriceValues([group.min, group.max ?? priceRange.max]);
                    }
                  }}
                />
              )}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("year")}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                data-testid="section-toggle-year"
              >
                <Label className="text-[10px] text-primary font-semibold cursor-pointer">Year Range</Label>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !sectionOpen.year && "-rotate-90")} />
              </button>
              {sectionOpen.year && (
                <YearFilterSection
                  yearRange={yearRange}
                  localYearValues={localYearValues}
                  onLocalYearChange={setLocalYearValues}
                  onYearCommit={(v) => onFilterChange({ minYear: v[0], maxYear: v[1] })}
                />
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ActiveFiltersBar({
  filters,
  onRemoveFilter,
  onClearAll,
}: {
  filters: Filters;
  onRemoveFilter: (key: string, value?: string) => void;
  onClearAll: () => void;
}) {
  const badges: { key: string; label: string; value?: string }[] = [];

  if (filters.cityName) {
    badges.push({ key: "city", label: filters.cityName });
  }
  (filters.makes || []).forEach((make) => {
    badges.push({ key: "make", label: make, value: make });
  });
  (filters.models || []).forEach((model) => {
    badges.push({ key: "model", label: model, value: model });
  });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice !== undefined ? formatPriceShort(filters.minPrice) : "Any";
    const max = filters.maxPrice !== undefined ? formatPriceShort(filters.maxPrice) : "Any";
    badges.push({ key: "price", label: `${min} - ${max}` });
  }
  if (filters.minYear !== undefined || filters.maxYear !== undefined) {
    badges.push({ key: "year", label: `${filters.minYear || "Any"} - ${filters.maxYear || "Any"}` });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4" data-testid="active-filters-bar">
      {badges.map((badge, i) => (
        <Badge
          key={`${badge.key}-${badge.value || i}`}
          className="bg-primary text-primary-foreground rounded-full flex items-center gap-1 text-xs"
          data-testid={`badge-filter-${badge.key}-${badge.value || i}`}
        >
          {badge.label}
          <button
            onClick={() => onRemoveFilter(badge.key, badge.value)}
            className="ml-1 hover:opacity-70"
            aria-label={`Remove ${badge.label} filter`}
            data-testid={`button-remove-filter-${badge.key}-${badge.value || i}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {badges.length > 1 && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-6 text-primary gap-1" data-testid="button-clear-all-filters">
          <RotateCcw className="h-3 w-3" />
          Clear all
        </Button>
      )}
    </div>
  );
}
