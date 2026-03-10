"use client";

import { CheckCircle2, Loader2, Fuel, Calendar } from "lucide-react";
import type { VehicleDetails, FuelType, YearOption } from "@lib/api";

interface FuelYearStepProps {
  formData: { fuelType: string; year: number };
  vehicleData: VehicleDetails | null;
  updateField: (field: string, value: any) => void;
  fuelTypes: FuelType[];
  fuelTypesLoading: boolean;
  years: YearOption[];
  yearsLoading: boolean;
}

export function FuelYearStep({
  formData, vehicleData, updateField,
  fuelTypes, fuelTypesLoading, years, yearsLoading,
}: FuelYearStepProps) {
  return (
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
  );
}
