"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import type { InspectionSlot, InspectionFranchise } from "@lib/api";
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Quote,
  Sparkles,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { OWNER_OPTIONS } from "../sell-constants";
import { FranchiseList } from "./franchise-list";

interface InspectionBookingFormData {
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

export interface InspectionBookingProps {
  formData: InspectionBookingFormData;
  selectedCityInspectionAvailable: boolean;
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

export function InspectionBooking(props: InspectionBookingProps) {
  const {
    formData,
    selectedCityInspectionAvailable,
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

  if (inspectionBooked) {
    return (
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
    );
  }

  return (
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
        <FranchiseList
          franchises={franchises}
          franchisesLoading={franchisesLoading}
          franchisesError={franchisesError}
          inspectionMode={inspectionMode}
          selectedFranchise={selectedFranchise}
          setSelectedFranchise={setSelectedFranchise}
          setInspectionMode={setInspectionMode}
          inspectionLocation={inspectionLocation}
          setInspectionLocation={setInspectionLocation}
        />

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
  );
}
