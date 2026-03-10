"use client";

import React, { useState } from "react";
import { Input } from "@components/ui/input";
import { Search, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "vehicleData" | "searchQuery" | "setSearchQuery" | "makesLoading" | "filteredMakes" | "selectMake">;

export function BrandStep({ formData, vehicleData, searchQuery, setSearchQuery, makesLoading, filteredMakes, selectMake }: Props) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(!formData.brand);

  React.useEffect(() => {
    setBrandDropdownOpen(!formData.brand);
  }, []);

  return (
    <div className="space-y-4">
      {vehicleData && formData.brand && !brandDropdownOpen && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-primary text-sm font-medium">Auto-filled: {formData.brand}</span>
        </div>
      )}
      <div className="relative cursor-pointer" onClick={() => { if (!brandDropdownOpen) { setBrandDropdownOpen(true); setSearchQuery(""); } }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={brandDropdownOpen ? searchQuery : formData.brand || ""}
          onChange={(e) => { setSearchQuery(e.target.value); if (!brandDropdownOpen) setBrandDropdownOpen(true); }}
          onFocus={() => { if (!brandDropdownOpen) { setBrandDropdownOpen(true); setSearchQuery(""); } }}
          placeholder={formData.brand || "Search brand..."}
          readOnly={!brandDropdownOpen}
          className={`h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!brandDropdownOpen ? "cursor-pointer" : ""}`}
        />
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${brandDropdownOpen ? "rotate-180" : ""}`} />
      </div>
      {brandDropdownOpen && (
        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
          {makesLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
            filteredMakes.map((make) => (
              <button
                key={make.id}
                type="button"
                onClick={() => { selectMake(make); setBrandDropdownOpen(false); setSearchQuery(""); }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 ${
                  formData.makeId === make.id
                    ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
                    : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {make.make_image && <img src={make.make_image} alt={make.make_name} className="w-10 h-10 object-contain" />}
                <span className="text-lg font-medium">{make.make_name}</span>
                {formData.makeId === make.id && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
