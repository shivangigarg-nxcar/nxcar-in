'use client';

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Car } from "lucide-react";

const OWNER_OPTIONS = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner", "5th+ Owner"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic", "CVT", "DCT", "AMT"];

interface CarDetailsSectionProps {
  formData: {
    vehicleNumber: string;
    brand: string;
    model: string;
    variant: string;
    year: number;
    fuelType: string;
    transmission: string;
    kilometers: number;
    color: string;
    ownerCount: number;
    location: string;
    state: string;
    expectedPrice: number;
    description: string;
  };
  updateField: (field: string, value: any) => void;
  formatPrice: (price: number) => string;
}

export function CarDetailsSection({ formData, updateField, formatPrice }: CarDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-teal-500" />
            </div>
            Car Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Vehicle Number</label>
            <Input
              value={formData.vehicleNumber}
              disabled
              className="bg-muted/50 cursor-not-allowed"
              data-testid="input-vehicle-number"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Brand *</label>
              <Input
                value={formData.brand}
                onChange={e => updateField("brand", e.target.value)}
                placeholder="e.g. Maruti Suzuki"
                data-testid="input-brand"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Model *</label>
              <Input
                value={formData.model}
                onChange={e => updateField("model", e.target.value)}
                placeholder="e.g. Swift"
                data-testid="input-model"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Variant</label>
              <Input
                value={formData.variant}
                onChange={e => updateField("variant", e.target.value)}
                placeholder="e.g. VXi"
                data-testid="input-variant"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Year</label>
              <Input
                type="number"
                value={formData.year || ""}
                onChange={e => updateField("year", parseInt(e.target.value) || 0)}
                placeholder="e.g. 2020"
                data-testid="input-year"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={e => updateField("fuelType", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-testid="select-fuel-type"
              >
                <option value="">Select</option>
                {FUEL_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Transmission</label>
              <select
                value={formData.transmission}
                onChange={e => updateField("transmission", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-testid="select-transmission"
              >
                <option value="">Select</option>
                {TRANSMISSION_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Kilometers Driven</label>
              <Input
                type="number"
                value={formData.kilometers || ""}
                onChange={e => updateField("kilometers", parseInt(e.target.value) || 0)}
                placeholder="e.g. 35000"
                data-testid="input-kilometers"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Color</label>
              <Input
                value={formData.color}
                onChange={e => updateField("color", e.target.value)}
                placeholder="e.g. White"
                data-testid="input-color"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Owner Count</label>
              <select
                value={formData.ownerCount}
                onChange={e => updateField("ownerCount", parseInt(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-testid="select-owner-count"
              >
                {OWNER_OPTIONS.map((o, i) => <option key={o} value={i + 1}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Location</label>
              <Input
                value={formData.location}
                onChange={e => updateField("location", e.target.value)}
                placeholder="e.g. Delhi"
                data-testid="input-location"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">State</label>
              <Input
                value={formData.state}
                onChange={e => updateField("state", e.target.value)}
                placeholder="e.g. Delhi"
                data-testid="input-state"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Expected Price (₹)</label>
            <div className="relative">
              <Input
                type="number"
                value={formData.expectedPrice || ""}
                onChange={e => updateField("expectedPrice", parseInt(e.target.value) || 0)}
                placeholder="e.g. 450000"
                data-testid="input-expected-price"
              />
              {formData.expectedPrice > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-500 font-medium">
                  {formatPrice(formData.expectedPrice)}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={e => updateField("description", e.target.value)}
              placeholder="Any additional details about your car..."
              rows={4}
              className="resize-none"
              data-testid="input-description"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
