'use client';

import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import Link from "next/link";
import { Users, Zap, Search, Banknote, Clock, Car, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Users, title: "500+ Verified Dealers", desc: "Access a vast network of verified dealers in Gurugram" },
  { icon: Zap, title: "Instant Price Offers", desc: "Get competitive offers within minutes of listing" },
  { icon: Search, title: "Free Car Inspection", desc: "Complimentary inspection by certified experts" },
  { icon: Banknote, title: "Same-Day Payment", desc: "Receive payment on the same day of sale" },
];

const stats = [
  { label: "Average Selling Time", value: "3 Days" },
  { label: "Dealers in Gurugram", value: "500+" },
  { label: "Cars Sold Monthly", value: "1,200+" },
  { label: "Customer Satisfaction", value: "98%" },
];

const steps = [
  { num: "01", title: "Enter Details", desc: "Share your car details including make, model, year, and condition" },
  { num: "02", title: "Get Offers", desc: "Receive instant offers from verified Gurugram dealers" },
  { num: "03", title: "Sell Your Car", desc: "Choose the best offer and complete the sale with same-day payment" },
];

export default function SellUsedCarsGurugram() {
  return (
    <div className="min-h-screen bg-[#0A0E14] font-sans" data-testid="sell-used-cars-gurugram-page">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container px-4 max-w-5xl mx-auto text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            data-testid="heading-hero"
          >
            Sell Your Car in <span className="text-[#0EA9B2]">Gurugram</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Get the best price for your car from verified Gurugram dealers
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link
              href="/sell-used-cars"
              data-testid="button-sell-now-hero"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors"
            >
              Sell Your Car Now <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>

        <section className="container px-4 max-w-5xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-10 text-center"
            data-testid="heading-why-sell"
          >
            Why Sell in <span className="text-[#0EA9B2]">Gurugram?</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center"
                data-testid={`benefit-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-6 w-6 text-[#0EA9B2]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container px-4 max-w-5xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-10 text-center"
            data-testid="heading-stats"
          >
            Gurugram in Numbers
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center"
                data-testid={`stat-${i + 1}`}
              >
                <div className="text-3xl font-bold text-[#0EA9B2] mb-1">{s.value}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container px-4 max-w-5xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-10 text-center"
            data-testid="heading-how-it-works"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center"
                data-testid={`how-step-${i + 1}`}
              >
                <div className="text-4xl font-bold text-[#0EA9B2]/30 mb-3">{step.num}</div>
                <h3 className="text-white font-semibold mb-2 text-lg">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/sell-used-cars"
              data-testid="button-sell-now-bottom"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors"
            >
              Sell Your Car Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
