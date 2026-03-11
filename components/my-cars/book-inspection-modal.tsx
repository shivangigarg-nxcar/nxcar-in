'use client';

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2, ClipboardCheck, X, Calendar, Clock, MapPinned, CheckCircle2, ArrowRight, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@hooks/use-toast";


interface InspectionSlot {
  slot_id: string;
  slot_name: string;
  slot_time: string;
  is_available: boolean;
}

interface SellCity {
  city_id: string;
  city_name: string;
  inspection_available: boolean;
}

export function BookInspectionModal({ car, onClose }: { car: any; onClose: () => void }) {
  const { toast } = useToast();
  const router = useRouter();
  const vehicleId = car.vehicle_id || car.id;
  const carName = `${car.make || ''} ${car.model || ''}`.trim();
  const location = car.city_name || car.city || car.location || "";
  const docUploadUrl = `/upload-documents?vehicle_id=${vehicleId}`;

  const [city, setCity] = useState(location);
  const [inspectionDate, setInspectionDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: slotsData } = useQuery({
    queryKey: ["inspection-slots"],
    queryFn: async () => {
      const res = await fetch("/api/nxcar/inspection-slots");
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      return (data.data || []) as InspectionSlot[];
    },
  });

  const { data: citiesData } = useQuery({
    queryKey: ["sell-cities"],
    queryFn: async () => {
      const res = await fetch("/api/sell-cities");
      if (!res.ok) throw new Error("Failed to fetch cities");
      const json = await res.json();
      return (json.cities || json || []) as SellCity[];
    },
  });

  const slots = slotsData || [];
  const cities = (citiesData || []).filter(c => c.inspection_available !== false);

  function toLocalDateString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getMinDate() {
    return toLocalDateString(new Date());
  }

  function isSlotTooSoon(slotTime: string, dateStr: string): boolean {
    const todayStr = toLocalDateString(new Date());
    if (dateStr !== todayStr) return false;
    const match = slotTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return false;
    let hour = parseInt(match[1], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return hour < currentHour + 2;
  }

  function formatDateForApi(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  }

  async function handleSubmit() {
    if (!city || !inspectionDate || !timeSlot || !address) {
      toast({ title: "Missing details", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const pincodeMatch = address.match(/\b(\d{6})\b/);
    const pincode = pincodeMatch ? pincodeMatch[1] : "";

    setSubmitting(true);
    try {
      const selectedSlot = slots.find(s => s.slot_id === timeSlot);
      const res = await fetch("/api/book-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          city,
          inspection_date: formatDateForApi(inspectionDate),
          pincode,
          address,
          time: selectedSlot?.slot_name || timeSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book inspection");
      }

      setSuccess(true);
      toast({ title: "Inspection Booked!", description: `Your inspection for ${carName} has been scheduled.` });
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground" data-testid="text-book-inspection-title">Book Inspection</h2>
              <p className="text-xs text-muted-foreground">{carName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" data-testid="button-close-inspection-modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1" data-testid="text-inspection-success">Inspection Booked!</h3>
            <p className="text-sm text-muted-foreground mb-5">
              We'll contact you to confirm the inspection for your {carName}.
            </p>

            <div className="w-full bg-muted/50 rounded-2xl p-4 border border-border/50 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                <span className="text-sm font-semibold text-foreground">Next Step</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Upload Documents</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Upload your RC copy, insurance, PAN card and payment details to speed up the selling process.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    router.push(docUploadUrl);
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-sm font-semibold gap-2"
                  data-testid="button-upload-now"
                >
                  <Upload className="w-4 h-4" />
                  Upload Now
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl h-11 text-sm font-semibold border-border hover:bg-muted"
                  data-testid="button-upload-later"
                >
                  I'll Do It Later
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              You can always upload documents from your car's detail page
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MapPinned className="w-3.5 h-3.5 text-primary" /> City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                data-testid="select-inspection-city"
              >
                <option value="">Select city</option>
                {cities.map(c => (
                  <option key={c.city_id} value={c.city_name}>{c.city_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Inspection Date
              </label>
              <Input
                type="date"
                value={inspectionDate}
                onChange={(e) => {
                  setInspectionDate(e.target.value);
                  if (timeSlot) {
                    const selectedSlotObj = slots.find(s => s.slot_id === timeSlot);
                    if (selectedSlotObj && isSlotTooSoon(selectedSlotObj.slot_time, e.target.value)) {
                      setTimeSlot("");
                    }
                  }
                }}
                min={getMinDate()}
                className="rounded-xl"
                data-testid="input-inspection-date"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {slots.length > 0 ? slots.map(slot => {
                  const tooSoon = inspectionDate ? isSlotTooSoon(slot.slot_time, inspectionDate) : false;
                  const disabled = !slot.is_available || tooSoon;
                  return (
                    <button
                      key={slot.slot_id}
                      type="button"
                      onClick={() => !disabled && setTimeSlot(slot.slot_id)}
                      disabled={disabled}
                      className={`px-2 py-2.5 rounded-xl text-xs font-medium transition-all border text-center ${
                        disabled
                          ? "bg-muted/50 border-border/50 text-muted-foreground/50 cursor-not-allowed"
                          : timeSlot === slot.slot_id
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                      data-testid={`button-slot-${slot.slot_id}`}
                    >
                      <div className="font-semibold">{slot.slot_name}</div>
                      <div className="text-[10px] mt-0.5 opacity-70">
                        {disabled ? "Not available" : slot.slot_time}
                      </div>
                    </button>
                  );
                }) : (
                  <>{[1, 2, 3].map((i) => (<div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />))}</>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MapPinned className="w-3.5 h-3.5 text-primary" /> Address
              </label>
              <textarea
                placeholder="Full address for inspection"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                data-testid="input-inspection-address"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white rounded-xl py-3 mt-2"
              data-testid="button-submit-inspection"
            >
              {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</>) : "Book Inspection"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
