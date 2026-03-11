'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import {
  Shield, FileText, Clock, CheckCircle, Phone, Zap,
  HeadphonesIcon, RefreshCw, ArrowRight, ClipboardCheck,
  AlertTriangle, IndianRupee, Umbrella, ShieldCheck, Star, ExternalLink
} from "lucide-react";

const features = [
  { icon: IndianRupee, title: "Low Premiums", description: "Get the best insurance rates from top providers with competitive premiums." },
  { icon: FileText, title: "Zero Paperwork", description: "Completely digital process. No physical documents required." },
  { icon: Shield, title: "Stress-free Claims", description: "Hassle-free claim settlement process with dedicated support." },
  { icon: Zap, title: "Instant Claim Settlement", description: "Quick and efficient claim processing with fast payouts." },
  { icon: Star, title: "Total Convenience", description: "Manage your insurance from anywhere, anytime on any device." },
  { icon: HeadphonesIcon, title: "24x7 Support", description: "Round-the-clock customer support for all your insurance queries." },
  { icon: RefreshCw, title: "Easy Insurance Renewal", description: "Renew your existing policy in minutes with the best deals." },
];

const plans = [
  {
    title: "Third Party",
    description: "Mandatory by law. Covers damages to third-party property, injury, or death. Does not cover own vehicle damage.",
    icon: Shield,
  },
  {
    title: "Comprehensive",
    description: "Complete protection covering own damage, third-party liability, theft, natural disasters, and personal accident cover.",
    icon: Umbrella,
  },
  {
    title: "Zero Depreciation (Bumper-to-Bumper)",
    description: "Get full claim amount without depreciation deduction on parts. Ideal for new and expensive cars.",
    icon: ShieldCheck,
  },
  {
    title: "Stand Alone Own Damage",
    description: "Covers only own vehicle damage from accidents, theft, fire, and natural calamities. Does not include third-party cover.",
    icon: CheckCircle,
  },
];

const otherServices = [
  { title: "RC Check", description: "Verify RC details and ownership history", href: "/rc-check", icon: ClipboardCheck },
  { title: "Challan Check", description: "Check pending challans and traffic fines", href: "/challan-check", icon: AlertTriangle },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function InsuranceCheck() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast({ title: "Please enter your vehicle number", variant: "destructive" });
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/nxcar/insurance-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle_number: vehicleNumber.replace(/\s/g, "").trim(), phone_number: phoneNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok || (data.success === false && data.status === false)) {
        toast({ title: "Error", description: data.message || "Failed to fetch insurance data", variant: "destructive" });
        return;
      }
      if (data.url) {
        setResult({ type: "redirect", url: data.url, vehicleNumber: vehicleNumber.replace(/\s/g, "").trim() });
        toast({ title: "Insurance quote ready!", description: "Click the button below to view your quote." });
      } else {
        setResult({ type: "data", data: data.data || data });
        toast({ title: "Insurance details retrieved!", description: "Check the results below." });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
        <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6" data-testid="badge-insurance">
                  Car Insurance
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                  Buy or Renew{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                    Car Insurance
                  </span>
                </h1>
                <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8" data-testid="text-hero-subtitle">
                  Get customizable car insurance plans from India's top providers. Compare, choose, and buy — all in minutes with zero paperwork.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>Instant Policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>Best Rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>24x7 Support</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-insurance">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Get a Free Quote</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle Number</label>
                      <Input
                        placeholder="e.g., DL 01 AB 1234"
                        value={vehicleNumber}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
                          setVehicleNumber(val.replace(/  +/g, " "));
                        }}
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12 text-lg uppercase"
                        data-testid="input-vehicle-number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-white/10 rounded-l-md text-sm text-slate-600 dark:text-slate-300">
                          +91
                        </span>
                        <Input
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12 rounded-l-none"
                          data-testid="input-phone-number"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold text-lg rounded-xl disabled:opacity-70"
                      data-testid="button-get-quote"
                    >
                      {loading ? "Checking..." : "Get a Quote"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {result && (
          <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]" data-testid="insurance-results-section">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-blue-500/30 shadow-xl"
              >
                {result.type === "redirect" ? (
                  <div className="text-center" data-testid="insurance-redirect-card">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2" data-testid="text-insurance-result-title">
                      Your Insurance Quote is Ready!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      Vehicle: <span className="font-semibold text-slate-900 dark:text-white">{result.vehicleNumber}</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                      We have partnered with Acko Insurance to bring you the best rates. Click below to compare plans and get an instant quote.
                    </p>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all text-lg"
                      data-testid="button-view-insurance-quote"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View Insurance Quote
                    </a>
                    <p className="text-xs text-slate-400 mt-4">Opens in a new tab on Acko Insurance</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-insurance-result-title">Insurance Details</h3>
                    </div>
                    {typeof result.data === 'object' && result.data !== null ? (
                      <div className="space-y-3" data-testid="insurance-result-details">
                        {Object.entries(result.data as Record<string, unknown>).map(([key, value]): React.ReactNode => {
                          if (!value) return null;
                          return (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-white/10 last:border-0">
                              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white" data-testid={`text-insurance-${key}`}>{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-600 dark:text-slate-400" data-testid="text-insurance-result-msg">{String(result.data)}</p>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-key-features">
                Key Features
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Why choose Nxcar for your car insurance needs
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all group"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-insurance-plans">
                Insurance Plans
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Choose the right plan for your needs
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all"
                  data-testid={`card-plan-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <plan.icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{plan.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{plan.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-other-services">
                Avail Other Services
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400">
                Explore more services to complete your car ownership experience
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            >
              {otherServices.map((service) => (
                <motion.div key={service.title} variants={fadeInUp}>
                  <Link href={service.href} data-testid={`link-other-${service.title.toLowerCase().replace(/ /g, '-')}`}>
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all cursor-pointer group flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <service.icon className="w-6 h-6 text-teal-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{service.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
