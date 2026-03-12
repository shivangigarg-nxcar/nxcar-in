"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Upload, 
  FileText,
  ChevronUp,
  CheckCircle2,
  X,
  PartyPopper,
} from "lucide-react";
import { Button } from "@components/ui/button";
import type { InspectionSlot, InspectionFranchise } from "@lib/api";
import { InlineDocumentUpload } from "./inline-document-upload";

interface InspectionSuccessViewProps {
  inspectionMode: "franchise" | "home";
  selectedFranchise: InspectionFranchise | null;
  inspectionLocation: string;
  selectedDate: string;
  selectedSlot: InspectionSlot | null;
  submittedVehicleId: string;
  resetForm: () => void;
}

const expectNextItems = [
  "Nxcar team will call or message you to confirm the inspection appointment.",
  "Our engineers will perform a 200+ points inspection at your doorstep at the scheduled time.",
  "You will receive a detailed inspection report and we will showcase the car to hundreds to registered dealers on Nxcar platform for bidding.",
  "Once you accept the winning bid, we will share our final offer to you and arrange the payment securely to your bank account at the time of pick up of the car.",
  "We will handle all the paperwork for transfer and you will be protected by Nxcar Seller Guaranty from any liabilities.",
];

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ThankYouModal({ onClose, vehicleId }: { onClose: () => void; vehicleId: string }) {
  const router = useRouter();

  const handleGoToMyCars = () => {
    onClose();
    router.push(`/my-cars?thank_you=${vehicleId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      data-testid="thank-you-modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        data-testid="thank-you-modal"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
          data-testid="button-close-thank-you"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-teal-400/20 flex items-center justify-center"
          >
            <PartyPopper className="w-10 h-10 text-primary" />
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2" data-testid="text-thank-you-title">
            Thank You!
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            Your car listing is now under review.
          </p>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            Our team will review your listing and get back to you shortly. You can upload
            documents anytime from the My Cars section.
          </p>

          <div className="space-y-2">
            <Button
              onClick={handleGoToMyCars}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold"
              data-testid="button-go-to-my-cars"
            >
              Go to My Cars
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full h-10 text-sm text-muted-foreground hover:text-foreground"
              data-testid="button-stay-on-page"
            >
              Stay on this page
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function InspectionSuccessView(props: InspectionSuccessViewProps) {
  const {
    inspectionMode,
    selectedFranchise,
    inspectionLocation,
    selectedDate,
    selectedSlot,
    submittedVehicleId,
    resetForm,
  } = props;

  const router = useRouter();
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [docUploadDismissed, setDocUploadDismissed] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const address =
    inspectionMode === "franchise" && selectedFranchise
      ? selectedFranchise.franchise_address || selectedFranchise.franchise_name
      : inspectionLocation;

  const locationName =
    inspectionMode === "franchise" && selectedFranchise
      ? selectedFranchise.franchise_name
      : inspectionLocation;

  const mapQuery = encodeURIComponent(address);

  const handleUploadLater = () => {
    setDocUploadDismissed(true);
    setShowThankYouModal(true);
  };

  const handleDocUploadDone = () => {
    setShowDocUpload(false);
    setDocUploadDismissed(true);
    router.push(`/my-cars?thank_you=${submittedVehicleId}`);
  };

  if (showDocUpload) {
    return (
      <InlineDocumentUpload
        vehicleId={submittedVehicleId}
        onBack={() => setShowDocUpload(false)}
        onDone={handleDocUploadDone}
      />
    );
  }

  return (
    <>
      <div className="space-y-6 pb-28" data-testid="inspection-success-view">
        <div className="flex items-center justify-center gap-2 sm:gap-4" data-testid="success-stepper-bar">
          {["Car Details", "Nxcar Price", "Inspection Booked", "Best Offers"].map((label, i) => {
            const isCompleted = i < 3;
            const isLast = i === 3;
            return (
              <div key={label} className="flex items-center gap-1 sm:gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-primary text-white" : "bg-primary/20 border-2 border-primary"
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                    isCompleted ? "text-primary" : "text-muted-foreground"
                  }`}>{label}</span>
                </div>
                {!isLast && (
                  <div className={`w-6 sm:w-12 h-0.5 mb-4 ${i < 2 ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl overflow-hidden" data-testid="process-steps-section">
          <img
            src="/images/process-steps.png"
            alt="Process: 1. Car Details - Fill your car details in 2 mins, 2. Price Recommendation - Nxcar AI recommended price, 3. Inspection - 200+ points of detailed inspection report, 4. Car Auction - We'll hold the auction for car & provide best offer"
            className="w-full h-auto"
            data-testid="img-process-steps"
          />
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 p-6 sm:p-8" data-testid="what-to-expect-section">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5" data-testid="text-what-to-expect">What to Expect Next</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <ul className="space-y-3">
                {expectNextItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            {address && (
              <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
                  <iframe
                    title="Inspection Location"
                    src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                    className="w-full h-48 md:h-full min-h-[180px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    data-testid="map-iframe"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-primary/10">
            <p className="text-sm text-primary">
              {"We've scheduled your inspection for "}
              <span className="font-semibold underline">{formatDateForDisplay(selectedDate)}</span>
              {selectedSlot && <> ({selectedSlot.slot_name}: {selectedSlot.slot_time})</>}
              {address && <> at <span className="font-semibold underline">{address}</span></>}
              {". "}
              Feel free to reach out to us at{" "}
              <a href="tel:+919289992797" className="font-semibold underline" data-testid="link-phone-support">
                +91 9289992797
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={resetForm} variant="outline" data-testid="button-sell-another-car" className="px-8 py-3 rounded-xl border-2 border-border">
            Sell Another Car
          </Button>
        </div>
      </div>

      {!docUploadDismissed && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
          data-testid="doc-upload-footer"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  You can save time by uploading following documents now, RC Copy Front and Back, Insurance
                  Policy Copy, Your PAN Card and Your Bank details or cancelled cheque copy for payment.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleUploadLater}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border-primary text-primary hover:bg-primary/5"
                  data-testid="button-upload-later"
                >
                  Upload Later
                </Button>
                <Button
                  onClick={() => setShowDocUpload(true)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white gap-2"
                  data-testid="button-upload-documents"
                >
                  Upload Documents <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showThankYouModal && (
          <ThankYouModal
            onClose={() => setShowThankYouModal(false)}
            vehicleId={submittedVehicleId}
          />
        )}
      </AnimatePresence>
    </>
  );
}
