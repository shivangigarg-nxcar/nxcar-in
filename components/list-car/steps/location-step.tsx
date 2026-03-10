"use client";

import { Input } from "@components/ui/input";
import { MapPin, ChevronDown, X, Search, Check, Loader2 } from "lucide-react";
import type { SellCity } from "@lib/api";

interface LocationStepProps {
  formData: { location: string; cityNumericId: string };
  updateField: (field: string, value: any) => void;
  showCityPicker: boolean;
  setShowCityPicker: (v: boolean) => void;
  citySearchQuery: string;
  setCitySearchQuery: (q: string) => void;
  filteredSellCities: SellCity[];
  sellCitiesLoading: boolean;
}

export function LocationStep({
  formData, updateField,
  showCityPicker, setShowCityPicker,
  citySearchQuery, setCitySearchQuery,
  filteredSellCities, sellCitiesLoading,
}: LocationStepProps) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        data-testid="button-select-city"
        onClick={() => setShowCityPicker(true)}
        className="w-full h-14 px-4 flex items-center gap-3 bg-background/50 border-2 border-border hover:border-primary rounded-xl text-left transition-colors"
      >
        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
        <span className={`text-lg flex-1 ${formData.location ? "text-foreground" : "text-muted-foreground"}`}>
          {formData.location || "Select city"}
        </span>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </button>

      {showCityPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Select City</h3>
              <button
                type="button"
                onClick={() => { setShowCityPicker(false); setCitySearchQuery(""); }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                data-testid="button-close-city-picker"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-city-search"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Search city..."
                  className="h-10 pl-9 bg-background/50 border border-border rounded-lg text-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {sellCitiesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : filteredSellCities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No cities found</p>
              ) : (
                filteredSellCities.map((city) => (
                  <button
                    key={city.city_id}
                    type="button"
                    data-testid={`city-option-${city.city_id}`}
                    onClick={() => {
                      updateField("location", city.city_name);
                      updateField("cityNumericId", city.city_id);
                      setShowCityPicker(false);
                      setCitySearchQuery("");
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      formData.cityNumericId === city.city_id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-foreground">{city.city_name}</span>
                    {formData.cityNumericId === city.city_id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
