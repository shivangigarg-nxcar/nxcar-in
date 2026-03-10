"use client";

import { Input } from "@components/ui/input";
import { Gauge } from "lucide-react";

const TRANSMISSION_OPTIONS = ["Manual", "Automatic", "CVT", "DCT", "AMT"];

interface KmTransmissionStepProps {
  formData: { kilometers: number; transmission: string };
  updateField: (field: string, value: any) => void;
}

export function KmTransmissionStep({ formData, updateField }: KmTransmissionStepProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <Input
          data-testid="input-kilometers"
          type="number"
          value={formData.kilometers || ""}
          onChange={(e) => updateField("kilometers", parseInt(e.target.value) || 0)}
          placeholder="Kilometers Driven"
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-3">Transmission</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRANSMISSION_OPTIONS.map((trans) => (
            <button
              key={trans}
              type="button"
              data-testid={`transmission-${trans.toLowerCase()}`}
              onClick={() => updateField("transmission", trans)}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.transmission === trans
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-foreground hover:border-primary/50"
              }`}
            >
              {trans}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
