'use client';

import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@components/ui/sheet";
import { cn } from "@lib/utils";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import type { City, Filters, FilterOptions } from "./filter-types";
import { CityCombobox } from "./city-combobox";
import { useFilterLogic, MakeModelFilterSection } from "./make-model-filter";
import { PriceFilterSection } from "./price-filter";
import { YearFilterSection } from "./year-filter";

export function MobileFilterSheet({
  filters,
  filterOptions,
  cities,
  onApplyFilters,
  onCityChange,
  open,
  onOpenChange,
}: {
  filters: Filters;
  filterOptions: FilterOptions;
  cities: City[];
  onApplyFilters: (filters: Filters) => void;
  onCityChange: (cityId: string, cityName: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pendingFilters, setPendingFilters] = useState<Filters>(filters);
  const [expandedMakes, setExpandedMakes] = useState<Set<string>>(new Set());
  const { isMakeFullySelected, isMakePartiallySelected } = useFilterLogic(filterOptions.makeModels);

  useEffect(() => {
    if (open) setPendingFilters(filters);
  }, [open, filters]);

  const priceRange = filterOptions.priceRange;
  const yearRange = filterOptions.yearRange;

  const [localPriceValues, setLocalPriceValues] = useState<[number, number]>([
    pendingFilters.minPrice ?? priceRange.min,
    pendingFilters.maxPrice ?? priceRange.max,
  ]);
  const [localYearValues, setLocalYearValues] = useState<[number, number]>([
    pendingFilters.minYear ?? yearRange.min,
    pendingFilters.maxYear ?? yearRange.max,
  ]);

  useEffect(() => {
    setLocalPriceValues([
      pendingFilters.minPrice ?? priceRange.min,
      pendingFilters.maxPrice ?? priceRange.max,
    ]);
    setLocalYearValues([
      pendingFilters.minYear ?? yearRange.min,
      pendingFilters.maxYear ?? yearRange.max,
    ]);
  }, [pendingFilters.minPrice, pendingFilters.maxPrice, pendingFilters.minYear, pendingFilters.maxYear, priceRange.min, priceRange.max, yearRange.min, yearRange.max]);

  const toggleMakeExpand = (make: string) => {
    setExpandedMakes((prev) => {
      const next = new Set(prev);
      if (next.has(make)) next.delete(make);
      else next.add(make);
      return next;
    });
  };

  const toggleMake = (make: string, checked: boolean) => {
    const currentMakes = pendingFilters.makes || [];
    const currentModels = pendingFilters.models || [];
    const modelsForMake = filterOptions.makeModels[make] || [];

    if (checked) {
      const newMakes = currentMakes.includes(make) ? currentMakes : [...currentMakes, make];
      setPendingFilters((p) => ({ ...p, makes: newMakes }));
    } else {
      const newMakes = currentMakes.filter((m) => m !== make);
      const newModels = currentModels.filter((m) => !modelsForMake.includes(m));
      setPendingFilters((p) => ({ ...p, makes: newMakes, models: newModels }));
    }
  };

  const isModelChecked = (model: string, make: string) => {
    const currentMakes = pendingFilters.makes || [];
    const currentModels = pendingFilters.models || [];
    if (currentModels.includes(model)) return true;
    if (currentMakes.includes(make) && !currentModels.some((m) => (filterOptions.makeModels[make] || []).includes(m))) return true;
    return false;
  };

  const toggleModel = (model: string, make: string, checked: boolean) => {
    const currentMakes = pendingFilters.makes || [];
    const currentModels = pendingFilters.models || [];
    const modelsForMake = filterOptions.makeModels[make] || [];
    const makeIsSelected = currentMakes.includes(make);
    const hasExplicitModels = currentModels.some((m) => modelsForMake.includes(m));

    let newModels: string[];
    let newMakes: string[];

    if (checked) {
      newModels = [...currentModels, model];
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
    setPendingFilters((p) => ({ ...p, makes: newMakes, models: newModels }));
  };

  const [mobileSectionOpen, setMobileSectionOpen] = useState<Record<string, boolean>>({
    makeModel: true,
    price: true,
    year: true,
  });

  const toggleMobileSection = (key: string) => {
    setMobileSectionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 space-y-3 py-4 min-h-0">
          <div>
            <Label className="text-[10px] text-primary font-semibold mb-1.5 block">City</Label>
            <CityCombobox
              cities={cities}
              value={pendingFilters.cityId || ""}
              onValueChange={(id, name) => {
                onCityChange(id, name);
                onOpenChange(false);
              }}
            />
          </div>

          {pendingFilters.cityId && (
            <>
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleMobileSection("makeModel")}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                  data-testid="mobile-section-toggle-make-model"
                >
                  <Label className="text-[10px] text-primary font-semibold cursor-pointer">Make & Model</Label>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !mobileSectionOpen.makeModel && "-rotate-90")} />
                </button>
                {mobileSectionOpen.makeModel && (
                  <div className="px-2 py-1">
                    <MakeModelFilterSection
                      filterOptions={filterOptions}
                      filters={pendingFilters}
                      expandedMakes={expandedMakes}
                      onToggleMakeExpand={toggleMakeExpand}
                      onToggleMake={toggleMake}
                      onToggleModel={toggleModel}
                      isModelChecked={isModelChecked}
                      isMakeFullySelected={isMakeFullySelected}
                      isMakePartiallySelected={isMakePartiallySelected}
                      testIdPrefix="mobile-"
                    />
                  </div>
                )}
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleMobileSection("price")}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                  data-testid="mobile-section-toggle-price"
                >
                  <Label className="text-[10px] text-primary font-semibold cursor-pointer">Price Range</Label>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !mobileSectionOpen.price && "-rotate-90")} />
                </button>
                {mobileSectionOpen.price && (
                  <PriceFilterSection
                    priceGroups={filterOptions.priceGroups}
                    priceRange={priceRange}
                    localPriceValues={localPriceValues}
                    currentMinPrice={pendingFilters.minPrice}
                    currentMaxPrice={pendingFilters.maxPrice}
                    onLocalPriceChange={setLocalPriceValues}
                    onPriceCommit={(v) => setPendingFilters((p) => ({ ...p, minPrice: v[0], maxPrice: v[1] }))}
                    onPriceGroupClick={(group, isActive) => {
                      if (isActive) {
                        setPendingFilters((p) => ({ ...p, minPrice: undefined, maxPrice: undefined }));
                      } else {
                        setPendingFilters((p) => ({ ...p, minPrice: group.min, maxPrice: group.max ?? priceRange.max }));
                        setLocalPriceValues([group.min, group.max ?? priceRange.max]);
                      }
                    }}
                    testIdPrefix="mobile-"
                  />
                )}
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleMobileSection("year")}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                  data-testid="mobile-section-toggle-year"
                >
                  <Label className="text-[10px] text-primary font-semibold cursor-pointer">Year Range</Label>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !mobileSectionOpen.year && "-rotate-90")} />
                </button>
                {mobileSectionOpen.year && (
                  <YearFilterSection
                    yearRange={yearRange}
                    localYearValues={localYearValues}
                    onLocalYearChange={setLocalYearValues}
                    onYearCommit={(v) => setPendingFilters((p) => ({ ...p, minYear: v[0], maxYear: v[1] }))}
                    testIdPrefix="mobile-"
                  />
                )}
              </div>
            </>
          )}
        </div>
        <SheetFooter className="gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              setPendingFilters({ cityId: filters.cityId, cityName: filters.cityName });
              onApplyFilters({ cityId: filters.cityId, cityName: filters.cityName });
              onOpenChange(false);
            }}
            data-testid="mobile-button-clear-filters"
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              onApplyFilters(pendingFilters);
              onOpenChange(false);
            }}
            data-testid="mobile-button-apply-filters"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
