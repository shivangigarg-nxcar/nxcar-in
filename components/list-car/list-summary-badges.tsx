"use client";

import { motion } from "framer-motion";
import {
  Car,
  CarFront,
  Fuel,
  Calendar,
  Gauge,
  Palette,
  MapPin,
  IndianRupee,
} from "lucide-react";

interface ListSummaryBadgesProps {
  formData: {
    vehicleNumber: string;
    brand: string;
    model: string;
    variant: string;
    fuelType: string;
    year: number;
    kilometers: number;
    transmission: string;
    color: string;
    location: string;
    expectedPrice: number;
  };
}

export function ListSummaryBadges({ formData }: ListSummaryBadgesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl p-3 border border-border/50 shadow-sm"
    >
      <div className="flex flex-wrap gap-1.5 text-xs sm:text-sm">
        {formData.vehicleNumber && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
            <Car className="w-3 h-3" />
            {formData.vehicleNumber}
          </span>
        )}
        {formData.brand && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-foreground font-medium flex items-center gap-1">
            <CarFront className="w-3 h-3 text-primary" />
            {formData.brand}
          </span>
        )}
        {formData.model && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-foreground">
            {formData.model}
          </span>
        )}
        {formData.variant && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {formData.variant}
          </span>
        )}
        {formData.fuelType && (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
            <Fuel className="w-3 h-3" />
            {formData.fuelType}
          </span>
        )}
        {formData.year > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            {formData.year}
          </span>
        )}
        {formData.kilometers > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-foreground flex items-center gap-1">
            <Gauge className="w-3 h-3 text-muted-foreground" />
            {formData.kilometers.toLocaleString()} km
          </span>
        )}
        {formData.transmission && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {formData.transmission}
          </span>
        )}
        {formData.color && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-foreground flex items-center gap-1">
            <Palette className="w-3 h-3 text-muted-foreground" />
            {formData.color}
          </span>
        )}
        {formData.location && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            {formData.location}
          </span>
        )}
        {formData.expectedPrice > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/20 to-teal-500/20 text-primary font-semibold flex items-center gap-1 border border-primary/20">
            <IndianRupee className="w-3 h-3" />
            {formData.expectedPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>
    </motion.div>
  );
}
