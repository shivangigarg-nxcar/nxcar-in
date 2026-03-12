"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { STEPS, OWNER_OPTIONS, type FormStep } from "./sell-constants";

interface SellFormData {
  vehicleNumber: string;
  brand: string;
  model: string;
  rtoCode: string;
  year: number;
  ownerCount: number;
  color: string;
  fuelType: string;
  transmission: string;
  kilometers: number;
  location: string;
  expectedPrice: number;
  variant: string;
}

interface SellTimelinePillsProps {
  formData: SellFormData;
  currentStep: FormStep;
  currentStepIndex: number;
  highestStepReached: number;
  goToStep: (step: FormStep) => void;
}

export function SellTimelinePills({
  formData,
  currentStep,
  currentStepIndex,
  highestStepReached,
  goToStep,
}: SellTimelinePillsProps) {
  if (currentStep === "vehicle-number") return null;

  const pillSteps: { id: FormStep; label: () => string; filledLabel: () => string; hasValue: () => boolean }[] = [
    { id: "brand", label: () => "Brand", filledLabel: () => formData.brand, hasValue: () => !!formData.brand },
    { id: "model", label: () => "Model", filledLabel: () => formData.model, hasValue: () => !!formData.model },
    { id: "rto-location", label: () => "RTO", filledLabel: () => formData.rtoCode, hasValue: () => !!formData.rtoCode },
    { id: "year", label: () => "Make Year", filledLabel: () => String(formData.year), hasValue: () => formData.year > 0 },
    { id: "ownership", label: () => "Ownership", filledLabel: () => OWNER_OPTIONS[formData.ownerCount - 1] || "Ownership", hasValue: () => formData.ownerCount > 0 },
    { id: "color", label: () => "Color", filledLabel: () => formData.color, hasValue: () => !!formData.color },
    { id: "fuel-variant", label: () => "Fuel & Variant", filledLabel: () => [formData.fuelType, formData.variant].filter(Boolean).join(" · ") || "Fuel & Variant", hasValue: () => !!formData.fuelType },
    { id: "transmission", label: () => "Transmission", filledLabel: () => formData.transmission, hasValue: () => !!formData.transmission },
    { id: "kilometers", label: () => "Mileage", filledLabel: () => `${formData.kilometers.toLocaleString()} km`, hasValue: () => formData.kilometers > 0 },
    { id: "vehicle-location", label: () => "Parked At", filledLabel: () => formData.location, hasValue: () => !!formData.location },
    { id: "price", label: () => "Price", filledLabel: () => `₹${formData.expectedPrice.toLocaleString("en-IN")}`, hasValue: () => formData.expectedPrice > 0 },
    { id: "photos", label: () => "Photos", filledLabel: () => "Photos", hasValue: () => false },
    { id: "seller-info", label: () => "Seller Info", filledLabel: () => "Seller Info", hasValue: () => false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl p-3 border border-border/50 shadow-sm"
    >
      <div className="flex flex-wrap gap-1.5 text-xs sm:text-sm">
        {formData.vehicleNumber && (
          <button type="button" onClick={() => goToStep("vehicle-number")} className="px-2.5 py-1 rounded-full font-medium flex items-center gap-1 transition-all cursor-pointer bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20" data-testid="pill-vehicle-number">
            <Car className="w-3 h-3" />{formData.vehicleNumber}
          </button>
        )}
        {pillSteps.map((pill) => {
          const stepIdx = STEPS.findIndex(s => s.id === pill.id);
          const isCurrent = currentStep === pill.id;
          const isCompleted = stepIdx < currentStepIndex && pill.hasValue();
          const isPast = stepIdx <= highestStepReached;
          const displayLabel = pill.hasValue() ? pill.filledLabel() : pill.label();
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => isPast ? goToStep(pill.id) : undefined}
              disabled={!isPast}
              className={`px-2.5 py-1 rounded-full transition-all truncate ${pill.id === "fuel-variant" ? "max-w-[200px] sm:max-w-[260px]" : "max-w-[120px] sm:max-w-[150px]"} ${
                isCurrent
                  ? "bg-background text-foreground border-2 border-foreground/70 font-medium shadow-sm"
                  : isCompleted
                    ? "bg-primary/10 text-primary border border-primary/30 font-medium cursor-pointer hover:bg-primary/20"
                    : isPast
                      ? "bg-muted text-foreground border border-border cursor-pointer hover:bg-muted/80"
                      : "bg-muted/50 text-muted-foreground border border-transparent"
              }`}
              data-testid={`pill-${pill.id}`}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
