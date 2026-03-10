"use client";

import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { BadgePercent, Building, CheckCircle2, ArrowRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function LoanBanner() {
  const { data: banners = [] } = useQuery({
    queryKey: ["loan-banners"],
    queryFn: async () => {
      const res = await fetch("/api/banners?position=loan");
      return res.json();
    },
  });

  return (
    <section className="py-16 bg-slate-100 dark:bg-[#0b1419] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-slate-100/40 dark:from-blue-950/30 dark:via-transparent dark:to-slate-950/25"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 dark:from-primary/20 via-white dark:via-card to-primary/5 dark:to-primary/10 border border-primary/30"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8 lg:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                <Wallet className="h-4 w-4" />
                Used Car Loans
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight">
                Get Approved in <br/>
                <span className="text-primary">24 Hours</span>
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg">
                Access India's largest network of 25+ lending partners. Competitive rates starting at 8.5% p.a. with flexible EMI options.
              </p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-4 bg-white/80 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                  <div className="text-lg sm:text-3xl font-black text-primary">25+</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Lenders</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-white/80 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                  <div className="text-lg sm:text-3xl font-black text-primary">8.5%</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Starting Rate</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-white/80 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                  <div className="text-lg sm:text-3xl font-black text-primary">100%</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Financing</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/used-car-loan">
                  <Button 
                    data-testid="button-apply-loan"
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider px-8 group"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/used-car-loan">
                  <Button 
                    data-testid="button-check-eligibility"
                    size="lg" 
                    variant="outline"
                    className="border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 uppercase tracking-wider"
                  >
                    Check Eligibility
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="space-y-4 lg:pl-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Why Choose NxCar Loans?</h3>
              
              <div className="space-y-3">
                {[
                  "Compare rates from 25+ banks & NBFCs",
                  "Instant approval with minimal documentation",
                  "Doorstep document pickup",
                  "No hidden charges or processing fees",
                  "Flexible tenure up to 7 years",
                  "Top-up loans available"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/80 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/5">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 flex items-center gap-3 sm:gap-4 overflow-hidden max-w-full">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  {[
                    { name: "ICICI Bank", abbr: "ICICI" },
                    { name: "IDFC First Bank", abbr: "IDFC" },
                    { name: "HDFC Bank", abbr: "HDFC" },
                    { name: "Kotak Mahindra", abbr: "Kotak" },
                    { name: "AU Small Finance", abbr: "AU" },
                  ].map((bank) => (
                    <div 
                      key={bank.name} 
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-[5px] sm:text-[6px] font-black text-slate-700 dark:text-slate-200 shadow-md"
                      title={bank.name}
                    >
                      {bank.abbr}
                    </div>
                  ))}
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary border-2 border-white dark:border-card flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white shadow-md">
                    +20
                  </div>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">Trusted Lending Partners</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
