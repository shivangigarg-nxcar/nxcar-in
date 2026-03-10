"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  Shield,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export function AddOnServices() {
  return (
    <section data-testid="section-addon-services">
      <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" data-testid="text-addon-services-title">Add On Services</h2>
      <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">Complete your car purchase with these essential services</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Link href="/rc-check" data-testid="link-addon-rc-check">
          <div className="rounded-lg sm:rounded-xl border bg-card overflow-hidden hover-elevate cursor-pointer h-full group">
            <div className="w-full aspect-square sm:aspect-[16/10] bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <ClipboardCheck className="w-8 h-8 sm:w-16 sm:h-16 text-white/90" />
            </div>
            <div className="p-2 sm:p-5">
              <h3 className="font-bold text-xs sm:text-base mb-0.5 sm:mb-1">RC Check</h3>
              <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-3 line-clamp-2 hidden sm:block">Verify RC details, ownership history, and registration status of any vehicle instantly.</p>
              <span className="inline-flex items-center text-primary font-medium text-[10px] sm:text-sm group-hover:gap-2 transition-all">
                Check Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
              </span>
            </div>
          </div>
        </Link>
        <Link href="/insurance-check" data-testid="link-addon-insurance">
          <div className="rounded-lg sm:rounded-xl border bg-card overflow-hidden hover-elevate cursor-pointer h-full group">
            <div className="w-full aspect-square sm:aspect-[16/10] bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Shield className="w-8 h-8 sm:w-16 sm:h-16 text-white/90" />
            </div>
            <div className="p-2 sm:p-5">
              <h3 className="font-bold text-xs sm:text-base mb-0.5 sm:mb-1">Insurance</h3>
              <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-3 line-clamp-2 hidden sm:block">Buy or renew car insurance with the best plans from top providers at low premiums.</p>
              <span className="inline-flex items-center text-primary font-medium text-[10px] sm:text-sm group-hover:gap-2 transition-all">
                Get Quote <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
              </span>
            </div>
          </div>
        </Link>
        <Link href="/challan-check" data-testid="link-addon-challan">
          <div className="rounded-lg sm:rounded-xl border bg-card overflow-hidden hover-elevate cursor-pointer h-full group">
            <div className="w-full aspect-square sm:aspect-[16/10] bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 sm:w-16 sm:h-16 text-white/90" />
            </div>
            <div className="p-2 sm:p-5">
              <h3 className="font-bold text-xs sm:text-base mb-0.5 sm:mb-1">Challan</h3>
              <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-3 line-clamp-2 hidden sm:block">Check pending challans and traffic fines associated with any vehicle number.</p>
              <span className="inline-flex items-center text-primary font-medium text-[10px] sm:text-sm group-hover:gap-2 transition-all">
                Check Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
