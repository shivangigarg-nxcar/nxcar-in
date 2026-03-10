"use client";

import { memo } from "react";
import { Button } from "@components/ui/button";
import { CheckCircle2, ClipboardCheck, Banknote, Car, ArrowRight } from "lucide-react";

export const SellCarProcess = memo(function SellCarProcess() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Get Valuation",
      desc: "Instant AI-driven price estimation.",
      step: "01"
    },
    {
      icon: CheckCircle2,
      title: "Inspection",
      desc: "Professional 280+ point check by Nxcar Engineers.",
      step: "02"
    },
    {
      icon: Banknote,
      title: "Best Offer",
      desc: "Live realtime auction. Highest bid from premium verified network.",
      step: "03"
    },
    {
      icon: Car,
      title: "Transfer",
      desc: "Instant online payment, digital paperwork & assured RC transfer.",
      step: "04"
    }
  ];

  return (
    <section className="py-12 sm:py-24 bg-teal-50 dark:bg-[#0a1420] relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-br from-teal-100/60 via-transparent to-cyan-100/40 dark:from-teal-900/40 dark:via-transparent dark:to-cyan-900/30"></div>
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
       <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 dark:from-primary/10 to-transparent skew-x-[-20deg]"></div>
       <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[120px]"></div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="order-2 lg:order-1 lg:col-span-2 relative group">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl blur-[80px] opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
            <img 
              src="/images/hero-xray-cyan.png" 
              alt="Deep Vision Inspection"
              width={448}
              height={448}
              loading="lazy"
              sizes="(max-width: 768px) 60vw, 400px"
              className="w-3/5 sm:w-full max-w-[200px] sm:max-w-md mx-auto h-auto object-contain relative z-10 drop-shadow-[0_0_40px_rgba(14,169,178,0.3)] transition-transform duration-700 group-hover:scale-105 dark:mix-blend-lighten"
            />
            
            <div className="absolute inset-0 pointer-events-none hidden md:block z-20">
               <div className="absolute top-[30%] left-[20%] flex flex-col items-end animate-pulse delay-700">
                 <div className="bg-white/80 dark:bg-black/60 border border-primary/30 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-primary mb-1">
                   AI DIAGNOSTICS
                 </div>
                 <div className="h-[1px] w-12 bg-primary/50"></div>
                 <div className="h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_10px_#0EA9B2] -mr-[3px] -mt-[4px]"></div>
               </div>
               
               <div className="absolute bottom-[40%] right-[30%] flex flex-col items-start animate-pulse delay-300">
                  <div className="bg-white/80 dark:bg-black/60 border border-cyan-400/30 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mb-1 ml-8">
                   STRUCTURAL INTEGRITY: 100%
                 </div>
                 <div className="flex items-end">
                    <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] -ml-[3px]"></div>
                    <div className="h-[1px] w-20 bg-cyan-400/50 rotate-[-30deg] origin-bottom-left"></div>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="inline-block border border-primary text-primary px-3 py-1 text-xs font-bold uppercase tracking-widest mb-6">
              Sell Your Machine
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 dark:text-white mb-4 sm:mb-6 uppercase italic tracking-tighter leading-none">
              Sell in <span className="text-primary">Minutes</span>.<br/>
              No Compromise.
            </h2>
            
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 leading-relaxed font-light">
              We've engineered the fastest, most transparent car selling process in the industry. 
              Pure performance, zero friction.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 sm:mb-10">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-white/5 hover:border-primary/50 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary group-hover:text-white group-hover:bg-primary transition-colors">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-primary/50 block mb-1">{step.step}</span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 uppercase tracking-wide">{step.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="h-14 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-primary hover:text-white font-black uppercase tracking-wider px-8 text-sm transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(14,169,178,0.4)]"
              data-testid="button-start-evaluation"
              onClick={() => {
                const heroInput = document.querySelector('[data-testid="input-car-number"]') as HTMLInputElement | null;
                if (heroInput) {
                  heroInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => heroInput.focus(), 500);
                }
              }}
            >
              Start Evaluation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});
