"use client";

import { useState, useEffect } from "react";
import { Input } from "@components/ui/input";
import { CheckCircle2, Palette } from "lucide-react";
import type { NxcarColor } from "@lib/api";

const OWNER_OPTIONS = [
  "1st Owner",
  "2nd Owner",
  "3rd Owner",
  "4th Owner",
  "5th+ Owner",
];

interface ColorOwnersStepProps {
  formData: { color: string; ownerCount: number };
  updateField: (field: string, value: any) => void;
  autoFilledColor?: string;
}

export function ColorOwnersStep({ formData, updateField, autoFilledColor }: ColorOwnersStepProps) {
  const [colors, setColors] = useState<NxcarColor[]>([]);
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColorText, setCustomColorText] = useState("");

  useEffect(() => {
    fetch("/api/nxcar/colors")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setColors(Array.isArray(data) ? data : []))
      .catch(() => setColors([]));
  }, []);

  useEffect(() => {
    if (colors.length > 0 && formData.color) {
      const isInList = colors.some(
        (c) => c.name.trim().toLowerCase() === formData.color.trim().toLowerCase()
      );
      if (!isInList) {
        setUseCustomColor(true);
        setCustomColorText(formData.color);
      }
    }
  }, [colors]);

  return (
    <div className="space-y-6">
      <div>
        {autoFilledColor && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">Auto-filled: {autoFilledColor}</span>
          </div>
        )}

        {!useCustomColor && colors.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                data-testid={`color-${c.id}`}
                onClick={() => {
                  updateField("color", c.name);
                  setCustomColorText("");
                  setUseCustomColor(false);
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                  formData.color.trim().toLowerCase() === c.name.trim().toLowerCase() && !useCustomColor
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
                    formData.color.trim().toLowerCase() === c.name.trim().toLowerCase() && !useCustomColor
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border/50"
                  }`}
                  style={{ backgroundColor: c.code }}
                />
                <span
                  className={`text-xs sm:text-sm font-medium leading-tight text-center ${
                    formData.color.trim().toLowerCase() === c.name.trim().toLowerCase() && !useCustomColor
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          onClick={() => {
            setUseCustomColor(!useCustomColor);
            if (!useCustomColor) {
              updateField("color", "");
            } else {
              setCustomColorText("");
              updateField("color", "");
            }
          }}
          className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
            useCustomColor
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
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
            onChange={(e) => {
              setCustomColorText(e.target.value);
              updateField("color", e.target.value);
            }}
            placeholder="Enter your car's exact color..."
            className="h-14 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground mt-3"
            autoFocus
          />
        )}
      </div>

      <div>
        <p className="text-muted-foreground mb-3">Number of Owners</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {OWNER_OPTIONS.map((owner, index) => (
            <button
              key={owner}
              type="button"
              data-testid={`owner-${index + 1}`}
              onClick={() => updateField("ownerCount", index + 1)}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.ownerCount === index + 1
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-foreground hover:border-primary/50"
              }`}
            >
              {owner}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
