"use client";

import React from "react";
import { OWNER_OPTIONS } from "../sell-constants";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField">;

export function OwnershipStep({ formData, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {OWNER_OPTIONS.map((owner, index) => (
          <button
            key={owner}
            type="button"
            data-testid={`owner-${index + 1}`}
            onClick={() => updateField("ownerCount", index + 1)}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.ownerCount === index + 1 ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
            }`}
          >
            {owner}
          </button>
        ))}
      </div>
    </div>
  );
}
