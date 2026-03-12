"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const services: { href: string; testId: string; img: string; title: string; desc: string; cta: string; external?: boolean }[] = [
  {
    href: "/rc-check",
    testId: "link-addon-rc-check",
    img: "/images/icon-3d-rto.png",
    title: "RC Check",
    desc: "Verify RC details, ownership history, and registration status of any vehicle instantly.",
    cta: "Check Now",
  },
  {
    href: "/insurance-check",
    testId: "link-addon-insurance",
    img: "/images/icon-3d-ins.png",
    title: "Insurance",
    desc: "Buy or renew car insurance with the best plans from top providers at low premiums.",
    cta: "Get Quote",
  },
  {
    href: "/challan-check",
    testId: "link-addon-challan",
    img: "/images/icon-3d-shield.png",
    title: "Challan",
    desc: "Check pending challans and traffic fines associated with any vehicle number.",
    cta: "Check Now",
  },
  {
    href: "/car-services",
    testId: "link-addon-pdi",
    img: "/images/icon-3d-pdi.png",
    title: "PDI Services",
    desc: "Get a comprehensive pre-delivery inspection to ensure your car is in perfect condition.",
    cta: "Learn More",
  },
  {
    href: "https://docs.nxcar.in",
    testId: "link-addon-docs",
    img: "/images/icon-3d-documents.png",
    title: "Docs",
    desc: "Access guides, documentation, and resources for buying and selling used cars.",
    cta: "View Docs",
    external: true,
  },
];

export function AddOnServices() {
  return (
    <section data-testid="section-addon-services">
      <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" data-testid="text-addon-services-title">Services</h2>
      <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">Complete your car purchase with these essential services</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
        {services.map((svc) => {
          const card = (
            <div className="rounded-lg sm:rounded-xl border bg-card overflow-hidden hover-elevate cursor-pointer h-full group">
              <div className="w-full aspect-square sm:aspect-[16/10] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-3 sm:p-6">
                <Image
                  src={svc.img}
                  alt={svc.title}
                  width={80}
                  height={80}
                  className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                />
              </div>
              <div className="p-2 sm:p-5">
                <h3 className="font-bold text-xs sm:text-base mb-0.5 sm:mb-1">{svc.title}</h3>
                <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-3 line-clamp-2 hidden sm:block">{svc.desc}</p>
                <span className="inline-flex items-center text-primary font-medium text-[10px] sm:text-sm group-hover:gap-2 transition-all">
                  {svc.cta} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                </span>
              </div>
            </div>
          );
          return svc.external ? (
            <a key={svc.testId} href={svc.href} target="_blank" rel="noopener noreferrer" data-testid={svc.testId}>
              {card}
            </a>
          ) : (
            <Link key={svc.testId} href={svc.href} data-testid={svc.testId}>
              {card}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
