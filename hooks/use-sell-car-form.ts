"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { STEPS, type FormStep } from "@components/sell-car/sell-constants";
import type { Make, NxcarColor, SellCity, NxcarCity, InspectionFranchise, InspectionSlot, Model, Variant } from "@lib/api";
import { useAuth } from "@hooks/use-auth";

export interface SellFormData {
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

export const INITIAL_FORM_DATA: SellFormData = {
  vehicleNumber: "", makeId: 0, brand: "", modelId: 0, model: "", variantId: 0, variant: "",
  year: 0, fuelType: "", fuleId: "", transmission: "", kilometers: 0, color: "", ownerCount: 0,
  location: "", state: "", rtoCode: "", rtoNumericId: "", stateNumericId: "", cityNumericId: "",
  manufacturingYear: "", expectedPrice: 0, description: "", sellerName: "", sellerPhone: "", sellerEmail: "",
};

interface UseSellCarFormParams {
  makes: Make[];
  colors: NxcarColor[];
  sellCities: SellCity[];
  nxcarCities: NxcarCity[];
}

export function useSellCarForm({ makes, colors, sellCities, nxcarCities }: UseSellCarFormParams) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<SellFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<FormStep>("vehicle-number");
  const [highestStepReached, setHighestStepReached] = useState(0);
  const [direction, setDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColorText, setCustomColorText] = useState("");
  const [variantNotFound, setVariantNotFound] = useState(false);
  const autoFilledSteps = useRef<Set<FormStep>>(new Set());
  const autoAdvancedYear = useRef(false);
  const autoAdvancedOwnership = useRef(false);
  const autoAdvancedTransmission = useRef(false);

  const [inspectionLocation, setInspectionLocation] = useState("");
  const [inspectionBooked, setInspectionBooked] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<InspectionFranchise | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InspectionSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [inspectionMode, setInspectionMode] = useState<"franchise" | "home">("franchise");
  const [activeSuccessStep, setActiveSuccessStep] = useState(0);
  const [selectedCityInspectionAvailable, setSelectedCityInspectionAvailable] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = currentStep === "success" ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100;

  useEffect(() => {
    if (currentStepIndex >= 0) { setHighestStepReached((prev) => Math.max(prev, currentStepIndex)); }
  }, [currentStepIndex]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        sellerName: prev.sellerName || [user.firstName, user.lastName].filter(Boolean).join(" "),
        sellerPhone: prev.sellerPhone || user.phone || "",
        sellerEmail: prev.sellerEmail || user.email || "",
      }));
    }
  }, [user]);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setHighestStepReached((prev) => Math.max(prev, nextIndex));
      setCurrentStep(STEPS[nextIndex].id);
      setSearchQuery("");
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) { setCurrentStep(STEPS[prevIndex].id); setSearchQuery(""); }
  };

  const goToStep = (targetStep: FormStep) => {
    const targetIndex = STEPS.findIndex((s) => s.id === targetStep);
    if (targetIndex < 0) return;
    if (targetIndex <= highestStepReached) {
      if (targetStep === "year") autoAdvancedYear.current = true;
      if (targetStep === "ownership") autoAdvancedOwnership.current = true;
      if (targetStep === "transmission") autoAdvancedTransmission.current = true;
      setDirection(targetIndex < currentStepIndex ? -1 : 1);
      setCurrentStep(targetStep);
      setSearchQuery("");
    }
  };

  const handleBack = () => {
    setDirection(-1);
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = STEPS[prevIndex].id;
      if (prevStep === "year") autoAdvancedYear.current = true;
      if (prevStep === "ownership") autoAdvancedOwnership.current = true;
      if (prevStep === "transmission") autoAdvancedTransmission.current = true;
      goBack();
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "vehicle-number": return true;
      case "brand": return formData.makeId > 0;
      case "model": return formData.modelId > 0;
      case "rto-location": return !!formData.rtoCode;
      case "year": return formData.year > 0;
      case "ownership": return formData.ownerCount > 0;
      case "color": return !!formData.color || (useCustomColor && !!customColorText.trim());
      case "fuel-variant": return !!formData.fuelType && (formData.variantId > 0 || variantNotFound);
      case "transmission": return !!formData.transmission;
      case "kilometers": return formData.kilometers > 0 && formData.kilometers <= 200000;
      case "vehicle-location": return !!formData.location;
      case "price": return formData.expectedPrice > 0;
      case "photos": return true;
      case "seller-info": return !!formData.sellerName && !!formData.sellerPhone;
      default: return false;
    }
  };

  useEffect(() => {
    if (currentStep === "year" && formData.year > 0 && !autoAdvancedYear.current && !autoFilledSteps.current.has("year")) {
      autoAdvancedYear.current = true;
      setTimeout(() => { setDirection(1); goNext(); }, 300);
    }
    if (currentStep !== "year") { autoAdvancedYear.current = false; }
  }, [currentStep, formData.year]);

  useEffect(() => {
    if (currentStep === "ownership" && formData.ownerCount > 0 && !autoAdvancedOwnership.current) {
      autoAdvancedOwnership.current = true;
      setTimeout(() => { setDirection(1); goNext(); }, 300);
    }
    if (currentStep !== "ownership") { autoAdvancedOwnership.current = false; }
  }, [currentStep, formData.ownerCount]);

  useEffect(() => {
    if (currentStep === "transmission" && formData.transmission && !autoAdvancedTransmission.current) {
      autoAdvancedTransmission.current = true;
      setTimeout(() => { setDirection(1); goNext(); }, 300);
    }
    if (currentStep !== "transmission") { autoAdvancedTransmission.current = false; }
  }, [currentStep, formData.transmission]);

  useEffect(() => {
    if (colors.length > 0 && formData.color && autoFilledSteps.current.has("color") && !useCustomColor) {
      const colorInList = colors.some((c) => c.name.trim().toLowerCase() === formData.color.trim().toLowerCase());
      if (!colorInList) {
        setUseCustomColor(true);
        setCustomColorText(formData.color);
      }
    }
  }, [colors, formData.color]);

  useEffect(() => {
    if (sellCities.length === 0) return;
    if (formData.cityNumericId) {
      const matchedCity = sellCities.find(c => c.city_id === formData.cityNumericId);
      if (matchedCity) { setSelectedCityInspectionAvailable(matchedCity.inspection_available === "1"); return; }
    }
    if (formData.location) {
      const normalizedLoc = formData.location.toLowerCase().trim();
      const matchedCity = sellCities.find(c => normalizedLoc.includes(c.city_name.toLowerCase()) || c.city_name.toLowerCase().includes(normalizedLoc));
      if (matchedCity) { setSelectedCityInspectionAvailable(matchedCity.inspection_available === "1"); updateField("cityNumericId", matchedCity.city_id); return; }
    }
  }, [formData.cityNumericId, formData.location, sellCities]);

  const filteredSellCities = useMemo(() => {
    const query = citySearchQuery.toLowerCase().trim();
    const filtered = query ? sellCities.filter((c) => c.city_name.toLowerCase().includes(query)) : sellCities;
    const inspectionAvailable = filtered.filter((c) => c.inspection_available === "1");
    const inspectionNotAvailable = filtered.filter((c) => c.inspection_available === "0");
    return [...inspectionAvailable, ...inspectionNotAvailable];
  }, [sellCities, citySearchQuery]);

  const getCityId = (location: string): string => {
    if (formData.cityNumericId) return formData.cityNumericId;
    const normalizedLocation = location.toLowerCase().trim();
    for (const city of nxcarCities) {
      if (normalizedLocation.includes(city.city_name.toLowerCase()) || city.city_name.toLowerCase().includes(normalizedLocation)) {
        return city.city_id;
      }
    }
    return "94";
  };

  const filteredMakes = useMemo(() => {
    if (!searchQuery) return makes;
    return makes.filter((m) => m.make_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [makes, searchQuery]);


  const selectMake = (make: Make) => {
    updateField("makeId", make.id);
    updateField("brand", make.make_name);
    updateField("modelId", 0);
    updateField("model", "");
    updateField("variantId", 0);
    updateField("variant", "");
    setSearchQuery("");
    setTimeout(() => { setDirection(1); goNext(); }, 300);
  };

  const selectModel = (model: Model) => {
    updateField("modelId", model.id);
    updateField("model", model.model_name);
    updateField("variantId", 0);
    updateField("variant", "");
    setSearchQuery("");
    setTimeout(() => { setDirection(1); goNext(); }, 300);
  };

  const selectVariant = (variant: Variant) => {
    updateField("variantId", variant.id);
    updateField("variant", variant.variant_name);
    setSearchQuery("");
    setTimeout(() => { setDirection(1); goNext(); }, 300);
  };

  const extractPincode = (addr: string): string => {
    const match = addr.match(/\b(\d{6})\b/);
    return match ? match[1] : "";
  };

  const buildSellData = () => {
    const resolvedCityId = formData.cityNumericId || getCityId(formData.location);
    return {
      vehicle_number: formData.vehicleNumber, vehicle_no: formData.vehicleNumber,
      make: formData.brand, make_id: formData.makeId ? String(formData.makeId) : "",
      model: formData.model, model_id: formData.modelId ? String(formData.modelId) : "",
      variant: variantNotFound ? "null" : formData.variant, variant_id: variantNotFound ? "null" : (formData.variantId ? String(formData.variantId) : ""),
      year: formData.year ? String(formData.year) : "",
      manufacturing_year: formData.manufacturingYear || (formData.year ? String(formData.year) : ""),
      fule_type: formData.fuelType ? formData.fuelType.toLowerCase() : "",
      fule_id: formData.fuleId || "",
      transmission: formData.transmission ? formData.transmission.toLowerCase() : "",
      mileage: formData.kilometers ? String(formData.kilometers) : "",
      color: formData.color, color_name: formData.color, color_id: "",
      ownership: formData.ownerCount ? String(formData.ownerCount) : "1",
      city: resolvedCityId, city_id: "", city_name: formData.location,
      state_id: formData.stateNumericId || formData.state, state_name: formData.state,
      state_code: formData.rtoCode, rto_id: formData.rtoNumericId || formData.rtoCode,
      rto_code: formData.rtoCode, rto_state_id: formData.stateNumericId || "",
      rto_state_name: formData.state,
      expected_selling_price: "0", price: "0",
      seller_name: formData.sellerName || "", seller_phone: formData.sellerPhone || "",
      seller_email: formData.sellerEmail || "", seller_address: "",
      vehicletype_id: 1, page_name: "sell-page", hidden_number_plate: 1,
      is_variant_found: formData.variantId > 0 && !variantNotFound,
      time: "", car_additional_fuel: "", description: "", image_urls: [] as string[],
    };
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    autoFilledSteps.current = new Set();
    setSearchQuery("");
    setInspectionLocation("");
    setInspectionBooked(false);
    setSelectedFranchise(null);
    setSelectedSlot(null);
    setSelectedDate("");
    setInspectionMode("franchise");
    setUseCustomColor(false);
    setCustomColorText("");
    setVariantNotFound(false);
    setActiveSuccessStep(0);
    setSelectedCityInspectionAvailable(false);
    setShowCityPicker(false);
    setCitySearchQuery("");
    setCurrentStep("vehicle-number");
    setHighestStepReached(0);
  };

  return {
    formData, setFormData, updateField,
    currentStep, setCurrentStep, currentStepIndex, direction, setDirection,
    highestStepReached, progress,
    goNext, goBack, goToStep, handleBack,
    canProceed,
    searchQuery, setSearchQuery,
    filteredMakes,
    selectMake, selectModel, selectVariant,
    useCustomColor, setUseCustomColor, customColorText, setCustomColorText,
    variantNotFound, setVariantNotFound,
    autoFilledSteps,
    inspectionLocation, setInspectionLocation,
    inspectionBooked, setInspectionBooked,
    selectedFranchise, setSelectedFranchise,
    selectedSlot, setSelectedSlot,
    selectedDate, setSelectedDate,
    inspectionMode, setInspectionMode,
    activeSuccessStep, setActiveSuccessStep,
    selectedCityInspectionAvailable, setSelectedCityInspectionAvailable,
    showCityPicker, setShowCityPicker,
    citySearchQuery, setCitySearchQuery,
    filteredSellCities,
    getCityId,
    extractPincode,
    buildSellData,
    slideVariants,
    resetForm,
  };
}
