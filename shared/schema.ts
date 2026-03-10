import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models
export * from "./models/auth";

// Export chat models
export * from "./models/chat";

// Car Listings
export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  variant: text("variant"),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  kilometers: integer("kilometers").notNull(),
  ownership: text("ownership"),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
});
export const selectCarSchema = createSelectSchema(cars);
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

// Testimonials - updated with Google review link
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  testimonialText: text("testimonial_text").notNull(),
  carSoldOrBought: text("car_sold_or_bought").notNull(),
  rating: integer("rating").default(5),
  googleReviewLink: text("google_review_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});
export const selectTestimonialSchema = createSelectSchema(testimonials);
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Dealer Cities
export const dealerCities = pgTable("dealer_cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  dealerCount: integer("dealer_count").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDealerCitySchema = createInsertSchema(dealerCities).omit({
  id: true,
  createdAt: true,
});
export const selectDealerCitySchema = createSelectSchema(dealerCities);
export type InsertDealerCity = z.infer<typeof insertDealerCitySchema>;
export type DealerCity = typeof dealerCities.$inferSelect;

// Nxcar Locations
export const nxcarLocations = pgTable("nxcar_locations", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  phone: text("phone"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNxcarLocationSchema = createInsertSchema(nxcarLocations).omit({
  id: true,
  createdAt: true,
});
export const selectNxcarLocationSchema = createSelectSchema(nxcarLocations);
export type InsertNxcarLocation = z.infer<typeof insertNxcarLocationSchema>;
export type NxcarLocation = typeof nxcarLocations.$inferSelect;

// Sell Car Leads
export const sellCarLeads = pgTable("sell_car_leads", {
  id: serial("id").primaryKey(),
  carNumber: text("car_number").notNull(),
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSellCarLeadSchema = createInsertSchema(sellCarLeads).omit({
  id: true,
  createdAt: true,
  status: true,
});
export const selectSellCarLeadSchema = createSelectSchema(sellCarLeads);
export type InsertSellCarLead = z.infer<typeof insertSellCarLeadSchema>;
export type SellCarLead = typeof sellCarLeads.$inferSelect;

// Site Content - for CMS editable text sections
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  imageUrl: text("image_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  updatedAt: true,
});
export const selectSiteContentSchema = createSelectSchema(siteContent);
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

// Marketing Banners
export const marketingBanners = pgTable("marketing_banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  imageUrl: text("image_url"),
  position: text("position").default("homepage"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMarketingBannerSchema = createInsertSchema(marketingBanners).omit({
  id: true,
  createdAt: true,
});
export const selectMarketingBannerSchema = createSelectSchema(marketingBanners);
export type InsertMarketingBanner = z.infer<typeof insertMarketingBannerSchema>;
export type MarketingBanner = typeof marketingBanners.$inferSelect;

// Admin Users - simple password auth
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Login schema for validation
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

// User Favorites - session-based favorites
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  carId: integer("car_id").notNull().references(() => cars.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

// Car Reviews - user feedback on car listings
export const carReviews = pgTable("car_reviews", {
  id: serial("id").primaryKey(),
  carId: integer("car_id").notNull().references(() => cars.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  reviewerName: text("reviewer_name"),
  isHelpful: boolean("is_helpful").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarReviewSchema = createInsertSchema(carReviews).omit({
  id: true,
  createdAt: true,
});
export type InsertCarReview = z.infer<typeof insertCarReviewSchema>;
export type CarReview = typeof carReviews.$inferSelect;

// Platform Feedback - general user feedback about the platform
export const platformFeedback = pgTable("platform_feedback", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  feedbackType: text("feedback_type").notNull(), // 'bug', 'feature', 'general', 'complaint', 'praise'
  feedbackText: text("feedback_text").notNull(),
  rating: integer("rating"), // optional overall platform rating 1-5
  email: text("email"),
  name: text("name"),
  page: text("page"), // which page the feedback was submitted from
  userAgent: text("user_agent"),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlatformFeedbackSchema = createInsertSchema(platformFeedback).omit({
  id: true,
  createdAt: true,
});
export type InsertPlatformFeedback = z.infer<typeof insertPlatformFeedbackSchema>;
export type PlatformFeedback = typeof platformFeedback.$inferSelect;

// Notification Subscriptions - for price drop and new listing alerts
export const notificationSubscriptions = pgTable("notification_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  sessionId: text("session_id").notNull(),
  notifyPriceDrops: boolean("notify_price_drops").default(false),
  notifyNewListings: boolean("notify_new_listings").default(false),
  preferredBrands: text("preferred_brands").array(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferredLocations: text("preferred_locations").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSubscriptionSchema = createInsertSchema(notificationSubscriptions).omit({
  id: true,
  createdAt: true,
});
export type InsertNotificationSubscription = z.infer<typeof insertNotificationSubscriptionSchema>;
export type NotificationSubscription = typeof notificationSubscriptions.$inferSelect;

// User Car Preferences - for AI recommendations
export const userCarPreferences = pgTable("user_car_preferences", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferredBrands: text("preferred_brands").array(),
  preferredFuelTypes: text("preferred_fuel_types").array(),
  preferredTransmissions: text("preferred_transmissions").array(),
  preferredLocations: text("preferred_locations").array(),
  maxKilometers: integer("max_kilometers"),
  minYear: integer("min_year"),
  usageType: text("usage_type"), // 'daily_commute', 'family', 'highway', 'off_road'
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserCarPreferencesSchema = createInsertSchema(userCarPreferences).omit({
  id: true,
  updatedAt: true,
});
export type InsertUserCarPreferences = z.infer<typeof insertUserCarPreferencesSchema>;
export type UserCarPreferences = typeof userCarPreferences.$inferSelect;

// Car Listings - user submitted cars for sale
export const carListings = pgTable("car_listings", {
  id: serial("id").primaryKey(),
  vehicleNumber: text("vehicle_number").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  variant: text("variant"),
  year: integer("year").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  kilometers: integer("kilometers").notNull(),
  color: text("color"),
  ownerCount: integer("owner_count").default(1),
  location: text("location").notNull(),
  state: text("state"),
  rtoCode: text("rto_code"),
  expectedPrice: integer("expected_price").notNull(),
  description: text("description"),
  imageUrls: text("image_urls").array(),
  sellerName: text("seller_name").notNull(),
  sellerPhone: text("seller_phone").notNull(),
  sellerEmail: text("seller_email"),
  status: text("status").default("pending").notNull(),
  isApproved: boolean("is_approved").default(false),
  sessionId: text("session_id"),
  insuranceValid: boolean("insurance_valid").default(false),
  rcStatus: text("rc_status"),
  engineNumber: text("engine_number"),
  chassisNumber: text("chassis_number"),
  rcDocumentUrl: text("rc_document_url"),
  insuranceDocumentUrl: text("insurance_document_url"),
  otherDocumentUrls: text("other_document_urls").array(),
  hideNumberPlate: boolean("hide_number_plate").default(false),
  removeWatermark: boolean("remove_watermark").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarListingSchema = createInsertSchema(carListings).omit({
  id: true,
  createdAt: true,
  status: true,
  isApproved: true,
});
export const selectCarListingSchema = createSelectSchema(carListings);
export type InsertCarListing = z.infer<typeof insertCarListingSchema>;
export type CarListing = typeof carListings.$inferSelect;

// Blog Articles for Insights Strips
export const blogArticles = pgTable("blog_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url").notNull(),
  externalUrl: text("external_url").notNull(),
  category: text("category").notNull(), // 'insights', 'news', 'top_picks', 'comparison', 'tips'
  stripPosition: integer("strip_position").notNull().default(1), // 1, 2, or 3 for which strip
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogArticleSchema = createInsertSchema(blogArticles).omit({
  id: true,
  createdAt: true,
});
export const selectBlogArticleSchema = createSelectSchema(blogArticles);
export type InsertBlogArticle = z.infer<typeof insertBlogArticleSchema>;
export type BlogArticle = typeof blogArticles.$inferSelect;
