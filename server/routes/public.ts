import type { Express } from "express";
import { storage } from "../storage";
import { insertSellCarLeadSchema, insertCarListingSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export function registerPublicRoutes(app: Express) {
  app.get("/api/cars", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const isFeatured = req.query.featured === "true" ? true : undefined;
      
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
          
          const carsWithImages = allCars.filter((car: any) => 
            car.images && car.images.startsWith("http")
          );
          
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
      
      const localCar = await storage.getCarById(id);
      if (localCar) {
        return res.json(localCar);
      }
      
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

  app.get("/api/car-listings", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const listings = await storage.getCarListings(limit, true);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching car listings:", error);
      res.status(500).json({ error: "Failed to fetch car listings" });
    }
  });
  
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
}
