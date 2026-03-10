"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarFinanceCalculator } from "./car-finance-calculator";
import { Building2, Shield, ChevronDown, ChevronUp, Calculator, Sparkles } from "lucide-react";
import { Button } from "@components/ui/button";

const bankingPartners = [
  { name: "ICICI Bank", abbr: "ICICI" },
  { name: "HDFC Bank", abbr: "HDFC" },
  { name: "Kotak Mahindra", abbr: "Kotak" },
  { name: "AU Small Finance", abbr: "AU" },
  { name: "Bajaj Finserv", abbr: "Bajaj" },
];

export function LoanCalculatorSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-8 lg:py-12 bg-slate-50 dark:bg-[#0d1418] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-teal-50/40 dark:from-blue-950/35 dark:via-transparent dark:to-teal-950/30"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"></div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-card/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-border/50 overflow-hidden"
        >
          <div 
            className="p-4 lg:p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-[#0EA9B2]/10 dark:bg-[#0EA9B2]/20 rounded-xl shrink-0">
                  <Calculator className="h-6 w-6 text-[#0EA9B2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0EA9B2] uppercase tracking-wider">Car Finance Made Easy</span>
                  </div>
                  <h2 className="text-lg lg:text-xl font-heading font-bold text-slate-900 dark:text-foreground">
                    Calculate Your <span className="text-[#0EA9B2]">Car Loan EMI</span>
                  </h2>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#0EA9B2]/10 px-3 py-1.5 rounded-lg border border-[#0EA9B2]/30">
                  <Building2 className="h-4 w-4 text-[#0EA9B2]" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-foreground">25+ Banks</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-muted/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-border">
                  <Shield className="h-4 w-4 text-[#0EA9B2]" />
                  <span className="text-sm text-slate-600 dark:text-muted-foreground">8.5% p.a.</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex -space-x-1.5">
                  {bankingPartners.slice(0, 5).map((bank) => (
                    <div
                      key={bank.name}
                      className="h-8 w-8 rounded-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-[6px] font-black text-slate-700 dark:text-slate-200 shadow-sm"
                      title={bank.name}
                    >
                      {bank.abbr.slice(0, 4)}
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-[#0EA9B2] border-2 border-white dark:border-card flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                    +20
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-[#0EA9B2] hover:bg-[#0EA9B2]/10"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-200 dark:border-border/50 p-4 lg:p-6">
                  <div className="grid lg:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-muted-foreground">
                        Get instant loan estimates from India's largest network of banking partners.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Lowest interest rates",
                          "Instant approval",
                          "No hidden charges",
                          "Flexible tenure",
                        ].map((benefit, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-muted-foreground"
                          >
                            <Sparkles className="h-3 w-3 text-[#0EA9B2]" />
                            {benefit}
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-[#0EA9B2]/10 to-transparent rounded-lg p-3 border border-[#0EA9B2]/20">
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            <span className="font-semibold text-slate-900 dark:text-foreground">Need help?</span>
                            <span className="text-slate-600 dark:text-muted-foreground ml-1">Call</span>
                            <a href="tel:+919355924132" className="text-[#0EA9B2] font-semibold ml-1 hover:underline">
                              +91 93559 24132
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <CarFinanceCalculator compact />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
