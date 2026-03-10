"use client";

import { Input } from "@components/ui/input";
import { Search, CheckCircle2, Loader2 } from "lucide-react";
import type { Variant } from "@lib/api";

interface VariantStepProps {
  formData: { brand: string; model: string; fuelType: string; variantId: number; variant: string };
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredVariants: Variant[];
  variantsLoading: boolean;
  selectVariant: (variant: Variant) => void;
  updateField: (field: string, value: any) => void;
}

export function VariantStep({
  formData, searchQuery, setSearchQuery,
  filteredVariants, variantsLoading, selectVariant, updateField,
}: VariantStepProps) {
  return (
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
  );
}
