'use client';

import { CollapsibleSection } from "./collapsible-section";
import { Input } from "@components/ui/input";
import { User } from "lucide-react";

interface SellerInfoSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: {
    sellerName: string;
    sellerPhone: string;
    sellerEmail: string;
  };
  updateField: (field: string, value: any) => void;
}

export function SellerInfoSection({
  isOpen,
  onToggle,
  formData,
  updateField,
}: SellerInfoSectionProps) {
  return (
    <CollapsibleSection
      title="Seller Information"
      icon={<User className="w-5 h-5 text-teal-500" />}
      isOpen={isOpen}
      onToggle={onToggle}
      testId="seller"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Seller Name *</label>
          <Input
            value={formData.sellerName}
            onChange={e => updateField("sellerName", e.target.value)}
            placeholder="Your name"
            data-testid="input-seller-name"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Phone *</label>
            <Input
              value={formData.sellerPhone}
              onChange={e => updateField("sellerPhone", e.target.value)}
              placeholder="Your phone number"
              data-testid="input-seller-phone"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
            <Input
              value={formData.sellerEmail}
              onChange={e => updateField("sellerEmail", e.target.value)}
              placeholder="Your email"
              type="email"
              data-testid="input-seller-email"
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
