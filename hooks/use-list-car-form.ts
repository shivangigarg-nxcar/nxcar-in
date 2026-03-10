"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useToast } from "@hooks/use-toast";
import { useUpload } from "@hooks/use-upload";
import { useAuth } from "@hooks/use-auth";
import {
  lookupVehicle,
  sellCar,
  createCarListing,
  getCities,
  getSellCities,
  type VehicleDetails,
  type NxcarCity,
  getMakes,
  getModels,
  getYears,
  getFuelTypes,
  getVariants,
  type Make,
  type Model,
  type Variant,
} from "@lib/api";
import {
  type FormStep,
  type ListCarFormData,
  STEPS,
  INITIAL_FORM_DATA,
} from "@components/list-car/list-constants";

export function useListCarForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, isDealer, isLoading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingSubmitAfterLogin = useRef(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("vehicle-number");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const autoLookupTriggered = useRef(false);
  const [vehicleData, setVehicleData] = useState<VehicleDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedVehicleId, setSubmittedVehicleId] = useState("");

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      if (uploadedImages.length < 10) {
        setUploadedImages((prev) => [...prev, response.objectPath]);
      }
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<ListCarFormData>(INITIAL_FORM_DATA);

  const [direction, setDirection] = useState(1);

  const { data: makes = [], isLoading: makesLoading } = useQuery({
    queryKey: ["makes"],
    queryFn: getMakes,
  });

  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ["models", formData.makeId],
    queryFn: () => getModels(formData.makeId),
    enabled: formData.makeId > 0,
  });

  const { data: years = [], isLoading: yearsLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const { data: fuelTypes = [], isLoading: fuelTypesLoading } = useQuery({
    queryKey: ["fuelTypes"],
    queryFn: getFuelTypes,
  });

  const { data: variants = [], isLoading: variantsLoading } = useQuery({
    queryKey: ["variants", formData.modelId, formData.fuelType],
    queryFn: () => getVariants(formData.modelId, formData.fuelType),
    enabled: formData.modelId > 0 && !!formData.fuelType,
  });

  const { data: nxcarCities = [] } = useQuery({
    queryKey: ["nxcarCities"],
    queryFn: getCities,
    staleTime: 3600000,
  });

  const { data: sellCities = [], isLoading: sellCitiesLoading } = useQuery({
    queryKey: ["sellCities"],
    queryFn: getSellCities,
    staleTime: 3600000,
  });

  const filteredSellCities = useMemo(() => {
    const query = citySearchQuery.toLowerCase().trim();
    return query
      ? sellCities.filter((c) => c.city_name.toLowerCase().includes(query))
      : sellCities;
  }, [sellCities, citySearchQuery]);

  const getCityId = (location: string): string => {
    if (formData.cityNumericId) return formData.cityNumericId;
    const normalizedLocation = location.toLowerCase().trim();
    for (const city of nxcarCities) {
      if (
        normalizedLocation.includes(city.city_name.toLowerCase()) ||
        city.city_name.toLowerCase().includes(normalizedLocation)
      ) {
        return city.city_id;
      }
    }
    return "94";
  };

  const findFirstIncompleteStep = (data: ListCarFormData): FormStep => {
    if (!data.makeId || !data.brand) return "brand";
    if (!data.modelId || !data.model) return "model";
    if (!data.fuelType || !data.year) return "fuel-year";
    if (data.variantId && data.variant) {
      return "km-transmission";
    }
    return "variant";
  };

  const vehicleLookupMutation = useMutation({
    mutationFn: lookupVehicle,
    onSuccess: (data) => {
      setVehicleData(data);
      const registrationYear = data.year || data.all?.vehicleManufacturingMonthYear?.split("/")[1] || "";
      const mfgYear = data.all?.vehicleManufacturingMonthYear?.split("/")[1] || data.year || "";

      const locationFromAddress = data.all?.presentAddress?.split(",")[0]?.trim() || "";
      let matchedCityId = "";
      if (locationFromAddress && nxcarCities.length > 0) {
        const normalizedLoc = locationFromAddress.toLowerCase();
        const matchedCity = nxcarCities.find(c =>
          normalizedLoc.includes(c.city_name.toLowerCase()) ||
          c.city_name.toLowerCase().includes(normalizedLoc)
        );
        if (matchedCity) matchedCityId = matchedCity.city_id;
      }

      const newFormData: ListCarFormData = {
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
        ownerCount: parseInt(data.ownership || data.all?.ownerCount || "1") || 1,
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

      toast({
        title: "Vehicle Found!",
        description: `Auto-filled details: ${newFormData.brand} ${newFormData.model}`,
      });

      const nextStep = findFirstIncompleteStep(newFormData);
      setCurrentStep(nextStep);
    },
    onError: () => {
      setIsLookingUp(false);
      toast({
        title: "Not Found",
        description: "Please enter details manually.",
        variant: "destructive",
      });
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

  const sellCarMutation = useMutation({
    mutationFn: sellCar,
    onSuccess: (data) => {
      if (data?.vehicle_id) setSubmittedVehicleId(String(data.vehicle_id));
      setCurrentStep("success");
      createCarListing({
        vehicleNumber: formData.vehicleNumber,
        brand: formData.brand,
        model: formData.model,
        variant: formData.variant,
        year: formData.year,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        kilometers: formData.kilometers,
        color: formData.color,
        ownerCount: formData.ownerCount,
        location: formData.location,
        state: formData.state,
        rtoCode: formData.rtoCode,
        expectedPrice: formData.expectedPrice,
        description: formData.description,
        imageUrls: uploadedImages.length > 0 ? uploadedImages : null,
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        sellerEmail: formData.sellerEmail,
      }).catch(() => {});
      toast({
        title: "Car Listed Successfully!",
        description: data?.message || "Your car has been listed on Nxcar.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Listing Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLookup = () => {
    if (!formData.vehicleNumber.trim()) {
      goNext();
      return;
    }
    setIsLookingUp(true);
    vehicleLookupMutation.mutate(formData.vehicleNumber.replace(/\s/g, "").trim());
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - uploadedImages.length;
    if (remaining <= 0) {
      toast({ title: "Max 10 images", variant: "destructive" });
      return;
    }
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.type.startsWith("image/")) {
        await uploadFile(file);
      }
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const doSubmit = () => {
    const resolvedCityId = formData.cityNumericId || getCityId(formData.location);
    const sellData: Record<string, any> = {
      vehicle_number: formData.vehicleNumber,
      vehicle_no: formData.vehicleNumber,
      make: formData.brand,
      make_id: formData.makeId ? String(formData.makeId) : "",
      model: formData.model,
      model_id: formData.modelId ? String(formData.modelId) : "",
      variant: formData.variant,
      variant_id: formData.variantId ? String(formData.variantId) : "",
      year: formData.year ? String(formData.year) : "",
      manufacturing_year: formData.manufacturingYear || (formData.year ? String(formData.year) : ""),
      fule_type: formData.fuelType.toLowerCase(),
      fule_id: formData.fuleId || "",
      transmission: formData.transmission.toLowerCase(),
      mileage: formData.kilometers ? String(formData.kilometers) : "",
      color: formData.color,
      color_name: formData.color,
      color_id: "",
      ownership: formData.ownerCount ? String(formData.ownerCount) : "1",
      city: resolvedCityId,
      city_id: "",
      city_name: formData.location,
      state_id: formData.stateNumericId || formData.state,
      state_name: formData.state,
      state_code: formData.rtoCode,
      rto_id: formData.rtoNumericId || formData.rtoCode,
      rto_code: formData.rtoCode,
      rto_state_id: formData.stateNumericId || "",
      rto_state_name: formData.state,
      expected_selling_price: formData.expectedPrice ? String(formData.expectedPrice) : "",
      price: formData.expectedPrice ? String(formData.expectedPrice) : "0",
      seller_name: formData.sellerName,
      seller_phone: formData.sellerPhone,
      seller_email: formData.sellerEmail,
      seller_address: "",
      vehicletype_id: 1,
      page_name: "dealer-list-car",
      hidden_number_plate: 0,
      is_variant_found: formData.variantId > 0,
      time: "",
      car_additional_fuel: "",
      description: formData.description,
      image_urls: uploadedImages,
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
      setTimeout(() => {
        doSubmit();
      }, 500);
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = currentStep === "success" ? 100 : ((currentStepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
      setSearchQuery("");
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
      setSearchQuery("");
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "vehicle-number": return true;
      case "brand": return formData.makeId > 0;
      case "model": return formData.modelId > 0;
      case "fuel-year": return !!formData.fuelType && formData.year > 0;
      case "variant": return true;
      case "km-transmission": return formData.kilometers > 0 && !!formData.transmission;
      case "color-owners": return true;
      case "location": return !!formData.location;
      case "price": return formData.expectedPrice > 0;
      case "photos": return true;
      case "seller-info": return !!formData.sellerName && !!formData.sellerPhone;
      default: return false;
    }
  };

  const handleNext = () => {
    setDirection(1);
    if (currentStep === "vehicle-number") {
      handleLookup();
    } else if (currentStep === "seller-info") {
      handleSubmit();
    } else {
      goNext();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    goBack();
  };

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM_DATA });
    setUploadedImages([]);
    setVehicleData(null);
    setSearchQuery("");
    setShowCityPicker(false);
    setCitySearchQuery("");
    setSubmittedVehicleId("");
    setCurrentStep("vehicle-number");
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
  };

  const selectModel = (model: Model) => {
    updateField("modelId", model.id);
    updateField("model", model.model_name);
    updateField("variantId", 0);
    updateField("variant", "");
    setSearchQuery("");
  };

  const selectVariant = (variant: Variant) => {
    updateField("variantId", variant.id);
    updateField("variant", variant.variant_name);
    setSearchQuery("");
  };

  return {
    authLoading,
    isAuthenticated,
    isDealer,
    showLoginModal,
    setShowLoginModal,
    pendingSubmitAfterLogin,
    handleLoginSuccess,

    currentStep,
    currentStepIndex,
    progress,
    direction,
    formData,
    updateField,
    vehicleData,
    searchQuery,
    setSearchQuery,
    submittedVehicleId,
    isLookingUp,

    showCityPicker,
    setShowCityPicker,
    citySearchQuery,
    setCitySearchQuery,

    uploadedImages,
    isUploading,
    handleImageUpload,
    removeImage,

    makes,
    makesLoading,
    filteredMakes,
    selectMake,
    models,
    modelsLoading,
    filteredModels,
    selectModel,
    fuelTypes,
    fuelTypesLoading,
    years,
    yearsLoading,
    variants,
    variantsLoading,
    filteredVariants,
    selectVariant,
    filteredSellCities,
    sellCitiesLoading,

    canProceed,
    handleNext,
    handleBack,
    resetForm,
    sellCarMutation,
  };
}
