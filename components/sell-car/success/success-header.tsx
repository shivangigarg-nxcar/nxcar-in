"use client";

import {
  CarFront,
  Sparkles,
  Shield,
  Zap,
  Check,
  Car,
  User,
  MapPin,
  Fuel,
  Gauge,
  Palette,
  IndianRupee,
} from "lucide-react";
import { OWNER_OPTIONS } from "../sell-constants";

interface SuccessHeaderFormData {
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
}

interface InspectionAvailableHeaderProps {
  formData: SuccessHeaderFormData;
}

export function InspectionAvailableHeader({ formData }: InspectionAvailableHeaderProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg mb-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 flex items-center justify-center">
        <Shield className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Book Car Inspection</h2>
      <p className="text-muted-foreground">
        Inspection is available in <span className="font-semibold text-foreground">{formData.location}</span>. Schedule your 280+ point inspection below.
      </p>
      {formData.brand && (
        <p className="text-sm text-muted-foreground mt-2">
          {formData.year} {formData.brand} {formData.model} {formData.variant ? `• ${formData.variant}` : ""}
        </p>
      )}
    </div>
  );
}

interface SuccessStepperProps {
  activeSuccessStep: number;
  setActiveSuccessStep: (step: number) => void;
}

export function SuccessStepper({ activeSuccessStep, setActiveSuccessStep }: SuccessStepperProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-border/50 shadow-lg mb-6" data-testid="success-stepper">
      <div className="flex items-center justify-between">
        {[
          { label: "Car Details", icon: CarFront },
          { label: "Nxcar Price", icon: Sparkles },
        ].map((step, index) => {
          const isCompleted = index < activeSuccessStep;
          const isActive = index === activeSuccessStep;
          const isFuture = index > activeSuccessStep;
          const StepIcon = step.icon;
          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => { if (isCompleted || isActive) setActiveSuccessStep(index); }}
                disabled={isFuture}
                data-testid={`stepper-step-${index}`}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                  isCompleted ? "bg-gradient-to-br from-primary to-teal-500 shadow-lg shadow-primary/30"
                    : isActive ? "bg-gradient-to-br from-primary to-teal-500 shadow-lg shadow-primary/30 ring-4 ring-primary/20"
                      : "bg-muted/50 border-2 border-border/50"
                }`}>
                  {isCompleted ? <Check className="w-5 h-5 text-white" /> : <StepIcon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground/50"}`} />}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[70px] sm:max-w-none ${
                  isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/50"
                }`}>{step.label}</span>
              </button>
              {index < 3 && (
                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-all ${index < activeSuccessStep ? "bg-gradient-to-r from-primary to-teal-500" : "bg-border/50"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CarDetailsTabProps {
  formData: SuccessHeaderFormData;
}

export function CarDetailsTab({ formData }: CarDetailsTabProps) {
  return (
    <div data-testid="tab-content-details">
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{formData.year} {formData.brand} {formData.model}</h2>
            <p className="text-muted-foreground">{formData.variant || "Standard Variant"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"><Fuel className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{formData.fuelType}</span></div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"><Gauge className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{formData.transmission}</span></div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"><User className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{OWNER_OPTIONS[formData.ownerCount - 1] || "1st Owner"}</span></div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"><Car className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{formData.vehicleNumber}</span></div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"><Palette className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{formData.color}</span></div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"><Gauge className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{formData.kilometers.toLocaleString()} km</span></div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 col-span-2"><MapPin className="w-4 h-4 text-primary" /><span className="text-sm text-foreground">{formData.location}</span></div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <IndianRupee className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Your Expected Price</p>
            <p className="text-xl font-bold text-primary">₹{formData.expectedPrice.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NxcarPriceTabProps {
  expectedPrice: number;
}

export function NxcarPriceTab({ expectedPrice }: NxcarPriceTabProps) {
  return (
    <div data-testid="tab-content-price">
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4"><Zap className="w-4 h-4" />AI-Powered Valuation</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Projected Valuation</h2>
          <p className="text-muted-foreground">by Nxcar AI Price Engine</p>
        </div>
        <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-teal-500/10 to-cyan-500/10 border border-primary/20 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            ₹{Math.round(expectedPrice * 0.92).toLocaleString("en-IN")} - ₹{Math.round(expectedPrice * 1.08).toLocaleString("en-IN")}
          </span>
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">Valuation considers similar cars' model, age, mileage, and fuel type, with final price based on condition, location, and demand.</p>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Book inspection for accurate pricing</p>
              <p className="text-sm text-muted-foreground">Final price determined after physical inspection of your car</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
