'use client';

import { Slider } from "@components/ui/slider";

export function YearFilterSection({
  yearRange,
  localYearValues,
  onLocalYearChange,
  onYearCommit,
  testIdPrefix = "",
}: {
  yearRange: { min: number; max: number };
  localYearValues: [number, number];
  onLocalYearChange: (values: [number, number]) => void;
  onYearCommit: (values: [number, number]) => void;
  testIdPrefix?: string;
}) {
  return (
    <div className="px-3 py-2">
      <Slider
        value={localYearValues}
        min={yearRange.min}
        max={yearRange.max}
        step={1}
        onValueChange={(v) => onLocalYearChange(v as [number, number])}
        onValueCommit={(v) => onYearCommit(v as [number, number])}
        className="mb-2"
        data-testid={`${testIdPrefix}slider-year`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{localYearValues[0]}</span>
        <span>{localYearValues[1]}</span>
      </div>
    </div>
  );
}
