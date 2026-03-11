"use client";

import { Calendar, Gauge, Fuel, Settings2, CalendarDays } from "lucide-react";
import { formatKilometers } from "@components/car-detail/car-detail-types";

interface QuickSpecsProps {
  year: number;
  kilometersDriven: number;
  fuelType: string;
  transmission: string;
  listingDate?: string;
}

function formatListingDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Today";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return "1 month ago";
}

export function QuickSpecs({ year, kilometersDriven, fuelType, transmission, listingDate }: QuickSpecsProps) {
  const items = [
    { icon: Calendar, label: "Year", value: `${year}` },
    { icon: Gauge, label: "Kilometers", value: formatKilometers(kilometersDriven) },
    { icon: Fuel, label: "Fuel Type", value: fuelType },
    { icon: Settings2, label: "Transmission", value: transmission },
    ...(listingDate ? [{ icon: CalendarDays, label: "Listed", value: formatListingDate(listingDate) }] : []),
  ].filter((item) => item.value && item.value !== "0");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-md border p-3 bg-gradient-to-br from-primary/5"
          data-testid={`spec-card-${item.label.toLowerCase().replace(/ /g, "-")}`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-sm font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
