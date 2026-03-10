"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { lookupVehicle, type VehicleDetails, type NxcarColor, type NxcarCity, type SellCity } from "@lib/api";
import type { FormStep } from "@components/sell-car/sell-constants";
import type { SellFormData } from "./use-sell-car-form";

interface UseVehicleLookupParams {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  colors: NxcarColor[];
  nxcarCities: NxcarCity[];
  sellCities: SellCity[];
  autoFilledSteps: React.MutableRefObject<Set<FormStep>>;
  setCurrentStep: (step: FormStep) => void;
  setUseCustomColor: (v: boolean) => void;
  setCustomColorText: (v: string) => void;
  goNext: () => void;
  toast: (opts: { title: string; description?: string; variant?: "destructive" | "default" }) => void;
}

export function useVehicleLookup({
  formData, setFormData, colors, nxcarCities, sellCities,
  autoFilledSteps, setCurrentStep, setUseCustomColor, setCustomColorText,
  goNext, toast,
}: UseVehicleLookupParams) {
  const searchParams = useSearchParams();
  const [vehicleData, setVehicleData] = useState<VehicleDetails | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const autoLookupTriggered = useRef(false);

  const findFirstIncompleteStep = (data: SellFormData): FormStep => {
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
      const newFormData: SellFormData = {
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
      if (newFormData.color) {
        autoFilledSteps.current.add("color");
        const colorInList = colors.some((c) => c.name.trim().toLowerCase() === newFormData.color.trim().toLowerCase());
        if (!colorInList && colors.length > 0) {
          setUseCustomColor(true);
          setCustomColorText(newFormData.color);
        }
      }
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

  const handleLookup = () => {
    if (!formData.vehicleNumber.trim()) { goNext(); return; }
    setIsLookingUp(true);
    vehicleLookupMutation.mutate(formData.vehicleNumber.replace(/\s/g, "").trim());
  };

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

  return {
    vehicleData,
    isLookingUp,
    handleLookup,
  };
}
