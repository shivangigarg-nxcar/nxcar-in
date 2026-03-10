export type FormStep =
  | "vehicle-number"
  | "brand"
  | "model"
  | "fuel-year"
  | "variant"
  | "km-transmission"
  | "color-owners"
  | "location"
  | "price"
  | "photos"
  | "seller-info"
  | "success";

export const STEPS: { id: FormStep; title: string; subtitle: string }[] = [
  { id: "vehicle-number", title: "Vehicle Number", subtitle: "Enter the car's registration number" },
  { id: "brand", title: "Select Brand", subtitle: "Which brand is the car?" },
  { id: "model", title: "Select Model", subtitle: "What model is it?" },
  { id: "fuel-year", title: "Fuel & Year", subtitle: "Select fuel type and manufacturing year" },
  { id: "variant", title: "Select Variant", subtitle: "Choose the car's variant" },
  { id: "km-transmission", title: "Usage Details", subtitle: "Kilometers and transmission type" },
  { id: "color-owners", title: "Condition", subtitle: "Color and ownership history" },
  { id: "location", title: "Location", subtitle: "Where is the car located?" },
  { id: "price", title: "Listing Price", subtitle: "Set the listing price" },
  { id: "photos", title: "Photos", subtitle: "Add photos of the car" },
  { id: "seller-info", title: "Contact Details", subtitle: "Dealer contact information" },
];

export interface ListCarFormData {
  vehicleNumber: string;
  makeId: number;
  brand: string;
  modelId: number;
  model: string;
  variantId: number;
  variant: string;
  year: number;
  fuelType: string;
  fuleId: string;
  transmission: string;
  kilometers: number;
  color: string;
  ownerCount: number;
  location: string;
  state: string;
  rtoCode: string;
  rtoNumericId: string;
  stateNumericId: string;
  cityNumericId: string;
  manufacturingYear: string;
  expectedPrice: number;
  description: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
}

export const INITIAL_FORM_DATA: ListCarFormData = {
  vehicleNumber: "",
  makeId: 0,
  brand: "",
  modelId: 0,
  model: "",
  variantId: 0,
  variant: "",
  year: 0,
  fuelType: "",
  fuleId: "",
  transmission: "",
  kilometers: 0,
  color: "",
  ownerCount: 1,
  location: "",
  state: "",
  rtoCode: "",
  rtoNumericId: "",
  stateNumericId: "",
  cityNumericId: "",
  manufacturingYear: "",
  expectedPrice: 0,
  description: "",
  sellerName: "",
  sellerPhone: "",
  sellerEmail: "",
};
