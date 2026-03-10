import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCarSchema, insertTestimonialSchema, insertDealerCitySchema, 
  insertNxcarLocationSchema, insertSellCarLeadSchema, insertSiteContentSchema,
  insertMarketingBannerSchema, loginSchema,
  insertCarReviewSchema, insertPlatformFeedbackSchema, insertNotificationSubscriptionSchema,
  insertUserCarPreferencesSchema, insertBlogArticleSchema, insertCarListingSchema
} from "@shared/schema";
import { fromError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import OpenAI from "openai";
import { SEED_CARS, SEED_TESTIMONIALS, SEED_DEALER_CITIES, SEED_LOCATIONS, SEED_BLOG_ARTICLES } from "./seed-data";

// Middleware to check admin auth
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Replit Auth (BEFORE other routes)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Register chat routes for chatbot
  registerChatRoutes(app);
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // ========== NXCAR MASTER DATA PROXY ROUTES ==========
  // These proxy external Nxcar APIs to avoid CORS issues
  
  app.get("/api/nxcar/makes", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/api/make");
      if (!response.ok) throw new Error("Failed to fetch makes");
      const data = await response.json();
      // Transform to expected format: {id, make_name, make_image}
      const makes = (data.make || []).map((m: any) => ({
        id: parseInt(m.make_id),
        make_name: m.make,
        make_image: m.make_image || null,
      }));
      res.json(makes);
    } catch (error) {
      console.error("Error fetching makes:", error);
      res.status(500).json({ error: "Failed to fetch makes" });
    }
  });

  app.get("/api/nxcar/models", async (req, res) => {
    try {
      const makeId = req.query.make_id;
      if (!makeId) {
        return res.status(400).json({ error: "make_id is required" });
      }
      const response = await fetch(`https://api.nxcar.in/model?make_id=${makeId}`);
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      // Transform to expected format: {id, model_name, make_id}
      const models = (data.model || []).map((m: any) => ({
        id: parseInt(m.model_id),
        model_name: m.model,
        make_id: parseInt(makeId as string),
      }));
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.get("/api/nxcar/years", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/year");
      if (!response.ok) throw new Error("Failed to fetch years");
      const data = await response.json();
      // Transform to expected format: {id, year}
      const years = (data.year || []).map((y: number, index: number) => ({
        id: index + 1,
        year: y,
      }));
      res.json(years);
    } catch (error) {
      console.error("Error fetching years:", error);
      res.status(500).json({ error: "Failed to fetch years" });
    }
  });

  app.get("/api/nxcar/fuel-types", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/v2/fuel-type");
      if (!response.ok) throw new Error("Failed to fetch fuel types");
      const data = await response.json();
      // Transform to expected format: {id, fuel_type}
      const fuelTypes = (data.fule_type || []).map((f: any) => ({
        id: parseInt(f.fuel_id),
        fuel_type: f.fuel_type,
      }));
      res.json(fuelTypes);
    } catch (error) {
      console.error("Error fetching fuel types:", error);
      res.status(500).json({ error: "Failed to fetch fuel types" });
    }
  });

  app.get("/api/nxcar/variants", async (req, res) => {
    try {
      const { model_id, fuel_type } = req.query;
      if (!model_id || !fuel_type) {
        return res.status(400).json({ error: "model_id and fuel_type are required" });
      }
      const response = await fetch(`https://api.nxcar.in/specific-variant?model_id=${model_id}&fuel_type=${fuel_type}`);
      if (!response.ok) throw new Error("Failed to fetch variants");
      const data = await response.json();
      // Transform to expected format: {id, variant_name, model_id}
      const variants = (data.variant || data || []).map((v: any) => ({
        id: parseInt(v.variant_id || v.id),
        variant_name: v.variant || v.variant_name,
        model_id: parseInt(model_id as string),
      }));
      res.json(Array.isArray(variants) ? variants : []);
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ error: "Failed to fetch variants" });
    }
  });

  // Dealer partners proxy route
  app.get("/api/nxcar/partners", async (req, res) => {
    try {
      const cityId = req.query.city_id;
      if (!cityId) {
        return res.status(400).json({ error: "city_id is required" });
      }
      const response = await fetch(`https://api.nxcar.in/partners/web-urls?fltr[][city_id]=${cityId}`);
      if (!response.ok) throw new Error("Failed to fetch partners");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Failed to fetch partners", allpartners: [] });
    }
  });

  // Inspection slots proxy
  app.get("/api/nxcar/inspection-slots", async (req, res) => {
    try {
      const response = await fetch("https://api.nxcar.in/inspection-slots");
      if (!response.ok) throw new Error("Failed to fetch inspection slots");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching inspection slots:", error);
      res.status(500).json({ status: false, data: [] });
    }
  });

  // Inspection franchises proxy
  app.post("/api/nxcar/inspection-franchises", async (req, res) => {
    try {
      const { city_id } = req.body;
      if (!city_id) {
        return res.status(400).json({ error: "city_id is required" });
      }
      const response = await fetch("https://api.nxcar.in/v2/inspection-franchise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city_id }),
      });
      if (!response.ok) throw new Error("Failed to fetch inspection franchises");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching inspection franchises:", error);
      res.status(500).json({ status: false, message: "Failed to fetch franchises", data: [] });
    }
  });

  // ========== BUY USED CARS PROXY ROUTES ==========

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

  // ========== PUBLIC API ROUTES ==========
  
  // Car routes
  app.get("/api/cars", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const isFeatured = req.query.featured === "true" ? true : undefined;
      
      // Always fetch from external NXCar API
      try {
        const externalResponse = await fetch("https://api.nxcar.in/listallcars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        
        if (externalResponse.ok) {
          const data = await externalResponse.json();
          const allCars = data.allcars || [];
          
          // Filter only cars with valid images from the API
          const carsWithImages = allCars.filter((car: any) => 
            car.images && car.images.startsWith("http")
          );
          
          // Transform external API response to match our Car schema
          const transformedCars = carsWithImages.slice(0, limit).map((car: any, index: number) => ({
            id: parseInt(car.vehicle_id) || index + 1000,
            name: `${car.make} ${car.model}`,
            brand: car.make || "Unknown",
            model: car.model || "Unknown",
            year: parseInt(car.year) || new Date().getFullYear(),
            price: Math.round(parseFloat(car.price) || 0),
            fuelType: car.fuel_type || "Petrol",
            transmission: car.transmission || "Manual",
            kilometers: parseInt(car.mileage) || 0,
            location: car.city_name || "India",
            imageUrl: car.images,
            isFeatured: isFeatured || false,
            createdAt: new Date(car.created_date || Date.now()),
          }));
          
          return res.json(transformedCars);
        }
      } catch (externalError) {
        console.error("Error fetching from external API, falling back to local:", externalError);
      }
      
      // Fallback to local storage only if API fails
      const cars = await storage.getCars(limit, isFeatured);
      res.json(cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // First check local storage
      const localCar = await storage.getCarById(id);
      if (localCar) {
        return res.json(localCar);
      }
      
      // If not found locally, fetch from external NXCar API
      try {
        const externalResponse = await fetch("https://api.nxcar.in/listallcars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        
        if (externalResponse.ok) {
          const data = await externalResponse.json();
          const allCars = data.allcars || [];
          
          // Find the car by vehicle_id
          const externalCar = allCars.find((car: any) => parseInt(car.vehicle_id) === id);
          
          if (externalCar && externalCar.images && externalCar.images.startsWith("http")) {
            const transformedCar = {
              id: parseInt(externalCar.vehicle_id),
              name: `${externalCar.make} ${externalCar.model}`,
              brand: externalCar.make || "Unknown",
              model: externalCar.model || "Unknown",
              year: parseInt(externalCar.year) || new Date().getFullYear(),
              price: Math.round(parseFloat(externalCar.price) || 0),
              fuelType: externalCar.fuel_type || "Petrol",
              transmission: externalCar.transmission || "Manual",
              kilometers: parseInt(externalCar.mileage) || 0,
              location: externalCar.city_name || "India",
              imageUrl: externalCar.images,
              isFeatured: false,
              createdAt: new Date(externalCar.created_date || Date.now()),
            };
            return res.json(transformedCar);
          }
        }
      } catch (externalError) {
        console.error("Error fetching car from external API:", externalError);
      }
      
      return res.status(404).json({ error: "Car not found" });
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
      const testimonials = await storage.getTestimonials(limit);
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Dealer City routes
  app.get("/api/dealer-cities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
      const cities = await storage.getDealerCities(limit);
      res.json(cities);
    } catch (error) {
      console.error("Error fetching dealer cities:", error);
      res.status(500).json({ error: "Failed to fetch dealer cities" });
    }
  });

  // Nxcar Location routes
  app.get("/api/locations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
      const locations = await storage.getNxcarLocations(limit);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Sell Car Lead routes (public)
  app.post("/api/sell-car-leads", async (req, res) => {
    try {
      const result = insertSellCarLeadSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const lead = await storage.createSellCarLead(result.data);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating sell car lead:", error);
      res.status(500).json({ error: "Failed to create sell car lead" });
    }
  });

  // ========== VEHICLE LOOKUP API ==========
  
  // Proxy for external vehicle details API
  app.get("/api/vehicle-lookup/:vehicleNumber", async (req, res) => {
    try {
      const vehicleNumber = req.params.vehicleNumber.toUpperCase().replace(/\s/g, '');
      
      const response = await fetch(
        `https://api.nxcar.in/vehicle_details?vehicle_number=${vehicleNumber}&backend=yes&from_crm=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch vehicle details" });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      res.status(500).json({ error: "Failed to fetch vehicle details" });
    }
  });

  // ========== CAR LISTINGS ROUTES ==========
  
  // Get all car listings (approved only for public - always filters for public access)
  app.get("/api/car-listings", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      // Public endpoint always returns only approved listings for security
      const listings = await storage.getCarListings(limit, true);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching car listings:", error);
      res.status(500).json({ error: "Failed to fetch car listings" });
    }
  });
  
  // Get single car listing
  app.get("/api/car-listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getCarListingById(id);
      if (!listing) {
        return res.status(404).json({ error: "Car listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error fetching car listing:", error);
      res.status(500).json({ error: "Failed to fetch car listing" });
    }
  });
  
  // Create new car listing (public - users can submit)
  app.post("/api/car-listings", async (req, res) => {
    try {
      const listingData = {
        ...req.body,
        sessionId: req.sessionID
      };
      
      const result = insertCarListingSchema.safeParse(listingData);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      
      const listing = await storage.createCarListing(result.data);
      res.status(201).json(listing);
    } catch (error) {
      console.error("Error creating car listing:", error);
      res.status(500).json({ error: "Failed to create car listing" });
    }
  });
  
  // Admin: Approve car listing
  app.post("/api/admin/car-listings/:id/approve", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.approveCarListing(id);
      if (!listing) {
        return res.status(404).json({ error: "Car listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error approving car listing:", error);
      res.status(500).json({ error: "Failed to approve car listing" });
    }
  });
  
  // Admin: Delete car listing
  app.delete("/api/admin/car-listings/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCarListing(id);
      if (!deleted) {
        return res.status(404).json({ error: "Car listing not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting car listing:", error);
      res.status(500).json({ error: "Failed to delete car listing" });
    }
  });
  
  // Admin: Get all listings (including pending)
  app.get("/api/admin/car-listings", requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const listings = await storage.getCarListings(limit, false);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching car listings:", error);
      res.status(500).json({ error: "Failed to fetch car listings" });
    }
  });

  // Site Content (public read)
  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.get("/api/site-content/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContentByKey(req.params.key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  // ========== FAVORITES ROUTES ==========
  
  // Get user's favorites
  app.get("/api/favorites", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const favorites = await storage.getFavorites(sessionId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });
  
  // Get favorite car IDs (for UI state)
  app.get("/api/favorites/ids", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const ids = await storage.getFavoriteCarIds(sessionId);
      res.json(ids);
    } catch (error) {
      console.error("Error fetching favorite IDs:", error);
      res.status(500).json({ error: "Failed to fetch favorite IDs" });
    }
  });
  
  // Add to favorites
  app.post("/api/favorites/:carId", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const carId = parseInt(req.params.carId);
      if (isNaN(carId)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }
      
      // Check local storage first
      let localCar = await storage.getCarById(carId);
      
      // If not in local, fetch from external API and sync to local DB
      if (!localCar) {
        try {
          const externalResponse = await fetch("https://api.nxcar.in/listallcars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (externalResponse.ok) {
            const data = await externalResponse.json();
            const allCars = data.allcars || [];
            const externalCar = allCars.find((car: any) => parseInt(car.vehicle_id) === carId);
            
            if (externalCar && externalCar.images && externalCar.images.startsWith("http")) {
              // Sync car to local database to satisfy foreign key constraint
              const carData = {
                name: `${externalCar.make} ${externalCar.model}`,
                brand: externalCar.make || "Unknown",
                model: externalCar.model || "Unknown",
                year: parseInt(externalCar.year) || new Date().getFullYear(),
                price: Math.round(parseFloat(externalCar.price) || 0),
                fuelType: externalCar.fuel_type || "Petrol",
                transmission: externalCar.transmission || "Manual",
                kilometers: parseInt(externalCar.mileage) || 0,
                location: externalCar.city_name || "India",
                imageUrl: externalCar.images,
                isFeatured: false,
              };
              
              // Insert with specific ID to maintain consistency
              await storage.syncExternalCar(carId, carData);
              localCar = await storage.getCarById(carId);
            }
          }
        } catch (externalError) {
          console.error("Error syncing external car:", externalError);
        }
      }
      
      if (!localCar) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      const favorite = await storage.addFavorite(sessionId, carId);
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });
  
  // Remove from favorites
  app.delete("/api/favorites/:carId", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const carId = parseInt(req.params.carId);
      if (isNaN(carId)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }
      const removed = await storage.removeFavorite(sessionId, carId);
      res.json({ success: removed });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // ========== CAR REVIEWS ==========
  
  // Get reviews for a car
  app.get("/api/cars/:carId/reviews", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      if (isNaN(carId)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }
      const reviews = await storage.getCarReviews(carId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching car reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  
  // Get average rating for a car
  app.get("/api/cars/:carId/rating", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      if (isNaN(carId)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }
      const rating = await storage.getCarAverageRating(carId);
      res.json(rating);
    } catch (error) {
      console.error("Error fetching car rating:", error);
      res.status(500).json({ error: "Failed to fetch rating" });
    }
  });
  
  // Submit a car review
  app.post("/api/cars/:carId/reviews", async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      if (isNaN(carId)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }
      
      const reviewData = {
        ...req.body,
        carId,
        sessionId: req.sessionID
      };
      
      const result = insertCarReviewSchema.safeParse(reviewData);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).message });
      }
      
      const review = await storage.createCarReview(result.data);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating car review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });
  
  // Delete own car review
  app.delete("/api/reviews/:reviewId", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }
      const deleted = await storage.deleteCarReview(reviewId, req.sessionID);
      if (!deleted) {
        return res.status(404).json({ error: "Review not found or not authorized" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // ========== PLATFORM FEEDBACK ==========
  
  // Submit platform feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = {
        ...req.body,
        sessionId: req.sessionID,
        userAgent: req.headers["user-agent"] || null
      };
      
      const result = insertPlatformFeedbackSchema.safeParse(feedbackData);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).message });
      }
      
      const feedback = await storage.createPlatformFeedback(result.data);
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Marketing Banners (public read)
  app.get("/api/banners", async (req, res) => {
    try {
      const position = req.query.position as string | undefined;
      const banners = await storage.getMarketingBanners(position);
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  // ========== NOTIFICATION SUBSCRIPTIONS ==========
  
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const subscriptionData = {
        ...req.body,
        sessionId: req.sessionID
      };
      
      const result = insertNotificationSubscriptionSchema.safeParse(subscriptionData);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).message });
      }
      
      const subscription = await storage.createNotificationSubscription(result.data);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });
  
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const subscription = await storage.getNotificationSubscriptionBySession(sessionId);
      res.json(subscription || null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // ========== AUTH ROUTES ==========
  
  app.post("/api/admin/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      const { username, password } = result.data;
      const user = await storage.getAdminUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      (req.session as any).isAdmin = true;
      (req.session as any).username = username;
      
      res.json({ success: true, username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session && (req.session as any).isAdmin) {
      res.json({ isAdmin: true, username: (req.session as any).username });
    } else {
      res.json({ isAdmin: false });
    }
  });

  // Setup admin (only works if no admin exists and password provided)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const existingAdmin = await storage.getAdminUserByUsername("admin");
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      
      // Require password from request body for security
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      await storage.createAdminUser({ username: "admin", passwordHash });
      
      res.json({ success: true, message: "Admin created with username: admin" });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ error: "Setup failed" });
    }
  });

  // ========== ADMIN PROTECTED ROUTES ==========
  
  // Cars CRUD
  app.post("/api/admin/cars", requireAuth, async (req, res) => {
    try {
      const result = insertCarSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const car = await storage.createCar(result.data);
      res.status(201).json(car);
    } catch (error) {
      console.error("Error creating car:", error);
      res.status(500).json({ error: "Failed to create car" });
    }
  });

  app.put("/api/admin/cars/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertCarSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const car = await storage.updateCar(id, result.data);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(500).json({ error: "Failed to update car" });
    }
  });

  app.delete("/api/admin/cars/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCar(id);
      if (!deleted) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ error: "Failed to delete car" });
    }
  });

  // Testimonials CRUD
  app.post("/api/admin/testimonials", requireAuth, async (req, res) => {
    try {
      const result = insertTestimonialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const testimonial = await storage.createTestimonial(result.data);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertTestimonialSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const testimonial = await storage.updateTestimonial(id, result.data);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTestimonial(id);
      if (!deleted) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Dealer Cities CRUD
  app.post("/api/admin/dealer-cities", requireAuth, async (req, res) => {
    try {
      const result = insertDealerCitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const city = await storage.createDealerCity(result.data);
      res.status(201).json(city);
    } catch (error) {
      console.error("Error creating dealer city:", error);
      res.status(500).json({ error: "Failed to create dealer city" });
    }
  });

  app.put("/api/admin/dealer-cities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertDealerCitySchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const city = await storage.updateDealerCity(id, result.data);
      if (!city) {
        return res.status(404).json({ error: "Dealer city not found" });
      }
      res.json(city);
    } catch (error) {
      console.error("Error updating dealer city:", error);
      res.status(500).json({ error: "Failed to update dealer city" });
    }
  });

  app.delete("/api/admin/dealer-cities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDealerCity(id);
      if (!deleted) {
        return res.status(404).json({ error: "Dealer city not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting dealer city:", error);
      res.status(500).json({ error: "Failed to delete dealer city" });
    }
  });

  // Nxcar Locations CRUD
  app.post("/api/admin/locations", requireAuth, async (req, res) => {
    try {
      const result = insertNxcarLocationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const location = await storage.createNxcarLocation(result.data);
      res.status(201).json(location);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  app.put("/api/admin/locations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertNxcarLocationSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const location = await storage.updateNxcarLocation(id, result.data);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Failed to update location" });
    }
  });

  app.delete("/api/admin/locations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNxcarLocation(id);
      if (!deleted) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ error: "Failed to delete location" });
    }
  });

  // Site Content CRUD
  app.post("/api/admin/site-content", requireAuth, async (req, res) => {
    try {
      const result = insertSiteContentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const content = await storage.upsertSiteContent(result.data);
      res.json(content);
    } catch (error) {
      console.error("Error saving site content:", error);
      res.status(500).json({ error: "Failed to save site content" });
    }
  });

  // Marketing Banners CRUD
  app.get("/api/admin/banners", requireAuth, async (req, res) => {
    try {
      const banners = await storage.getMarketingBanners();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", requireAuth, async (req, res) => {
    try {
      const result = insertMarketingBannerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const banner = await storage.createMarketingBanner(result.data);
      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ error: "Failed to create banner" });
    }
  });

  app.put("/api/admin/banners/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const result = insertMarketingBannerSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromError(result.error).toString() });
      }
      const banner = await storage.updateMarketingBanner(id, result.data);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({ error: "Failed to update banner" });
    }
  });

  app.delete("/api/admin/banners/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMarketingBanner(id);
      if (!deleted) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(500).json({ error: "Failed to delete banner" });
    }
  });

  // Sell Car Leads (admin only for viewing)
  app.get("/api/admin/sell-car-leads", requireAuth, async (req, res) => {
    try {
      const leads = await storage.getSellCarLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching sell car leads:", error);
      res.status(500).json({ error: "Failed to fetch sell car leads" });
    }
  });

  app.put("/api/admin/sell-car-leads/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const lead = await storage.updateSellCarLeadStatus(id, status);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead status:", error);
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  // ========== SEED DATABASE (Admin) ==========
  app.post("/api/admin/seed-database", requireAuth, async (req, res) => {
    try {
      const results = {
        cars: 0,
        testimonials: 0,
        dealerCities: 0,
        locations: 0,
        blogArticles: 0
      };

      // Seed cars
      for (const car of SEED_CARS) {
        try {
          await storage.createCar(car as any);
          results.cars++;
        } catch (e) { /* skip duplicates */ }
      }

      // Seed testimonials
      for (const testimonial of SEED_TESTIMONIALS) {
        try {
          await storage.createTestimonial(testimonial as any);
          results.testimonials++;
        } catch (e) { /* skip duplicates */ }
      }

      // Seed dealer cities
      for (const city of SEED_DEALER_CITIES) {
        try {
          await storage.createDealerCity(city as any);
          results.dealerCities++;
        } catch (e) { /* skip duplicates */ }
      }

      // Seed locations
      for (const location of SEED_LOCATIONS) {
        try {
          await storage.createNxcarLocation(location as any);
          results.locations++;
        } catch (e) { /* skip duplicates */ }
      }

      // Seed blog articles
      for (const article of SEED_BLOG_ARTICLES) {
        try {
          await storage.createBlogArticle(article as any);
          results.blogArticles++;
        } catch (e) { /* skip duplicates */ }
      }

      res.json({ 
        success: true, 
        message: `Seeded: ${results.cars} cars, ${results.testimonials} testimonials, ${results.dealerCities} dealer cities, ${results.locations} locations, ${results.blogArticles} blog articles`
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  // ========== AI RECOMMENDATION ENGINE ==========
  
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  // Save user car preferences
  app.post("/api/preferences", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const validatedData = insertUserCarPreferencesSchema.parse({
        ...req.body,
        sessionId
      });
      const preferences = await storage.upsertUserCarPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ error: "Failed to save preferences" });
    }
  });

  // Get user car preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const preferences = await storage.getUserCarPreferences(sessionId);
      res.json(preferences || null);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // AI-powered car recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { recentlyViewedIds = [], preferences } = req.body;
      const sessionId = req.sessionID;
      
      // Get recently viewed cars
      const recentlyViewedCars = recentlyViewedIds.length > 0 
        ? await storage.getCarsByIds(recentlyViewedIds)
        : [];
      
      // Get all available cars
      const allCars = await storage.getCars(50);
      
      // Get user's stored preferences if not provided
      const userPreferences = preferences || await storage.getUserCarPreferences(sessionId);
      
      // Build the prompt for AI analysis
      const browsingHistory = recentlyViewedCars.map(car => ({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        fuelType: car.fuelType,
        transmission: car.transmission,
        kilometers: car.kilometers,
        location: car.location
      }));

      const availableCars = allCars.map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        fuelType: car.fuelType,
        transmission: car.transmission,
        kilometers: car.kilometers,
        location: car.location
      }));

      const prompt = `You are an AI car recommendation engine for Nxcar, India's trusted used car platform.

Analyze the user's browsing history and preferences to recommend the best matching cars.

USER'S BROWSING HISTORY:
${browsingHistory.length > 0 ? JSON.stringify(browsingHistory, null, 2) : 'No browsing history available'}

USER'S STATED PREFERENCES:
${userPreferences ? JSON.stringify({
  budgetMin: userPreferences.budgetMin,
  budgetMax: userPreferences.budgetMax,
  preferredBrands: userPreferences.preferredBrands,
  preferredFuelTypes: userPreferences.preferredFuelTypes,
  preferredTransmissions: userPreferences.preferredTransmissions,
  maxKilometers: userPreferences.maxKilometers,
  minYear: userPreferences.minYear,
  usageType: userPreferences.usageType
}, null, 2) : 'No preferences set'}

AVAILABLE CARS FOR RECOMMENDATION:
${JSON.stringify(availableCars, null, 2)}

Based on the browsing patterns and preferences, recommend up to 6 cars that would be the best match. For each recommendation, provide:
1. The car ID
2. A personalized reason why this car is recommended (2-3 sentences, mention specific features that match their interests)
3. A match score from 1-100

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "carId": <number>,
      "reason": "<string>",
      "matchScore": <number>
    }
  ],
  "insights": "<A brief 1-2 sentence summary of what the user seems to be looking for>"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 1500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const aiResponse = JSON.parse(content);
      
      // Fetch full car details for recommended cars
      const recommendedCarIds = aiResponse.recommendations.map((r: any) => r.carId);
      const recommendedCars = await storage.getCarsByIds(recommendedCarIds);
      
      // Merge car details with AI recommendations
      const enrichedRecommendations = aiResponse.recommendations.map((rec: any) => {
        const car = recommendedCars.find(c => c.id === rec.carId);
        return {
          ...rec,
          car
        };
      }).filter((rec: any) => rec.car); // Only include cars that exist

      res.json({
        recommendations: enrichedRecommendations,
        insights: aiResponse.insights
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  return httpServer;
}
