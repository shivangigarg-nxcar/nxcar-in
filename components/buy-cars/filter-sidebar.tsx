'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { ScrollArea } from "@components/ui/scroll-area";
import { Slider } from "@components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@components/ui/sheet";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";
import {
  Search, X, MapPin, SlidersHorizontal,
  ChevronDown, ChevronRight as ChevronRightIcon, Check, ChevronsUpDown,
  RotateCcw, Filter
} from "lucide-react";

export interface City {
  city_id: string;
  city_name: string;
  city_image: string;
  v_cnt: string;
}

export interface Filters {
  cityId?: string;
  cityName?: string;
  makes?: string[];
  models?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

export interface PriceGroup {
  displayName: string;
  name: string;
  min: number;
  max: number | null;
  count: number;
}

export interface FilterOptions {
  cities: City[];
  makes: string[];
  models: string[];
  makeModels: Record<string, string[]>;
  makeCounts: Record<string, number>;
  modelCounts: Record<string, number>;
  priceGroups: PriceGroup[];
  years: number[];
  priceRange: { min: number; max: number };
  yearRange: { min: number; max: number };
}

export const defaultFilterOptions: FilterOptions = {
  cities: [],
  makes: [],
  models: [],
  makeModels: {},
  makeCounts: {},
  modelCounts: {},
  priceGroups: [],
  years: [],
  priceRange: { min: 0, max: 20000000 },
  yearRange: { min: 2010, max: new Date().getFullYear() },
};

export function formatPriceShort(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function useFilterLogic(makeModels: Record<string, string[]>) {
  const findMakeForModel = useCallback((model: string): string | null => {
    for (const [make, models] of Object.entries(makeModels)) {
      if (models.includes(model)) return make;
    }
    return null;
  }, [makeModels]);

  const deriveMakesFromModels = useCallback((selectedModels: string[]): string[] => {
    const makes = new Set<string>();
    for (const model of selectedModels) {
      const make = findMakeForModel(model);
      if (make) makes.add(make);
    }
    return Array.from(makes);
  }, [findMakeForModel]);

  const isMakeFullySelected = useCallback((make: string, selectedModels: string[]): boolean => {
    const modelsForMake = makeModels[make] || [];
    if (modelsForMake.length === 0) return false;
    return modelsForMake.every((m) => selectedModels.includes(m));
  }, [makeModels]);

  const isMakePartiallySelected = useCallback((make: string, selectedModels: string[]): boolean => {
    const modelsForMake = makeModels[make] || [];
    if (modelsForMake.length === 0) return false;
    const selectedCount = modelsForMake.filter((m) => selectedModels.includes(m)).length;
    return selectedCount > 0 && selectedCount < modelsForMake.length;
  }, [makeModels]);

  return { findMakeForModel, deriveMakesFromModels, isMakeFullySelected, isMakePartiallySelected };
}

function CityCombobox({
  cities,
  value,
  onValueChange,
  placeholder = "Select a city...",
}: {
  cities: City[];
  value: string;
  onValueChange: (cityId: string, cityName: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedCity = cities.find((c) => c.city_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal bg-background border-border text-foreground hover:bg-muted"
          data-testid="select-city"
        >
          {selectedCity ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {selectedCity.city_name}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-popover border border-border shadow-xl" align="start">
        <Command className="bg-popover">
          <CommandInput placeholder="Search city..." data-testid="input-city-search" className="text-foreground" />
          <CommandList className="bg-popover">
            <CommandEmpty className="text-muted-foreground">No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.city_id}
                  value={city.city_name}
                  onSelect={() => {
                    onValueChange(city.city_id, city.city_name);
                    setOpen(false);
                  }}
                  data-testid={`option-city-${city.city_id}`}
                  className="text-foreground"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === city.city_id ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1">{city.city_name}</span>
                  <span className="text-xs text-muted-foreground">{city.v_cnt} cars</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by make, model...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative" data-testid="search-bar">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 h-11 text-base focus:ring-2 focus:ring-primary/20 rounded-md"
        data-testid="input-search"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
          data-testid="button-clear-search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

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
                  <ScrollArea className="h-[220px]">
                    <div className="space-y-0.5 pr-3">
                      {filterOptions.makes.map((make) => {
                        const isExpanded = expandedMakes.has(make);
                        const makeModels = filterOptions.makeModels[make] || [];
                        const makeDirectlySelected = (filters.makes || []).includes(make);
                        const isFullySelected = makeDirectlySelected || isMakeFullySelected(make, filters.models || []);
                        const isPartiallySelected = !isFullySelected && isMakePartiallySelected(make, filters.models || []);

                        return (
                          <div key={make}>
                            <div className="flex items-center gap-2 py-1.5 hover:bg-muted/50 rounded px-2">
                              <Checkbox
                                checked={isFullySelected ? true : isPartiallySelected ? "indeterminate" : false}
                                onCheckedChange={(checked) => toggleMake(make, !!checked)}
                                data-testid={`checkbox-make-${make}`}
                              />
                              <button
                                onClick={() => toggleMakeExpand(make)}
                                className="flex-1 flex items-center justify-between text-sm"
                                data-testid={`button-expand-${make}`}
                              >
                                <span>{make}</span>
                                <span className="flex items-center gap-1">
                                  <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                    {filterOptions.makeCounts[make] || 0}
                                  </Badge>
                                  {makeModels.length > 0 && (
                                    isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />
                                  )}
                                </span>
                              </button>
                            </div>
                            {isExpanded && makeModels.length > 0 && (
                              <div className="ml-6 space-y-0.5 mb-1">
                                {makeModels.map((model) => (
                                  <div key={model} className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded">
                                    <Checkbox
                                      checked={isModelChecked(model, make)}
                                      onCheckedChange={(checked) => toggleModel(model, make, !!checked)}
                                      data-testid={`checkbox-model-${model}`}
                                    />
                                    <span className="text-sm flex-1">{model}</span>
                                    <span className="text-xs text-muted-foreground">({filterOptions.modelCounts[model] || 0})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
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
                <div className="px-3 py-2">
                  {filterOptions.priceGroups.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {filterOptions.priceGroups.map((group) => {
                        const isActive = filters.minPrice === group.min && filters.maxPrice === (group.max ?? priceRange.max);
                        return (
                          <button
                            key={group.name}
                            onClick={() => {
                              if (isActive) {
                                onFilterChange({ minPrice: undefined, maxPrice: undefined });
                                setLocalPriceValues([priceRange.min, priceRange.max]);
                              } else {
                                onFilterChange({ minPrice: group.min, maxPrice: group.max ?? priceRange.max });
                                setLocalPriceValues([group.min, group.max ?? priceRange.max]);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "bg-muted/50 text-foreground hover:bg-muted"
                            }`}
                            data-testid={`button-price-group-${group.name}`}
                          >
                            <span>{group.displayName}</span>
                            <span className={`text-[10px] ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>({group.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <Slider
                    value={localPriceValues}
                    min={priceRange.min}
                    max={priceRange.max}
                    step={50000}
                    onValueChange={(v) => setLocalPriceValues(v as [number, number])}
                    onValueCommit={(v) => onFilterChange({ minPrice: v[0], maxPrice: v[1] })}
                    className="mb-2"
                    data-testid="slider-price"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatPriceShort(localPriceValues[0])}</span>
                    <span>{formatPriceShort(localPriceValues[1])}</span>
                  </div>
                </div>
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
                <div className="px-3 py-2">
                  <Slider
                    value={localYearValues}
                    min={yearRange.min}
                    max={yearRange.max}
                    step={1}
                    onValueChange={(v) => setLocalYearValues(v as [number, number])}
                    onValueCommit={(v) => onFilterChange({ minYear: v[0], maxYear: v[1] })}
                    className="mb-2"
                    data-testid="slider-year"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{localYearValues[0]}</span>
                    <span>{localYearValues[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

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
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-0.5 pr-3">
                        {filterOptions.makes.map((make) => {
                          const isExpanded = expandedMakes.has(make);
                          const makeModels = filterOptions.makeModels[make] || [];
                          const makeDirectlySelected = (pendingFilters.makes || []).includes(make);
                          const isFullySelected = makeDirectlySelected || isMakeFullySelected(make, pendingFilters.models || []);
                          const isPartial = !isFullySelected && isMakePartiallySelected(make, pendingFilters.models || []);

                          return (
                            <div key={make}>
                              <div className="flex items-center gap-2 py-1.5 hover:bg-muted/50 rounded px-2">
                                <Checkbox
                                  checked={isFullySelected ? true : isPartial ? "indeterminate" : false}
                                  onCheckedChange={(checked) => toggleMake(make, !!checked)}
                                  data-testid={`mobile-checkbox-make-${make}`}
                                />
                                <button
                                  onClick={() => toggleMakeExpand(make)}
                                  className="flex-1 flex items-center justify-between text-sm"
                                  data-testid={`mobile-button-expand-${make}`}
                                >
                                  <span>{make}</span>
                                  <span className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                      {filterOptions.makeCounts[make] || 0}
                                    </Badge>
                                    {makeModels.length > 0 && (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />)}
                                  </span>
                                </button>
                              </div>
                              {isExpanded && makeModels.length > 0 && (
                                <div className="ml-6 space-y-0.5 mb-1">
                                  {makeModels.map((model) => (
                                    <div key={model} className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded">
                                      <Checkbox
                                        checked={isModelChecked(model, make)}
                                        onCheckedChange={(checked) => toggleModel(model, make, !!checked)}
                                        data-testid={`mobile-checkbox-model-${model}`}
                                      />
                                      <span className="text-sm flex-1">{model}</span>
                                      <span className="text-xs text-muted-foreground">({filterOptions.modelCounts[model] || 0})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
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
                  <div className="px-3 py-2">
                    {filterOptions.priceGroups.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {filterOptions.priceGroups.map((group) => {
                          const isActive = pendingFilters.minPrice === group.min && pendingFilters.maxPrice === (group.max ?? priceRange.max);
                          return (
                            <button
                              key={group.name}
                              onClick={() => {
                                if (isActive) {
                                  setPendingFilters((p) => ({ ...p, minPrice: undefined, maxPrice: undefined }));
                                } else {
                                  setPendingFilters((p) => ({ ...p, minPrice: group.min, maxPrice: group.max ?? priceRange.max }));
                                  setLocalPriceValues([group.min, group.max ?? priceRange.max]);
                                }
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                                isActive
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "bg-muted/50 text-foreground hover:bg-muted"
                              }`}
                              data-testid={`mobile-button-price-group-${group.name}`}
                            >
                              <span>{group.displayName}</span>
                              <span className={`text-[10px] ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>({group.count})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <Slider
                      value={localPriceValues}
                      min={priceRange.min}
                      max={priceRange.max}
                      step={50000}
                      onValueChange={(v) => setLocalPriceValues(v as [number, number])}
                      onValueCommit={(v) => setPendingFilters((p) => ({ ...p, minPrice: v[0], maxPrice: v[1] }))}
                      className="mb-2"
                      data-testid="mobile-slider-price"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPriceShort(localPriceValues[0])}</span>
                      <span>{formatPriceShort(localPriceValues[1])}</span>
                    </div>
                  </div>
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
                  <div className="px-3 py-2">
                    <Slider
                      value={localYearValues}
                      min={yearRange.min}
                      max={yearRange.max}
                      step={1}
                      onValueChange={(v) => setLocalYearValues(v as [number, number])}
                      onValueCommit={(v) => setPendingFilters((p) => ({ ...p, minYear: v[0], maxYear: v[1] }))}
                      className="mb-2"
                      data-testid="mobile-slider-year"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{localYearValues[0]}</span>
                      <span>{localYearValues[1]}</span>
                    </div>
                  </div>
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
