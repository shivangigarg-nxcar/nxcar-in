"use client";

import React from "react";
import { Input } from "@components/ui/input";
import { User, Phone, Mail } from "lucide-react";
import type { SellStepsProps } from "../sell-steps";

type Props = Pick<SellStepsProps, "formData" | "updateField">;

export function SellerInfoStep({ formData, updateField }: Props) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <Input
          data-testid="input-seller-name"
          value={formData.sellerName}
          onChange={(e) => updateField("sellerName", e.target.value)}
          placeholder="Your Name"
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
      </div>
      <div className="relative">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <Input
          data-testid="input-seller-phone"
          value={formData.sellerPhone}
          onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); updateField("sellerPhone", val); }}
          placeholder="Phone Number"
          inputMode="numeric"
          maxLength={10}
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <Input
          data-testid="input-seller-email"
          type="email"
          value={formData.sellerEmail}
          onChange={(e) => updateField("sellerEmail", e.target.value)}
          placeholder="Email (optional)"
          className="h-14 pl-12 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
        />
      </div>
    </div>
  );
}
