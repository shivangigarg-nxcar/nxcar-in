"use client";

import { Button } from "@components/ui/button";
import {
  Phone,
  IndianRupee,
  HandCoins,
} from "lucide-react";

interface MobileActionBarProps {
  price: number;
  emi: number;
  sellerPhone: string;
  formatPriceNoSymbol: (price: number) => string;
  formatEmi: (emi: number) => string;
  onMakeOfferClick: () => void;
}

export function MobileActionBar({
  price,
  emi,
  sellerPhone,
  formatPriceNoSymbol,
  formatEmi,
  onMakeOfferClick,
}: MobileActionBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t p-3 flex items-center justify-between gap-2 lg:hidden"
      data-testid="mobile-price-bar"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <IndianRupee className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold" data-testid="text-mobile-price">
            {formatPriceNoSymbol(price)}
          </span>
        </div>
        {emi > 0 && (
          <p className="text-xs text-muted-foreground">
            EMI from {formatEmi(emi)}
          </p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 text-amber-600 dark:text-amber-400"
          onClick={onMakeOfferClick}
          data-testid="button-mobile-make-offer"
        >
          <HandCoins className="mr-1 h-3.5 w-3.5" /> Offer
        </Button>
        {sellerPhone ? (
          <a href={`tel:${sellerPhone}`}>
            <Button size="sm" data-testid="button-mobile-contact">
              <Phone className="mr-1 h-3.5 w-3.5" /> Call
            </Button>
          </a>
        ) : (
          <Button size="sm" disabled data-testid="button-mobile-contact">
            <Phone className="mr-1 h-3.5 w-3.5" /> Call
          </Button>
        )}
      </div>
    </div>
  );
}
