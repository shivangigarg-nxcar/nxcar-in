import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

const NXCAR_LISTINGS_URL = `${BASE_URL}/listallcars`;
const NXCAR_CITIES_URL = `${BASE_URL}/available-cities`;

async function fetchCitiesCached() {
  return cachedFetch('buy_cities', 600, async () => {
    const response = await fetchWithTimeout(NXCAR_CITIES_URL, {}, 8000);
    const data = await response.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      return data.data.map((city: any) => ({
        city_id: city.city_id,
        city_name: city.city_name,
        city_image: city.city_image,
        v_cnt: city.v_cnt,
      }));
    }
    return [];
  });
}

async function fetchListingsPage(cityId: string) {
  return cachedFetch(`filter_options_${cityId}`, 300, async () => {
    const fltrArray = [
      { city_id: cityId },
      { type: "multiselect", name: "make", options: [] },
      { type: "multiselect", name: "model", options: [] },
      { type: "range", name: "year", selected_min: null, selected_max: null, min: null, max: null },
      { type: "range", name: "price", selected_min: null, selected_max: null, min: null, max: null }
    ];
    const response = await fetchWithTimeout(NXCAR_LISTINGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fltr: fltrArray, page: 1 }),
    }, 10000);
    const data = await response.json();
    return { filters: data.filters };
  });
}

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get('cityId') || '';
    const cities = await fetchCitiesCached();

    if (!cityId) {
      return NextResponse.json({
        cities,
        makes: [],
        models: [],
        makeModels: {},
        makeCounts: {},
        modelCounts: {},
        priceGroups: [],
        years: [],
        priceRange: { min: 0, max: 20000000 },
        yearRange: { min: 2010, max: new Date().getFullYear() },
      });
    }

    const { filters } = await fetchListingsPage(cityId);

    let makes: string[] = [];
    let models: string[] = [];
    let makeModels: Record<string, string[]> = {};
    let makeCounts: Record<string, number> = {};
    let modelCounts: Record<string, number> = {};
    let priceGroups: any[] = [];
    let years: number[] = [];
    let priceRange = { min: 0, max: 100000000 };
    let yearRange = { min: 1970, max: new Date().getFullYear() };

    if (filters && Array.isArray(filters)) {
      for (const filter of filters) {
        if (filter.name === "price" && filter.type === "range") {
          priceRange = {
            min: parseInt(filter.min || "0", 10),
            max: parseInt(filter.max || "100000000", 10),
          };
          if (filter.groups && Array.isArray(filter.groups)) {
            priceGroups = filter.groups.map((g: any) => ({
              displayName: g.displayName,
              name: g.name,
              min: g.min,
              max: g.max,
              count: g.count,
            }));
          }
        } else if (filter.name === "year" && filter.type === "range") {
          const minYear = parseInt(filter.min || "1970", 10);
          const maxYear = parseInt(filter.max || String(new Date().getFullYear()), 10);
          yearRange = { min: minYear, max: maxYear };
          years = [];
          for (let y = maxYear; y >= minYear; y--) {
            years.push(y);
          }
        } else if (filter.name === "make" && filter.type === "multiselect" && filter.options) {
          const allModels: string[] = [];
          for (const makeOption of filter.options) {
            if (makeOption.make) {
              makes.push(makeOption.make);
              makeModels[makeOption.make] = [];
              makeCounts[makeOption.make] = makeOption.count || 0;
              if (makeOption.models && Array.isArray(makeOption.models)) {
                for (const model of makeOption.models) {
                  if (model.model) {
                    makeModels[makeOption.make].push(model.model);
                    allModels.push(model.model);
                    modelCounts[model.model] = parseInt(model.count || "0", 10);
                  }
                }
                makeModels[makeOption.make].sort();
              }
            }
          }
          makes.sort();
          models = Array.from(new Set(allModels)).sort();
        }
      }
    }

    return NextResponse.json({
      cities,
      makes,
      models,
      makeModels,
      makeCounts,
      modelCounts,
      priceGroups,
      years,
      priceRange,
      yearRange,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch filter options",
      cities: [], makes: [], models: [], makeModels: {}, makeCounts: {}, modelCounts: {},
      priceGroups: [], years: [], priceRange: { min: 0, max: 0 }, yearRange: { min: 0, max: 0 },
    }, { status: 500 });
  }
}
