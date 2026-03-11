"use client";

import { useState, useRef, Suspense } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useToast } from "@hooks/use-toast";
import {
  sellCar,
  bookInspection,
  createCarListing,
  getCities,
  getSellCities,
  getMakes,
  getModels,
  getYears,
  getFuelTypes,
  getVariants,
  getInspectionSlots,
  getInspectionFranchises,
  getColors,
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
import { STEPS, FALLBACK_SLOTS } from "@components/sell-car/sell-constants";
import { SellTimelinePills } from "@components/sell-car/sell-timeline-pills";
import { SellSuccessSection } from "@components/sell-car/sell-success-section";
import { SellSteps } from "@components/sell-car/sell-steps";
import { useSellCarForm } from "@hooks/use-sell-car-form";
import { useVehicleLookup } from "@hooks/use-vehicle-lookup";
import { useImageUpload } from "@hooks/use-image-upload";

export default function SellCarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SellCar />
    </Suspense>
  );
}

function SellCar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingSubmitAfterLogin = useRef(false);
  const [submittedVehicleId, setSubmittedVehicleId] = useState("");
  const [savedCarListingId, setSavedCarListingId] = useState<number | null>(null);

  const { data: makes = [], isLoading: makesLoading } = useQuery({ queryKey: ["makes"], queryFn: getMakes });
  const { data: years = [], isLoading: yearsLoading } = useQuery({ queryKey: ["years"], queryFn: getYears });
  const { data: fuelTypes = [], isLoading: fuelTypesLoading } = useQuery({ queryKey: ["fuelTypes"], queryFn: getFuelTypes });
  const { data: colors = [] } = useQuery<NxcarColor[]>({ queryKey: ["colors"], queryFn: getColors });
  const { data: nxcarCities = [] } = useQuery({ queryKey: ["nxcarCities"], queryFn: getCities, staleTime: 3600000 });
  const { data: sellCities = [], isLoading: sellCitiesLoading } = useQuery({ queryKey: ["sellCities"], queryFn: getSellCities, staleTime: 3600000 });

  const form = useSellCarForm({ makes, colors, sellCities, nxcarCities });

  const { data: modelsData = [], isLoading: modelsDataLoading } = useQuery({ queryKey: ["models", form.formData.makeId], queryFn: () => getModels(form.formData.makeId), enabled: form.formData.makeId > 0 });
  const { data: variants = [], isLoading: variantsLoading } = useQuery({ queryKey: ["variants", form.formData.modelId, form.formData.fuelType], queryFn: () => getVariants(form.formData.modelId, form.formData.fuelType), enabled: form.formData.modelId > 0 && !!form.formData.fuelType });

  const userCityId = form.getCityId(form.formData.location);

  const { data: inspectionSlotsData = [], isLoading: slotsLoading, isError: slotsError } = useQuery({
    queryKey: ["inspectionSlots"], queryFn: getInspectionSlots,
    enabled: form.currentStep === "success" && form.selectedCityInspectionAvailable, retry: 2,
  });

  const inspectionSlots = inspectionSlotsData.length > 0 ? inspectionSlotsData
    : slotsError || (!slotsLoading && inspectionSlotsData.length === 0) ? FALLBACK_SLOTS : [];

  const { data: franchises = [], isLoading: franchisesLoading, isError: franchisesError } = useQuery({
    queryKey: ["franchises", userCityId],
    queryFn: () => getInspectionFranchises(userCityId),
    enabled: form.currentStep === "success" && form.selectedCityInspectionAvailable && !!form.formData.location, retry: 2,
  });

  const imageUpload = useImageUpload({ toast });

  const { vehicleData, isLookingUp, handleLookup } = useVehicleLookup({
    formData: form.formData,
    setFormData: form.setFormData,
    colors,
    nxcarCities,
    sellCities,
    autoFilledSteps: form.autoFilledSteps,
    setCurrentStep: form.setCurrentStep,
    setUseCustomColor: form.setUseCustomColor,
    setCustomColorText: form.setCustomColorText,
    goNext: form.goNext,
    toast,
  });

  const sellCarMutation = useMutation({
    mutationFn: sellCar,
    onSuccess: async (data) => {
      const vid = data?.vehicle_id ? String(data.vehicle_id) : "";
      if (vid) {
        setSubmittedVehicleId(vid);
        await imageUpload.uploadImagesToNxcar(vid, form.formData.expectedPrice);
      }
      form.setCurrentStep("success");
      createCarListing({
        vehicleNumber: form.formData.vehicleNumber, brand: form.formData.brand, model: form.formData.model, variant: form.formData.variant,
        year: form.formData.year, fuelType: form.formData.fuelType, transmission: form.formData.transmission, kilometers: form.formData.kilometers,
        color: form.formData.color, ownerCount: form.formData.ownerCount, location: form.formData.location, state: form.formData.state,
        rtoCode: form.formData.rtoCode, expectedPrice: form.formData.expectedPrice, description: form.formData.description,
        imageUrls: imageUpload.uploadedImages.length > 0 ? imageUpload.uploadedImages : null,
        sellerName: form.formData.sellerName, sellerPhone: form.formData.sellerPhone, sellerEmail: form.formData.sellerEmail,
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
      form.setInspectionBooked(true);
      createCarListing({
        vehicleNumber: form.formData.vehicleNumber, brand: form.formData.brand, model: form.formData.model, variant: form.formData.variant,
        year: form.formData.year, fuelType: form.formData.fuelType, transmission: form.formData.transmission, kilometers: form.formData.kilometers,
        color: form.formData.color, ownerCount: form.formData.ownerCount, location: form.formData.location, state: form.formData.state,
        rtoCode: form.formData.rtoCode, expectedPrice: form.formData.expectedPrice || 0,
        sellerName: form.formData.sellerName || "N/A", sellerPhone: form.formData.sellerPhone || "N/A", sellerEmail: form.formData.sellerEmail,
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

  const doSubmit = () => {
    const resolvedCityId = form.formData.cityNumericId || form.getCityId(form.formData.location);
    const sellData: Record<string, any> = {
      vehicle_number: form.formData.vehicleNumber, vehicle_no: form.formData.vehicleNumber,
      make: form.formData.brand, make_id: form.formData.makeId ? String(form.formData.makeId) : "",
      model: form.formData.model, model_id: form.formData.modelId ? String(form.formData.modelId) : "",
      variant: form.variantNotFound ? "null" : form.formData.variant, variant_id: form.variantNotFound ? "0" : (form.formData.variantId ? String(form.formData.variantId) : ""),
      year: form.formData.year ? String(form.formData.year) : "",
      manufacturing_year: form.formData.manufacturingYear || (form.formData.year ? String(form.formData.year) : ""),
      fule_type: form.formData.fuelType.toLowerCase(),
      fule_id: form.formData.fuleId || "",
      transmission: form.formData.transmission.toLowerCase(),
      mileage: form.formData.kilometers ? String(form.formData.kilometers) : "",
      color: form.formData.color, color_name: form.formData.color, color_id: "",
      ownership: form.formData.ownerCount ? String(form.formData.ownerCount) : "1",
      city: resolvedCityId, city_id: "", city_name: form.formData.location,
      state_id: form.formData.stateNumericId || form.formData.state, state_name: form.formData.state,
      state_code: form.formData.rtoCode, rto_id: form.formData.rtoNumericId || form.formData.rtoCode,
      rto_code: form.formData.rtoCode, rto_state_id: form.formData.stateNumericId || "",
      rto_state_name: form.formData.state,
      expected_selling_price: form.formData.expectedPrice ? String(form.formData.expectedPrice) : "",
      price: "0",
      seller_name: form.formData.sellerName, seller_phone: form.formData.sellerPhone,
      seller_email: form.formData.sellerEmail, seller_address: "",
      vehicletype_id: 1, page_name: "sell-page", hidden_number_plate: 1,
      is_variant_found: form.formData.variantId > 0 && !form.variantNotFound,
      time: "", car_additional_fuel: "",
      description: form.formData.description, image_urls: imageUpload.uploadedImages,
    };
    sellCarMutation.mutate(sellData);
  };

  const handleSubmit = () => {
    if (!form.formData.sellerName || !form.formData.sellerPhone) {
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

  const handleNext = () => {
    form.setDirection(1);
    if (form.autoFilledSteps.current.has(form.currentStep)) { form.autoFilledSteps.current.delete(form.currentStep); }
    if (form.currentStep === "color" && form.useCustomColor && form.customColorText.trim()) { form.updateField("color", form.customColorText.trim()); }
    if (form.currentStep === "vehicle-number") {
      handleLookup();
    } else if (form.currentStep === "vehicle-location" && form.selectedCityInspectionAvailable) {
      form.setCurrentStep("success");
      form.setActiveSuccessStep(2);
    } else if (form.currentStep === "seller-info") {
      handleSubmit();
    } else {
      form.goNext();
    }
  };

  const resetAll = () => {
    form.resetForm();
    imageUpload.resetImages();
  };

  const filteredMakes = form.filteredMakes;
  const filteredModels = (() => {
    if (!form.searchQuery) return modelsData;
    return modelsData.filter((m) => m.model_name.toLowerCase().includes(form.searchQuery.toLowerCase()));
  })();
  const filteredVariants = (() => {
    if (!form.searchQuery) return variants;
    return variants.filter((v) => v.variant_name.toLowerCase().includes(form.searchQuery.toLowerCase()));
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:from-[#0a0f14] dark:via-[#0d1318] dark:to-primary/10 overflow-x-hidden">
      <Navbar />

      <main className="pt-14 min-h-screen flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        {form.currentStep !== "success" && (
          <div className="w-full bg-muted/50 h-2 relative z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-teal-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${form.progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        )}

        <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8 relative z-10">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={form.direction}>
              {form.currentStep === "success" ? (
                <SellSuccessSection
                  formData={form.formData}
                  selectedCityInspectionAvailable={form.selectedCityInspectionAvailable}
                  activeSuccessStep={form.activeSuccessStep}
                  setActiveSuccessStep={form.setActiveSuccessStep}
                  inspectionBooked={form.inspectionBooked}
                  inspectionMode={form.inspectionMode}
                  setInspectionMode={form.setInspectionMode}
                  selectedFranchise={form.selectedFranchise}
                  setSelectedFranchise={form.setSelectedFranchise}
                  selectedSlot={form.selectedSlot}
                  setSelectedSlot={form.setSelectedSlot}
                  selectedDate={form.selectedDate}
                  setSelectedDate={form.setSelectedDate}
                  inspectionLocation={form.inspectionLocation}
                  inspectionPincode={form.inspectionPincode}
                  setInspectionPincode={form.setInspectionPincode}
                  setInspectionLocation={form.setInspectionLocation}
                  franchises={franchises}
                  franchisesLoading={franchisesLoading}
                  franchisesError={franchisesError}
                  inspectionSlots={inspectionSlots}
                  slotsLoading={slotsLoading}
                  bookInspectionMutation={bookInspectionMutation}
                  resetForm={resetAll}
                  submittedVehicleId={submittedVehicleId}
                  savedCarListingId={savedCarListingId}
                  extractPincode={form.extractPincode}
                  buildSellData={form.buildSellData}
                  getCityId={form.getCityId}
                  cityNumericId={form.formData.cityNumericId}
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={() => {
                    pendingSubmitAfterLogin.current = false;
                    setShowLoginModal(true);
                  }}
                  onBookInspectionToast={(title, description) => {
                    toast({ title, description, variant: "destructive" });
                  }}
                  onGoBack={() => {
                    form.setDirection(-1);
                    form.setCurrentStep(form.lastFormStep);
                  }}
                />
              ) : (
                <motion.div
                  key={form.currentStep}
                  custom={form.direction}
                  variants={form.slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                      {STEPS[form.currentStepIndex]?.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {STEPS[form.currentStepIndex]?.subtitle}
                    </p>
                  </div>

                  <SellTimelinePills
                    formData={form.formData}
                    currentStep={form.currentStep}
                    currentStepIndex={form.currentStepIndex}
                    highestStepReached={form.highestStepReached}
                    goToStep={form.goToStep}
                  />

                  <SellSteps
                    currentStep={form.currentStep}
                    formData={form.formData}
                    updateField={form.updateField}
                    vehicleData={vehicleData}
                    autoFilledSteps={form.autoFilledSteps}
                    searchQuery={form.searchQuery}
                    setSearchQuery={form.setSearchQuery}
                    makes={makes}
                    makesLoading={makesLoading}
                    filteredMakes={filteredMakes}
                    selectMake={form.selectMake}
                    models={modelsData}
                    modelsLoading={modelsDataLoading}
                    filteredModels={filteredModels}
                    selectModel={form.selectModel}
                    years={years}
                    yearsLoading={yearsLoading}
                    fuelTypes={fuelTypes}
                    fuelTypesLoading={fuelTypesLoading}
                    colors={colors}
                    variants={variants}
                    variantsLoading={variantsLoading}
                    filteredVariants={filteredVariants}
                    useCustomColor={form.useCustomColor}
                    setUseCustomColor={form.setUseCustomColor}
                    customColorText={form.customColorText}
                    setCustomColorText={form.setCustomColorText}
                    variantNotFound={form.variantNotFound}
                    setVariantNotFound={form.setVariantNotFound}
                    uploadedImages={imageUpload.uploadedImages}
                    handleImageUpload={imageUpload.handleImageUpload}
                    removeImage={imageUpload.removeImage}
                    isUploading={imageUpload.isUploading}
                    selectedCityInspectionAvailable={form.selectedCityInspectionAvailable}
                    showCityPicker={form.showCityPicker}
                    setShowCityPicker={form.setShowCityPicker}
                  />

                  <div className="flex gap-4 pt-4">
                    {form.currentStepIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={form.handleBack}
                        className="h-14 px-6 rounded-xl border-2 border-border text-foreground hover:bg-muted"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                    )}

                    {(!["brand", "model", "year", "transmission"].includes(form.currentStep) || form.currentStep === "ownership" || form.autoFilledSteps.current.has(form.currentStep)) && (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!form.canProceed() || isLookingUp || sellCarMutation.isPending}
                        className="flex-1 h-14 bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-foreground font-semibold text-lg rounded-xl disabled:opacity-50"
                      >
                        {isLookingUp || sellCarMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {form.currentStep === "seller-info" ? "Submit Listing" : form.currentStep === "vehicle-number" && form.formData.vehicleNumber ? "Fetch Details" : "Continue"}
                        {!isLookingUp && !sellCarMutation.isPending && form.currentStep !== "seller-info" && <ArrowRight className="w-5 h-5 ml-2" />}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {form.showCityPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Select City</h3>
              <button
                type="button"
                onClick={() => { form.setShowCityPicker(false); form.setCitySearchQuery(""); }}
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
                  value={form.citySearchQuery}
                  onChange={(e) => form.setCitySearchQuery(e.target.value)}
                  placeholder="Search city..."
                  className="h-10 pl-9 bg-background/50 border border-border rounded-lg text-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {sellCitiesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
              ) : form.filteredSellCities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No cities found</p>
              ) : (
                <>
                  {form.filteredSellCities.some((c) => c.inspection_available === "1") && (
                    <div className="px-3 py-2">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">Inspection Available</span>
                    </div>
                  )}
                  {form.filteredSellCities.map((city) => {
                    const isInspectionCity = city.inspection_available === "1";
                    const isFirstNonInspection = !isInspectionCity &&
                      form.filteredSellCities.indexOf(city) > 0 &&
                      form.filteredSellCities[form.filteredSellCities.indexOf(city) - 1]?.inspection_available === "1";
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
                            form.updateField("location", city.city_name);
                            form.updateField("cityNumericId", city.city_id);
                            form.setSelectedCityInspectionAvailable(isInspectionCity);
                            form.setShowCityPicker(false);
                            form.setCitySearchQuery("");
                            if (isInspectionCity) {
                              setTimeout(() => { form.setDirection(1); form.setCurrentStep("success"); form.setActiveSuccessStep(2); }, 400);
                            } else {
                              setTimeout(() => { form.setDirection(1); form.goNext(); }, 400);
                            }
                          }}
                          className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                            form.formData.cityNumericId === city.city_id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                          }`}
                        >
                          <MapPin className={`w-4 h-4 flex-shrink-0 ${isInspectionCity ? "text-primary" : "text-muted-foreground/50"}`} />
                          <span className={`flex-1 ${isInspectionCity ? "font-semibold text-foreground" : "font-normal text-muted-foreground"}`}>
                            {city.city_name}
                          </span>
                          {isInspectionCity && (
                            <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">Inspection</span>
                          )}
                          {form.formData.cityNumericId === city.city_id && <Check className="w-4 h-4 text-primary" />}
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
