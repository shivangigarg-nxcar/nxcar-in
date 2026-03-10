import type { Express } from "express";

const PAGE_SIZE = 48;
const NXCAR_LISTINGS_URL = "https://api.nxcar.in/api/listallcars";
const NXCAR_CITIES_URL = "https://api.nxcar.in/api/available-cities";

async function fetchListingsPage(cityId: string, page: number) {
  const fltrArray = [
    { city_id: cityId },
    { type: "multiselect", name: "make", options: [] },
    { type: "multiselect", name: "model", options: [] },
    { type: "range", name: "year", selected_min: null, selected_max: null, min: null, max: null },
    { type: "range", name: "price", selected_min: null, selected_max: null, min: null, max: null }
  ];
  const response = await fetch(NXCAR_LISTINGS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fltr: fltrArray, page }),
  });
  const data = await response.json();
  if (Array.isArray(data.allcars)) {
    const availableCars = data.allcars.filter((car: any) =>
      car.status === "Available" && car.is_active === "1"
    );
    const listings = availableCars.map((car: any) => ({
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
      city: car.city_name || "",
      ownership: car.ownership || "1",
    }));
    return { listings, filters: data.filters };
  }
  return { listings: [], filters: undefined };
}

async function fetchCitiesCached() {
  const response = await fetch(NXCAR_CITIES_URL);
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
}

export function registerBuyRoutes(app: Express) {
  app.get("/api/buy/cities", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/api/available-cities");
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        const cities = data.data.map((city: any) => ({
          city_id: city.city_id,
          city_name: city.city_name,
          city_image: city.city_image,
          v_cnt: city.v_cnt,
        }));
        res.json({ status: "success", cities });
      } else {
        res.json({ status: "success", cities: [] });
      }
    } catch (error) {
      console.error("Error fetching buy cities:", error);
      res.status(500).json({ status: "error", error: "Failed to fetch cities", cities: [] });
    }
  });

  app.get("/api/buy/listings", async (req, res) => {
    try {
      const { cityId, cityName, makes, models, minPrice, maxPrice, minYear, maxYear, search, page } = req.query;

      if (!cityId || !cityName) {
        return res.json({ listings: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 });
      }

      const cities = await fetchCitiesCached();
      const cityInfo = cities.find((c: any) => c.city_id === cityId);
      const totalCars = cityInfo ? parseInt(cityInfo.v_cnt || '0', 10) : 0;
      const totalPages = Math.max(1, Math.ceil(totalCars / PAGE_SIZE));
      const requestedPage = Math.max(1, parseInt(page as string || '1', 10) || 1);
      const currentPage = Math.min(requestedPage, totalPages);

      const hasFilters = makes || models || minPrice || maxPrice || minYear || maxYear || search;

      if (!hasFilters) {
        const { listings } = await fetchListingsPage(cityId as string, currentPage);
        return res.json({ listings, total: totalCars, page: currentPage, pageSize: PAGE_SIZE, totalPages });
      }

      const estimatedPages = Math.ceil(totalCars / PAGE_SIZE);
      let allListings: any[] = [];
      const BATCH_SIZE = 10;
      for (let batchStart = 1; batchStart <= estimatedPages; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, estimatedPages);
        const pageNumbers = [];
        for (let p = batchStart; p <= batchEnd; p++) pageNumbers.push(p);
        const batchResults = await Promise.all(pageNumbers.map(p => fetchListingsPage(cityId as string, p)));
        for (const result of batchResults) {
          if (result.listings.length > 0) allListings = allListings.concat(result.listings);
        }
      }

      let filteredListings = [...allListings];
      const makesArray = makes ? (makes as string).split(',').map(m => m.trim()).filter(m => m !== '') : [];
      const modelsArray = models ? (models as string).split(',').map(m => m.trim()).filter(m => m !== '') : [];

      if (makesArray.length > 0 && modelsArray.length > 0) {
        filteredListings = filteredListings.filter(l => makesArray.includes(l.make) && modelsArray.includes(l.model));
      } else if (makesArray.length > 0) {
        filteredListings = filteredListings.filter(l => makesArray.includes(l.make));
      } else if (modelsArray.length > 0) {
        filteredListings = filteredListings.filter(l => modelsArray.includes(l.model));
      }

      if (minPrice) {
        const min = parseInt(minPrice as string, 10);
        if (!isNaN(min)) filteredListings = filteredListings.filter(l => l.price >= min);
      }
      if (maxPrice) {
        const max = parseInt(maxPrice as string, 10);
        if (!isNaN(max)) filteredListings = filteredListings.filter(l => l.price <= max);
      }
      if (minYear) {
        const min = parseInt(minYear as string, 10);
        if (!isNaN(min)) filteredListings = filteredListings.filter(l => l.makeYear >= min);
      }
      if (maxYear) {
        const max = parseInt(maxYear as string, 10);
        if (!isNaN(max)) filteredListings = filteredListings.filter(l => l.makeYear <= max);
      }
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        filteredListings = filteredListings.filter(l =>
          l.make.toLowerCase().includes(searchLower) ||
          l.model.toLowerCase().includes(searchLower) ||
          l.variant.toLowerCase().includes(searchLower) ||
          l.city.toLowerCase().includes(searchLower)
        );
      }

      filteredListings.sort((a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime());

      const totalFilteredItems = filteredListings.length;
      const filteredTotalPages = Math.max(1, Math.ceil(totalFilteredItems / PAGE_SIZE));
      const filteredCurrentPage = Math.min(requestedPage, filteredTotalPages);
      const startIndex = (filteredCurrentPage - 1) * PAGE_SIZE;
      const paginatedListings = filteredListings.slice(startIndex, startIndex + PAGE_SIZE);

      res.json({ listings: paginatedListings, total: totalFilteredItems, page: filteredCurrentPage, pageSize: PAGE_SIZE, totalPages: filteredTotalPages });
    } catch (error) {
      console.error("Error fetching buy listings:", error);
      res.status(500).json({ error: "Failed to fetch listings", listings: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
    }
  });

  app.get("/api/buy/filter-options", async (req, res) => {
    try {
      const cityId = req.query.cityId as string || '';
      const cities = await fetchCitiesCached();

      if (!cityId) {
        return res.json({
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

      const { filters } = await fetchListingsPage(cityId, 1);

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

      res.json({
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
      console.error("Error fetching filter options:", error);
      res.status(500).json({
        error: "Failed to fetch filter options",
        cities: [], makes: [], models: [], makeModels: {}, makeCounts: {}, modelCounts: {},
        priceGroups: [], years: [], priceRange: { min: 0, max: 0 }, yearRange: { min: 0, max: 0 },
      });
    }
  });

  app.get("/api/buy/car/:id", async (req, res) => {
    try {
      const vehicleId = req.params.id;
      if (!vehicleId) {
        return res.status(400).json({ error: "Vehicle ID is required" });
      }

      const detailResponse = await fetch("https://api.nxcar.in/api/listcar-individual", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ vehicle_id: String(vehicleId) }),
      });

      const data = await detailResponse.json();

      if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
        return res.status(404).json({ error: data[0] });
      }

      if (!data || !data.individual || !data.individual.vehicle_id) {
        return res.status(404).json({ error: "Car not found" });
      }

      const car = data.individual;

      let imagesArray: string[] = [];
      if (data.images && Array.isArray(data.images)) {
        imagesArray = data.images
          .map((img: any) => img.image_url || img.url || "")
          .filter((url: string) => url !== "");
      } else if (car.images) {
        imagesArray = car.images.split(",").map((img: string) => img.trim()).filter((img: string) => img !== "");
      }

      let featuresRaw: any[] = [];
      if (data.feature && Array.isArray(data.feature)) {
        featuresRaw = data.feature;
      } else if (data.features && Array.isArray(data.features)) {
        featuresRaw = data.features;
      } else if (data.individual?.feature && Array.isArray(data.individual.feature)) {
        featuresRaw = data.individual.feature;
      }

      const features = featuresRaw
        .filter((f: any) => f.type === "feature" && f.name)
        .map((f: any) => ({ name: f.name, category: f.category || "Other" }));

      let insurance: any = {};
      if (data.insurance && typeof data.insurance === "object") {
        insurance = data.insurance;
      } else if (data.individual?.insurance && typeof data.individual.insurance === "object") {
        insurance = data.individual.insurance;
      }

      const parseOwnership = (ownership: string): string => {
        const num = parseInt(ownership, 10);
        if (num === 1) return "First Owner";
        if (num === 2) return "Second Owner";
        if (num === 3) return "Third Owner";
        if (num >= 4) return `${num}th Owner`;
        return ownership || "N/A";
      }

      const carscope = car.carscope || {};
      let rcData: Record<string, string> = {};
      try {
        if (carscope.rc_report_generate) {
          rcData = JSON.parse(carscope.rc_report_generate);
        }
      } catch { rcData = {}; }

      const specs = {
        engineCC: parseInt(carscope.vehicle_cc || rcData.vehicleCubicCapacity || "0", 10) || 0,
        cylinders: parseInt(rcData.vehicleCylindersNo || "0", 10) || 0,
        bodyType: carscope.bodyType || rcData.bodyType || "",
        color: carscope.colorOfCar || rcData.vehicleColour || car.color || "",
        grossWeight: parseInt(rcData.grossVehicleWeight || "0", 10) || 0,
        unladenWeight: parseInt(rcData.unladenWeight || "0", 10) || 0,
        wheelbase: parseInt(rcData.wheelbase || "0", 10) || 0,
        registrationDate: rcData.registrationDate || "",
        registrationNumber: rcData.registrationNumber || car.rto_location || "",
        insuranceProvider: insurance.provider_name || "",
        insuranceExpiry: insurance.expiry_date || "",
        manufacturingDate: rcData.manufacturingDate || "",
      };

      let insights: any[] = [];
      if (carscope.ai_insights && Array.isArray(carscope.ai_insights)) {
        insights = carscope.ai_insights.map((i: any) => ({
          heading: i.heading || "",
          body: i.body || i.text || "",
        }));
      }

      let rcDetails = null;
      if (Object.keys(rcData).length > 0) {
        rcDetails = {
          regNo: rcData.registrationNumber || "",
          vehicleClass: rcData.vehicleClass || "",
          chassis: rcData.chassisNumber || "",
          engine: rcData.engineNumber || "",
          manufacturerName: rcData.manufacturerName || "",
          model: rcData.model || "",
          color: rcData.vehicleColour || "",
          fuelType: rcData.fuelType || "",
          normsType: rcData.normsType || "",
          bodyType: rcData.bodyType || "",
          ownerCount: rcData.ownerCount || "",
          ownerName: rcData.ownerName || "",
          status: rcData.status || "",
          statusAsOn: rcData.statusAsOn || "",
          regAuthority: rcData.registeredAt || "",
          regDate: rcData.registrationDate || "",
          rcExpiryDate: rcData.rcExpiryDate || "",
          vehicleTaxUpto: rcData.vehicleTaxUpto || "",
          insuranceCompany: rcData.insuranceCompany || "",
          insuranceUpto: rcData.insuranceUpto || "",
          insurancePolicyNumber: rcData.insurancePolicyNumber || "",
          financer: rcData.financer || "",
          puccNumber: rcData.puccNumber || "",
          puccUpto: rcData.puccUpto || "",
          blacklistStatus: rcData.blacklistStatus || "",
          financed: rcData.financed === "true" || rcData.financed === "Yes",
        };
      }

      let carscopeData = null;
      if (Object.keys(carscope).length > 0) {
        carscopeData = {
          inspectionReportUrl: carscope.inspection_report || null,
          rcFrontUrl: carscope.rc_front || null,
          rcBackUrl: carscope.rc_back || null,
          rcDetails,
          warrantyPackages: [],
          insuranceQuotes: null,
          warrantyPrices: {} as Record<string, string>,
        };
      }

      const carDetail = {
        id: car.vehicle_id,
        images: imagesArray,
        make: car.make || "",
        model: car.model || "",
        variant: car.variant || "",
        year: parseInt(car.year, 10) || 0,
        price: parseFloat(car.price) || 0,
        emi: parseFloat(car.emi) || 0,
        kilometersDriven: parseInt(car.mileage, 10) || 0,
        fuelType: car.fuel_type || "",
        transmission: car.transmission || "",
        seats: parseInt(car.seats, 10) || 0,
        ownership: parseOwnership(car.ownership),
        city: car.city_name || car.location_name || "",
        rtoLocation: car.rto_location || "",
        sellerName: car.seller_name || car.seller_username || "",
        sellerPhone: car.seller_phone_number || "",
        sellerAddress: car.seller_address || "",
        listingDate: car.created_date || "",
        status: car.status || "",
        specs,
        features,
        insights,
        carscope: carscopeData,
      };

      res.json(carDetail);
    } catch (error) {
      console.error("Error fetching car details:", error);
      res.status(500).json({ error: "Failed to fetch car details" });
    }
  });

  app.get("/api/buy/car/:id/images", async (req, res) => {
    try {
      const vehicleId = req.params.id;
      const response = await fetch(`https://api.nxcar.in/api/getImage?vehicle_id=${vehicleId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) return res.json({ images: [] });
      const data = await response.json();
      if (!data.images || !Array.isArray(data.images)) return res.json({ images: [] });

      const sortedImages = [...data.images].sort((a: any, b: any) => {
        if (a.is_primary === "1" && b.is_primary !== "1") return -1;
        if (b.is_primary === "1" && a.is_primary !== "1") return 1;
        return parseInt(a.image_id || "0", 10) - parseInt(b.image_id || "0", 10);
      });

      const imageUrls = sortedImages
        .map((img: any) => img.image_url || "")
        .filter((url: string) => url !== "");

      res.json({ images: imageUrls });
    } catch (error) {
      console.error("Error fetching car images:", error);
      res.json({ images: [] });
    }
  });
}
