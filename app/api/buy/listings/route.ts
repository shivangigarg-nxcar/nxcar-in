import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch, fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

const PAGE_SIZE = 48;
const NXCAR_LISTINGS_URL = `${BASE_URL}/listallcars`;

function buildFltrArray(cityId: string, makes?: string, models?: string, minPrice?: string, maxPrice?: string, minYear?: string, maxYear?: string) {
  const fltr: any[] = [{ city_id: cityId }];

  const makesArray = makes ? makes.split(',').map(m => m.trim()).filter(m => m !== '') : [];
  fltr.push({ type: "multiselect", name: "make", options: makesArray });

  const modelsArray = models ? models.split(',').map(m => m.trim()).filter(m => m !== '') : [];
  fltr.push({ type: "multiselect", name: "model", options: modelsArray });

  fltr.push({
    type: "range",
    name: "year",
    selected_min: minYear || null,
    selected_max: maxYear || null,
  });

  fltr.push({
    type: "range",
    name: "price",
    selected_min: minPrice || null,
    selected_max: maxPrice || null,
  });

  return fltr;
}

function mapCarToListing(car: any) {
  return {
    id: car.vehicle_id,
    image: car.images || null,
    makeYear: parseInt(car.year, 10) || 0,
    make: car.make || "",
    model: car.model || "",
    variant: car.variant || "",
    kilometersDriven: parseInt(car.mileage, 10) || 0,
    fuelType: car.fuel_type || "",
    transmission: car.transmission || "",
    price: parseFloat(car.price) || 0,
    listingDate: car.created_date || "",
    sellerName: car.seller_fullname || car.seller_name || "",
    sellerWebUrl: car.web_url || "",
    city: car.city_name || "",
    ownership: car.ownership || "1",
  };
}

function parseAllCars(data: any) {
  if (!data.allcars || typeof data.allcars === 'string') {
    return [];
  }
  if (Array.isArray(data.allcars)) {
    return data.allcars
      .filter((car: any) => car.is_active === "1")
      .map(mapCarToListing);
  }
  return [];
}

async function fetchFilteredListings(fltr: any[], page: number) {
  const cacheKey = `listings_${JSON.stringify(fltr)}_page_${page}`;
  return cachedFetch(cacheKey, 180, async () => {
    const response = await fetchWithTimeout(NXCAR_LISTINGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fltr, page }),
    }, 10000);
    const data = await response.json();
    const listings = parseAllCars(data);
    const pagination = data.pagination || {};
    return {
      listings,
      total: parseInt(pagination.total || "0", 10),
      currentPage: parseInt(pagination.current_page || String(page), 10),
      perPage: parseInt(pagination.per_page || String(PAGE_SIZE), 10),
      totalPages: parseInt(pagination.total_pages || "1", 10),
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get('cityId');
    const cityName = request.nextUrl.searchParams.get('cityName');
    const makes = request.nextUrl.searchParams.get('makes') || undefined;
    const models = request.nextUrl.searchParams.get('models') || undefined;
    const minPrice = request.nextUrl.searchParams.get('minPrice') || undefined;
    const maxPrice = request.nextUrl.searchParams.get('maxPrice') || undefined;
    const minYear = request.nextUrl.searchParams.get('minYear') || undefined;
    const maxYear = request.nextUrl.searchParams.get('maxYear') || undefined;
    const search = request.nextUrl.searchParams.get('search');
    const page = request.nextUrl.searchParams.get('page');
    const requestedPage = Math.max(1, parseInt(page || '1', 10) || 1);

    if (!cityId || !cityName) {
      return NextResponse.json({ listings: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 });
    }

    const fltr = buildFltrArray(cityId, makes, models, minPrice, maxPrice, minYear, maxYear);

    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      let allListings: any[] = [];

      const firstResult = await fetchFilteredListings(fltr, 1);
      allListings = [...firstResult.listings];
      const totalPages = firstResult.totalPages;

      if (totalPages > 1) {
        const BATCH_SIZE = 10;
        for (let batchStart = 2; batchStart <= totalPages; batchStart += BATCH_SIZE) {
          const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, totalPages);
          const pageNumbers = [];
          for (let p = batchStart; p <= batchEnd; p++) pageNumbers.push(p);
          const batchResults = await Promise.all(pageNumbers.map(p => fetchFilteredListings(fltr, p)));
          for (const result of batchResults) {
            allListings = allListings.concat(result.listings);
          }
        }
      }

      let filteredListings = allListings.filter(l =>
        l.make.toLowerCase().includes(searchLower) ||
        l.model.toLowerCase().includes(searchLower) ||
        l.variant.toLowerCase().includes(searchLower) ||
        l.city.toLowerCase().includes(searchLower)
      );

      filteredListings.sort((a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime());

      const totalFilteredItems = filteredListings.length;
      const filteredTotalPages = Math.max(1, Math.ceil(totalFilteredItems / PAGE_SIZE));
      const filteredCurrentPage = Math.min(requestedPage, filteredTotalPages);
      const startIndex = (filteredCurrentPage - 1) * PAGE_SIZE;
      const paginatedListings = filteredListings.slice(startIndex, startIndex + PAGE_SIZE);

      return NextResponse.json({
        listings: paginatedListings,
        total: totalFilteredItems,
        page: filteredCurrentPage,
        pageSize: PAGE_SIZE,
        totalPages: filteredTotalPages,
      });
    }

    const result = await fetchFilteredListings(fltr, requestedPage);

    return NextResponse.json({
      listings: result.listings,
      total: result.total,
      page: result.currentPage,
      pageSize: PAGE_SIZE,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings", listings: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 }, { status: 500 });
  }
}
