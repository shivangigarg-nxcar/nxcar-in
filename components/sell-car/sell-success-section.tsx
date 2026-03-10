"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import type { InspectionSlot, InspectionFranchise } from "@lib/api";
import {
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  MapPin,
  Fuel,
  Calendar,
  Gauge,
  Palette,
  IndianRupee,
  Sparkles,
  CarFront,
  Home,
  Clock,
  Shield,
  Award,
  Zap,
  Quote,
  Building2,
  ExternalLink,
  Check,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { OWNER_OPTIONS } from "./sell-constants";

interface SuccessSectionFormData {
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
  rtoCode: string;
  expectedPrice: number;
}

export interface SellSuccessSectionProps {
  formData: SuccessSectionFormData;
  selectedCityInspectionAvailable: boolean;
  activeSuccessStep: number;
  setActiveSuccessStep: (step: number) => void;
  inspectionBooked: boolean;
  inspectionMode: "franchise" | "home";
  setInspectionMode: (mode: "franchise" | "home") => void;
  selectedFranchise: InspectionFranchise | null;
  setSelectedFranchise: (franchise: InspectionFranchise | null) => void;
  selectedSlot: InspectionSlot | null;
  setSelectedSlot: (slot: InspectionSlot | null) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  inspectionLocation: string;
  setInspectionLocation: (location: string) => void;
  franchises: InspectionFranchise[];
  franchisesLoading: boolean;
  franchisesError: boolean;
  inspectionSlots: InspectionSlot[];
  slotsLoading: boolean;
  bookInspectionMutation: {
    isPending: boolean;
    mutate: (data: Record<string, any>) => void;
  };
  resetForm: () => void;
  submittedVehicleId: string;
  savedCarListingId: number | null;
  extractPincode: (addr: string) => string;
  buildSellData: () => Record<string, any>;
  getCityId: (location: string) => string;
  cityNumericId: string;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
  onBookInspectionToast: (title: string, description: string) => void;
}

export function SellSuccessSection(props: SellSuccessSectionProps) {
  const {
    formData,
    selectedCityInspectionAvailable,
    activeSuccessStep,
    setActiveSuccessStep,
    inspectionBooked,
    inspectionMode,
    setInspectionMode,
    selectedFranchise,
    setSelectedFranchise,
    selectedSlot,
    setSelectedSlot,
    selectedDate,
    setSelectedDate,
    inspectionLocation,
    setInspectionLocation,
    franchises,
    franchisesLoading,
    franchisesError,
    inspectionSlots,
    slotsLoading,
    bookInspectionMutation,
    resetForm,
    submittedVehicleId,
    savedCarListingId,
    extractPincode,
    buildSellData,
    getCityId,
    cityNumericId,
    isAuthenticated,
    onLoginRequired,
    onBookInspectionToast,
  } = props;

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { date: Date; dateString: string; day: number; isCurrentMonth: boolean; isPast: boolean }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      const d = new Date(year, month, -startDayOfWeek + i + 1);
      days.push({ date: d, dateString: d.toISOString().split("T")[0], day: d.getDate(), isCurrentMonth: false, isPast: d < today });
    }
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      days.push({ date, dateString: date.toISOString().split("T")[0], day: d, isCurrentMonth: true, isPast: date < today });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d, dateString: d.toISOString().split("T")[0], day: i, isCurrentMonth: false, isPast: d < today });
      }
    }
    return days;
  }, [calendarMonth]);

  const calendarMonthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const canGoPrevMonth = useMemo(() => {
    const now = new Date();
    return calendarMonth.year > now.getFullYear() || (calendarMonth.year === now.getFullYear() && calendarMonth.month > now.getMonth());
  }, [calendarMonth]);

  const handleBookInspection = () => {
    const hasLocation = inspectionMode === "franchise" ? !!selectedFranchise : !!inspectionLocation.trim();
    if (hasLocation && selectedDate && selectedSlot) {
      const dateParts = selectedDate.split("-");
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const resolvedCityId = cityNumericId || getCityId(formData.location);
      const address = inspectionMode === "franchise" && selectedFranchise
        ? selectedFranchise.franchise_address
        : inspectionLocation.trim();
      const inspectionData: Record<string, any> = {
        vehicle_id: submittedVehicleId,
        city: resolvedCityId,
        inspection_date: formattedDate,
        pincode: extractPincode(address),
        address: address,
        time: selectedSlot.slot_name === "Evening" ? "Evening" : "Morning",
      };
      if (selectedCityInspectionAvailable && !submittedVehicleId) {
        inspectionData.sell_data = buildSellData();
      }
      if (!isAuthenticated) {
        onLoginRequired();
        return;
      }
      bookInspectionMutation.mutate(inspectionData);
    } else if (!hasLocation) {
      onBookInspectionToast("Select Location", "Please select a franchise location or enter your address");
    } else if (!selectedDate) {
      onBookInspectionToast("Select Date", "Please select a preferred date for inspection");
    } else if (!selectedSlot) {
      onBookInspectionToast("Select Time Slot", "Please select a preferred time slot");
    }
  };

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {selectedCityInspectionAvailable && (
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
      )}

      {!selectedCityInspectionAvailable && (
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
      )}

      {!selectedCityInspectionAvailable && activeSuccessStep === 0 && (
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
      )}

      {!selectedCityInspectionAvailable && activeSuccessStep === 1 && (
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
                ₹{Math.round(formData.expectedPrice * 0.92).toLocaleString("en-IN")} - ₹{Math.round(formData.expectedPrice * 1.08).toLocaleString("en-IN")}
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
      )}

      {selectedCityInspectionAvailable && activeSuccessStep === 2 && (
        <div data-testid="tab-content-inspection">
          <div className="space-y-6">
            {inspectionBooked ? (
              <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Inspection Booked!</h2>
                  <p className="text-muted-foreground mb-4">{inspectionMode === "franchise" && selectedFranchise ? "Visit us at:" : "Our expert will visit at:"}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-muted max-w-md">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground text-sm text-left">{inspectionMode === "franchise" && selectedFranchise ? selectedFranchise.franchise_name : inspectionLocation}</span>
                  </div>
                  {selectedDate && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 mt-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground text-sm">{selectedDate}</span>
                    </div>
                  )}
                  {selectedSlot && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 mt-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground text-sm">{selectedSlot.slot_name}: {selectedSlot.slot_time}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-4">We'll contact you within 24 hours to confirm</p>

                  <div className="w-full max-w-sm mx-auto mt-6 bg-muted/50 rounded-2xl p-4 border border-border/50 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                      <span className="text-sm font-semibold text-foreground">Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-primary">Upload Documents</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Upload your RC copy, insurance, PAN card and payment details to speed up the selling process.</p>
                    <div className="flex gap-3">
                      <a
                        href={savedCarListingId
                          ? `/used-cars/${(formData.location || "india").toLowerCase().replace(/\s+/g, "-")}/${(formData.brand || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(formData.model || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}${formData.year || ""}-${savedCarListingId}?from=sell`
                          : "/my-cars"}
                        className="flex-1"
                        data-testid="button-upload-docs"
                      >
                        <Button type="button" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-sm font-semibold gap-2">
                          <Upload className="w-4 h-4" />Upload Now
                        </Button>
                      </a>
                      <Button type="button" variant="outline" onClick={resetForm} className="flex-1 rounded-xl h-11 text-sm font-semibold border-border hover:bg-muted" data-testid="button-upload-later">
                        I'll Do It Later
                      </Button>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3">You can always upload documents from the My Cars page</p>
                </div>
              </div>
            ) : (
              <>
                {!selectedCityInspectionAvailable && (
                  <>
                    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-border/50 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <Quote className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground">{formData.brand}</h3>
                          <p className="text-sm text-muted-foreground truncate">{formData.year} {formData.brand} {formData.model} {formData.variant}</p>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{formData.fuelType}</span><span>•</span>
                            <span>{formData.transmission}</span><span>•</span>
                            <span>{OWNER_OPTIONS[formData.ownerCount - 1] || "1st Owner"}</span><span>•</span>
                            <span>{formData.rtoCode || formData.vehicleNumber?.slice(0, 4)}</span><span>•</span>
                            <span>{formData.color}</span><span>•</span>
                            <span>{formData.kilometers.toLocaleString()} Km</span><span>•</span>
                            <span>{formData.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-primary/20 shadow-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Quote className="w-4 h-4" />Projected valuation by <span className="text-primary font-semibold">nxcar-ai-price</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 py-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                          ₹{Math.round(formData.expectedPrice * 0.92).toLocaleString("en-IN")} - ₹{Math.round(formData.expectedPrice * 1.08).toLocaleString("en-IN")}
                        </span>
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Valuation considers similar cars' model, age, mileage, and fuel type, with final price based on condition, location, and demand.</p>
                    </div>
                  </>
                )}

                <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div><p className="font-medium text-foreground text-sm">Book your inspection to get the best offer</p></div>
                  </div>
                </div>

                <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-border/50 shadow-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Choose Location*</label>
                    <div className="space-y-2 mb-4">
                      {franchisesLoading ? (
                        <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                      ) : franchises.length > 0 ? (
                        franchises.map((franchise) => (
                          <button
                            key={franchise.franchise_id}
                            type="button"
                            onClick={() => { setSelectedFranchise(franchise); setInspectionMode("franchise"); setInspectionLocation(""); }}
                            data-testid={`franchise-${franchise.franchise_id}`}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-left ${
                              inspectionMode === "franchise" && selectedFranchise?.franchise_id === franchise.franchise_id
                                ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"
                            }`}
                          >
                            <Building2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${inspectionMode === "franchise" && selectedFranchise?.franchise_id === franchise.franchise_id ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm">{franchise.franchise_name}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{franchise.franchise_address}</p>
                              {franchise.map_location && (
                                <a href={franchise.map_location} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                                  <ExternalLink className="w-3 h-3" />View on Map
                                </a>
                              )}
                            </div>
                            {inspectionMode === "franchise" && selectedFranchise?.franchise_id === franchise.franchise_id && (
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                          </button>
                        ))
                      ) : franchisesError ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground text-sm">Unable to load franchise locations</p>
                          <p className="text-xs text-muted-foreground mt-1">Please use home/office inspection option below</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4 text-sm">No franchise locations in your area</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-sm text-muted-foreground font-medium">Or</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setInspectionMode("home"); setSelectedFranchise(null); }}
                      data-testid="home-inspection-option"
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${inspectionMode === "home" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
                    >
                      <Home className={`w-5 h-5 ${inspectionMode === "home" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-medium text-foreground text-sm">Request inspection at your home/office</span>
                      {inspectionMode === "home" && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                    </button>

                    {inspectionMode === "home" && (
                      <div className="mt-4 space-y-3">
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                          <Input
                            data-testid="input-inspection-location"
                            value={inspectionLocation}
                            onChange={(e) => setInspectionLocation(e.target.value)}
                            placeholder="Enter your complete address"
                            className="h-14 pl-12 text-base bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {(selectedFranchise || (inspectionMode === "home" && inspectionLocation.trim())) && (
                    <div className="pt-4 border-t border-border">
                      <label className="block text-sm font-medium text-foreground mb-3">Select Date*</label>
                      <div className="bg-background/50 border border-border rounded-xl p-3" data-testid="inspection-calendar">
                        <div className="flex items-center justify-between mb-3">
                          <button
                            type="button"
                            onClick={() => {
                              const prev = calendarMonth.month === 0
                                ? { year: calendarMonth.year - 1, month: 11 }
                                : { year: calendarMonth.year, month: calendarMonth.month - 1 };
                              setCalendarMonth(prev);
                            }}
                            disabled={!canGoPrevMonth}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            data-testid="calendar-prev-month"
                          >
                            <ChevronLeft className="w-4 h-4 text-foreground" />
                          </button>
                          <span className="text-sm font-semibold text-foreground" data-testid="calendar-month-label">{calendarMonthLabel}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = calendarMonth.month === 11
                                ? { year: calendarMonth.year + 1, month: 0 }
                                : { year: calendarMonth.year, month: calendarMonth.month + 1 };
                              setCalendarMonth(next);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                            data-testid="calendar-next-month"
                          >
                            <ChevronRight className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {calendarDays.map((day, idx) => {
                            const isSelected = selectedDate === day.dateString;
                            const isToday = day.dateString === new Date().toISOString().split("T")[0];
                            const isDisabled = day.isPast || !day.isCurrentMonth;
                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => setSelectedDate(day.dateString)}
                                data-testid={`date-${day.dateString}`}
                                className={`relative w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                                  isSelected ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                    : isToday && day.isCurrentMonth ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                                      : !day.isCurrentMonth ? "text-muted-foreground/30 cursor-default"
                                        : day.isPast ? "text-muted-foreground/40 cursor-not-allowed"
                                          : "text-foreground hover:bg-muted cursor-pointer"
                                }`}
                              >
                                {day.day}
                              </button>
                            );
                          })}
                        </div>
                        {selectedDate && (
                          <div className="mt-2 pt-2 border-t border-border/50 text-center">
                            <span className="text-xs text-muted-foreground">Selected: </span>
                            <span className="text-xs font-semibold text-primary">
                              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(selectedFranchise || (inspectionMode === "home" && inspectionLocation.trim())) && selectedDate && (
                    <div className="pt-4 border-t border-border">
                      <label className="block text-sm font-medium text-foreground mb-3">Select Time Slot*</label>
                      {slotsLoading ? (
                        <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
                      ) : inspectionSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {inspectionSlots.filter((slot) => slot.is_available).map((slot) => (
                            <button
                              key={slot.slot_id}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              data-testid={`slot-${slot.slot_id}`}
                              className={`p-3 rounded-xl border-2 transition-all ${selectedSlot?.slot_id === slot.slot_id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className={`w-4 h-4 ${selectedSlot?.slot_id === slot.slot_id ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="font-medium text-foreground text-sm">{slot.slot_name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{slot.slot_time}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4 text-sm">Loading available slots...</p>
                      )}
                    </div>
                  )}

                  <Button
                    data-testid="button-book-inspection"
                    onClick={handleBookInspection}
                    disabled={
                      !(inspectionMode === "franchise" ? !!selectedFranchise : !!inspectionLocation.trim()) ||
                      !selectedDate || !selectedSlot || bookInspectionMutation.isPending
                    }
                    className="w-full h-14 text-lg bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookInspectionMutation.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Clock className="w-5 h-5 mr-2" />}
                    {bookInspectionMutation.isPending ? "Booking..." : "Book Inspection Now"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">Get final price after inspection</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!selectedCityInspectionAvailable && activeSuccessStep === 3 && (
        <div data-testid="tab-content-offers">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <Award className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No Offers Yet</h2>
              <p className="text-muted-foreground mb-6">
                {inspectionBooked ? "Offers will appear after your inspection is complete" : "Book an inspection to receive offers from verified dealers"}
              </p>
              {!inspectionBooked && (
                <Button onClick={() => setActiveSuccessStep(2)} className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white px-6 py-3 rounded-xl" data-testid="button-book-inspection-first">
                  Book Inspection First
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCityInspectionAvailable ? (
        <div className="flex items-center justify-center mt-6">
          <Button onClick={resetForm} variant="outline" data-testid="button-sell-another-car" className="px-6 py-3 rounded-xl border-2 border-border">
            <ArrowLeft className="w-4 h-4 mr-2" />Sell Another Car
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-6 gap-4">
          {activeSuccessStep > 0 ? (
            <button type="button" onClick={() => setActiveSuccessStep(activeSuccessStep - 1)} data-testid="button-prev-step" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
          ) : (
            <div />
          )}
          {(() => {
            const maxStep = selectedCityInspectionAvailable ? 2 : 1;
            return activeSuccessStep < maxStep ? (
              <Button
                onClick={() => setActiveSuccessStep(activeSuccessStep + 1)}
                data-testid="button-next-step"
                className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/20"
              >
                {activeSuccessStep === 0 && "Next: See Nxcar Price"}
                {activeSuccessStep === 1 && selectedCityInspectionAvailable && "Next: Book Inspection"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={resetForm}
                data-testid="button-list-another-car"
                className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary/20"
              >
                {selectedCityInspectionAvailable ? "Done" : "List Another Car"}
              </Button>
            );
          })()}
        </div>
      )}
    </motion.div>
  );
}
