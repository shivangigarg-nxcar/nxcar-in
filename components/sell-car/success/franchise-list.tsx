"use client";

import {
  Loader2,
  Building2,
  CheckCircle2,
  ExternalLink,
  Home,
  MapPin,
} from "lucide-react";
import { Input } from "@components/ui/input";
import type { InspectionFranchise } from "@lib/api";

interface FranchiseListProps {
  franchises: InspectionFranchise[];
  franchisesLoading: boolean;
  franchisesError: boolean;
  inspectionMode: "franchise" | "home";
  selectedFranchise: InspectionFranchise | null;
  setSelectedFranchise: (franchise: InspectionFranchise | null) => void;
  setInspectionMode: (mode: "franchise" | "home") => void;
  inspectionLocation: string;
  setInspectionLocation: (location: string) => void;
  inspectionPincode: string;
  setInspectionPincode: (pincode: string) => void;
}

export function FranchiseList({
  franchises,
  franchisesLoading,
  franchisesError,
  inspectionMode,
  selectedFranchise,
  setSelectedFranchise,
  setInspectionMode,
  inspectionLocation,
  setInspectionLocation,
  inspectionPincode,
  setInspectionPincode,
}: FranchiseListProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-3">Choose Location*</label>
      <div className="space-y-2 mb-4">
        {franchisesLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : franchises.length > 0 ? (
          franchises.map((franchise) => (
            <button
              key={franchise.franchise_id}
              type="button"
              onClick={() => { setSelectedFranchise(franchise); setInspectionMode("franchise"); setInspectionLocation(""); }}
              data-testid={`franchise-${franchise.franchise_id}`}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-left ${
                inspectionMode === "franchise" && selectedFranchise?.franchise_id === franchise.franchise_id
                  ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <Building2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${inspectionMode === "franchise" && selectedFranchise?.franchise_id === franchise.franchise_id ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{franchise.franchise_name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{franchise.franchise_address}</p>
                {franchise.map_location && (
                  <a href={franchise.map_location} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                    <ExternalLink className="w-3 h-3" />View on Map
                  </a>
                )}
              </div>
              {inspectionMode === "franchise" && selectedFranchise?.franchise_id === franchise.franchise_id && (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </button>
          ))
        ) : franchisesError ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">Unable to load franchise locations</p>
            <p className="text-xs text-muted-foreground mt-1">Please use home/office inspection option below</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4 text-sm">No franchise locations in your area</p>
        )}
      </div>

      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-sm text-muted-foreground font-medium">Or</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <button
        type="button"
        onClick={() => { setInspectionMode("home"); setSelectedFranchise(null); }}
        data-testid="home-inspection-option"
        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${inspectionMode === "home" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
      >
        <Home className={`w-5 h-5 ${inspectionMode === "home" ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-medium text-foreground text-sm">Request inspection at your home/office</span>
        {inspectionMode === "home" && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
      </button>

      {inspectionMode === "home" && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              data-testid="input-inspection-location"
              value={inspectionLocation}
              onChange={(e) => setInspectionLocation(e.target.value)}
              placeholder="Enter your complete address"
              className="h-14 pl-12 text-base bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              PIN Code <span className="text-destructive">*</span>
            </label>
            <Input
              data-testid="input-inspection-pincode"
              value={inspectionPincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setInspectionPincode(val);
              }}
              placeholder="Enter 6-digit PIN code"
              inputMode="numeric"
              maxLength={6}
              className={`h-12 text-base bg-background/50 border-2 focus:border-primary rounded-xl text-foreground ${
                inspectionPincode && !/^\d{6}$/.test(inspectionPincode) ? "border-destructive" : "border-border"
              }`}
            />
            {inspectionPincode && !/^\d{6}$/.test(inspectionPincode) && (
              <p className="text-xs text-destructive mt-1">PIN code must be 6 digits</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
