"use client";

import React from "react";
import { Input } from "@components/ui/input";
import { CheckCircle2, Palette } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField" | "autoFilledSteps" | "colors" | "useCustomColor" | "setUseCustomColor" | "customColorText" | "setCustomColorText">;

export function ColorStep({ formData, updateField, autoFilledSteps, colors, useCustomColor, setUseCustomColor, customColorText, setCustomColorText }: Props) {
  return (
    <div className="space-y-6">
      {autoFilledSteps.current.has("color") && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Auto-filled: {formData.color}</span>
        </div>
      )}
      {!useCustomColor && (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              data-testid={`color-${c.id}`}
              onClick={() => { updateField("color", c.name); setCustomColorText(""); }}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                formData.color === c.name && !useCustomColor ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/50"
              }`}
            >
              <span
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${formData.color === c.name && !useCustomColor ? "border-primary ring-2 ring-primary/30" : "border-border/50"}`}
                style={{ backgroundColor: c.code }}
              />
              <span className={`text-[10px] sm:text-xs font-medium leading-tight text-center ${formData.color === c.name && !useCustomColor ? "text-primary" : "text-foreground"}`}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm font-medium text-muted-foreground">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <button
        type="button"
        onClick={() => {
          setUseCustomColor(!useCustomColor);
          if (!useCustomColor) { updateField("color", ""); } else { setCustomColorText(""); updateField("color", ""); }
        }}
        className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
          useCustomColor ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
        }`}
        data-testid="button-custom-color"
      >
        <Palette className="w-5 h-5" />
        <span className="font-medium">Type your exact color here</span>
      </button>
      {useCustomColor && (
        <Input
          data-testid="input-custom-color"
          value={customColorText}
          onChange={(e) => { setCustomColorText(e.target.value); updateField("color", e.target.value); }}
          placeholder="Enter your car's exact color..."
          className="h-14 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
          autoFocus
        />
      )}
    </div>
  );
}
