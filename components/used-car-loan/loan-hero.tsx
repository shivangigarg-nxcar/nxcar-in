"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone, Car, AlertTriangle, Shield, ClipboardCheck
} from "lucide-react";

const quickLinks = [
  { title: "View All Cars", href: "/used-cars", icon: Car },
  { title: "Challan Check", href: "/challan-check", icon: AlertTriangle },
  { title: "Insurance", href: "/insurance-check", icon: Shield },
  { title: "RC Check", href: "/rc-check", icon: ClipboardCheck },
];

export function LoanHero({ onApply }: { onApply: () => void }) {
  return (
    <>
      <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-loan">
              Used Car Loans
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
              Your One-Stop Destination for{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                Second Hand Car Loans
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Whether you're purchasing from a dealer, online marketplace, or an individual seller — get the best car loan deals with quick approvals and competitive rates.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onApply}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-shadow"
                data-testid="button-apply-now"
              >
                Apply Now
              </motion.button>
              <a href="tel:+919355924132" data-testid="link-call-us">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-colors flex items-center gap-2"
                  data-testid="button-call-us"
                >
                  <Phone className="w-4 h-4" />
                  +91 93559 24132
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white dark:bg-[#0A0E14] border-b border-slate-200 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} data-testid={`link-quick-${link.title.toLowerCase().replace(/ /g, '-')}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-500 hover:bg-teal-500/10 transition-all cursor-pointer border border-slate-200 dark:border-white/5"
                >
                  <link.icon className="w-4 h-4" />
                  {link.title}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
