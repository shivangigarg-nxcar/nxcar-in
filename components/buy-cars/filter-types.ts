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
