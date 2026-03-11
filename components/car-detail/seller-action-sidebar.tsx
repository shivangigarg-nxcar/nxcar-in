"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Gauge,
  Fuel,
  Settings2,
  MapPin,
  User,
  Phone,
  Landmark,
  Download,
  IndianRupee,
  HandCoins,
  Loader2,
  PhoneCall,
} from "lucide-react";
import { ShareSection } from "@components/car-detail/share-section";

interface PriceMapData {
  buyerLower: number;
  buyerUpper: number;
  sellerLower: number;
  sellerUpper: number;
}

interface SellerActionSidebarProps {
  car: {
    status: string;
    year: number;
    make: string;
    model: string;
    variant?: string;
    price: number;
    emi: number;
    kilometersDriven: number;
    fuelType: string;
    transmission: string;
    ownership: string;
    sellerName: string;
    sellerPhone: string;
    sellerAddress: string;
    rtoLocation: string;
    carscope: {
      inspectionReportUrl: string | null;
    } | null;
  };
  priceMap?: PriceMapData | null;
  formatPriceNoSymbol: (price: number) => string;
  formatKilometers: (km: number) => string;
  formatEmi: (emi: number) => string;
  onMakeOfferClick: () => void;
  onRequestCallback: () => void;
  callbackLoading: boolean;
}

function formatPrice(price: number): string {
  if (price == null) return "Price Not Available";
  if (price >= 10000000) {
    return `${(price / 10000000) % 1 === 0 ? price / 10000000 : (price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `${(price / 100000) % 1 === 0 ? price / 100000 : (price / 100000).toFixed(2)} L`;
  }
  return price.toLocaleString("en-IN");
}

export function SellerActionSidebar({
  car,
  priceMap,
  formatPriceNoSymbol,
  formatKilometers,
  formatEmi,
  onMakeOfferClick,
  onRequestCallback,
  callbackLoading,
}: SellerActionSidebarProps) {
  const hasFairRange = priceMap &&
    Number.isFinite(priceMap.buyerLower) &&
    Number.isFinite(priceMap.buyerUpper) &&
    priceMap.buyerUpper > priceMap.buyerLower &&
    priceMap.buyerLower > 0;

  return (
    <div data-testid="seller-info-card">
      <Card className="overflow-hidden rounded-b-none">
        <div className="h-1.5 bg-gradient-to-r from-primary/80 to-primary" />
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            {car.status && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0">
                {car.status === "active" ? "Available" : car.status}
              </Badge>
            )}
            <Badge variant="outline">{car.year}</Badge>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span
                className="text-2xl font-bold"
                data-testid="text-car-price"
              >
                {formatPriceNoSymbol(car.price)}
              </span>
            </div>
            {car.emi > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                EMI from {formatEmi(car.emi)}
              </p>
            )}
          </div>

          <div className="border-y py-3 space-y-2">
            {[
              {
                label: "Kilometers",
                value: formatKilometers(car.kilometersDriven),
                icon: Gauge,
              },
              { label: "Fuel", value: car.fuelType, icon: Fuel },
              {
                label: "Transmission",
                value: car.transmission,
                icon: Settings2,
              },
              { label: "Ownership", value: car.ownership, icon: User },
            ]
              .filter((item) => item.value && item.value !== "0")
              .map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
          </div>

          {car.sellerName && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  data-testid="text-seller-name"
                >
                  {car.sellerName}
                </p>
                {car.sellerAddress && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {car.sellerAddress}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {car.sellerPhone ? (
              <a
                href={`tel:${car.sellerPhone}`}
                data-testid="link-contact-seller"
              >
                <Button
                  className="w-full"
                  data-testid="button-contact-seller"
                >
                  <Phone className="mr-2 h-4 w-4" /> Contact Seller
                </Button>
              </a>
            ) : (
              <Button
                className="w-full"
                disabled
                data-testid="button-contact-seller"
              >
                <Phone className="mr-2 h-4 w-4" /> Contact Seller
              </Button>
            )}
            <Link href="/used-car-loan">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5"
                data-testid="button-get-loan"
              >
                <Landmark className="mr-2 h-4 w-4" /> Get Loan Now
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
              onClick={onMakeOfferClick}
              data-testid="button-make-offer"
            >
              <HandCoins className="mr-2 h-4 w-4" /> Make Your Offer
            </Button>
            <Button
              variant="outline"
              className="w-full border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
              onClick={onRequestCallback}
              disabled={callbackLoading}
              data-testid="button-request-callback"
            >
              {callbackLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting...</>
              ) : (
                <><PhoneCall className="mr-2 h-4 w-4" /> Request Callback</>
              )}
            </Button>
          </div>

          {car.rtoLocation && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              RTO: {car.rtoLocation}
            </div>
          )}

          {car.carscope?.inspectionReportUrl && (
            <a
              href={car.carscope.inspectionReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              data-testid="link-inspection-report"
            >
              <Download className="h-3.5 w-3.5" /> Download Inspection
              Report
            </a>
          )}

          <ShareSection car={car} />
        </CardContent>
      </Card>

      {hasFairRange && (
        <div
          className="relative flex items-center px-4 md:px-6 py-2 text-base md:text-lg font-semibold rounded-b-2xl shadow-[2px_0px_4px_0px_rgba(0,0,0,0.1),-2px_0px_4px_0px_rgba(0,0,0,0.1)]"
          style={{
            background: "linear-gradient(136deg, #e0f7fa, #e0f2f1, #ede7f6)",
            backgroundSize: "150% 200%",
            animation: "gradientBG 4s ease infinite",
            color: "#4AA09B",
          }}
          data-testid="section-fair-range"
        >
          <Image
            width={20}
            height={20}
            src="/images/singleCar/coins.svg"
            alt="nxcar-coins"
            className="mr-1.5 flex-shrink-0"
          />
          <span className="whitespace-nowrap">
            ₹{formatPrice(priceMap!.buyerLower)} - ₹{formatPrice(priceMap!.buyerUpper)}
          </span>
          <span className="text-sm font-normal text-gray-500 ml-1.5 hidden sm:inline">
            Recommended Price By Nxcar.
          </span>
          <span className="text-xs font-normal text-gray-500 ml-1 sm:hidden">
            Recommended Price
          </span>
          <div className="absolute bottom-0.5 right-2.5">
            <Image
              width={50}
              height={10}
              src="/images/singleCar/bynxcar.svg"
              alt="by-nxcar-ai"
              className="w-[50px] h-auto md:w-[60px]"
            />
          </div>
        </div>
      )}

    </div>
  );
}
