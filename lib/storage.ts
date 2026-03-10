import { 
  type Car, type InsertCar,
  type Testimonial, type InsertTestimonial,
  type DealerCity, type InsertDealerCity,
  type NxcarLocation, type InsertNxcarLocation,
  type SellCarLead, type InsertSellCarLead,
  type SiteContent, type InsertSiteContent,
  type MarketingBanner, type InsertMarketingBanner,
  type AdminUser, type InsertAdminUser,
  type UserFavorite,
  type CarReview, type InsertCarReview,
  type PlatformFeedback, type InsertPlatformFeedback,
  type NotificationSubscription, type InsertNotificationSubscription,
  type UserCarPreferences, type InsertUserCarPreferences,
  type BlogArticle, type InsertBlogArticle,
  type CarListing, type InsertCarListing,
  cars, testimonials, dealerCities, nxcarLocations, sellCarLeads,
  siteContent, marketingBanners, adminUsers, userFavorites,
  carReviews, platformFeedback, notificationSubscriptions, userCarPreferences,
  blogArticles, carListings
} from "@shared/schema";
import { db } from "@lib/db";
import { eq, desc, and, inArray, sql } from "drizzle-orm";

export interface IStorage {
  getCars(limit?: number, isFeatured?: boolean): Promise<Car[]>;
  getCarById(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  syncExternalCar(id: number, car: InsertCar): Promise<void>;
  getTestimonials(limit?: number): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  getDealerCities(limit?: number): Promise<DealerCity[]>;
  getDealerCityById(id: number): Promise<DealerCity | undefined>;
  createDealerCity(city: InsertDealerCity): Promise<DealerCity>;
  updateDealerCity(id: number, city: Partial<InsertDealerCity>): Promise<DealerCity | undefined>;
  deleteDealerCity(id: number): Promise<boolean>;
  getNxcarLocations(limit?: number): Promise<NxcarLocation[]>;
  getNxcarLocationById(id: number): Promise<NxcarLocation | undefined>;
  createNxcarLocation(location: InsertNxcarLocation): Promise<NxcarLocation>;
  updateNxcarLocation(id: number, location: Partial<InsertNxcarLocation>): Promise<NxcarLocation | undefined>;
  deleteNxcarLocation(id: number): Promise<boolean>;
  createSellCarLead(lead: InsertSellCarLead): Promise<SellCarLead>;
  getSellCarLeads(): Promise<SellCarLead[]>;
  updateSellCarLeadStatus(id: number, status: string): Promise<SellCarLead | undefined>;
  getSiteContent(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  upsertSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  getMarketingBanners(position?: string): Promise<MarketingBanner[]>;
  getMarketingBannerById(id: number): Promise<MarketingBanner | undefined>;
  createMarketingBanner(banner: InsertMarketingBanner): Promise<MarketingBanner>;
  updateMarketingBanner(id: number, banner: Partial<InsertMarketingBanner>): Promise<MarketingBanner | undefined>;
  deleteMarketingBanner(id: number): Promise<boolean>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getFavorites(sessionId: string): Promise<Car[]>;
  getFavoriteCarIds(sessionId: string): Promise<number[]>;
  addFavorite(sessionId: string, carId: number): Promise<UserFavorite>;
  removeFavorite(sessionId: string, carId: number): Promise<boolean>;
  isFavorite(sessionId: string, carId: number): Promise<boolean>;
  getCarReviews(carId: number): Promise<CarReview[]>;
  getCarAverageRating(carId: number): Promise<{ average: number; count: number }>;
  createCarReview(review: InsertCarReview): Promise<CarReview>;
  deleteCarReview(id: number, sessionId: string): Promise<boolean>;
  createPlatformFeedback(feedback: InsertPlatformFeedback): Promise<PlatformFeedback>;
  getPlatformFeedback(): Promise<PlatformFeedback[]>;
  updatePlatformFeedbackStatus(id: number, isResolved: boolean): Promise<PlatformFeedback | undefined>;
  createNotificationSubscription(subscription: InsertNotificationSubscription): Promise<NotificationSubscription>;
  getNotificationSubscriptionBySession(sessionId: string): Promise<NotificationSubscription | undefined>;
  getUserCarPreferences(sessionId: string): Promise<UserCarPreferences | undefined>;
  upsertUserCarPreferences(preferences: InsertUserCarPreferences): Promise<UserCarPreferences>;
  getCarsByIds(ids: number[]): Promise<Car[]>;
  getBlogArticlesByStrip(stripPosition: number): Promise<BlogArticle[]>;
  getAllBlogArticles(): Promise<BlogArticle[]>;
  getBlogArticleById(id: number): Promise<BlogArticle | undefined>;
  createBlogArticle(article: InsertBlogArticle): Promise<BlogArticle>;
  updateBlogArticle(id: number, article: Partial<InsertBlogArticle>): Promise<BlogArticle | undefined>;
  deleteBlogArticle(id: number): Promise<boolean>;
  getCarListings(limit?: number, approvedOnly?: boolean): Promise<CarListing[]>;
  getCarListingsBySession(sessionId: string, limit?: number): Promise<CarListing[]>;
  getCarListingById(id: number): Promise<CarListing | undefined>;
  createCarListing(listing: InsertCarListing): Promise<CarListing>;
  updateCarListing(id: number, listing: Partial<InsertCarListing>): Promise<CarListing | undefined>;
  approveCarListing(id: number): Promise<CarListing | undefined>;
  deleteCarListing(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getCars(limit: number = 20, isFeatured?: boolean): Promise<Car[]> {
    let query = db.select().from(cars).orderBy(desc(cars.createdAt));
    if (isFeatured !== undefined) {
      query = query.where(eq(cars.isFeatured, isFeatured)) as any;
    }
    return query.limit(limit);
  }

  async getCarById(id: number): Promise<Car | undefined> {
    const result = await db.select().from(cars).where(eq(cars.id, id));
    return result[0];
  }

  async createCar(car: InsertCar): Promise<Car> {
    const result = await db.insert(cars).values(car).returning();
    return result[0];
  }

  async updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined> {
    const result = await db.update(cars).set(car).where(eq(cars.id, id)).returning();
    return result[0];
  }

  async deleteCar(id: number): Promise<boolean> {
    const result = await db.delete(cars).where(eq(cars.id, id)).returning();
    return result.length > 0;
  }

  async syncExternalCar(id: number, car: InsertCar): Promise<void> {
    const existing = await this.getCarById(id);
    if (existing) {
      await db.update(cars).set(car).where(eq(cars.id, id));
    } else {
      await db.execute(
        sql`INSERT INTO cars (id, name, brand, model, year, price, fuel_type, transmission, kilometers, location, image_url, is_featured, created_at)
            VALUES (${id}, ${car.name}, ${car.brand}, ${car.model}, ${car.year}, ${car.price}, ${car.fuelType}, ${car.transmission}, ${car.kilometers}, ${car.location}, ${car.imageUrl}, ${car.isFeatured || false}, NOW())
            ON CONFLICT (id) DO NOTHING`
      );
    }
  }

  async getTestimonials(limit: number = 15): Promise<Testimonial[]> {
    return db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(limit);
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return result[0];
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const result = await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id)).returning();
    return result[0];
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }

  async getDealerCities(limit: number = 12): Promise<DealerCity[]> {
    return db.select().from(dealerCities).limit(limit);
  }

  async getDealerCityById(id: number): Promise<DealerCity | undefined> {
    const result = await db.select().from(dealerCities).where(eq(dealerCities.id, id));
    return result[0];
  }

  async createDealerCity(city: InsertDealerCity): Promise<DealerCity> {
    const result = await db.insert(dealerCities).values(city).returning();
    return result[0];
  }

  async updateDealerCity(id: number, city: Partial<InsertDealerCity>): Promise<DealerCity | undefined> {
    const result = await db.update(dealerCities).set(city).where(eq(dealerCities.id, id)).returning();
    return result[0];
  }

  async deleteDealerCity(id: number): Promise<boolean> {
    const result = await db.delete(dealerCities).where(eq(dealerCities.id, id)).returning();
    return result.length > 0;
  }

  async getNxcarLocations(limit: number = 12): Promise<NxcarLocation[]> {
    return db.select().from(nxcarLocations).limit(limit);
  }

  async getNxcarLocationById(id: number): Promise<NxcarLocation | undefined> {
    const result = await db.select().from(nxcarLocations).where(eq(nxcarLocations.id, id));
    return result[0];
  }

  async createNxcarLocation(location: InsertNxcarLocation): Promise<NxcarLocation> {
    const result = await db.insert(nxcarLocations).values(location).returning();
    return result[0];
  }

  async updateNxcarLocation(id: number, location: Partial<InsertNxcarLocation>): Promise<NxcarLocation | undefined> {
    const result = await db.update(nxcarLocations).set(location).where(eq(nxcarLocations.id, id)).returning();
    return result[0];
  }

  async deleteNxcarLocation(id: number): Promise<boolean> {
    const result = await db.delete(nxcarLocations).where(eq(nxcarLocations.id, id)).returning();
    return result.length > 0;
  }

  async createSellCarLead(lead: InsertSellCarLead): Promise<SellCarLead> {
    const result = await db.insert(sellCarLeads).values(lead).returning();
    return result[0];
  }

  async getSellCarLeads(): Promise<SellCarLead[]> {
    return db.select().from(sellCarLeads).orderBy(desc(sellCarLeads.createdAt));
  }

  async updateSellCarLeadStatus(id: number, status: string): Promise<SellCarLead | undefined> {
    const result = await db.update(sellCarLeads).set({ status }).where(eq(sellCarLeads.id, id)).returning();
    return result[0];
  }

  async getSiteContent(): Promise<SiteContent[]> {
    return db.select().from(siteContent);
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    const result = await db.select().from(siteContent).where(eq(siteContent.sectionKey, key));
    return result[0];
  }

  async upsertSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const existing = await this.getSiteContentByKey(content.sectionKey);
    if (existing) {
      const result = await db.update(siteContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(siteContent.sectionKey, content.sectionKey))
        .returning();
      return result[0];
    }
    const result = await db.insert(siteContent).values(content).returning();
    return result[0];
  }

  async getMarketingBanners(position?: string): Promise<MarketingBanner[]> {
    const conditions = position
      ? and(eq(marketingBanners.isActive, true), eq(marketingBanners.position, position))
      : eq(marketingBanners.isActive, true);
    return db.select().from(marketingBanners).where(conditions).orderBy(desc(marketingBanners.priority));
  }

  async getMarketingBannerById(id: number): Promise<MarketingBanner | undefined> {
    const result = await db.select().from(marketingBanners).where(eq(marketingBanners.id, id));
    return result[0];
  }

  async createMarketingBanner(banner: InsertMarketingBanner): Promise<MarketingBanner> {
    const result = await db.insert(marketingBanners).values(banner).returning();
    return result[0];
  }

  async updateMarketingBanner(id: number, banner: Partial<InsertMarketingBanner>): Promise<MarketingBanner | undefined> {
    const result = await db.update(marketingBanners).set(banner).where(eq(marketingBanners.id, id)).returning();
    return result[0];
  }

  async deleteMarketingBanner(id: number): Promise<boolean> {
    const result = await db.delete(marketingBanners).where(eq(marketingBanners.id, id)).returning();
    return result.length > 0;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return result[0];
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const result = await db.insert(adminUsers).values(user).returning();
    return result[0];
  }

  async getFavorites(sessionId: string): Promise<Car[]> {
    const favorites = await db.select().from(userFavorites).where(eq(userFavorites.sessionId, sessionId));
    if (favorites.length === 0) return [];
    const carIds = favorites.map(f => f.carId);
    return db.select().from(cars).where(inArray(cars.id, carIds));
  }

  async getFavoriteCarIds(sessionId: string): Promise<number[]> {
    const favorites = await db.select({ carId: userFavorites.carId }).from(userFavorites).where(eq(userFavorites.sessionId, sessionId));
    return favorites.map(f => f.carId);
  }

  async addFavorite(sessionId: string, carId: number): Promise<UserFavorite> {
    const existing = await db.select().from(userFavorites).where(and(eq(userFavorites.sessionId, sessionId), eq(userFavorites.carId, carId)));
    if (existing.length > 0) return existing[0];
    const result = await db.insert(userFavorites).values({ sessionId, carId }).returning();
    return result[0];
  }

  async removeFavorite(sessionId: string, carId: number): Promise<boolean> {
    const result = await db.delete(userFavorites).where(and(eq(userFavorites.sessionId, sessionId), eq(userFavorites.carId, carId))).returning();
    return result.length > 0;
  }

  async isFavorite(sessionId: string, carId: number): Promise<boolean> {
    const result = await db.select().from(userFavorites).where(and(eq(userFavorites.sessionId, sessionId), eq(userFavorites.carId, carId)));
    return result.length > 0;
  }

  async getCarReviews(carId: number): Promise<CarReview[]> {
    return await db.select().from(carReviews).where(eq(carReviews.carId, carId)).orderBy(desc(carReviews.createdAt));
  }

  async getCarAverageRating(carId: number): Promise<{ average: number; count: number }> {
    const reviews = await db.select().from(carReviews).where(eq(carReviews.carId, carId));
    if (reviews.length === 0) return { average: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length };
  }

  async createCarReview(review: InsertCarReview): Promise<CarReview> {
    const result = await db.insert(carReviews).values(review).returning();
    return result[0];
  }

  async deleteCarReview(id: number, sessionId: string): Promise<boolean> {
    const result = await db.delete(carReviews).where(and(eq(carReviews.id, id), eq(carReviews.sessionId, sessionId))).returning();
    return result.length > 0;
  }

  async createPlatformFeedback(feedback: InsertPlatformFeedback): Promise<PlatformFeedback> {
    const result = await db.insert(platformFeedback).values(feedback).returning();
    return result[0];
  }

  async getPlatformFeedback(): Promise<PlatformFeedback[]> {
    return await db.select().from(platformFeedback).orderBy(desc(platformFeedback.createdAt));
  }

  async updatePlatformFeedbackStatus(id: number, isResolved: boolean): Promise<PlatformFeedback | undefined> {
    const result = await db.update(platformFeedback).set({ isResolved }).where(eq(platformFeedback.id, id)).returning();
    return result[0];
  }

  async createNotificationSubscription(subscription: InsertNotificationSubscription): Promise<NotificationSubscription> {
    const existing = await this.getNotificationSubscriptionBySession(subscription.sessionId);
    if (existing) {
      const result = await db.update(notificationSubscriptions)
        .set(subscription)
        .where(eq(notificationSubscriptions.sessionId, subscription.sessionId))
        .returning();
      return result[0];
    }
    const result = await db.insert(notificationSubscriptions).values(subscription).returning();
    return result[0];
  }

  async getNotificationSubscriptionBySession(sessionId: string): Promise<NotificationSubscription | undefined> {
    const result = await db.select().from(notificationSubscriptions).where(eq(notificationSubscriptions.sessionId, sessionId));
    return result[0];
  }

  async getUserCarPreferences(sessionId: string): Promise<UserCarPreferences | undefined> {
    const result = await db.select().from(userCarPreferences).where(eq(userCarPreferences.sessionId, sessionId));
    return result[0];
  }

  async upsertUserCarPreferences(preferences: InsertUserCarPreferences): Promise<UserCarPreferences> {
    const existing = await this.getUserCarPreferences(preferences.sessionId);
    if (existing) {
      const result = await db.update(userCarPreferences)
        .set({ ...preferences, updatedAt: new Date() })
        .where(eq(userCarPreferences.sessionId, preferences.sessionId))
        .returning();
      return result[0];
    }
    const result = await db.insert(userCarPreferences).values(preferences).returning();
    return result[0];
  }

  async getCarsByIds(ids: number[]): Promise<Car[]> {
    if (ids.length === 0) return [];
    return db.select().from(cars).where(inArray(cars.id, ids));
  }

  async getBlogArticlesByStrip(stripPosition: number): Promise<BlogArticle[]> {
    return db.select().from(blogArticles)
      .where(and(eq(blogArticles.stripPosition, stripPosition), eq(blogArticles.isActive, true)))
      .orderBy(blogArticles.sortOrder)
      .limit(5);
  }

  async getAllBlogArticles(): Promise<BlogArticle[]> {
    return db.select().from(blogArticles).orderBy(blogArticles.stripPosition, blogArticles.sortOrder);
  }

  async getBlogArticleById(id: number): Promise<BlogArticle | undefined> {
    const result = await db.select().from(blogArticles).where(eq(blogArticles.id, id));
    return result[0];
  }

  async createBlogArticle(article: InsertBlogArticle): Promise<BlogArticle> {
    const result = await db.insert(blogArticles).values(article).returning();
    return result[0];
  }

  async updateBlogArticle(id: number, article: Partial<InsertBlogArticle>): Promise<BlogArticle | undefined> {
    const result = await db.update(blogArticles).set(article).where(eq(blogArticles.id, id)).returning();
    return result[0];
  }

  async deleteBlogArticle(id: number): Promise<boolean> {
    const result = await db.delete(blogArticles).where(eq(blogArticles.id, id)).returning();
    return result.length > 0;
  }

  async getCarListings(limit: number = 50, approvedOnly: boolean = false): Promise<CarListing[]> {
    if (approvedOnly) {
      return db.select().from(carListings)
        .where(eq(carListings.isApproved, true))
        .orderBy(desc(carListings.createdAt))
        .limit(limit);
    }
    return db.select().from(carListings).orderBy(desc(carListings.createdAt)).limit(limit);
  }

  async getCarListingsBySession(sessionId: string, limit: number = 50): Promise<CarListing[]> {
    return db.select().from(carListings)
      .where(eq(carListings.sessionId, sessionId))
      .orderBy(desc(carListings.createdAt))
      .limit(limit);
  }

  async getCarListingById(id: number): Promise<CarListing | undefined> {
    const result = await db.select().from(carListings).where(eq(carListings.id, id));
    return result[0];
  }

  async createCarListing(listing: InsertCarListing): Promise<CarListing> {
    const result = await db.insert(carListings).values(listing).returning();
    return result[0];
  }

  async updateCarListing(id: number, listing: Partial<InsertCarListing>): Promise<CarListing | undefined> {
    const result = await db.update(carListings).set(listing).where(eq(carListings.id, id)).returning();
    return result[0];
  }

  async approveCarListing(id: number): Promise<CarListing | undefined> {
    const result = await db.update(carListings)
      .set({ isApproved: true, status: 'approved' })
      .where(eq(carListings.id, id))
      .returning();
    return result[0];
  }

  async deleteCarListing(id: number): Promise<boolean> {
    const result = await db.delete(carListings).where(eq(carListings.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
