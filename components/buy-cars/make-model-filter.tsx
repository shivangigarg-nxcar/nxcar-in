'use client';

import { useCallback } from "react";
import { Badge } from "@components/ui/badge";
import { Checkbox } from "@components/ui/checkbox";
import { ScrollArea } from "@components/ui/scroll-area";
import { ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";
import type { FilterOptions, Filters } from "./filter-types";

export function useFilterLogic(makeModels: Record<string, string[]>) {
  const findMakeForModel = useCallback((model: string): string | null => {
    for (const [make, models] of Object.entries(makeModels)) {
      if (models.includes(model)) return make;
    }
    return null;
  }, [makeModels]);

  const deriveMakesFromModels = useCallback((selectedModels: string[]): string[] => {
    const makes = new Set<string>();
    for (const model of selectedModels) {
      const make = findMakeForModel(model);
      if (make) makes.add(make);
    }
    return Array.from(makes);
  }, [findMakeForModel]);

  const isMakeFullySelected = useCallback((make: string, selectedModels: string[]): boolean => {
    const modelsForMake = makeModels[make] || [];
    if (modelsForMake.length === 0) return false;
    return modelsForMake.every((m) => selectedModels.includes(m));
  }, [makeModels]);

  const isMakePartiallySelected = useCallback((make: string, selectedModels: string[]): boolean => {
    const modelsForMake = makeModels[make] || [];
    if (modelsForMake.length === 0) return false;
    const selectedCount = modelsForMake.filter((m) => selectedModels.includes(m)).length;
    return selectedCount > 0 && selectedCount < modelsForMake.length;
  }, [makeModels]);

  return { findMakeForModel, deriveMakesFromModels, isMakeFullySelected, isMakePartiallySelected };
}

export function MakeModelFilterSection({
  filterOptions,
  filters,
  expandedMakes,
  onToggleMakeExpand,
  onToggleMake,
  onToggleModel,
  isModelChecked,
  isMakeFullySelected,
  isMakePartiallySelected,
  testIdPrefix = "",
}: {
  filterOptions: FilterOptions;
  filters: { makes?: string[]; models?: string[] };
  expandedMakes: Set<string>;
  onToggleMakeExpand: (make: string) => void;
  onToggleMake: (make: string, checked: boolean) => void;
  onToggleModel: (model: string, make: string, checked: boolean) => void;
  isModelChecked: (model: string, make: string) => boolean;
  isMakeFullySelected: (make: string, selectedModels: string[]) => boolean;
  isMakePartiallySelected: (make: string, selectedModels: string[]) => boolean;
  testIdPrefix?: string;
}) {
  return (
    <ScrollArea className="h-[220px]">
      <div className="space-y-0.5 pr-3">
        {filterOptions.makes.map((make) => {
          const isExpanded = expandedMakes.has(make);
          const makeModels = filterOptions.makeModels[make] || [];
          const makeDirectlySelected = (filters.makes || []).includes(make);
          const isFullySelected = makeDirectlySelected || isMakeFullySelected(make, filters.models || []);
          const isPartial = !isFullySelected && isMakePartiallySelected(make, filters.models || []);

          return (
            <div key={make}>
              <div className="flex items-center gap-2 py-1.5 hover:bg-muted/50 rounded px-2">
                <Checkbox
                  checked={isFullySelected ? true : isPartial ? "indeterminate" : false}
                  onCheckedChange={(checked) => onToggleMake(make, !!checked)}
                  data-testid={`${testIdPrefix}checkbox-make-${make}`}
                />
                <button
                  onClick={() => onToggleMakeExpand(make)}
                  className="flex-1 flex items-center justify-between text-sm"
                  data-testid={`${testIdPrefix}button-expand-${make}`}
                >
                  <span>{make}</span>
                  <span className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">
                      {filterOptions.makeCounts[make] || 0}
                    </Badge>
                    {makeModels.length > 0 && (
                      isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />
                    )}
                  </span>
                </button>
              </div>
              {isExpanded && makeModels.length > 0 && (
                <div className="ml-6 space-y-0.5 mb-1">
                  {makeModels.map((model) => (
                    <div key={model} className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded">
                      <Checkbox
                        checked={isModelChecked(model, make)}
                        onCheckedChange={(checked) => onToggleModel(model, make, !!checked)}
                        data-testid={`${testIdPrefix}checkbox-model-${model}`}
                      />
                      <span className="text-sm flex-1">{model}</span>
                      <span className="text-xs text-muted-foreground">({filterOptions.modelCounts[model] || 0})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
