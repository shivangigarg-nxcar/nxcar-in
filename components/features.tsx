import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    id: "loans",
    image: "/images/icon-loans-3d.png",
    title: "Used Car Loans",
    description: "Get quick approval and competitive interest rates for your dream car.",
    details: [
      "Interest rates starting at 12%",
      "Loans up to 90% of car value",
      "Quick disbursement in 48 hours"
    ],
    link: "/used-car-loan"
  },
  {
    id: "pd",
    image: "/images/icon-pd-3d.png",
    title: "Nxcar PD Services",
    description: "Comprehensive pre-delivery inspection and verification services.",
    details: [
      "200+ checkpoints inspection",
      "Detailed digital report",
      "Engine & transmission health check"
    ],
    new: true,
    link: "https://pdi.nxcar.in/pdi"
  },
  {
    id: "rc",
    image: "/images/icon-rc-3d.png",
    title: "RC Transfer",
    description: "Hassle-free paperwork and ownership transfer assistance.",
    details: [
      "Doorstep document pickup",
      "RTO liaison included",
      "Online tracking of application"
    ],
    link: "/rc-transfer"
  },
  {
    id: "insurance",
    image: "/images/icon-insurance-3d.png",
    title: "Car Insurance",
    description: "Comprehensive insurance plans for complete peace of mind.",
    details: [
      "Zero depreciation cover",
      "24x7 roadside assistance",
      "Cashless garage network"
    ],
    link: "/insurance-check"
  }
];

export const Features = memo(function Features() {
  return (
    <section className="py-12 sm:py-24 bg-slate-100 dark:bg-[#0f1923] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tl from-slate-200/80 via-transparent to-gray-100/60 dark:from-slate-900/30 dark:via-transparent dark:to-blue-950/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-slate-400/10 dark:bg-slate-600/20 rounded-full blur-[128px]"></div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white mb-3 sm:mb-6 uppercase tracking-tight">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Ecosystem</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-lg px-4 sm:px-0">
            A comprehensive suite of high-performance automotive services designed for the modern enthusiast.
          </p>
        </div>

        {/* Mobile: compact 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {SERVICES.map((service) => (
            <Link
              href={service.link}
              key={service.id}
              aria-label={service.title}
              target={service.link.startsWith("http") ? "_blank" : undefined}
              rel={service.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative bg-white/80 dark:bg-card/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 p-4 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-3 relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={56}
                  height={56}
                  sizes="56px"
                  loading="lazy"
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(14,169,178,0.3)]"
                />
              </div>
              <h3 className="font-heading text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1.5">
                {service.title}
              </h3>
              {service.new && (
                <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1.5">
                  New
                </span>
              )}
              <span className="flex items-center justify-center text-primary text-[10px] font-bold uppercase tracking-wider">
                Learn More <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop: full cards */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-8">
          {SERVICES.map((service) => (
            <Link
              href={service.link}
              key={service.id}
              aria-label={service.title}
              target={service.link.startsWith("http") ? "_blank" : undefined}
              rel={service.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative bg-white/80 dark:bg-card/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 p-8 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(14,169,178,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-row gap-8 items-start text-left">
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 relative">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      width={96}
                      height={96}
                      sizes="96px"
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(14,169,178,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" 
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    {service.new && (
                      <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded skew-x-[-10deg] uppercase tracking-wider shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        New
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6 text-left">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                        <div className="h-1.5 w-1.5 rotate-45 bg-primary mr-3 shadow-[0_0_5px_rgba(14,169,178,0.8)]"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  <span className="inline-flex items-center font-bold text-primary group-hover:text-slate-900 dark:group-hover:text-white uppercase tracking-wider text-sm">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});
