"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { BarChart3 } from "lucide-react";

function formatPriceNoSymbol(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
}

interface PriceMapData {
  buyerLower: number;
  buyerUpper: number;
  sellerLower: number;
  sellerUpper: number;
}

interface PriceMapProps {
  priceMap: PriceMapData;
  askingPrice: number;
  year: number;
  make: string;
  model: string;
}

export const PriceMap = React.memo(function PriceMap({ priceMap, askingPrice, year, make, model }: PriceMapProps) {
  const pm = priceMap;
  const fairLow = pm.buyerLower;
  const fairHigh = pm.buyerUpper;
  const fairMid = (fairLow + fairHigh) / 2;

  const rangeMin = Math.min(fairLow, askingPrice) * 0.92;
  const rangeMax = Math.max(fairHigh, askingPrice) * 1.08;
  const totalRange = rangeMax - rangeMin;

  const fairLeftPct = ((fairLow - rangeMin) / totalRange) * 100;
  const fairWidthPct = ((fairHigh - fairLow) / totalRange) * 100;
  const askingPct = ((askingPrice - rangeMin) / totalRange) * 100;

  let priceLabel = '';
  let labelColor = '';
  if (askingPrice < fairLow) {
    priceLabel = 'Below Market';
    labelColor = 'text-green-600 dark:text-green-400';
  } else if (askingPrice > fairHigh) {
    priceLabel = 'Above Market';
    labelColor = 'text-red-500 dark:text-red-400';
  } else if (askingPrice <= fairMid) {
    priceLabel = 'Good Deal';
    labelColor = 'text-green-600 dark:text-green-400';
  } else {
    priceLabel = 'Fair Price';
    labelColor = 'text-primary';
  }

  return (
    <Card data-testid="price-map-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-semibold">Price Map</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <p className="text-lg font-bold" data-testid="text-price-map-asking">₹ {formatPriceNoSymbol(askingPrice)}</p>
            </div>
            <Badge className={`${labelColor} border-current bg-current/10 font-semibold`} data-testid="badge-price-label">
              {priceLabel}
            </Badge>
          </div>

          <div className="relative pt-8 pb-4">
            <div className="h-3 rounded-full bg-muted/60 relative overflow-visible" data-testid="price-map-bar">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-green-400 via-primary to-green-400 opacity-80"
                style={{ left: `${fairLeftPct}%`, width: `${fairWidthPct}%` }}
              />
              <div
                className="absolute -top-6 flex flex-col items-center"
                style={{ left: `${Math.max(2, Math.min(askingPct, 98))}%`, transform: 'translateX(-50%)' }}
              >
                <span className="text-[10px] font-bold text-foreground whitespace-nowrap mb-0.5">You</span>
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground" />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-foreground border-2 border-background shadow-md"
                style={{ left: `${Math.max(1, Math.min(askingPct, 99))}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>

            <div className="flex justify-between mt-3">
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Low</p>
                <p className="text-xs font-semibold" data-testid="text-price-map-low">₹ {formatPriceNoSymbol(fairLow)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-primary uppercase tracking-wider font-medium">Fair Range</p>
                <p className="text-xs font-semibold text-primary" data-testid="text-price-map-fair">₹ {formatPriceNoSymbol(fairMid)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">High</p>
                <p className="text-xs font-semibold" data-testid="text-price-map-high">₹ {formatPriceNoSymbol(fairHigh)}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              The fair market range for this <span className="font-medium text-foreground">{year} {make} {model}</span> is between <span className="font-medium text-foreground">₹ {formatPriceNoSymbol(fairLow)}</span> and <span className="font-medium text-foreground">₹ {formatPriceNoSymbol(fairHigh)}</span>, based on the car&apos;s age, mileage, condition, and market trends.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
