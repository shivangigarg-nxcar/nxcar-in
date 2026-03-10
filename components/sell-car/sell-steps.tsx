"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import type { VehicleDetails, Make, Model, YearOption, FuelType, Variant, NxcarColor, SellCity } from "@lib/api";
import { useQuery } from "@tanstack/react-query";
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
  Gauge,
  Palette,
  IndianRupee,
  Camera,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { OWNER_OPTIONS, TRANSMISSION_OPTIONS, type FormStep } from "./sell-constants";

interface NxcarState {
  state_id: string;
  state_name: string;
}

interface NxcarRto {
  rto_id: string;
  state_code: string;
  rto_number: string;
  rto_location: string;
}

interface SellStepsProps {
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

export function SellSteps({
  currentStep,
  formData,
  updateField,
  vehicleData,
  autoFilledSteps,
  searchQuery,
  setSearchQuery,
  makes,
  makesLoading,
  filteredMakes,
  selectMake,
  models,
  modelsLoading,
  filteredModels,
  selectModel,
  years,
  yearsLoading,
  fuelTypes,
  fuelTypesLoading,
  colors,
  variants,
  variantsLoading,
  filteredVariants,
  useCustomColor,
  setUseCustomColor,
  customColorText,
  setCustomColorText,
  variantNotFound,
  setVariantNotFound,
  uploadedImages,
  handleImageUpload,
  removeImage,
  isUploading,
  selectedCityInspectionAvailable,
  showCityPicker,
  setShowCityPicker,
}: SellStepsProps) {
  const [stateSearch, setStateSearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(true);
  const [rtoSearch, setRtoSearch] = useState("");
  const [rtoDropdownOpen, setRtoDropdownOpen] = useState(true);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(!formData.brand);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(!formData.model);
  const [variantDropdownOpen, setVariantDropdownOpen] = useState(!formData.variant);

  React.useEffect(() => {
    if (currentStep === "brand") setBrandDropdownOpen(!formData.brand);
    if (currentStep === "model") setModelDropdownOpen(!formData.model);
    if (currentStep === "fuel-variant") setVariantDropdownOpen(!formData.variant);
  }, [currentStep]);

  const { data: nxcarStates = [], isLoading: statesLoading } = useQuery<NxcarState[]>({
    queryKey: ["nxcar-states"],
    queryFn: async () => {
      const res = await fetch("/api/nxcar/states");
      if (!res.ok) throw new Error("Failed to fetch states");
      return res.json();
    },
    staleTime: 3600000,
    enabled: currentStep === "rto-location",
  });

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return nxcarStates;
    const q = stateSearch.toLowerCase();
    return nxcarStates.filter((s) => s.state_name.toLowerCase().includes(q));
  }, [nxcarStates, stateSearch]);

  const selectedStateId = useMemo(() => {
    const found = nxcarStates.find((s) => s.state_name === formData.state);
    return found?.state_id || "";
  }, [nxcarStates, formData.state]);

  const { data: nxcarRtos = [], isLoading: rtosLoading } = useQuery<NxcarRto[]>({
    queryKey: ["nxcar-rtos", selectedStateId],
    queryFn: async () => {
      const res = await fetch(`/api/nxcar/rto?state_id=${selectedStateId}`);
      if (!res.ok) throw new Error("Failed to fetch RTOs");
      return res.json();
    },
    staleTime: 3600000,
    enabled: currentStep === "rto-location" && !!selectedStateId,
  });

  const filteredRtos = useMemo(() => {
    if (!rtoSearch.trim()) return nxcarRtos;
    const q = rtoSearch.toLowerCase();
    return nxcarRtos.filter((r) =>
      r.rto_location.toLowerCase().includes(q) ||
      `${r.state_code}${r.rto_number}`.toLowerCase().includes(q)
    );
  }, [nxcarRtos, rtoSearch]);

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
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
          {vehicleData && formData.brand && !brandDropdownOpen && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-medium">Auto-filled: {formData.brand}</span>
            </div>
          )}
          <div className="relative cursor-pointer" onClick={() => { if (!brandDropdownOpen) { setBrandDropdownOpen(true); setSearchQuery(""); } }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={brandDropdownOpen ? searchQuery : formData.brand || ""}
              onChange={(e) => { setSearchQuery(e.target.value); if (!brandDropdownOpen) setBrandDropdownOpen(true); }}
              onFocus={() => { if (!brandDropdownOpen) { setBrandDropdownOpen(true); setSearchQuery(""); } }}
              placeholder={formData.brand || "Search brand..."}
              readOnly={!brandDropdownOpen}
              className={`h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!brandDropdownOpen ? "cursor-pointer" : ""}`}
            />
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${brandDropdownOpen ? "rotate-180" : ""}`} />
          </div>
          {brandDropdownOpen && (
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {makesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
              ) : (
                filteredMakes.map((make) => (
                  <button
                    key={make.id}
                    type="button"
                    onClick={() => { selectMake(make); setBrandDropdownOpen(false); setSearchQuery(""); }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 ${
                      formData.makeId === make.id
                        ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
                        : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {make.make_image && <img src={make.make_image} alt={make.make_name} className="w-10 h-10 object-contain" />}
                    <span className="text-lg font-medium">{make.make_name}</span>
                    {formData.makeId === make.id && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {currentStep === "model" && (
        <div className="space-y-4">
          {vehicleData && formData.model && !modelDropdownOpen && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Auto-filled: {formData.model}</span>
            </div>
          )}
          <div className="text-center mb-4">
            <span className="text-muted-foreground">Brand: </span>
            <span className="text-primary font-semibold">{formData.brand}</span>
          </div>
          <div className="relative cursor-pointer" onClick={() => { if (!modelDropdownOpen) { setModelDropdownOpen(true); setSearchQuery(""); } }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={modelDropdownOpen ? searchQuery : formData.model || ""}
              onChange={(e) => { setSearchQuery(e.target.value); if (!modelDropdownOpen) setModelDropdownOpen(true); }}
              onFocus={() => { if (!modelDropdownOpen) { setModelDropdownOpen(true); setSearchQuery(""); } }}
              placeholder={formData.model || "Search model..."}
              readOnly={!modelDropdownOpen}
              className={`h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!modelDropdownOpen ? "cursor-pointer" : ""}`}
            />
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
          </div>
          {modelDropdownOpen && (
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {modelsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
              ) : filteredModels.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No models found</p>
              ) : (
                filteredModels.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => { selectModel(model); setModelDropdownOpen(false); setSearchQuery(""); }}
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
          )}
        </div>
      )}

      {currentStep === "rto-location" && (
        <div className="space-y-6">
          {autoFilledSteps.current.has("rto-location") && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Auto-filled: {formData.state} — {formData.rtoCode}</span>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Select State</p>
            <div className="relative mb-3 cursor-pointer" onClick={() => { if (!stateDropdownOpen) { setStateDropdownOpen(true); setStateSearch(""); } }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                data-testid="input-state-search"
                value={stateDropdownOpen ? stateSearch : formData.state || ""}
                onChange={(e) => { setStateSearch(e.target.value); if (!stateDropdownOpen) setStateDropdownOpen(true); }}
                onFocus={() => { if (!stateDropdownOpen) { setStateDropdownOpen(true); setStateSearch(""); } }}
                placeholder={formData.state || "Search state..."}
                readOnly={!stateDropdownOpen}
                className={`h-14 pl-12 pr-10 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!stateDropdownOpen ? "cursor-pointer" : ""}`}
              />
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${stateDropdownOpen ? "rotate-180" : ""}`} />
            </div>
            {stateDropdownOpen && (
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                {statesLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                ) : filteredStates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No states found</p>
                ) : (
                  filteredStates.map((s) => (
                    <button
                      key={s.state_id}
                      type="button"
                      data-testid={`state-${s.state_id}`}
                      onClick={() => { updateField("state", s.state_name); updateField("rtoCode", ""); setStateSearch(""); setStateDropdownOpen(false); setRtoSearch(""); setRtoDropdownOpen(true); }}
                      className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                        formData.state === s.state_name ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <span className="font-medium">{s.state_name}</span>
                      {formData.state === s.state_name && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {formData.state && (
            <div>
              <p className="text-muted-foreground mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-primary" /> Select RTO</p>
              <div className="relative mb-3 cursor-pointer" onClick={() => { if (!rtoDropdownOpen) { setRtoDropdownOpen(true); setRtoSearch(""); } }}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  data-testid="input-rto-search"
                  value={rtoDropdownOpen ? rtoSearch : formData.rtoCode || ""}
                  onChange={(e) => { setRtoSearch(e.target.value); if (!rtoDropdownOpen) setRtoDropdownOpen(true); }}
                  onFocus={() => { if (!rtoDropdownOpen) { setRtoDropdownOpen(true); setRtoSearch(""); } }}
                  placeholder={formData.rtoCode || "Search RTO code or location..."}
                  readOnly={!rtoDropdownOpen}
                  className={`h-14 pl-12 pr-10 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!rtoDropdownOpen ? "cursor-pointer" : ""}`}
                />
                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${rtoDropdownOpen ? "rotate-180" : ""}`} />
              </div>
              {rtoDropdownOpen && (
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                  {rtosLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                  ) : filteredRtos.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No RTOs found</p>
                  ) : (
                    filteredRtos.map((r) => {
                      const code = `${r.state_code}${r.rto_number}`;
                      return (
                        <button
                          key={r.rto_id}
                          type="button"
                          data-testid={`rto-${r.rto_id}`}
                          onClick={() => { updateField("rtoCode", code); setRtoSearch(""); setRtoDropdownOpen(false); }}
                          className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                            formData.rtoCode === code ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <div className="text-left">
                            <span className="font-bold text-sm">{code}</span>
                            <span className="text-xs text-muted-foreground ml-2">{r.rto_location}</span>
                          </div>
                          {formData.rtoCode === code && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {currentStep === "year" && (
        <div className="space-y-4">
          {autoFilledSteps.current.has("year") && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Auto-filled: {formData.year}</span>
            </div>
          )}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2">
            {yearsLoading ? (
              <div className="col-span-full flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
            ) : (
              years.map((y) => (
                <button
                  key={y.id}
                  type="button"
                  onClick={() => updateField("year", y.year)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    formData.year === y.year ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {y.year}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {currentStep === "ownership" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OWNER_OPTIONS.map((owner, index) => (
              <button
                key={owner}
                type="button"
                data-testid={`owner-${index + 1}`}
                onClick={() => updateField("ownerCount", index + 1)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.ownerCount === index + 1 ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                {owner}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "color" && (
        <div className="space-y-6">
          {autoFilledSteps.current.has("color") && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Auto-filled: {formData.color}</span>
            </div>
          )}
          {!useCustomColor && (
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-testid={`color-${c.id}`}
                  onClick={() => { updateField("color", c.name); setCustomColorText(""); }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    formData.color === c.name && !useCustomColor ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/50"
                  }`}
                >
                  <span
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${formData.color === c.name && !useCustomColor ? "border-primary ring-2 ring-primary/30" : "border-border/50"}`}
                    style={{ backgroundColor: c.code }}
                  />
                  <span className={`text-[10px] sm:text-xs font-medium leading-tight text-center ${formData.color === c.name && !useCustomColor ? "text-primary" : "text-foreground"}`}>
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            type="button"
            onClick={() => {
              setUseCustomColor(!useCustomColor);
              if (!useCustomColor) { updateField("color", ""); } else { setCustomColorText(""); updateField("color", ""); }
            }}
            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
              useCustomColor ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
            }`}
            data-testid="button-custom-color"
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Type your exact color here</span>
          </button>
          {useCustomColor && (
            <Input
              data-testid="input-custom-color"
              value={customColorText}
              onChange={(e) => { setCustomColorText(e.target.value); updateField("color", e.target.value); }}
              placeholder="Enter your car's exact color..."
              className="h-14 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
              autoFocus
            />
          )}
        </div>
      )}

      {currentStep === "fuel-variant" && (
        <div className="space-y-6">
          {autoFilledSteps.current.has("fuel-variant") && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Auto-filled: {formData.fuelType}{formData.variant ? ` • ${formData.variant}` : ""}</span>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-3 flex items-center gap-2"><Fuel className="w-4 h-4 text-primary" /> Fuel Type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fuelTypesLoading ? (
                <div className="col-span-full flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
              ) : (
                fuelTypes.map((fuel) => (
                  <button
                    key={fuel.id}
                    type="button"
                    onClick={() => {
                      if (formData.fuelType.toLowerCase() !== fuel.fuel_type.toLowerCase()) {
                        updateField("variantId", 0);
                        updateField("variant", "");
                        setVariantNotFound(false);
                        setSearchQuery("");
                      }
                      updateField("fuelType", fuel.fuel_type);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.fuelType.toLowerCase() === fuel.fuel_type.toLowerCase()
                        ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {fuel.fuel_type}
                  </button>
                ))
              )}
            </div>
          </div>
          {formData.fuelType && (
            <div>
              <p className="text-muted-foreground mb-3">Select Variant</p>
              <div className="relative mb-3 cursor-pointer" onClick={() => { if (!variantDropdownOpen) { setVariantDropdownOpen(true); setSearchQuery(""); } }}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={variantDropdownOpen ? searchQuery : formData.variant || ""}
                  onChange={(e) => { setSearchQuery(e.target.value); if (!variantDropdownOpen) setVariantDropdownOpen(true); }}
                  onFocus={() => { if (!variantDropdownOpen) { setVariantDropdownOpen(true); setSearchQuery(""); } }}
                  placeholder={formData.variant || "Search variant..."}
                  readOnly={!variantDropdownOpen}
                  className={`h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!variantDropdownOpen ? "cursor-pointer" : ""}`}
                />
                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${variantDropdownOpen ? "rotate-180" : ""}`} />
              </div>
              {variantDropdownOpen && (
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                  {variantsLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                  ) : filteredVariants.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No variants found</p>
                  ) : (
                    filteredVariants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => { updateField("variantId", variant.id); updateField("variant", variant.variant_name); setVariantDropdownOpen(false); setSearchQuery(""); }}
                        className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                          formData.variantId === variant.id ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <span className="font-medium">{variant.variant_name}</span>
                        {formData.variantId === variant.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setVariantNotFound(!variantNotFound);
            }}
            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
              variantNotFound ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
            }`}
            data-testid="button-variant-not-found"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${variantNotFound ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
              {variantNotFound && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="font-medium">I don't find my exact variant here</span>
          </button>
        </div>
      )}

      {currentStep === "transmission" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TRANSMISSION_OPTIONS.map((trans) => (
              <button
                key={trans}
                type="button"
                data-testid={`transmission-${trans.toLowerCase()}`}
                onClick={() => updateField("transmission", trans)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.transmission === trans ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                {trans}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "kilometers" && (
        <div className="space-y-6">
          <div className="relative">
            <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-kilometers"
              type="number"
              value={formData.kilometers || ""}
              onChange={(e) => { const val = parseInt(e.target.value) || 0; updateField("kilometers", Math.min(val, 200000)); }}
              max={200000}
              placeholder="e.g. 45000"
              className={`h-14 pl-12 text-lg bg-background/50 border-2 rounded-xl text-foreground ${formData.kilometers > 200000 ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"}`}
            />
          </div>
          {formData.kilometers > 200000 && (
            <p className="text-center text-sm text-red-500 font-medium" data-testid="text-km-error">Maximum allowed is 2,00,000 km</p>
          )}
          {formData.kilometers > 0 && formData.kilometers <= 200000 && (
            <p className="text-center text-xl font-semibold text-primary">{formData.kilometers.toLocaleString()} km</p>
          )}
        </div>
      )}

      {currentStep === "vehicle-location" && (
        <div className="space-y-6">
          <button
            type="button"
            data-testid="button-select-city"
            onClick={() => setShowCityPicker(true)}
            className="w-full h-14 px-4 flex items-center gap-3 bg-background/50 border-2 border-border hover:border-primary rounded-xl text-left transition-colors"
          >
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <span className={`text-lg flex-1 ${formData.location ? "text-foreground" : "text-muted-foreground"}`}>
              {formData.location || "Select your city"}
            </span>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
          {selectedCityInspectionAvailable && formData.location && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                Inspection is available in <span className="font-semibold">{formData.location}</span>. You'll be redirected to book an inspection directly.
              </p>
            </div>
          )}
          {!selectedCityInspectionAvailable && formData.location && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Inspection is not available in <span className="font-medium text-foreground">{formData.location}</span>. You can list your car with photos.
              </p>
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
              placeholder="Expected Price"
              className="h-16 pl-14 text-2xl bg-background/50 border-2 border-border focus:border-primary rounded-2xl text-foreground"
            />
          </div>
          {formData.expectedPrice > 0 && (
            <p className="text-center text-2xl font-bold text-primary">₹{formData.expectedPrice.toLocaleString("en-IN")}</p>
          )}
          <Textarea
            data-testid="input-description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Additional details about your car (optional)"
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
                  src={imagePath.startsWith("blob:") ? imagePath : imagePath.startsWith("/objects/") ? `/api${imagePath}` : `/api/objects/${imagePath}`}
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
            {uploadedImages.length < 5 && (
              <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-background/30">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading} />
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
          <p className="text-center text-muted-foreground text-sm">Add up to 5 photos • {uploadedImages.length}/5 uploaded</p>
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
              placeholder="Your Name"
              className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-seller-phone"
              value={formData.sellerPhone}
              onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); updateField("sellerPhone", val); }}
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
    </div>
  );
}
