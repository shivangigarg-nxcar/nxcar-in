import type { InspectionSlot } from "@lib/api";

export type FormStep =
  | "vehicle-number"
  | "brand"
  | "model"
  | "rto-location"
  | "year"
  | "ownership"
  | "color"
  | "fuel-variant"
  | "transmission"
  | "kilometers"
  | "vehicle-location"
  | "price"
  | "photos"
  | "seller-info"
  | "success";

export const STEPS: { id: FormStep; title: string; subtitle: string }[] = [
  {
    id: "vehicle-number",
    title: "Vehicle Number",
    subtitle: "Enter your car's registration number",
  },
  { id: "brand", title: "Select Brand", subtitle: "Which brand is your car?" },
  { id: "model", title: "Select Model", subtitle: "What model do you drive?" },
  {
    id: "rto-location",
    title: "RTO Location",
    subtitle: "Select your RTO location and code",
  },
  {
    id: "year",
    title: "Manufacturing Year",
    subtitle: "When was your car manufactured?",
  },
  {
    id: "ownership",
    title: "Ownership",
    subtitle: "How many owners has this car had?",
  },
  { id: "color", title: "Car Color", subtitle: "What color is your car?" },
  {
    id: "fuel-variant",
    title: "Fuel & Variant",
    subtitle: "Select fuel type and variant",
  },
  {
    id: "transmission",
    title: "Transmission",
    subtitle: "What's the transmission type?",
  },
  {
    id: "kilometers",
    title: "Kilometers Driven",
    subtitle: "How far has your car traveled?",
  },
  {
    id: "vehicle-location",
    title: "Vehicle Location",
    subtitle: "Where is your car located?",
  },
  { id: "price", title: "Expected Price", subtitle: "How much do you expect?" },
  { id: "photos", title: "Photos", subtitle: "Add photos of your car" },
  {
    id: "seller-info",
    title: "Your Details",
    subtitle: "How can we reach you?",
  },
];

export const OWNER_OPTIONS = [
  "1st Owner",
  "2nd Owner",
  "3rd Owner",
  "4th Owner",
  "5th+ Owner",
];

export const TRANSMISSION_OPTIONS = ["Manual", "Automatic", "CVT", "DCT", "AMT"];

export const FALLBACK_SLOTS: InspectionSlot[] = [
  {
    slot_id: "1",
    slot_name: "Morning",
    slot_time: "09:00 AM - 12:00 PM",
    is_available: true,
  },
  {
    slot_id: "2",
    slot_name: "Afternoon",
    slot_time: "12:00 PM - 03:00 PM",
    is_available: true,
  },
  {
    slot_id: "3",
    slot_name: "Evening",
    slot_time: "03:00 PM - 06:00 PM",
    is_available: true,
  },
];
