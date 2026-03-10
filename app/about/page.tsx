"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import {
  Car, ShieldCheck, FileText, CreditCard, Shield, Search,
  Eye, Heart, Cpu, Users, CheckCircle, Phone, ArrowRight,
  ClipboardCheck, Zap, Star
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const stats = [
  { label: "Cars Sold", value: 10000, suffix: "+" },
  { label: "Dealer Partners", value: 500, suffix: "+" },
  { label: "Cities", value: 12, suffix: "+" },
  { label: "Happy Customers", value: 50000, suffix: "+" },
];

const services = [
  { icon: Car, title: "Buy Cars", description: "Browse thousands of verified used cars from trusted dealers across India.", color: "from-teal-500 to-cyan-500" },
  { icon: CreditCard, title: "Sell Cars", description: "Sell your car at the best price with our wide network of verified buyers.", color: "from-blue-500 to-indigo-500" },
  { icon: FileText, title: "Car Loans", description: "Get instant used car loans from 25+ banking partners at competitive rates.", color: "from-amber-500 to-orange-500" },
  { icon: Shield, title: "Car Insurance", description: "Buy or renew car insurance with comprehensive plans from top providers.", color: "from-purple-500 to-pink-500" },
  { icon: ClipboardCheck, title: "RC Transfer", description: "Hassle-free RC transfer with complete documentation and RTO support.", color: "from-emerald-500 to-green-500" },
  { icon: Search, title: "Car Inspection", description: "280+ point inspection by certified experts for complete peace of mind.", color: "from-red-500 to-rose-500" },
];

const values = [
  { icon: Eye, title: "Transparency", description: "Complete visibility into every car's history, condition, and pricing with no hidden charges." },
  { icon: Heart, title: "Trust", description: "Every dealer and car on our platform is verified to ensure a safe and reliable experience." },
  { icon: Cpu, title: "Technology", description: "Leveraging cutting-edge tech to make car buying and selling seamless and efficient." },
  { icon: Users, title: "Customer First", description: "Your satisfaction drives everything we do — from first click to final handover." },
];

const whyChoose = [
  { icon: ShieldCheck, title: "Verified Dealers", description: "Every dealer on our platform is background-verified and rated by real customers." },
  { icon: ClipboardCheck, title: "280+ Point Inspection", description: "Comprehensive vehicle inspection covering engine, body, electrical, and more." },
  { icon: FileText, title: "Hassle-free RC Transfer", description: "We handle all the paperwork, NOC, and RTO formalities for smooth ownership transfer." },
  { icon: Zap, title: "Easy Car Loans", description: "Instant loan approvals from 25+ banking partners with competitive interest rates." },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = count >= 1000 ? count.toLocaleString("en-IN") : count.toString();

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent" data-testid="text-counter-value">
      {formatted}{suffix}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-about">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                About{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  Nxcar
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                India's Most Trusted Used Car Platform
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6" data-testid="text-mission-title">
                Our Mission
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                At Nxcar, we're on a mission to make used car buying and selling transparent, fair, and delightful. We believe every customer deserves a hassle-free experience — whether you're buying your first car or upgrading to a better one.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-slate-500 dark:text-slate-500 leading-relaxed">
                NXFIN Technologies Private Limited, headquartered in Gurgaon, is building India's most comprehensive used car ecosystem — powered by technology, trust, and transparency.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                  data-testid={`stat-${index}`}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-what-we-do">
                What We Do
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A complete ecosystem for your used car journey
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                  data-testid={`card-service-${index}`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-our-values">
                Our Values
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                The principles that guide everything we do
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={fadeInUp}
                  className="text-center bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all"
                  data-testid={`card-value-${index}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-why-choose">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Nxcar</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                What sets us apart from the rest
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {whyChoose.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="flex items-start gap-4 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all"
                  data-testid={`card-why-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-10 sm:py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
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
                Join thousands of happy car owners who trust Nxcar for their used car needs.
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
                <a href="tel:+919355924132" data-testid="link-cta-call">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                    data-testid="button-cta-call"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93559 24132
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
