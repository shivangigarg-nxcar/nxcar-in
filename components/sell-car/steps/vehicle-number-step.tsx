"use client";

import React from "react";
import { Input } from "@components/ui/input";
import { Car } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField">;

export function VehicleNumberStep({ formData, updateField }: Props) {
  return (
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
          className="h-16 pl-14 text-lg font-mono tracking-widest uppercase text-center bg-background/50 border-2 border-border focus:border-primary rounded-2xl text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-center text-muted-foreground text-sm">
        We'll auto-fill details if found, or you can enter manually
      </p>
    </div>
  );
}
