"use client";

import { Input } from "@components/ui/input";
import { Search, CheckCircle2, Loader2 } from "lucide-react";
import type { VehicleDetails, Make } from "@lib/api";

interface BrandStepProps {
  formData: { brand: string; makeId: number };
  vehicleData: VehicleDetails | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredMakes: Make[];
  makesLoading: boolean;
  selectMake: (make: Make) => void;
}

export function BrandStep({
  formData, vehicleData, searchQuery, setSearchQuery,
  filteredMakes, makesLoading, selectMake,
}: BrandStepProps) {
  return (
    <div className="space-y-4">
      {vehicleData && formData.brand && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-primary text-sm font-medium">Auto-filled: {formData.brand}</span>
        </div>
      )}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search brand..."
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
        {makesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          filteredMakes.map((make) => (
            <button
              key={make.id}
              type="button"
              onClick={() => selectMake(make)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 ${
                formData.makeId === make.id
                  ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
                  : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {make.make_image && (
                <img src={make.make_image} alt={make.make_name} className="w-10 h-10 object-contain" />
              )}
              <span className="text-lg font-medium">{make.make_name}</span>
              {formData.makeId === make.id && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
