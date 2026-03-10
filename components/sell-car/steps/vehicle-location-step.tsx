"use client";

import React from "react";
import { CheckCircle2, MapPin, ChevronDown } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "selectedCityInspectionAvailable" | "setShowCityPicker">;

export function VehicleLocationStep({ formData, selectedCityInspectionAvailable, setShowCityPicker }: Props) {
  return (
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
  );
}
