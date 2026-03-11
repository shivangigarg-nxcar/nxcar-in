"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { IndianRupee, Loader2 } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField">;

interface PricePrediction {
  pricing: {
    seller: { lower: number; upper: number };
    Buyer: { lower: number; upper: number };
  };
  price_range: { lower: number; upper: number };
}

function formatINR(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

export function PriceStep({ formData, updateField }: Props) {
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!formData.brand || !formData.model || !formData.variantId || !formData.year) return;

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const payload: Record<string, any> = {
      make: formData.brand,
      model: formData.model,
      variant: formData.variant,
      variant_id: formData.variantId,
      year: formData.year,
      fuel_type: formData.fuelType,
      transmission: formData.transmission,
      distance: formData.kilometers,
      owner_count: formData.ownerCount,
      rto_code: formData.rtoCode,
      color: formData.color,
    };

    fetch("https://dev-ai.nxcar.in/price-prediction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        if (data?.pricing?.seller) {
          setPrediction(data);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [formData.brand, formData.model, formData.variantId, formData.year]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-6" data-testid="price-prediction-loading">
          <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Getting projected valuation...</span>
        </div>
      )}

      {!loading && prediction && (
        <div data-testid="price-prediction-card">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl px-6 py-5 border border-blue-200/60 dark:border-blue-800/40 text-center">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Projected valuation by
            </p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              ₹{formatINR(prediction.pricing.seller.lower)}{" "}
              <span className="text-slate-400 font-normal">-</span>{" "}
              ₹{formatINR(prediction.pricing.seller.upper)}
            </p>
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-3 text-center leading-relaxed px-2">
            Valuation considers similar cars' model, age, mileage, and fuel type, with final price based on condition, location, and demand.
          </p>
        </div>
      )}

      {!loading && error && (
        <p className="text-xs text-muted-foreground text-center">
          Could not fetch projected valuation. You can still enter your expected price below.
        </p>
      )}

      <div className="relative">
        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
        <Input
          data-testid="input-price"
          type="number"
          value={formData.expectedPrice || ""}
          onChange={(e) => updateField("expectedPrice", parseInt(e.target.value) || 0)}
          placeholder="Enter Selling Price"
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
  );
}
