"use client";

import { Button } from "@components/ui/button";
import { ArrowRight, CheckCircle2, Scan, Shield, FileSearch, Wrench, Activity, Camera } from "lucide-react";
import { motion } from "framer-motion";

const pdiFeatures = [
  { icon: Scan, text: "X-Ray Diagnostics", desc: "Deep structural analysis" },
  { icon: Shield, text: "200+ Point Check", desc: "Comprehensive inspection" },
  { icon: FileSearch, text: "Digital Report", desc: "Detailed documentation" },
  { icon: Wrench, text: "Engine Health", desc: "Performance analysis" },
  { icon: Activity, text: "OBD Scan", desc: "Electronic diagnostics" },
  { icon: Camera, text: "Photo Evidence", desc: "Visual documentation" },
];

export function PDISection() {
  return (
    <section className="py-12 sm:py-20 bg-slate-50 dark:bg-[#0a1218] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-teal-50/60 via-transparent to-slate-100/40 dark:from-teal-950/40 dark:via-transparent dark:to-slate-950/30"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/5 dark:from-teal-500/10 via-transparent to-transparent"></div>
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-teal-500/5 dark:bg-teal-500/15 rounded-full blur-[100px]"></div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-card/50">
              <img 
                src="/images/pdi-xray-car.png" 
                alt="X-Ray Car Inspection"
                width={600}
                height={450}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-contain p-2 sm:p-4"
              />
              
              <div className="absolute top-1/4 left-1/4 animate-pulse">
                <div className="relative">
                  <div className="h-3 w-3 bg-primary rounded-full shadow-[0_0_10px_rgba(14,169,178,0.8)]"></div>
                  <div className="absolute -top-1 -left-1 h-5 w-5 border border-primary/50 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-5 w-16 h-px bg-gradient-to-r from-primary to-transparent"></div>
                  <span className="absolute -top-2 left-24 text-[10px] text-primary font-mono uppercase hidden sm:inline">Engine Check</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-1/4 animate-pulse" style={{ animationDelay: "0.5s" }}>
                <div className="relative">
                  <div className="h-3 w-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                  <div className="absolute -top-1 -left-1 h-5 w-5 border border-cyan-400/50 rounded-full animate-ping"></div>
                  <div className="absolute top-0 right-5 w-16 h-px bg-gradient-to-l from-cyan-400 to-transparent"></div>
                  <span className="absolute -top-2 right-24 text-[10px] text-cyan-600 dark:text-cyan-400 font-mono uppercase hidden sm:inline">Suspension</span>
                </div>
              </div>
              
              <div className="absolute bottom-1/3 left-1/3 animate-pulse" style={{ animationDelay: "1s" }}>
                <div className="relative">
                  <div className="h-3 w-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                  <div className="absolute -top-1 -left-1 h-5 w-5 border border-green-400/50 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-5 w-20 h-px bg-gradient-to-r from-green-400 to-transparent"></div>
                  <span className="absolute -top-2 left-28 text-[10px] text-green-600 dark:text-green-400 font-mono uppercase hidden sm:inline">Frame Integrity</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white dark:from-card to-transparent"></div>
              
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50"></div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(14,169,178,0.5)]">
              X-Ray Analysis
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                <Scan className="h-4 w-4" />
                Pre-Delivery Inspection
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">
                Know Your Car <span className="text-primary">Inside Out</span>
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Our state-of-the-art PDI service uses advanced X-ray diagnostics and 200+ point inspection to reveal every detail about your potential purchase.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {pdiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/80 dark:bg-card/50 border border-slate-200 dark:border-white/5 rounded-lg p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm">{feature.text}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-xs">{feature.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-end">
              <a 
                href="https://nxcar.in/pdi" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="link-book-pdi"
                className="inline-flex items-center justify-center h-11 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider rounded-md group transition-colors"
              >
                Book PDI Inspection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="/sample-inspection-report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-view-sample-report"
                className="group flex items-center gap-3 bg-white/80 dark:bg-card/50 border border-slate-200 dark:border-white/10 rounded-lg p-2 hover:border-primary/50 transition-all"
              >
                <img 
                  src="/images/sample-report-thumbnail.png" 
                  alt="Sample Inspection Report"
                  width={48}
                  height={64}
                  loading="lazy"
                  className="w-12 h-16 object-cover rounded border border-slate-200 dark:border-white/10 group-hover:border-primary/30 transition-colors"
                />
                <div className="pr-2">
                  <div className="text-slate-900 dark:text-white font-bold text-sm">Sample Report</div>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <FileSearch className="h-3 w-3" /> View PDF
                  </div>
                </div>
              </a>
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-white/5">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-primary">50K+</div>
                <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase">Cars Inspected</div>
              </div>
              <div className="h-8 sm:h-10 w-px bg-slate-200 dark:bg-white/10"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-primary">99.2%</div>
                <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase">Accuracy Rate</div>
              </div>
              <div className="h-8 sm:h-10 w-px bg-slate-200 dark:bg-white/10"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-primary">4.9★</div>
                <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase">Customer Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
