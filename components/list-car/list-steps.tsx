"use client";

import type { VehicleDetails, Make, Model, Variant, FuelType, YearOption, SellCity } from "@lib/api";
import type { FormStep } from "@components/list-car/list-constants";
import { VehicleNumberStep } from "./steps/vehicle-number-step";
import { BrandStep } from "./steps/brand-step";
import { ModelStep } from "./steps/model-step";
import { FuelYearStep } from "./steps/fuel-year-step";
import { VariantStep } from "./steps/variant-step";
import { KmTransmissionStep } from "./steps/km-transmission-step";
import { ColorOwnersStep } from "./steps/color-owners-step";
import { LocationStep } from "./steps/location-step";
import { PriceStep } from "./steps/price-step";
import { PhotosStep } from "./steps/photos-step";
import { SellerInfoStep } from "./steps/seller-info-step";

export interface ListStepsProps {
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
    cityNumericId: string;
    expectedPrice: number;
    description: string;
    sellerName: string;
    sellerPhone: string;
    sellerEmail: string;
  };
  updateField: (field: string, value: any) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  vehicleData: VehicleDetails | null;
  filteredMakes: Make[];
  makesLoading: boolean;
  selectMake: (make: Make) => void;
  filteredModels: Model[];
  modelsLoading: boolean;
  selectModel: (model: Model) => void;
  fuelTypes: FuelType[];
  fuelTypesLoading: boolean;
  years: YearOption[];
  yearsLoading: boolean;
  filteredVariants: Variant[];
  variantsLoading: boolean;
  selectVariant: (variant: Variant) => void;
  showCityPicker: boolean;
  setShowCityPicker: (v: boolean) => void;
  citySearchQuery: string;
  setCitySearchQuery: (q: string) => void;
  filteredSellCities: SellCity[];
  sellCitiesLoading: boolean;
  uploadedImages: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: (index: number) => void;
  isUploading: boolean;
}

export function ListSteps(props: ListStepsProps) {
  const { currentStep } = props;

  return (
    <>
      {currentStep === "vehicle-number" && (
        <VehicleNumberStep
          vehicleNumber={props.formData.vehicleNumber}
          updateField={props.updateField}
        />
      )}
      {currentStep === "brand" && (
        <BrandStep
          formData={props.formData}
          vehicleData={props.vehicleData}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          filteredMakes={props.filteredMakes}
          makesLoading={props.makesLoading}
          selectMake={props.selectMake}
        />
      )}
      {currentStep === "model" && (
        <ModelStep
          formData={props.formData}
          vehicleData={props.vehicleData}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          filteredModels={props.filteredModels}
          modelsLoading={props.modelsLoading}
          selectModel={props.selectModel}
        />
      )}
      {currentStep === "fuel-year" && (
        <FuelYearStep
          formData={props.formData}
          vehicleData={props.vehicleData}
          updateField={props.updateField}
          fuelTypes={props.fuelTypes}
          fuelTypesLoading={props.fuelTypesLoading}
          years={props.years}
          yearsLoading={props.yearsLoading}
        />
      )}
      {currentStep === "variant" && (
        <VariantStep
          formData={props.formData}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          filteredVariants={props.filteredVariants}
          variantsLoading={props.variantsLoading}
          selectVariant={props.selectVariant}
          updateField={props.updateField}
        />
      )}
      {currentStep === "km-transmission" && (
        <KmTransmissionStep
          formData={props.formData}
          updateField={props.updateField}
        />
      )}
      {currentStep === "color-owners" && (
        <ColorOwnersStep
          formData={props.formData}
          updateField={props.updateField}
        />
      )}
      {currentStep === "location" && (
        <LocationStep
          formData={props.formData}
          updateField={props.updateField}
          showCityPicker={props.showCityPicker}
          setShowCityPicker={props.setShowCityPicker}
          citySearchQuery={props.citySearchQuery}
          setCitySearchQuery={props.setCitySearchQuery}
          filteredSellCities={props.filteredSellCities}
          sellCitiesLoading={props.sellCitiesLoading}
        />
      )}
      {currentStep === "price" && (
        <PriceStep
          formData={props.formData}
          updateField={props.updateField}
        />
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
        <SellerInfoStep
          formData={props.formData}
          updateField={props.updateField}
        />
      )}
    </>
  );
}
