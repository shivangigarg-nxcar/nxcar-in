"use client";

import { Input } from "@components/ui/input";
import { Search, CheckCircle2, Loader2 } from "lucide-react";
import type { VehicleDetails, Model } from "@lib/api";

interface ModelStepProps {
  formData: { brand: string; model: string; modelId: number };
  vehicleData: VehicleDetails | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredModels: Model[];
  modelsLoading: boolean;
  selectModel: (model: Model) => void;
}

export function ModelStep({
  formData, vehicleData, searchQuery, setSearchQuery,
  filteredModels, modelsLoading, selectModel,
}: ModelStepProps) {
  return (
    <div className="space-y-4">
      {vehicleData && formData.model && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Auto-filled: {formData.model}</span>
        </div>
      )}
      <div className="text-center mb-4">
        <span className="text-muted-foreground">Brand: </span>
        <span className="text-primary font-semibold">{formData.brand}</span>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search model..."
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
        {modelsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredModels.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No models found</p>
        ) : (
          filteredModels.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => selectModel(model)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                formData.modelId === model.id
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <span className="text-lg font-medium">{model.model_name}</span>
              {formData.modelId === model.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
