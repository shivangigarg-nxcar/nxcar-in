import type { Car, Testimonial, DealerCity, NxcarLocation, SellCarLead, InsertSellCarLead, BlogArticle, CarListing, InsertCarListing } from "@shared/schema";

const API_BASE = "/api";

export async function getCars(limit: number = 20, featured?: boolean): Promise<(Car & { sellerName?: string; emi?: number; variant?: string })[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (featured !== undefined) {
    params.append("featured", featured.toString());
  }
  const response = await fetch(`${API_BASE}/cars?${params}`);
  if (!response.ok) throw new Error("Failed to fetch cars");
  return response.json();
}

export async function getCarById(id: number): Promise<Car> {
  const response = await fetch(`${API_BASE}/cars/${id}`);
  if (!response.ok) throw new Error("Failed to fetch car");
  return response.json();
}

export async function getTestimonials(limit: number = 15): Promise<Testimonial[]> {
  const response = await fetch(`${API_BASE}/testimonials?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch testimonials");
  return response.json();
}

export type NxcarCity = {
  city_id: string;
  city_name: string;
  city_image?: string;
  v_cnt?: string;
};

export type SellCity = {
  city_id: string;
  city_name: string;
  inspection_available: string;
  city_image: string | null;
  city_order: string | null;
  IsDealership: string;
};

export async function getCities(): Promise<NxcarCity[]> {
  const response = await fetch(`${API_BASE}/buy/cities`);
  if (!response.ok) throw new Error("Failed to fetch cities");
  const data = await response.json();
  return data.cities || [];
}

export async function getSellCities(): Promise<SellCity[]> {
  const response = await fetch(`${API_BASE}/sell-cities`);
  if (!response.ok) throw new Error("Failed to fetch sell cities");
  const data = await response.json();
  return data.cities || [];
}

export async function getDealerCities(limit: number = 12): Promise<DealerCity[]> {
  const response = await fetch(`${API_BASE}/dealer-cities?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch dealer cities");
  return response.json();
}

export async function getNxcarLocations(limit: number = 12): Promise<NxcarLocation[]> {
  const response = await fetch(`${API_BASE}/locations?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch locations");
  return response.json();
}

export async function createSellCarLead(lead: InsertSellCarLead): Promise<SellCarLead> {
  const response = await fetch(`${API_BASE}/sell-car-leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!response.ok) throw new Error("Failed to create sell car lead");
  return response.json();
}

export async function getFavorites(): Promise<Car[]> {
  const response = await fetch(`${API_BASE}/favorites`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch favorites");
  return response.json();
}

export async function getFavoriteIds(): Promise<number[]> {
  const response = await fetch(`${API_BASE}/favorites/ids`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch favorite IDs");
  return response.json();
}

export async function addFavorite(carId: number, carMeta?: { image?: string; name?: string; brand?: string; model?: string; year?: number; price?: number; fuelType?: string; transmission?: string; kilometers?: number; location?: string }): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${carId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carMeta || {}),
  });
  if (!response.ok) throw new Error("Failed to add favorite");
}

export async function removeFavorite(carId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${carId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to remove favorite");
}

export async function getCarRating(carId: number): Promise<{ average: number; count: number }> {
  const response = await fetch(`${API_BASE}/cars/${carId}/rating`);
  if (!response.ok) throw new Error("Failed to fetch car rating");
  return response.json();
}

export async function getBatchRatings(carIds: number[]): Promise<Record<number, { average: number; count: number }>> {
  if (carIds.length === 0) return {};
  const response = await fetch(`${API_BASE}/cars/batch-ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carIds }),
  });
  if (!response.ok) throw new Error("Failed to fetch batch ratings");
  return response.json();
}

export async function submitCarReview(carId: number, data: { rating: number; reviewText?: string; reviewerName?: string }): Promise<void> {
  const response = await fetch(`${API_BASE}/cars/${carId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit review");
}

export interface SubscriptionData {
  email?: string;
  phone?: string;
  notifyPriceDrops?: boolean;
  notifyNewListings?: boolean;
  preferredBrands?: string[];
  budgetMin?: number;
  budgetMax?: number;
  preferredLocations?: string[];
}

export async function createSubscription(data: SubscriptionData): Promise<void> {
  const response = await fetch(`${API_BASE}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create subscription");
}

export async function getSubscription(): Promise<SubscriptionData | null> {
  const response = await fetch(`${API_BASE}/subscriptions`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch subscription");
  return response.json();
}

export interface UserCarPreferencesData {
  budgetMin?: number;
  budgetMax?: number;
  preferredBrands?: string[];
  preferredFuelTypes?: string[];
  preferredTransmissions?: string[];
  preferredLocations?: string[];
  maxKilometers?: number;
  minYear?: number;
  usageType?: string;
}

export async function saveCarPreferences(data: UserCarPreferencesData): Promise<void> {
  const response = await fetch(`${API_BASE}/preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save preferences");
}

export async function getCarPreferences(): Promise<UserCarPreferencesData | null> {
  const response = await fetch(`${API_BASE}/preferences`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch preferences");
  return response.json();
}

export interface CarRecommendation {
  carId: number;
  reason: string;
  matchScore: number;
  car: Car;
}

export interface RecommendationsResponse {
  recommendations: CarRecommendation[];
  insights: string;
}

export async function getAIRecommendations(
  recentlyViewedIds: number[],
  preferences?: UserCarPreferencesData
): Promise<RecommendationsResponse> {
  const response = await fetch(`${API_BASE}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recentlyViewedIds, preferences }),
  });
  if (!response.ok) throw new Error("Failed to get recommendations");
  return response.json();
}

export async function getBlogArticlesByStrip(stripPosition: number): Promise<BlogArticle[]> {
  const response = await fetch(`${API_BASE}/blog-articles/strip/${stripPosition}`);
  if (!response.ok) throw new Error("Failed to fetch blog articles");
  return response.json();
}

export interface Make {
  id: number;
  make_name: string;
  make_image?: string;
}

export interface Model {
  id: number;
  model_name: string;
  make_id: number;
}

export interface YearOption {
  id: number;
  year: number;
}

export interface FuelType {
  id: number;
  fuel_type: string;
}

export interface Variant {
  id: number;
  variant_name: string;
  model_id: number;
  fuel_type?: string;
}

export interface NxcarColor {
  id: string;
  name: string;
  code: string;
}

export async function getColors(): Promise<NxcarColor[]> {
  const response = await fetch(`${API_BASE}/nxcar/colors`);
  if (!response.ok) throw new Error("Failed to fetch colors");
  return response.json();
}

export async function getMakes(): Promise<Make[]> {
  const response = await fetch(`${API_BASE}/nxcar/makes`);
  if (!response.ok) throw new Error("Failed to fetch makes");
  return response.json();
}

export async function getModels(makeId: number): Promise<Model[]> {
  const response = await fetch(`${API_BASE}/nxcar/models?make_id=${makeId}`);
  if (!response.ok) throw new Error("Failed to fetch models");
  return response.json();
}

export async function getYears(): Promise<YearOption[]> {
  const response = await fetch(`${API_BASE}/nxcar/years`);
  if (!response.ok) throw new Error("Failed to fetch years");
  return response.json();
}

export async function getFuelTypes(): Promise<FuelType[]> {
  const response = await fetch(`${API_BASE}/nxcar/fuel-types`);
  if (!response.ok) throw new Error("Failed to fetch fuel types");
  return response.json();
}

export async function getVariants(modelId: number, fuelType: string): Promise<Variant[]> {
  const response = await fetch(`${API_BASE}/nxcar/variants?model_id=${modelId}&fuel_type=${fuelType.toLowerCase()}`);
  if (!response.ok) throw new Error("Failed to fetch variants");
  return response.json();
}

export interface VehicleDetails {
  make_id: string;
  make: string;
  model_id: string;
  model: string;
  variant_id: string;
  variant: string;
  fule_id: string;
  fule_type: string;
  rto_id: string;
  rto_code: string;
  rto_state_id: string;
  rto_state_name: string;
  ownership: string;
  year: string;
  color: string;
  vehicle_number: string;
  all: {
    regNo: string;
    vehicleClass: string;
    engine: string;
    vehicleManufacturerName: string;
    model: string;
    vehicleColour: string;
    chassis: string;
    type: string;
    normsType: string;
    bodyType: string;
    ownerCount: string;
    owner: string;
    regDate: string;
    rcExpiryDate: string;
    vehicleInsuranceUpto: string;
    vehicleCubicCapacity: string;
    vehicleSeatCapacity: string;
    vehicleManufacturingMonthYear: string;
    presentAddress: string;
    permanentAddress: string;
    regAuthority: string;
    status: string;
    financed: boolean;
    rtoCode?: string;
  };
}

export async function lookupVehicle(vehicleNumber: string): Promise<VehicleDetails> {
  const response = await fetch(`${API_BASE}/vehicle-lookup/${vehicleNumber}`);
  if (!response.ok) throw new Error("Failed to fetch vehicle details");
  return response.json();
}

export async function getCarListings(limit: number = 50): Promise<CarListing[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  const response = await fetch(`${API_BASE}/car-listings?${params}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch car listings");
  return response.json();
}

export async function getCarListingById(id: number): Promise<CarListing> {
  const response = await fetch(`${API_BASE}/car-listings/${id}`);
  if (!response.ok) throw new Error("Failed to fetch car listing");
  return response.json();
}

export async function createCarListing(listing: Omit<InsertCarListing, 'sessionId'>): Promise<CarListing> {
  const response = await fetch(`${API_BASE}/car-listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(listing),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create car listing");
  }
  return response.json();
}

export async function sellCar(data: Record<string, any>): Promise<any> {
  const response = await fetch(`${API_BASE}/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit car details");
  }
  return response.json();
}

export async function bookInspection(data: Record<string, any>): Promise<any> {
  const response = await fetch(`${API_BASE}/book-inspection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to book inspection");
  }
  return response.json();
}

export async function updateCarListing(id: number, data: Partial<any>): Promise<any> {
  const response = await fetch(`${API_BASE}/car-listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update car listing");
  return response.json();
}

export async function updateCarListingDocuments(id: number, documents: Record<string, any>): Promise<any> {
  const response = await fetch(`${API_BASE}/car-listings/${id}/documents`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(documents),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update documents");
  }
  return response.json();
}

export async function uploadSellformDocuments(formData: FormData): Promise<any> {
  const response = await fetch(`${API_BASE}/sellform-documents`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to upload documents");
  }
  return response.json();
}

export async function getMyCarsSell(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/mycars-sell`, { credentials: "include" });
  if (!response.ok) return [];
  return response.json();
}

export async function getMyCarsSellAds(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/mycars-sell-ads`, { credentials: "include" });
  if (!response.ok) return [];
  return response.json();
}

export async function getMyCarsBuy(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/mycars-buy`, { credentials: "include" });
  if (!response.ok) return [];
  return response.json();
}

export async function deleteCarListing(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/car-listings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete car listing");
}

export interface InspectionSlot {
  slot_id: string;
  slot_name: string;
  slot_time: string;
  is_available: boolean;
}

export interface InspectionSlotsResponse {
  status: boolean;
  data: InspectionSlot[];
}

export async function getInspectionSlots(): Promise<InspectionSlot[]> {
  const response = await fetch(`${API_BASE}/nxcar/inspection-slots`);
  if (!response.ok) throw new Error("Failed to fetch inspection slots");
  const result: InspectionSlotsResponse = await response.json();
  return result.data || [];
}

export interface InspectionFranchise {
  franchise_id: string;
  city_id: string;
  franchise_name: string;
  dealership_name: string;
  map_location: string;
  franchise_address: string;
  created_at: string;
}

export interface InspectionFranchiseResponse {
  status: boolean;
  message: string;
  data: InspectionFranchise[];
}

export async function getInspectionFranchises(cityId: string): Promise<InspectionFranchise[]> {
  const response = await fetch(`${API_BASE}/nxcar/inspection-franchises`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city_id: cityId }),
  });
  if (!response.ok) throw new Error("Failed to fetch inspection franchises");
  const result: InspectionFranchiseResponse = await response.json();
  return result.data || [];
}
