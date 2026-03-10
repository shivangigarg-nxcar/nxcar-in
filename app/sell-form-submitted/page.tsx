"use client";

import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { CheckCircle, ClipboardCheck, ShieldCheck, Globe, Users, Phone } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: ClipboardCheck, title: "Step 1", desc: "Our team reviews your car details" },
  { icon: ShieldCheck, title: "Step 2", desc: "We verify your vehicle information" },
  { icon: Globe, title: "Step 3", desc: "Your car goes live on Nxcar" },
  { icon: Users, title: "Step 4", desc: "Dealers contact you with offers" },
];

export default function SellFormSubmitted() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] font-sans" data-testid="sell-form-submitted-page">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" data-testid="icon-check-circle" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            data-testid="heading-sell-submitted"
          >
            Your Car Has Been Listed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-12"
            data-testid="text-subtitle"
          >
            Our team will review your listing and get back to you within 24 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 mb-10 text-left"
          >
            <h2 className="text-2xl font-bold text-[#0EA9B2] mb-6 text-center" data-testid="heading-what-next">
              What happens next?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-4"
                  data-testid={`step-${i + 1}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-[#0EA9B2]" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link
              href="/sell-used-cars"
              data-testid="button-list-another"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors"
            >
              List Another Car
            </Link>
            <Link
              href="/"
              data-testid="button-go-home"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-white dark:bg-slate-800 transition-colors"
            >
              Go to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400"
            data-testid="text-need-help"
          >
            <Phone className="h-4 w-4" />
            <span>Need help? Call </span>
            <a href="tel:+919355924132" className="text-[#0EA9B2] hover:underline" data-testid="link-phone">
              +91 93559 24132
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
