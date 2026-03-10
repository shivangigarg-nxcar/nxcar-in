"use client";

import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField" | "autoFilledSteps" | "years" | "yearsLoading">;

export function YearStep({ formData, updateField, autoFilledSteps, years, yearsLoading }: Props) {
  return (
    <div className="space-y-4">
      {autoFilledSteps.current.has("year") && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Auto-filled: {formData.year}</span>
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2">
        {yearsLoading ? (
          <div className="col-span-full flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : (
          years.map((y) => (
            <button
              key={y.id}
              type="button"
              onClick={() => updateField("year", y.year)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                formData.year === y.year ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50"
              }`}
            >
              {y.year}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
