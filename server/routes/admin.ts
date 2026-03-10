import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { 
  insertCarSchema, insertTestimonialSchema, insertDealerCitySchema, 
  insertNxcarLocationSchema, insertSiteContentSchema,
  insertMarketingBannerSchema, insertBlogArticleSchema
} from "@shared/schema";
import { fromError } from "zod-validation-error";
import { SEED_CARS, SEED_TESTIMONIALS, SEED_DEALER_CITIES, SEED_LOCATIONS, SEED_BLOG_ARTICLES } from "../seed-data";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export function registerAdminRoutes(app: Express) {
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

  app.post("/api/admin/seed-database", requireAuth, async (req, res) => {
    try {
      const results = {
        cars: 0,
        testimonials: 0,
        dealerCities: 0,
        locations: 0,
        blogArticles: 0
      };

      for (const car of SEED_CARS) {
        try {
          await storage.createCar(car as any);
          results.cars++;
        } catch (e) { /* skip duplicates */ }
      }

      for (const testimonial of SEED_TESTIMONIALS) {
        try {
          await storage.createTestimonial(testimonial as any);
          results.testimonials++;
        } catch (e) { /* skip duplicates */ }
      }

      for (const city of SEED_DEALER_CITIES) {
        try {
          await storage.createDealerCity(city as any);
          results.dealerCities++;
        } catch (e) { /* skip duplicates */ }
      }

      for (const location of SEED_LOCATIONS) {
        try {
          await storage.createNxcarLocation(location as any);
          results.locations++;
        } catch (e) { /* skip duplicates */ }
      }

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
}
