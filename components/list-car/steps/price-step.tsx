"use client";

import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { IndianRupee } from "lucide-react";

interface PriceStepProps {
  formData: { expectedPrice: number; description: string };
  updateField: (field: string, value: any) => void;
}

export function PriceStep({ formData, updateField }: PriceStepProps) {
  return (
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
  );
}
