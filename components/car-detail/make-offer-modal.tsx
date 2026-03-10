"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  IndianRupee,
  HandCoins,
  Loader2,
  CheckCircle2,
  XCircle,
  Phone,
  MessageCircle,
  User,
} from "lucide-react";

function formatPriceNoSymbol(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
}

interface MakeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: {
    year: number;
    make: string;
    model: string;
    variant?: string;
    price: number;
    sellerName?: string;
    sellerPhone?: string;
  };
  offerLoading: boolean;
  offerSubmitting: boolean;
  offerResult: "success" | "error" | null;
  offerError: string;
  selectedOffer: string;
  predictionData: {
    predicted_price: string;
    suggested_prices: string[];
    highest_offer: number;
    total_offers: number;
  } | null;
  onSelectedOfferChange: (value: string) => void;
  onSubmitOffer: () => void;
  onRetry: () => void;
}

export function MakeOfferModal({
  open,
  onOpenChange,
  car,
  offerLoading,
  offerSubmitting,
  offerResult,
  offerError,
  selectedOffer,
  predictionData,
  onSelectedOfferChange,
  onSubmitOffer,
  onRetry,
}: MakeOfferModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {offerResult === "success" ? (
          <>
            <DialogTitle className="sr-only">Offer Submitted</DialogTitle>
            <DialogDescription className="sr-only">
              Your offer has been submitted successfully.
            </DialogDescription>
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Offer Submitted!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your offer has been sent to the seller.
              </p>

              <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  {car.year} {car.make} {car.model}
                </p>
                {car.variant && (
                  <p className="text-xs text-muted-foreground">
                    {car.variant}
                  </p>
                )}
                <div className="flex items-center gap-1 pt-1">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-primary">
                    {selectedOffer}
                  </span>
                </div>
              </div>

              {car.sellerName && (
                <div className="bg-muted/50 rounded-xl p-4 text-left space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Seller Details
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {car.sellerName}
                      </p>
                      {car.sellerPhone && (
                        <p className="text-xs text-muted-foreground">
                          +91 {car.sellerPhone}
                        </p>
                      )}
                    </div>
                  </div>
                  {car.sellerPhone && (
                    <div className="flex gap-2">
                      <a href={`tel:${car.sellerPhone}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full"
                          data-testid="button-offer-call"
                        >
                          <Phone className="mr-2 h-4 w-4" /> Call
                        </Button>
                      </a>
                      <a
                        href={`https://wa.me/91${car.sellerPhone}?text=Hi, I made an offer of ${selectedOffer} on your ${car.year} ${car.make} ${car.model} listed on NxCar.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
                          data-testid="button-offer-whatsapp"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => onOpenChange(false)}
                data-testid="button-offer-done"
              >
                Done
              </Button>
            </div>
          </>
        ) : offerResult === "error" ? (
          <>
            <DialogTitle className="sr-only">Offer Failed</DialogTitle>
            <DialogDescription className="sr-only">
              Your offer could not be submitted.
            </DialogDescription>
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Offer Failed
              </h3>
              <p className="text-sm text-muted-foreground">
                {offerError || "Something went wrong. Please try again."}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onRetry}
                  data-testid="button-offer-retry"
                >
                  Try Again
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  data-testid="button-offer-close"
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-amber-500" /> Make Your Offer
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose or enter an offer amount for this car.
            </DialogDescription>

            {offerLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading price suggestions...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {car.year} {car.make} {car.model}
                  </p>
                  {car.variant && (
                    <p className="text-xs text-muted-foreground">
                      {car.variant}
                    </p>
                  )}
                  <div className="flex items-center gap-1 pt-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Listed at{" "}
                      <span className="font-bold text-foreground">
                        {formatPriceNoSymbol(car.price)}
                      </span>
                    </span>
                  </div>
                </div>

                {predictionData && (
                  <div className="flex gap-4">
                    <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        Highest Offer
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {predictionData.highest_offer > 0
                          ? `₹${predictionData.highest_offer >= 100000 ? (predictionData.highest_offer / 100000).toFixed(2) + " L" : predictionData.highest_offer.toLocaleString("en-IN")}`
                          : "No offers yet"}
                      </p>
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Offers
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {predictionData.total_offers}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Enter Your Offer
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      value={selectedOffer}
                      onChange={(e) => onSelectedOfferChange(e.target.value)}
                      placeholder="e.g. 22.75 L"
                      className="pl-8 text-lg font-semibold h-12 
                                 text-gray-900 dark:text-white 
                                 bg-white dark:bg-gray-900"
                      data-testid="input-offer-amount"
                    />
                  </div>
                </div>

                {predictionData &&
                  predictionData?.suggested_prices?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Suggested Prices
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {predictionData?.suggested_prices?.map(
                          (price, idx) => (
                            <button
                              key={idx}
                              onClick={() => onSelectedOfferChange(price)}
                              className={`px-2 py-2 rounded-lg text-sm font-medium border transition-all ${
                                selectedOffer === price
                                  ? "bg-primary text-white border-primary"
                                  : "bg-muted/50 text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                              }`}
                              data-testid={`button-suggested-price-${idx}`}
                            >
                              ₹{price}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {offerError && !predictionData?.suggested_prices.length && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {offerError}
                  </p>
                )}

                <Button
                  className="w-full h-12 text-sm font-bold uppercase tracking-wider"
                  disabled={!selectedOffer || offerSubmitting}
                  onClick={onSubmitOffer}
                  data-testid="button-submit-offer"
                >
                  {offerSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : selectedOffer ? (
                    `Make Offer of ₹${selectedOffer}`
                  ) : (
                    "Select or Enter an Offer"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
