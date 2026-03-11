"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";

const QUICK_SERVICES = [
  { image: "/images/icon-3d-buy.png", label: "Buy used car", href: "/buy" },
  { image: "/images/icon-3d-sell.png", label: "Sell car", href: "/sell-used-car" },
  { image: "/images/icon-3d-loan.png", label: "Get car loan", href: "/used-car-loan" },
  { image: "/images/icon-3d-val.png", label: "Car valuation", href: "/valuation" },
  { image: "/images/icon-3d-pdi.png", label: "PDI", href: "https://nxcar.in/pdi", isNew: true, external: true },
  { image: "/images/icon-3d-ins.png", label: "Insurance", href: "/insurance-check" },
  { image: "/images/icon-3d-rto.png", label: "RTO Services", href: "/rc-check" },
  { image: "/images/icon-3d-more.png", label: "More...", href: "/car-services" },
];

export const QuickServices = memo(function QuickServices() {
  return (
    <nav aria-label="Quick services" className="w-full bg-white/90 dark:bg-card/80 border-b border-slate-200 dark:border-white/5 sticky top-14 z-40 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-6 lg:gap-10 lg:justify-center">
          {QUICK_SERVICES.map((service) => {
            const linkProps = service.external
              ? { href: service.href, target: "_blank" as const, rel: "noopener noreferrer" }
              : { href: service.href };
            const Wrapper = service.external ? "a" : Link;
            return (
              <Wrapper key={service.label} {...linkProps} className="group flex flex-col items-center gap-1 sm:gap-2 sm:min-w-[80px] cursor-pointer" data-testid={`link-service-${service.label.toLowerCase().replace(/ /g, '-')}`}>
                <div className="relative transition-all duration-300 hover:scale-110">
                  <Image 
                    src={service.image} 
                    alt={service.label}
                    width={40}
                    height={40}
                    sizes="56px"
                    className="!w-9 !h-9 sm:!w-14 sm:!h-14 object-contain rounded-2xl drop-shadow-lg dark:brightness-125 dark:drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                  />
                  {service.isNew && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full shadow-md">
                      NEW
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-center leading-tight transition-colors text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                  {service.label}
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </nav>
  );
});
