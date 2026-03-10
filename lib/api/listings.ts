import type { SellCarLead, InsertSellCarLead, CarListing, InsertCarListing } from "@shared/schema";

const API_BASE = "/api";

export async function createSellCarLead(lead: InsertSellCarLead): Promise<SellCarLead> {
  const response = await fetch(`${API_BASE}/sell-car-leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!response.ok) throw new Error("Failed to create sell car lead");
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
