"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { useCarComparison } from "@hooks/use-car-comparison";
import { Fuel, Gauge, Settings2, MapPin, Calendar, IndianRupee, X, Trophy, Car, User, Tag, Hash } from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";

interface CarComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const comparisonFields = [
  { key: "price", label: "Price", icon: IndianRupee, format: (v: any) => v ? `₹ ${(Number(v) / 100000).toFixed(2)} Lakh` : "—", bestFn: "min" as const },
  { key: "year", label: "Year", icon: Calendar, format: (v: any) => v ? String(v) : "—", bestFn: "max" as const },
  { key: "kilometers", label: "Kilometers", icon: Gauge, format: (v: any) => v ? `${Number(v).toLocaleString()} km` : "—", bestFn: "min" as const },
  { key: "brand", label: "Brand", icon: Tag, format: (v: any) => v || "—", bestFn: null },
  { key: "model", label: "Model", icon: Car, format: (v: any) => v || "—", bestFn: null },
  { key: "variant", label: "Variant", icon: Hash, format: (v: any) => v || "—", bestFn: null },
  { key: "fuelType", label: "Fuel Type", icon: Fuel, format: (v: any) => v || "—", bestFn: null },
  { key: "transmission", label: "Transmission", icon: Settings2, format: (v: any) => v || "—", bestFn: null },
  { key: "ownership", label: "Ownership", icon: User, format: (v: any) => {
    if (!v) return "—";
    const num = parseInt(v);
    if (isNaN(num)) return v;
    if (num === 1) return "1st Owner";
    if (num === 2) return "2nd Owner";
    if (num === 3) return "3rd Owner";
    return `${num}th Owner`;
  }, bestFn: "min" as const },
  { key: "location", label: "Location", icon: MapPin, format: (v: any) => v || "—", bestFn: null },
];

export function CarComparisonModal({ open, onOpenChange }: CarComparisonModalProps) {
  const { comparisonCars, removeFromCompare } = useCarComparison();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] p-0 bg-background border-border overflow-hidden"
        data-testid="car-comparison-modal"
      >
        <DialogHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Car Comparison</span>
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({comparisonCars.length} cars)
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6 pt-4">
            <div className="grid gap-3 sm:gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${comparisonCars.length}, 1fr)` }}>
              <AnimatePresence mode="popLayout">
                {comparisonCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="rounded-lg overflow-hidden border border-border bg-muted/30" style={{ aspectRatio: '7 / 5' }}>
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromCompare(car.id)}
                      data-testid={`button-remove-compare-modal-${car.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="mt-2 text-center">
                      <h3 className="font-bold text-sm truncate" data-testid={`comparison-car-name-${car.id}`}>
                        {car.name}
                      </h3>
                      <span className="text-xs text-primary">{car.brand}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              {comparisonFields.map((field, fieldIndex) => {
                const bestValue = field.bestFn && comparisonCars.length > 1
                  ? (() => {
                      const values = comparisonCars
                        .map(c => Number(c[field.key as keyof typeof c]))
                        .filter(v => !isNaN(v));
                      if (values.length === 0) return null;
                      return field.bestFn === "min" ? Math.min(...values) : Math.max(...values);
                    })()
                  : null;

                return (
                  <div
                    key={field.key}
                    className={`grid gap-3 sm:gap-4 py-3 px-4 ${fieldIndex % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
                    style={{ gridTemplateColumns: `110px repeat(${comparisonCars.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <field.icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{field.label}</span>
                    </div>
                    {comparisonCars.map((car) => {
                      const value = car[field.key as keyof typeof car];
                      const formattedValue = field.format(value);
                      const isBest = bestValue !== null && Number(value) === bestValue;

                      return (
                        <div
                          key={car.id}
                          className={`text-center text-xs sm:text-sm font-medium ${isBest ? "text-primary" : ""}`}
                          data-testid={`comparison-${field.key}-${car.id}`}
                        >
                          {formattedValue}
                          {isBest && (
                            <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              Best
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
