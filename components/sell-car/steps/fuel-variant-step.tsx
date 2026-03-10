"use client";

import React, { useState } from "react";
import { Input } from "@components/ui/input";
import { Search, CheckCircle2, Loader2, ChevronDown, Fuel, Check } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField" | "autoFilledSteps" | "searchQuery" | "setSearchQuery" | "fuelTypes" | "fuelTypesLoading" | "variants" | "variantsLoading" | "filteredVariants" | "variantNotFound" | "setVariantNotFound">;

export function FuelVariantStep({ formData, updateField, autoFilledSteps, searchQuery, setSearchQuery, fuelTypes, fuelTypesLoading, variantsLoading, filteredVariants, variantNotFound, setVariantNotFound }: Props) {
  const [variantDropdownOpen, setVariantDropdownOpen] = useState(!formData.variant);

  React.useEffect(() => {
    setVariantDropdownOpen(!formData.variant);
  }, []);

  return (
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
  );
}
