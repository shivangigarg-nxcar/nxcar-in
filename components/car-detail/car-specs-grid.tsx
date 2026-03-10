"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Settings2,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SpecEntry {
  label: string;
  value: string;
}

interface CarSpecsGridProps {
  specsEntries: SpecEntry[];
  showAllSpecs: boolean;
  onToggleShowAll: () => void;
  specsExpanded: boolean;
  onToggleExpanded: () => void;
  insuranceProvider?: string;
  insuranceExpiry?: string;
}

export function CarSpecsGrid({
  specsEntries,
  showAllSpecs,
  onToggleShowAll,
  specsExpanded,
  onToggleExpanded,
  insuranceProvider,
  insuranceExpiry,
}: CarSpecsGridProps) {
  if (specsEntries.length === 0) return null;

  const visibleSpecs = showAllSpecs ? specsEntries : specsEntries.slice(0, 6);

  return (
    <Card data-testid="specifications-card">
      <CardHeader
        className="pb-3 cursor-pointer select-none"
        onClick={onToggleExpanded}
        data-testid="button-toggle-specs-section"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-semibold">Specifications</h2>
          <Badge variant="secondary" className="ml-1">{specsEntries.length}</Badge>
          <ChevronDown className={`ml-auto h-5 w-5 text-muted-foreground transition-transform duration-200 ${specsExpanded ? 'rotate-180' : ''}`} />
        </div>
      </CardHeader>
      {specsExpanded && (
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {visibleSpecs.map((spec, idx) => (
              <div
                key={idx}
                className="flex justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm text-muted-foreground">
                  {spec.label}
                </span>
                <span className="text-sm font-medium">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
          {specsEntries.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3"
              onClick={onToggleShowAll}
              data-testid="button-toggle-specs"
            >
              {showAllSpecs ? (
                <>
                  Show Less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Show All {specsEntries.length} Specs{" "}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          )}
          {insuranceProvider && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" /> Insurance
              </h4>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-muted-foreground">
                    Provider
                  </span>
                  <span className="text-sm font-medium">
                    {insuranceProvider}
                  </span>
                </div>
                {insuranceExpiry && (
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-muted-foreground">
                      Expiry
                    </span>
                    <span className="text-sm font-medium">
                      {insuranceExpiry}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
