export interface CarDetail {
  id: string;
  images: string[];
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  predictionPrice: string;
  emi: number;
  kilometersDriven: number;
  fuelType: string;
  transmission: string;
  seats: number;
  ownership: string;
  city: string;
  rtoLocation: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  listingDate: string;
  status: string;
  specs: {
    engineCC: number;
    cylinders: number;
    bodyType: string;
    color: string;
    grossWeight: number;
    unladenWeight: number;
    wheelbase: number;
    registrationDate: string;
    registrationNumber: string;
    insuranceProvider: string;
    insuranceExpiry: string;
    manufacturingDate: string;
  };
  features: { name: string; category: string }[];
  insights: { heading: string; body: string }[];
  detailedSpecs?: { name: string; value: string; category: string }[];
  priceMap?: {
    buyerLower: number;
    buyerUpper: number;
    sellerLower: number;
    sellerUpper: number;
  };
  carscope: {
    inspectionReportUrl: string | null;
    rcFrontUrl: string | null;
    rcBackUrl: string | null;
    rcDetails: any | null;
    warrantyPackages: string[];
    insuranceQuotes: any | null;
    warrantyPrices: Record<string, string>;
  } | null;
  rawData?: {
    vehicle_id: string;
    vehicle_no: string;
    make: string;
    model: string;
    variant: string;
    make_id: string;
    model_id: string;
    variant_id: string;
    year: string;
    color: string;
    fuel_type: string;
    transmission: string;
    mileage: string;
    ownership: string;
    expected_selling_price: string;
    location_name: string;
    rto_code: string;
    seats: string;
    is_active: string;
    vehicle_status: string;
    created_by: string;
  };
}

export function formatPriceNoSymbol(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
}

export function formatKilometers(km: number): string {
  if (km >= 100000) return `${(km / 100000).toFixed(1)} Lakh km`;
  return `${km.toLocaleString("en-IN")} km`;
}

export function formatEmi(emi: number): string {
  return `₹${Math.round(emi).toLocaleString("en-IN")}/mo`;
}

export const categoryConfig: Record<string, { icon: string; color: string }> = {
  Safety: { icon: "Shield", color: "text-red-500 bg-red-50 dark:bg-red-500/10" },
  Comfort: { icon: "Sparkles", color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
  Interior: { icon: "Sofa", color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
  Exterior: { icon: "ExternalLink", color: "text-green-500 bg-green-50 dark:bg-green-500/10" },
  Entertainment: { icon: "Radio", color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
};
