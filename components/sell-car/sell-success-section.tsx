"use client";

import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import type { InspectionSlot, InspectionFranchise } from "@lib/api";
import {
  ArrowRight,
  ArrowLeft,
  Award,
} from "lucide-react";
import {
  InspectionAvailableHeader,
  SuccessStepper,
  CarDetailsTab,
  NxcarPriceTab,
} from "./success/success-header";
import { InspectionBooking } from "./success/inspection-booking";

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
  inspectionPincode: string;
  setInspectionPincode: (pincode: string) => void;
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
    resetForm,
  } = props;

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {selectedCityInspectionAvailable && (
        <InspectionAvailableHeader formData={formData} />
      )}

      {!selectedCityInspectionAvailable && (
        <SuccessStepper activeSuccessStep={activeSuccessStep} setActiveSuccessStep={setActiveSuccessStep} />
      )}

      {!selectedCityInspectionAvailable && activeSuccessStep === 0 && (
        <CarDetailsTab formData={formData} />
      )}

      {!selectedCityInspectionAvailable && activeSuccessStep === 1 && (
        <NxcarPriceTab expectedPrice={formData.expectedPrice} />
      )}

      {selectedCityInspectionAvailable && activeSuccessStep === 2 && (
        <div data-testid="tab-content-inspection">
          <div className="space-y-6">
            <InspectionBooking
              formData={formData}
              selectedCityInspectionAvailable={props.selectedCityInspectionAvailable}
              inspectionBooked={props.inspectionBooked}
              inspectionMode={props.inspectionMode}
              setInspectionMode={props.setInspectionMode}
              selectedFranchise={props.selectedFranchise}
              setSelectedFranchise={props.setSelectedFranchise}
              selectedSlot={props.selectedSlot}
              setSelectedSlot={props.setSelectedSlot}
              selectedDate={props.selectedDate}
              setSelectedDate={props.setSelectedDate}
              inspectionLocation={props.inspectionLocation}
              setInspectionLocation={props.setInspectionLocation}
              inspectionPincode={props.inspectionPincode}
              setInspectionPincode={props.setInspectionPincode}
              franchises={props.franchises}
              franchisesLoading={props.franchisesLoading}
              franchisesError={props.franchisesError}
              inspectionSlots={props.inspectionSlots}
              slotsLoading={props.slotsLoading}
              bookInspectionMutation={props.bookInspectionMutation}
              resetForm={props.resetForm}
              submittedVehicleId={props.submittedVehicleId}
              savedCarListingId={props.savedCarListingId}
              extractPincode={props.extractPincode}
              buildSellData={props.buildSellData}
              getCityId={props.getCityId}
              cityNumericId={props.cityNumericId}
              isAuthenticated={props.isAuthenticated}
              onLoginRequired={props.onLoginRequired}
              onBookInspectionToast={props.onBookInspectionToast}
            />
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
