import type { Car } from "@shared/schema";

const API_BASE = "/api";

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
