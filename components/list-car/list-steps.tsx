"use client";

import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Car,
  Search,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Fuel,
  Calendar,
  Gauge,
  Palette,
  IndianRupee,
  Camera,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import type { VehicleDetails, Make, Model, Variant, FuelType, YearOption, SellCity } from "@lib/api";

type FormStep =
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

const OWNER_OPTIONS = [
  "1st Owner",
  "2nd Owner",
  "3rd Owner",
  "4th Owner",
  "5th+ Owner",
];

const TRANSMISSION_OPTIONS = ["Manual", "Automatic", "CVT", "DCT", "AMT"];

interface ListStepsProps {
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

export function ListSteps({
  currentStep,
  formData,
  updateField,
  searchQuery,
  setSearchQuery,
  vehicleData,
  filteredMakes,
  makesLoading,
  selectMake,
  filteredModels,
  modelsLoading,
  selectModel,
  fuelTypes,
  fuelTypesLoading,
  years,
  yearsLoading,
  filteredVariants,
  variantsLoading,
  selectVariant,
  showCityPicker,
  setShowCityPicker,
  citySearchQuery,
  setCitySearchQuery,
  filteredSellCities,
  sellCitiesLoading,
  uploadedImages,
  handleImageUpload,
  removeImage,
  isUploading,
}: ListStepsProps) {
  return (
    <>
      {currentStep === "vehicle-number" && (
        <div className="space-y-6">
          <div className="relative">
            <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <Input
              data-testid="input-vehicle-number"
              value={formData.vehicleNumber}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
                updateField("vehicleNumber", val.replace(/  +/g, " "));
              }}
              placeholder="MH 02 AB 1234"
              className="h-16 pl-14 text-2xl font-mono tracking-widest uppercase text-center bg-background/50 border-2 border-border focus:border-primary rounded-2xl text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <p className="text-center text-muted-foreground text-sm">
            We'll auto-fill details if found, or you can enter manually
          </p>
        </div>
      )}

      {currentStep === "brand" && (
        <div className="space-y-4">
          {vehicleData && formData.brand && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-medium">Auto-filled: {formData.brand}</span>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand..."
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {makesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              filteredMakes.map((make) => (
                <button
                  key={make.id}
                  type="button"
                  onClick={() => selectMake(make)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 ${
                    formData.makeId === make.id
                      ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {make.make_image && (
                    <img src={make.make_image} alt={make.make_name} className="w-10 h-10 object-contain" />
                  )}
                  <span className="text-lg font-medium">{make.make_name}</span>
                  {formData.makeId === make.id && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {currentStep === "model" && (
        <div className="space-y-4">
          {vehicleData && formData.model && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Auto-filled: {formData.model}</span>
            </div>
          )}
          <div className="text-center mb-4">
            <span className="text-muted-foreground">Brand: </span>
            <span className="text-primary font-semibold">{formData.brand}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model..."
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {modelsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredModels.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No models found</p>
            ) : (
              filteredModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => selectModel(model)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    formData.modelId === model.id
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-lg font-medium">{model.model_name}</span>
                  {formData.modelId === model.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {currentStep === "fuel-year" && (
        <div className="space-y-6">
          {vehicleData && (formData.fuelType || formData.year > 0) && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">
                Auto-filled: {formData.fuelType && formData.fuelType} {formData.year > 0 && `• ${formData.year}`}
              </span>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-3 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-primary" /> Fuel Type
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fuelTypesLoading ? (
                <div className="col-span-full flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                fuelTypes.map((fuel) => (
                  <button
                    key={fuel.id}
                    type="button"
                    onClick={() => updateField("fuelType", fuel.fuel_type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.fuelType.toLowerCase() === fuel.fuel_type.toLowerCase()
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {fuel.fuel_type}
                  </button>
                ))
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Manufacturing Year
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {yearsLoading ? (
                <div className="col-span-full flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                years.map((y) => (
                  <button
                    key={y.id}
                    type="button"
                    onClick={() => updateField("year", y.year)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.year === y.year
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {y.year}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {currentStep === "variant" && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <span className="text-muted-foreground">{formData.brand} {formData.model} • </span>
            <span className="text-primary font-semibold">{formData.fuelType}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search variant..."
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {variantsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredVariants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No variants found</p>
                <Input
                  value={formData.variant}
                  onChange={(e) => updateField("variant", e.target.value)}
                  placeholder="Enter variant manually..."
                  className="h-14 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
                />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { updateField("variantId", 0); updateField("variant", ""); }}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    !formData.variant
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-lg font-medium">Skip (Not Sure)</span>
                </button>
                {filteredVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => selectVariant(variant)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      formData.variantId === variant.id
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <span className="text-lg font-medium">{variant.variant_name}</span>
                    {formData.variantId === variant.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {currentStep === "km-transmission" && (
        <div className="space-y-6">
          <div className="relative">
            <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-kilometers"
              type="number"
              value={formData.kilometers || ""}
              onChange={(e) => updateField("kilometers", parseInt(e.target.value) || 0)}
              placeholder="Kilometers Driven"
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div>
            <p className="text-muted-foreground mb-3">Transmission</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRANSMISSION_OPTIONS.map((trans) => (
                <button
                  key={trans}
                  type="button"
                  data-testid={`transmission-${trans.toLowerCase()}`}
                  onClick={() => updateField("transmission", trans)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.transmission === trans
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === "color-owners" && (
        <div className="space-y-6">
          <div className="relative">
            <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-color"
              value={formData.color}
              onChange={(e) => updateField("color", e.target.value)}
              placeholder="Car Color (e.g., White, Black)"
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div>
            <p className="text-muted-foreground mb-3">Number of Owners</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {OWNER_OPTIONS.map((owner, index) => (
                <button
                  key={owner}
                  type="button"
                  data-testid={`owner-${index + 1}`}
                  onClick={() => updateField("ownerCount", index + 1)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.ownerCount === index + 1
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {owner}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === "location" && (
        <div className="space-y-6">
          <button
            type="button"
            data-testid="button-select-city"
            onClick={() => setShowCityPicker(true)}
            className="w-full h-14 px-4 flex items-center gap-3 bg-background/50 border-2 border-border hover:border-primary rounded-xl text-left transition-colors"
          >
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <span className={`text-lg flex-1 ${formData.location ? "text-foreground" : "text-muted-foreground"}`}>
              {formData.location || "Select city"}
            </span>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>

          {showCityPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  ) : filteredSellCities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No cities found</p>
                  ) : (
                    filteredSellCities.map((city) => (
                      <button
                        key={city.city_id}
                        type="button"
                        data-testid={`city-option-${city.city_id}`}
                        onClick={() => {
                          updateField("location", city.city_name);
                          updateField("cityNumericId", city.city_id);
                          setShowCityPicker(false);
                          setCitySearchQuery("");
                        }}
                        className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                          formData.cityNumericId === city.city_id
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <MapPin className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-foreground">{city.city_name}</span>
                        {formData.cityNumericId === city.city_id && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === "price" && (
        <div className="space-y-6">
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <Input
              data-testid="input-price"
              type="number"
              value={formData.expectedPrice || ""}
              onChange={(e) => updateField("expectedPrice", parseInt(e.target.value) || 0)}
              placeholder="Listing Price"
              className="h-16 pl-14 text-2xl bg-background/50 border-2 border-border focus:border-primary rounded-2xl text-foreground"
            />
          </div>
          {formData.expectedPrice > 0 && (
            <p className="text-center text-2xl font-bold text-primary">
              ₹{formData.expectedPrice.toLocaleString("en-IN")}
            </p>
          )}
          <Textarea
            data-testid="input-description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Additional details about the car (optional)"
            className="min-h-24 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground resize-none"
          />
        </div>
      )}

      {currentStep === "photos" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedImages.map((imagePath, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <img
                  src={`/api/objects/${imagePath}`}
                  alt={`Car photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {uploadedImages.length < 10 && (
              <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-background/30">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground text-sm">Add Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Add up to 10 photos • {uploadedImages.length}/10 uploaded
          </p>
        </div>
      )}

      {currentStep === "seller-info" && (
        <div className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-seller-name"
              value={formData.sellerName}
              onChange={(e) => updateField("sellerName", e.target.value)}
              placeholder="Contact Name"
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-seller-phone"
              value={formData.sellerPhone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                updateField("sellerPhone", val);
              }}
              placeholder="Phone Number"
              inputMode="numeric"
              maxLength={10}
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-seller-email"
              type="email"
              value={formData.sellerEmail}
              onChange={(e) => updateField("sellerEmail", e.target.value)}
              placeholder="Email (optional)"
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
        </div>
      )}
    </>
  );
}
