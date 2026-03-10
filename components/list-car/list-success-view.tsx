"use client";

import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import {
  CheckCircle2,
  CarFront,
  Fuel,
  Gauge,
  User,
  Car,
  Palette,
  MapPin,
  IndianRupee,
  Plus,
} from "lucide-react";

const OWNER_OPTIONS = [
  "1st Owner",
  "2nd Owner",
  "3rd Owner",
  "4th Owner",
  "5th+ Owner",
];

interface ListSuccessViewProps {
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
    expectedPrice: number;
  };
  submittedVehicleId: string;
  uploadedImages: string[];
  resetForm: () => void;
}

export function ListSuccessView({
  formData,
  submittedVehicleId,
  uploadedImages,
  resetForm,
}: ListSuccessViewProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
      data-testid="list-car-success"
    >
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg mb-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" data-testid="text-listing-success">
          Car Listed Successfully!
        </h2>
        <p className="text-muted-foreground mb-1">
          Your car has been listed on Nxcar and is now visible to buyers.
        </p>
        {submittedVehicleId && (
          <p className="text-sm text-primary font-medium" data-testid="text-vehicle-id">
            Vehicle ID: {submittedVehicleId}
          </p>
        )}
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
            <CarFront className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground" data-testid="text-listed-car-name">
              {formData.year} {formData.brand} {formData.model}
            </h3>
            <p className="text-muted-foreground">
              {formData.variant || "Standard Variant"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{formData.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{formData.transmission}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">
              {OWNER_OPTIONS[formData.ownerCount - 1] || "1st Owner"}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <Car className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{formData.vehicleNumber}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{formData.kilometers.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{formData.color}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 col-span-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{formData.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <IndianRupee className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Listing Price</p>
            <p className="text-xl font-bold text-primary" data-testid="text-listing-price">
              ₹{formData.expectedPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">{uploadedImages.length} photo(s) uploaded</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img src={`/api/objects/${img}`} alt={`Car photo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={resetForm}
          data-testid="button-list-another"
          className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white px-8 py-3 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          List Another Car
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/my-cars"}
          data-testid="button-view-listings"
          className="px-8 py-3 rounded-xl border-2"
        >
          View My Listings
        </Button>
      </div>
    </motion.div>
  );
}
