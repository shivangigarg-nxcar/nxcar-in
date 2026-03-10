"use client";

import React from "react";
import type { VehicleDetails, Make, Model, YearOption, FuelType, Variant, NxcarColor, SellCity } from "@lib/api";
import type { FormStep } from "./sell-constants";
import { VehicleNumberStep } from "./steps/vehicle-number-step";
import { BrandStep } from "./steps/brand-step";
import { ModelStep } from "./steps/model-step";
import { RtoLocationStep } from "./steps/rto-location-step";
import { YearStep } from "./steps/year-step";
import { OwnershipStep } from "./steps/ownership-step";
import { ColorStep } from "./steps/color-step";
import { FuelVariantStep } from "./steps/fuel-variant-step";
import { TransmissionStep } from "./steps/transmission-step";
import { KilometersStep } from "./steps/kilometers-step";
import { VehicleLocationStep } from "./steps/vehicle-location-step";
import { PriceStep } from "./steps/price-step";
import { PhotosStep } from "./steps/photos-step";
import { SellerInfoStep } from "./steps/seller-info-step";

export interface SellStepsProps {
  currentStep: FormStep;
  formData: {
    vehicleNumber: string;
    makeId: number;
    brand: string;
    modelId: number;
    model: string;
    variantId: number;
    variant: string;
    year: number;
    fuelType: string;
    transmission: string;
    kilometers: number;
    color: string;
    ownerCount: number;
    location: string;
    state: string;
    rtoCode: string;
    expectedPrice: number;
    description: string;
    sellerName: string;
    sellerPhone: string;
    sellerEmail: string;
    cityNumericId: string;
  };
  updateField: (field: string, value: any) => void;
  vehicleData: VehicleDetails | null;
  autoFilledSteps: React.MutableRefObject<Set<FormStep>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  makes: Make[];
  makesLoading: boolean;
  filteredMakes: Make[];
  selectMake: (make: Make) => void;
  models: Model[];
  modelsLoading: boolean;
  filteredModels: Model[];
  selectModel: (model: Model) => void;
  years: YearOption[];
  yearsLoading: boolean;
  fuelTypes: FuelType[];
  fuelTypesLoading: boolean;
  colors: NxcarColor[];
  variants: Variant[];
  variantsLoading: boolean;
  filteredVariants: Variant[];
  useCustomColor: boolean;
  setUseCustomColor: (v: boolean) => void;
  customColorText: string;
  setCustomColorText: (v: string) => void;
  variantNotFound: boolean;
  setVariantNotFound: (v: boolean) => void;
  uploadedImages: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isUploading: boolean;
  selectedCityInspectionAvailable: boolean;
  showCityPicker: boolean;
  setShowCityPicker: (v: boolean) => void;
}

export function SellSteps(props: SellStepsProps) {
  const { currentStep } = props;

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
      {currentStep === "vehicle-number" && (
        <VehicleNumberStep formData={props.formData} updateField={props.updateField} />
      )}
      {currentStep === "brand" && (
        <BrandStep
          formData={props.formData}
          vehicleData={props.vehicleData}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          makesLoading={props.makesLoading}
          filteredMakes={props.filteredMakes}
          selectMake={props.selectMake}
        />
      )}
      {currentStep === "model" && (
        <ModelStep
          formData={props.formData}
          vehicleData={props.vehicleData}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          modelsLoading={props.modelsLoading}
          filteredModels={props.filteredModels}
          selectModel={props.selectModel}
        />
      )}
      {currentStep === "rto-location" && (
        <RtoLocationStep
          formData={props.formData}
          updateField={props.updateField}
          autoFilledSteps={props.autoFilledSteps}
        />
      )}
      {currentStep === "year" && (
        <YearStep
          formData={props.formData}
          updateField={props.updateField}
          autoFilledSteps={props.autoFilledSteps}
          years={props.years}
          yearsLoading={props.yearsLoading}
        />
      )}
      {currentStep === "ownership" && (
        <OwnershipStep formData={props.formData} updateField={props.updateField} />
      )}
      {currentStep === "color" && (
        <ColorStep
          formData={props.formData}
          updateField={props.updateField}
          autoFilledSteps={props.autoFilledSteps}
          colors={props.colors}
          useCustomColor={props.useCustomColor}
          setUseCustomColor={props.setUseCustomColor}
          customColorText={props.customColorText}
          setCustomColorText={props.setCustomColorText}
        />
      )}
      {currentStep === "fuel-variant" && (
        <FuelVariantStep
          formData={props.formData}
          updateField={props.updateField}
          autoFilledSteps={props.autoFilledSteps}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          fuelTypes={props.fuelTypes}
          fuelTypesLoading={props.fuelTypesLoading}
          variants={props.variants}
          variantsLoading={props.variantsLoading}
          filteredVariants={props.filteredVariants}
          variantNotFound={props.variantNotFound}
          setVariantNotFound={props.setVariantNotFound}
        />
      )}
      {currentStep === "transmission" && (
        <TransmissionStep formData={props.formData} updateField={props.updateField} />
      )}
      {currentStep === "kilometers" && (
        <KilometersStep formData={props.formData} updateField={props.updateField} />
      )}
      {currentStep === "vehicle-location" && (
        <VehicleLocationStep
          formData={props.formData}
          selectedCityInspectionAvailable={props.selectedCityInspectionAvailable}
          setShowCityPicker={props.setShowCityPicker}
        />
      )}
      {currentStep === "price" && (
        <PriceStep formData={props.formData} updateField={props.updateField} />
      )}
      {currentStep === "photos" && (
        <PhotosStep
          uploadedImages={props.uploadedImages}
          handleImageUpload={props.handleImageUpload}
          removeImage={props.removeImage}
          isUploading={props.isUploading}
        />
      )}
      {currentStep === "seller-info" && (
        <SellerInfoStep formData={props.formData} updateField={props.updateField} />
      )}
    </div>
  );
}
