import type { DealerCity, NxcarLocation } from "@shared/schema";

const API_BASE = "/api";

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
