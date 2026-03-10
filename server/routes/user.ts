import type { Express } from "express";
import { storage } from "../storage";
import { 
  insertCarReviewSchema, insertPlatformFeedbackSchema, 
  insertNotificationSubscriptionSchema 
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export function registerUserRoutes(app: Express) {
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
  
  app.post("/api/favorites/:carId", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const carId = parseInt(req.params.carId);
      if (isNaN(carId)) {
        return res.status(400).json({ error: "Invalid car ID" });
      }
      
      let localCar = await storage.getCarById(carId);
      
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
}
