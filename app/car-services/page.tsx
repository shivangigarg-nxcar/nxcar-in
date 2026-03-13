'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import {
  Car, Shield, FileText, CheckCircle, ArrowRight, Sparkles,
  ClipboardCheck, ShieldCheck, AlertTriangle, Phone, MessageCircle, Wrench,
  Settings, Heart, Star, Zap, Users
} from "lucide-react";

const services = [
  {
    icon: ClipboardCheck,
    title: "RC Check",
    description: "Verify RC details, ownership history, and registration status of any vehicle instantly.",
    href: "/rc-check",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: AlertTriangle,
    title: "Challan Check",
    description: "Check pending challans and traffic fines associated with any vehicle number.",
    href: "/challan-check",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Car Insurance",
    description: "Buy or renew car insurance with the best plans from top providers at low premiums.",
    href: "/insurance-check",
    color: "from-blue-500 to-indigo-500",
  },
];

const steps = [
  {
    number: "01",
    icon: Car,
    title: "Pick a Car",
    description: "Browse through our curated collection of verified used cars and find the one that fits your needs.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Add Services",
    description: "Customize your purchase with insurance, RC transfer, loan assistance, and more — all in one place.",
  },
  {
    number: "03",
    icon: Heart,
    title: "Zero-Stress Ownership",
    description: "Drive home with complete peace of mind. We handle all the paperwork and legalities for you.",
  },
];

const processSteps = [
  {
    icon: Star,
    title: "Choose Your Car",
    description: "Select from our wide range of inspected, verified used cars.",
  },
  {
    icon: Wrench,
    title: "Bundle Your Services",
    description: "Add insurance, RC transfer, challan clearance, and more.",
  },
  {
    icon: Zap,
    title: "We Handle Everything",
    description: "Our team takes care of all paperwork, transfers, and formalities.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function CarServices() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-hero">
                No More Platform-Hopping
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                All Your Used Car Needs{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  in One Place
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                From buying and selling to insurance, RC transfer, and challan checks — Nxcar brings everything together so you don't have to juggle multiple platforms.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/sell-used-car" data-testid="link-sell-car">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-shadow"
                    data-testid="button-get-started"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <a href="tel:+919355924133" data-testid="link-call-us">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-colors flex items-center gap-2"
                    data-testid="button-call-us"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93559 24133
                  </motion.button>
                </a>
                <a href="https://wa.me/919355924133?text=Hi%2C%20I%27m%20interested%20in%20NxCar%20car%20services.%20Please%20share%20more%20details." target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-us">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center gap-2"
                    data-testid="button-whatsapp-us"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                data-testid="text-make-it-your-way"
              >
                Let's Make It{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Your Way</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Three simple steps to a hassle-free used car experience
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-4 sm:gap-8"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                  data-testid={`card-step-${index + 1}`}
                >
                  <span className="absolute top-4 right-4 text-6xl font-black text-slate-100 dark:text-white/5 select-none">
                    {step.number}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-teal-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6" data-testid="text-we-believe">
                We Believe
              </h2>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Used car ownership should be as seamless and joyful as buying a new one. At Nxcar, we're building an ecosystem where every aspect of your used car journey — from discovery to ownership — is handled with care, transparency, and technology.
              </p>
              <p className="text-slate-500 dark:text-slate-500 leading-relaxed">
                No hidden surprises, no running around for paperwork, no stress. Just pick your car, add the services you need, and drive home happy.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                data-testid="text-our-services"
              >
                Our Services
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need for a worry-free used car experience
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-4 sm:gap-8"
            >
              {services.map((service) => (
                <motion.div key={service.title} variants={fadeInUp}>
                  <Link href={service.href} data-testid={`link-service-${service.title.toLowerCase().replace(/ /g, '-')}`}>
                    <div className="rounded-xl border bg-card overflow-hidden hover-elevate cursor-pointer h-full group">
                      <div className={`w-full aspect-[16/10] bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                        <service.icon className="w-16 h-16 text-white/90" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold mb-1 text-slate-900 dark:text-white">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                          Learn More <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                data-testid="text-easy-123"
              >
                As Easy As{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">1-2-3</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Our streamlined process ensures you get the best experience
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-4 sm:gap-8"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative text-center"
                  data-testid={`card-process-${index + 1}`}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/25">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-teal-500/50 to-transparent" />
                  )}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4" data-testid="text-cta-title">
                Ready to Get Started?
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Join thousands of happy car owners who chose Nxcar for a hassle-free experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/sell-used-car" data-testid="link-cta-sell">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    data-testid="button-cta-sell"
                  >
                    Sell Your Car
                  </motion.button>
                </Link>
                <a href="tel:+919355924133" data-testid="link-cta-call">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                    data-testid="button-cta-call"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us Now
                  </motion.button>
                </a>
                <a href="https://wa.me/919355924133?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20NxCar%20car%20services." target="_blank" rel="noopener noreferrer" data-testid="link-cta-whatsapp">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center gap-2"
                    data-testid="button-cta-whatsapp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
