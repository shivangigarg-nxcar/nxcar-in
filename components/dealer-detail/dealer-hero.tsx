'use client';

import Link from "next/link";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  MapPin, CheckCircle, ArrowLeft, Car, Phone, Star,
  MessageSquare, Share2
} from "lucide-react";
import { DealerImageSlider } from "./dealer-image-slider";

interface DealerInfo {
  showroom_name: string;
  showroom_address: string;
  dealership_logo: string | null;
  rating: string;
  years_in_business: string;
  mobile_number_1: string;
  whatsapp_number: string;
  closing_time: string;
}

interface DealerBasic {
  phone_number: string;
}

interface DealerTeamMember {
  name: string;
  designation: string;
  mobile_number: string;
  image: string;
}

function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  let h = parseInt(hours, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minutes} ${period}`;
}

function getFirstChar(name: string): string {
  return (name || "?").charAt(0).toUpperCase();
}

interface DealerHeroProps {
  dealerInfo: DealerInfo;
  dealerBasic: DealerBasic | undefined;
  dealerTeams: DealerTeamMember[];
  dealerImages: string[];
  citySlug: string;
  cityName: string;
  carsLoading: boolean;
  carsCount: number;
  onCall: () => void;
  onWhatsApp: () => void;
  onDirection: () => void;
  onShare: () => void;
}

export function DealerHero({
  dealerInfo, dealerBasic, dealerTeams, dealerImages,
  citySlug, cityName, carsLoading, carsCount,
  onCall, onWhatsApp, onDirection, onShare,
}: DealerHeroProps) {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container px-4 max-w-7xl mx-auto py-8 md:py-12">
        <Link
          href={`/used-car-dealers-in/${citySlug}`}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors text-sm"
          data-testid="link-back-city"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {cityName} Dealers
        </Link>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {dealerInfo.dealership_logo ? (
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white overflow-hidden flex-shrink-0">
                  <img
                    src={dealerInfo.dealership_logo}
                    alt={dealerInfo.showroom_name}
                    className="h-full w-full object-cover"
                    data-testid="img-dealer-logo"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl md:text-3xl font-bold text-primary" data-testid="text-dealer-initial">
                    {getFirstChar(dealerInfo.showroom_name)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" data-testid="heading-dealer-name">
                  {dealerInfo.showroom_name}
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                  {dealerInfo.years_in_business && (
                    <span className="text-sm text-slate-300">{dealerInfo.years_in_business} years in business</span>
                  )}
                </div>
              </div>
            </div>

            {dealerImages.length > 0 && (
              <div className="md:hidden h-48 rounded-xl overflow-hidden mb-4">
                <DealerImageSlider images={dealerImages} />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium" data-testid="text-dealer-cars">
                  {carsLoading ? "..." : carsCount} Listed Cars
                </span>
              </div>
              {dealerInfo.rating && parseFloat(dealerInfo.rating) >= 3 && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium">{parseFloat(dealerInfo.rating).toFixed(1)} Rating</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 text-slate-300 text-sm mb-4">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <span data-testid="text-dealer-address">{dealerInfo.showroom_address}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <Phone className="h-4 w-4" />
              <span>+91{dealerInfo.mobile_number_1 || dealerBasic?.phone_number}</span>
              {dealerInfo.closing_time && (
                <span className="ml-2 text-primary">Closes: {formatTime(dealerInfo.closing_time)}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={onCall} className="bg-primary hover:bg-primary/90" data-testid="button-call-dealer">
                <Phone className="h-4 w-4 mr-1" /> Call
              </Button>
              <Button size="sm" variant="outline" onClick={onWhatsApp} className="border-green-500 text-green-400 hover:bg-green-500/10" data-testid="button-whatsapp">
                <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
              </Button>
              <Button size="sm" variant="outline" onClick={onDirection} className="border-slate-500 text-slate-300 hover:bg-white/10" data-testid="button-directions">
                <MapPin className="h-4 w-4 mr-1" /> Directions
              </Button>
              <Button size="sm" variant="ghost" onClick={onShare} className="text-slate-300 hover:bg-white/10" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {dealerImages.length > 0 && (
            <div className="hidden md:block w-[400px] lg:w-[480px] h-[280px] lg:h-[320px] rounded-xl overflow-hidden flex-shrink-0">
              <DealerImageSlider images={dealerImages} />
            </div>
          )}
        </div>

        {dealerTeams.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">{dealerInfo.showroom_name}&apos;s Team</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {dealerTeams.map((member, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2 min-w-[200px] flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">{getFirstChar(member.name)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">{member.designation}</p>
                    <p className="text-sm font-medium truncate">{member.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
