"use client";

import React from "react";
import { Input } from "@components/ui/input";
import { Gauge } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField">;

export function KilometersStep({ formData, updateField }: Props) {
  return (
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
  );
}
