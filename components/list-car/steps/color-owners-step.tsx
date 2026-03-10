"use client";

import { Input } from "@components/ui/input";
import { Palette } from "lucide-react";

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
}

export function ColorOwnersStep({ formData, updateField }: ColorOwnersStepProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <Input
          data-testid="input-color"
          value={formData.color}
          onChange={(e) => updateField("color", e.target.value)}
          placeholder="Car Color (e.g., White, Black)"
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
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
