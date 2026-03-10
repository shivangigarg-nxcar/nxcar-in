"use client";

import { motion } from "framer-motion";

export function PartnerHero() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0D1117] to-[#0A0E14] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6" data-testid="badge-partner">
            Channel Partner Program
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Transform Pre-Owned Car Acquisitions & Sales with{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              Nxcar
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            We are your trusted partners. Nxcar specializes in facilitating pre-owned car acquisitions and helping dealers grow their business.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
