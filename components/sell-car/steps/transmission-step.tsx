"use client";

import React from "react";
import { TRANSMISSION_OPTIONS } from "../sell-constants";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField">;

export function TransmissionStep({ formData, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TRANSMISSION_OPTIONS.map((trans) => (
          <button
            key={trans}
            type="button"
            data-testid={`transmission-${trans.toLowerCase()}`}
            onClick={() => updateField("transmission", trans)}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.transmission === trans ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
            }`}
          >
            {trans}
          </button>
        ))}
      </div>
    </div>
  );
}
