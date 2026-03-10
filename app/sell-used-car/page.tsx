"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useToast } from "@hooks/use-toast";
import {
  lookupVehicle,
  sellCar,
  bookInspection,
  createCarListing,
  getCities,
  getSellCities,
  type VehicleDetails,
  type NxcarCity,
  type SellCity,
  getMakes,
  getModels,
  getYears,
  getFuelTypes,
  getVariants,
  getInspectionSlots,
  getInspectionFranchises,
  getColors,
  type Make,
  type Model,
  type YearOption,
  type FuelType,
  type Variant,
  type InspectionSlot,
  type InspectionFranchise,
  type NxcarColor,
} from "@lib/api";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  MapPin,
  X,
  Check,
} from "lucide-react";
import LoginModal from "@components/login-modal";
import { useAuth } from "@hooks/use-auth";
import { STEPS, OWNER_OPTIONS, TRANSMISSION_OPTIONS, FALLBACK_SLOTS, type FormStep } from "@components/sell-car/sell-constants";
import { SellTimelinePills } from "@components/sell-car/sell-timeline-pills";
import { SellSuccessSection } from "@components/sell-car/sell-success-section";
import { SellSteps } from "@components/sell-car/sell-steps";

export default function SellCarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SellCar />
    </Suspense>
  );
}

function SellCar() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingSubmitAfterLogin = useRef(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("vehicle-number");
  const [highestStepReached, setHighestStepReached] = useState(0);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const autoLookupTriggered = useRef(false);
  const [vehicleData, setVehicleData] = useState<VehicleDetails | null>(null);
  const autoFilledSteps = useRef<Set<FormStep>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectionLocation, setInspectionLocation] = useState("");
  const extractPincode = (addr: string): string => {
    const match = addr.match(/\b(\d{6})\b/);
    return match ? match[1] : "";
  };
  const [inspectionBooked, setInspectionBooked] = useState(false);
  const [savedCarListingId, setSavedCarListingId] = useState<number | null>(null);
  const [selectedFranchise, setSelectedFranchise] = useState<InspectionFranchise | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<InspectionSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [inspectionMode, setInspectionMode] = useState<"franchise" | "home">("franchise");
  const [activeSuccessStep, setActiveSuccessStep] = useState(0);
  const [selectedCityInspectionAvailable, setSelectedCityInspectionAvailable] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
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
    ownerCount: 0,
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
  });

  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColorText, setCustomColorText] = useState("");
  const [variantNotFound, setVariantNotFound] = useState(false);

  const { data: makes = [], isLoading: makesLoading } = useQuery({ queryKey: ["makes"], queryFn: getMakes });
  const { data: models = [], isLoading: modelsLoading } = useQuery({ queryKey: ["models", formData.makeId], queryFn: () => getModels(formData.makeId), enabled: formData.makeId > 0 });
  const { data: years = [], isLoading: yearsLoading } = useQuery({ queryKey: ["years"], queryFn: getYears });
  const { data: fuelTypes = [], isLoading: fuelTypesLoading } = useQuery({ queryKey: ["fuelTypes"], queryFn: getFuelTypes });
  const { data: colors = [] } = useQuery<NxcarColor[]>({ queryKey: ["colors"], queryFn: getColors });
  const { data: variants = [], isLoading: variantsLoading } = useQuery({ queryKey: ["variants", formData.modelId, formData.fuelType], queryFn: () => getVariants(formData.modelId, formData.fuelType), enabled: formData.modelId > 0 && !!formData.fuelType });

  const { data: nxcarCities = [] } = useQuery({ queryKey: ["nxcarCities"], queryFn: getCities, staleTime: 3600000 });
  const { data: sellCities = [], isLoading: sellCitiesLoading } = useQuery({ queryKey: ["sellCities"], queryFn: getSellCities, staleTime: 3600000 });

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

  const userCityId = getCityId(formData.location);

  const { data: inspectionSlotsData = [], isLoading: slotsLoading, isError: slotsError } = useQuery({
    queryKey: ["inspectionSlots"], queryFn: getInspectionSlots,
    enabled: currentStep === "success" && selectedCityInspectionAvailable, retry: 2,
  });

  const inspectionSlots = inspectionSlotsData.length > 0 ? inspectionSlotsData
    : slotsError || (!slotsLoading && inspectionSlotsData.length === 0) ? FALLBACK_SLOTS : [];

  const { data: franchises = [], isLoading: franchisesLoading, isError: franchisesError } = useQuery({
    queryKey: ["franchises", userCityId],
    queryFn: () => getInspectionFranchises(userCityId),
    enabled: currentStep === "success" && selectedCityInspectionAvailable && !!formData.location, retry: 2,
  });

  const findFirstIncompleteStep = (data: typeof formData): FormStep => {
    if (!data.makeId || !data.brand) return "brand";
    if (!data.modelId || !data.model) return "model";
    if (!data.rtoCode) return "rto-location";
    if (!data.year) return "year";
    if (!data.ownerCount) return "ownership";
    if (!data.color) return "color";
    if (!data.fuelType) return "fuel-variant";
    if (!data.transmission) return "transmission";
    if (!data.kilometers) return "kilometers";
    if (!data.location) return "vehicle-location";
    return "price";
  };

  const vehicleLookupMutation = useMutation({
    mutationFn: lookupVehicle,
    onSuccess: (data) => {
      setVehicleData(data);
      const registrationYear = data.year || data.all?.vehicleManufacturingMonthYear?.split("/")[1] || "";
      const mfgYear = data.all?.vehicleManufacturingMonthYear?.split("/")[1] || data.year || "";
      const locationFromAddress = data.all?.presentAddress?.split(",")[0]?.trim() || "";
      let matchedCityId = "";
      if (locationFromAddress) {
        const normalizedLoc = locationFromAddress.toLowerCase();
        const cityList = nxcarCities.length > 0 ? nxcarCities : sellCities;
        if (cityList.length > 0) {
          const matchedCity = cityList.find(c => normalizedLoc.includes(c.city_name.toLowerCase()) || c.city_name.toLowerCase().includes(normalizedLoc));
          if (matchedCity) matchedCityId = matchedCity.city_id;
        }
      }
      const newFormData = {
        ...formData,
        vehicleNumber: data.vehicle_number || formData.vehicleNumber.toUpperCase(),
        makeId: parseInt(data.make_id) || 0,
        brand: data.make || "",
        modelId: parseInt(data.model_id) || 0,
        model: data.model || "",
        variantId: parseInt(data.variant_id) || 0,
        variant: data.variant || "",
        year: parseInt(registrationYear) || 0,
        fuelType: data.fule_type || data.all?.type || "",
        fuleId: data.fule_id || "",
        color: data.color || data.all?.vehicleColour || "",
        ownerCount: 0,
        state: data.rto_state_name || "",
        rtoCode: data.rto_code || data.all?.rtoCode || "",
        rtoNumericId: data.rto_id || "",
        stateNumericId: data.rto_state_id || "",
        cityNumericId: matchedCityId,
        manufacturingYear: mfgYear,
        location: locationFromAddress || data.rto_state_name || "",
      };
      setFormData(newFormData);
      setIsLookingUp(false);
      autoFilledSteps.current = new Set();
      if (newFormData.rtoCode) autoFilledSteps.current.add("rto-location");
      if (newFormData.year > 0) autoFilledSteps.current.add("year");
      if (newFormData.color) autoFilledSteps.current.add("color");
      if (newFormData.fuelType) autoFilledSteps.current.add("fuel-variant");
      const filledFields = [];
      if (newFormData.brand) filledFields.push(newFormData.brand);
      if (newFormData.model) filledFields.push(newFormData.model);
      if (newFormData.variant) filledFields.push(newFormData.variant);
      if (newFormData.fuelType) filledFields.push(newFormData.fuelType);
      if (newFormData.year) filledFields.push(newFormData.year.toString());
      if (newFormData.color) filledFields.push(newFormData.color);
      if (newFormData.location) filledFields.push(newFormData.location);
      toast({ title: "Vehicle Found!", description: `Auto-filled ${filledFields.length} details: ${newFormData.brand} ${newFormData.model}` });
      const nextStep = findFirstIncompleteStep(newFormData);
      setCurrentStep(nextStep);
    },
    onError: () => {
      setIsLookingUp(false);
      toast({ title: "Not Found", description: "Please enter details manually.", variant: "destructive" });
      setCurrentStep("brand");
    },
  });

  useEffect(() => {
    const carNumberParam = searchParams.get("carNumber");
    if (carNumberParam && !autoLookupTriggered.current) {
      autoLookupTriggered.current = true;
      const upperCarNumber = carNumberParam.trim().toUpperCase();
      setFormData((prev) => ({ ...prev, vehicleNumber: upperCarNumber }));
      setIsLookingUp(true);
      vehicleLookupMutation.mutate(upperCarNumber);
    }
  }, [searchParams]);

  const [submittedVehicleId, setSubmittedVehicleId] = useState("");

  const sellCarMutation = useMutation({
    mutationFn: sellCar,
    onSuccess: async (data) => {
      const vid = data?.vehicle_id ? String(data.vehicle_id) : "";
      if (vid) {
        setSubmittedVehicleId(vid);
        await uploadImagesToNxcar(vid);
      }
      setCurrentStep("success");
      createCarListing({
        vehicleNumber: formData.vehicleNumber, brand: formData.brand, model: formData.model, variant: formData.variant,
        year: formData.year, fuelType: formData.fuelType, transmission: formData.transmission, kilometers: formData.kilometers,
        color: formData.color, ownerCount: formData.ownerCount, location: formData.location, state: formData.state,
        rtoCode: formData.rtoCode, expectedPrice: formData.expectedPrice, description: formData.description,
        imageUrls: uploadedImages.length > 0 ? uploadedImages : null,
        sellerName: formData.sellerName, sellerPhone: formData.sellerPhone, sellerEmail: formData.sellerEmail,
      }).catch(() => {});
      toast({ title: "Submitted!", description: "We'll contact you shortly." });
    },
    onError: (error: Error) => {
      console.error("Sell car submission failed:", error);
      toast({ title: "Failed", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const bookInspectionMutation = useMutation({
    mutationFn: bookInspection,
    onSuccess: (data) => {
      setInspectionBooked(true);
      createCarListing({
        vehicleNumber: formData.vehicleNumber, brand: formData.brand, model: formData.model, variant: formData.variant,
        year: formData.year, fuelType: formData.fuelType, transmission: formData.transmission, kilometers: formData.kilometers,
        color: formData.color, ownerCount: formData.ownerCount, location: formData.location, state: formData.state,
        rtoCode: formData.rtoCode, expectedPrice: formData.expectedPrice || 0,
        sellerName: formData.sellerName || "N/A", sellerPhone: formData.sellerPhone || "N/A", sellerEmail: formData.sellerEmail,
      }).then((savedCar) => {
        if (savedCar?.id) setSavedCarListingId(savedCar.id);
      }).catch(() => {});
      toast({ title: "Inspection Booked!", description: data?.message || `Your inspection has been scheduled successfully.` });
    },
    onError: (error: Error) => {
      console.error("Inspection booking failed:", error);
      toast({ title: "Booking Failed", description: error.message || "Failed to book inspection. Please try again.", variant: "destructive" });
    },
  });

  const buildSellData = () => {
    const resolvedCityId = formData.cityNumericId || getCityId(formData.location);
    return {
      vehicle_number: formData.vehicleNumber, vehicle_no: formData.vehicleNumber,
      make: formData.brand, make_id: formData.makeId ? String(formData.makeId) : "",
      model: formData.model, model_id: formData.modelId ? String(formData.modelId) : "",
      variant: formData.variant, variant_id: formData.variantId ? String(formData.variantId) : "",
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

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLookup = () => {
    if (!formData.vehicleNumber.trim()) { goNext(); return; }
    setIsLookingUp(true);
    vehicleLookupMutation.mutate(formData.vehicleNumber.replace(/\s/g, "").trim());
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 5 - pendingFiles.length;
    if (remaining <= 0) { toast({ title: "Max 5 images", variant: "destructive" }); return; }
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.type.startsWith("image/")) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    }
    setPendingFiles((prev) => [...prev, ...newFiles]);
    setUploadedImages((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const url = prev[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToNxcar = async (vehicleId: string) => {
    if (pendingFiles.length === 0) return;
    try {
      setIsUploading(true);
      const formPayload = new FormData();
      formPayload.append("vehicle_id", vehicleId);
      for (const file of pendingFiles) {
        formPayload.append("images", file);
      }
      const res = await fetch("/api/nxcar/image-upload", { method: "POST", body: formPayload });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Image upload failed:", errData);
      }
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const doSubmit = () => {
    const resolvedCityId = formData.cityNumericId || getCityId(formData.location);
    const sellData: Record<string, any> = {
      vehicle_number: formData.vehicleNumber, vehicle_no: formData.vehicleNumber,
      make: formData.brand, make_id: formData.makeId ? String(formData.makeId) : "",
      model: formData.model, model_id: formData.modelId ? String(formData.modelId) : "",
      variant: formData.variant, variant_id: formData.variantId ? String(formData.variantId) : "",
      year: formData.year ? String(formData.year) : "",
      manufacturing_year: formData.manufacturingYear || (formData.year ? String(formData.year) : ""),
      fule_type: formData.fuelType.toLowerCase(),
      fule_id: formData.fuleId || "",
      transmission: formData.transmission.toLowerCase(),
      mileage: formData.kilometers ? String(formData.kilometers) : "",
      color: formData.color, color_name: formData.color, color_id: "",
      ownership: formData.ownerCount ? String(formData.ownerCount) : "1",
      city: resolvedCityId, city_id: "", city_name: formData.location,
      state_id: formData.stateNumericId || formData.state, state_name: formData.state,
      state_code: formData.rtoCode, rto_id: formData.rtoNumericId || formData.rtoCode,
      rto_code: formData.rtoCode, rto_state_id: formData.stateNumericId || "",
      rto_state_name: formData.state,
      expected_selling_price: formData.expectedPrice ? String(formData.expectedPrice) : "",
      price: "0",
      seller_name: formData.sellerName, seller_phone: formData.sellerPhone,
      seller_email: formData.sellerEmail, seller_address: "",
      vehicletype_id: 1, page_name: "sell-page", hidden_number_plate: 1,
      is_variant_found: formData.variantId > 0 && !variantNotFound,
      time: "", car_additional_fuel: "",
      description: formData.description, image_urls: uploadedImages,
    };
    sellCarMutation.mutate(sellData);
  };

  const handleSubmit = () => {
    if (!formData.sellerName || !formData.sellerPhone) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!isAuthenticated) {
      pendingSubmitAfterLogin.current = true;
      setShowLoginModal(true);
      return;
    }
    doSubmit();
  };

  const handleLoginSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    setShowLoginModal(false);
    if (pendingSubmitAfterLogin.current) {
      pendingSubmitAfterLogin.current = false;
      setTimeout(() => { doSubmit(); }, 500);
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  useEffect(() => {
    if (currentStepIndex >= 0) { setHighestStepReached((prev) => Math.max(prev, currentStepIndex)); }
  }, [currentStepIndex]);

  const progress = currentStep === "success" ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100;

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

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "vehicle-number": return true;
      case "brand": return formData.makeId > 0;
      case "model": return formData.modelId > 0;
      case "rto-location": return !!formData.rtoCode;
      case "year": return formData.year > 0;
      case "ownership": return formData.ownerCount > 0;
      case "color": return !!formData.color || (useCustomColor && !!customColorText.trim());
      case "fuel-variant": return !!formData.fuelType && formData.variantId > 0;
      case "transmission": return !!formData.transmission;
      case "kilometers": return formData.kilometers > 0 && formData.kilometers <= 200000;
      case "vehicle-location": return !!formData.location;
      case "price": return formData.expectedPrice > 0;
      case "photos": return true;
      case "seller-info": return !!formData.sellerName && !!formData.sellerPhone;
      default: return false;
    }
  };

  const autoAdvancedYear = useRef(false);
  useEffect(() => {
    if (currentStep === "year" && formData.year > 0 && !autoAdvancedYear.current && !autoFilledSteps.current.has("year")) {
      autoAdvancedYear.current = true;
      setTimeout(() => { setDirection(1); goNext(); }, 300);
    }
    if (currentStep !== "year") { autoAdvancedYear.current = false; }
  }, [currentStep, formData.year]);

  const autoAdvancedOwnership = useRef(false);
  useEffect(() => {
    if (currentStep === "ownership" && formData.ownerCount > 0 && !autoAdvancedOwnership.current) {
      autoAdvancedOwnership.current = true;
      setTimeout(() => { setDirection(1); goNext(); }, 300);
    }
    if (currentStep !== "ownership") { autoAdvancedOwnership.current = false; }
  }, [currentStep, formData.ownerCount]);

  const autoAdvancedTransmission = useRef(false);
  useEffect(() => {
    if (currentStep === "transmission" && formData.transmission && !autoAdvancedTransmission.current) {
      autoAdvancedTransmission.current = true;
      setTimeout(() => { setDirection(1); goNext(); }, 300);
    }
    if (currentStep !== "transmission") { autoAdvancedTransmission.current = false; }
  }, [currentStep, formData.transmission]);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    if (autoFilledSteps.current.has(currentStep)) { autoFilledSteps.current.delete(currentStep); }
    if (currentStep === "color" && useCustomColor && customColorText.trim()) { updateField("color", customColorText.trim()); }
    if (currentStep === "vehicle-number") {
      handleLookup();
    } else if (currentStep === "vehicle-location" && selectedCityInspectionAvailable) {
      setCurrentStep("success");
      setActiveSuccessStep(2);
    } else if (currentStep === "seller-info") {
      handleSubmit();
    } else {
      goNext();
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

  const resetForm = () => {
    setFormData({
      vehicleNumber: "", makeId: 0, brand: "", modelId: 0, model: "", variantId: 0, variant: "",
      year: 0, fuelType: "", fuleId: "", transmission: "", kilometers: 0, color: "", ownerCount: 0,
      location: "", state: "", rtoCode: "", rtoNumericId: "", stateNumericId: "", cityNumericId: "",
      manufacturingYear: "", expectedPrice: 0, description: "", sellerName: "", sellerPhone: "", sellerEmail: "",
    });
    setUploadedImages([]);
    setVehicleData(null);
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

  const filteredMakes = useMemo(() => {
    if (!searchQuery) return makes;
    return makes.filter((m) => m.make_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [makes, searchQuery]);

  const filteredModels = useMemo(() => {
    if (!searchQuery) return models;
    return models.filter((m) => m.model_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [models, searchQuery]);

  const filteredVariants = useMemo(() => {
    if (!searchQuery) return variants;
    return variants.filter((v) => v.variant_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [variants, searchQuery]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:from-[#0a0f14] dark:via-[#0d1318] dark:to-primary/10 overflow-x-hidden">
      <Navbar />

      <main className="pt-20 min-h-screen flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        {currentStep !== "success" && (
          <div className="w-full bg-muted/50 h-2 relative z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-teal-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        )}

        <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8 relative z-10">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === "success" ? (
                <SellSuccessSection
                  formData={formData}
                  selectedCityInspectionAvailable={selectedCityInspectionAvailable}
                  activeSuccessStep={activeSuccessStep}
                  setActiveSuccessStep={setActiveSuccessStep}
                  inspectionBooked={inspectionBooked}
                  inspectionMode={inspectionMode}
                  setInspectionMode={setInspectionMode}
                  selectedFranchise={selectedFranchise}
                  setSelectedFranchise={setSelectedFranchise}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  inspectionLocation={inspectionLocation}
                  setInspectionLocation={setInspectionLocation}
                  franchises={franchises}
                  franchisesLoading={franchisesLoading}
                  franchisesError={franchisesError}
                  inspectionSlots={inspectionSlots}
                  slotsLoading={slotsLoading}
                  bookInspectionMutation={bookInspectionMutation}
                  resetForm={resetForm}
                  submittedVehicleId={submittedVehicleId}
                  savedCarListingId={savedCarListingId}
                  extractPincode={extractPincode}
                  buildSellData={buildSellData}
                  getCityId={getCityId}
                  cityNumericId={formData.cityNumericId}
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={() => {
                    pendingSubmitAfterLogin.current = false;
                    setShowLoginModal(true);
                  }}
                  onBookInspectionToast={(title, description) => {
                    toast({ title, description, variant: "destructive" });
                  }}
                />
              ) : (
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                      {STEPS[currentStepIndex]?.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {STEPS[currentStepIndex]?.subtitle}
                    </p>
                  </div>

                  <SellTimelinePills
                    formData={formData}
                    currentStep={currentStep}
                    currentStepIndex={currentStepIndex}
                    highestStepReached={highestStepReached}
                    goToStep={goToStep}
                  />

                  <SellSteps
                    currentStep={currentStep}
                    formData={formData}
                    updateField={updateField}
                    vehicleData={vehicleData}
                    autoFilledSteps={autoFilledSteps}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    makes={makes}
                    makesLoading={makesLoading}
                    filteredMakes={filteredMakes}
                    selectMake={selectMake}
                    models={models}
                    modelsLoading={modelsLoading}
                    filteredModels={filteredModels}
                    selectModel={selectModel}
                    years={years}
                    yearsLoading={yearsLoading}
                    fuelTypes={fuelTypes}
                    fuelTypesLoading={fuelTypesLoading}
                    colors={colors}
                    variants={variants}
                    variantsLoading={variantsLoading}
                    filteredVariants={filteredVariants}
                    useCustomColor={useCustomColor}
                    setUseCustomColor={setUseCustomColor}
                    customColorText={customColorText}
                    setCustomColorText={setCustomColorText}
                    variantNotFound={variantNotFound}
                    setVariantNotFound={setVariantNotFound}
                    uploadedImages={uploadedImages}
                    handleImageUpload={handleImageUpload}
                    removeImage={removeImage}
                    isUploading={isUploading}
                    selectedCityInspectionAvailable={selectedCityInspectionAvailable}
                    showCityPicker={showCityPicker}
                    setShowCityPicker={setShowCityPicker}
                  />

                  <div className="flex gap-4 pt-4">
                    {currentStepIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="h-14 px-6 rounded-xl border-2 border-border text-foreground hover:bg-muted"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                    )}

                    {(!["brand", "model", "year", "transmission"].includes(currentStep) || currentStep === "ownership" || autoFilledSteps.current.has(currentStep)) && (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!canProceed() || isLookingUp || sellCarMutation.isPending}
                        className="flex-1 h-14 bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-foreground font-semibold text-lg rounded-xl disabled:opacity-50"
                      >
                        {isLookingUp || sellCarMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {currentStep === "seller-info" ? "Submit Listing" : currentStep === "vehicle-number" && formData.vehicleNumber ? "Fetch Details" : "Continue"}
                        {!isLookingUp && !sellCarMutation.isPending && currentStep !== "seller-info" && <ArrowRight className="w-5 h-5 ml-2" />}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {showCityPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Select City</h3>
              <button
                type="button"
                onClick={() => { setShowCityPicker(false); setCitySearchQuery(""); }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                data-testid="button-close-city-picker"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-city-search"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Search city..."
                  className="h-10 pl-9 bg-background/50 border border-border rounded-lg text-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {sellCitiesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
              ) : filteredSellCities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No cities found</p>
              ) : (
                <>
                  {filteredSellCities.some((c) => c.inspection_available === "1") && (
                    <div className="px-3 py-2">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">Inspection Available</span>
                    </div>
                  )}
                  {filteredSellCities.map((city) => {
                    const isInspectionCity = city.inspection_available === "1";
                    const isFirstNonInspection = !isInspectionCity &&
                      filteredSellCities.indexOf(city) > 0 &&
                      filteredSellCities[filteredSellCities.indexOf(city) - 1]?.inspection_available === "1";
                    return (
                      <div key={city.city_id}>
                        {isFirstNonInspection && (
                          <div className="px-3 py-2 mt-2 border-t border-border">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Other Cities</span>
                          </div>
                        )}
                        <button
                          type="button"
                          data-testid={`city-option-${city.city_id}`}
                          onClick={() => {
                            updateField("location", city.city_name);
                            updateField("cityNumericId", city.city_id);
                            setSelectedCityInspectionAvailable(isInspectionCity);
                            setShowCityPicker(false);
                            setCitySearchQuery("");
                            if (isInspectionCity) {
                              setTimeout(() => { setDirection(1); setCurrentStep("success"); setActiveSuccessStep(2); }, 400);
                            } else {
                              setTimeout(() => { setDirection(1); goNext(); }, 400);
                            }
                          }}
                          className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                            formData.cityNumericId === city.city_id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                          }`}
                        >
                          <MapPin className={`w-4 h-4 flex-shrink-0 ${isInspectionCity ? "text-primary" : "text-muted-foreground/50"}`} />
                          <span className={`flex-1 ${isInspectionCity ? "font-semibold text-foreground" : "font-normal text-muted-foreground"}`}>
                            {city.city_name}
                          </span>
                          {isInspectionCity && (
                            <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">Inspection</span>
                          )}
                          {formData.cityNumericId === city.city_id && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        open={showLoginModal}
        onOpenChange={(open) => {
          setShowLoginModal(open);
          if (!open) pendingSubmitAfterLogin.current = false;
        }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
