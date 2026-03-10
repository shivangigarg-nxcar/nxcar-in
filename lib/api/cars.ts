import type { Car } from "@shared/schema";
import type { UserCarPreferencesData } from "./user";

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
