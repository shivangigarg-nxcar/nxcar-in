'use client';

import { Slider } from "@components/ui/slider";
import type { PriceGroup } from "./filter-types";
import { formatPriceShort } from "./filter-types";

export function PriceFilterSection({
  priceGroups,
  priceRange,
  localPriceValues,
  currentMinPrice,
  currentMaxPrice,
  onLocalPriceChange,
  onPriceCommit,
  onPriceGroupClick,
  testIdPrefix = "",
}: {
  priceGroups: PriceGroup[];
  priceRange: { min: number; max: number };
  localPriceValues: [number, number];
  currentMinPrice?: number;
  currentMaxPrice?: number;
  onLocalPriceChange: (values: [number, number]) => void;
  onPriceCommit: (values: [number, number]) => void;
  onPriceGroupClick: (group: PriceGroup, isActive: boolean) => void;
  testIdPrefix?: string;
}) {
  return (
    <div className="px-3 py-2">
      {priceGroups.length > 0 && (
        <div className="space-y-1 mb-3">
          {priceGroups.map((group) => {
            const isActive = currentMinPrice === group.min && currentMaxPrice === (group.max ?? priceRange.max);
            return (
              <button
                key={group.name}
                onClick={() => onPriceGroupClick(group, isActive)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
                data-testid={`${testIdPrefix}button-price-group-${group.name}`}
              >
                <span>{group.displayName}</span>
                <span className={`text-[10px] ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>({group.count})</span>
              </button>
            );
          })}
        </div>
      )}
      <Slider
        value={localPriceValues}
        min={priceRange.min}
        max={priceRange.max}
        step={50000}
        onValueChange={(v) => onLocalPriceChange(v as [number, number])}
        onValueCommit={(v) => onPriceCommit(v as [number, number])}
        className="mb-2"
        data-testid={`${testIdPrefix}slider-price`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatPriceShort(localPriceValues[0])}</span>
        <span>{formatPriceShort(localPriceValues[1])}</span>
      </div>
    </div>
  );
}
