'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import {
  ShieldCheck, Search, Phone, CheckCircle, Car, Eye,
  Wrench, Zap, CircleDot, FileText, Loader2, Star,
  ClipboardCheck, Camera, Award
} from "lucide-react";

const inspectionChecklist = [
  { icon: Car, title: "Exterior Condition", description: "Body panels, paint quality, dents & scratches", status: "Available with full inspection" },
  { icon: Eye, title: "Interior Condition", description: "Seats, dashboard, controls & upholstery", status: "Available with full inspection" },
  { icon: Wrench, title: "Engine & Transmission", description: "Performance, leaks, noise & vibrations", status: "Available with full inspection" },
  { icon: Zap, title: "Electrical Systems", description: "Lights, AC, infotainment & electronics", status: "Available with full inspection" },
  { icon: CircleDot, title: "Tyres & Brakes", description: "Tread depth, brake pads & suspension", status: "Available with full inspection" },
  { icon: FileText, title: "Documents & Legal", description: "RC, insurance, challan & ownership", status: "Available with full inspection" },
];

const howItWorks = [
  { number: "1", icon: Search, title: "Enter Vehicle Number", description: "Provide the vehicle registration number to get started with the inspection process." },
  { number: "2", icon: ClipboardCheck, title: "Expert Inspects 200+ Checkpoints", description: "Our certified expert thoroughly inspects the vehicle covering 200+ checkpoints." },
  { number: "3", icon: Camera, title: "Get Detailed Report with Photos", description: "Receive a comprehensive report with photos, ratings, and expert recommendations." },
];

const pricingPlans = [
  {
    name: "Basic Report",
    price: "₹499",
    features: ["Vehicle history check", "RC verification", "Insurance status", "Challan records", "Ownership history"],
    popular: false,
  },
  {
    name: "Full Inspection",
    price: "₹1,999",
    features: ["200+ checkpoint physical inspection", "Detailed condition report", "Engine & transmission check", "Electrical systems check", "Expert recommendations", "Photo documentation"],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹2,999",
    features: ["Full 200+ checkpoint inspection", "Detailed report with photos", "6-month warranty coverage", "Priority support", "Re-inspection within 7 days", "Negotiation assistance"],
    popular: false,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function CarScope() {
  const { toast } = useToast();
  const params = useParams<{ vehicleNumber?: string }>();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);

  useEffect(() => {
    if (params.vehicleNumber) {
      setVehicleNumber(params.vehicleNumber.toUpperCase());
      fetchVehicleData(params.vehicleNumber.toUpperCase());
    }
  }, [params.vehicleNumber]);

  const fetchVehicleData = async (number: string) => {
    setLoading(true);
    setVehicleData(null);
    try {
      const res = await fetch(`/api/vehicle-lookup/${encodeURIComponent(number)}`);
      if (!res.ok) throw new Error("Vehicle not found");
      const data = await res.json();
      setVehicleData(data);
    } catch {
      toast({ title: "Could not fetch vehicle details", description: "Please check the vehicle number and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = vehicleNumber.replace(/\s/g, "").trim();
    if (!trimmed) {
      toast({ title: "Please enter a vehicle number", variant: "destructive" });
      return;
    }
    fetchVehicleData(trimmed);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden" data-testid="carscope-page">
      <Navbar />
      <main className="pt-14">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-carscope">
                  <ShieldCheck className="w-4 h-4" />
                  Vehicle Inspection
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                    DriveAway
                  </span>{" "}
                  by Nxcar
                </h1>
                <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8" data-testid="text-hero-subtitle">
                  Complete vehicle inspection before you buy. Know the real condition of any used car.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>200+ Checkpoints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>Certified Experts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>Detailed Reports</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-carscope">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Get Inspection Report</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle Registration Number</label>
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
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl"
                      data-testid="button-get-report"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Fetching Details...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Get Inspection Report
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vehicle Report Section */}
        {(loading || vehicleData) && (
          <section className="py-20 bg-white dark:bg-[#0A0E14]">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16" data-testid="loading-state">
                  <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg">Fetching vehicle details...</p>
                </div>
              ) : vehicleData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 mb-8" data-testid="vehicle-info">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-testid="text-vehicle-info-title">Vehicle Information</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vehicleData.make && (
                        <div className="flex flex-col" data-testid="info-make">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Make</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{vehicleData.make}</span>
                        </div>
                      )}
                      {vehicleData.model && (
                        <div className="flex flex-col" data-testid="info-model">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Model</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{vehicleData.model}</span>
                        </div>
                      )}
                      {vehicleData.year && (
                        <div className="flex flex-col" data-testid="info-year">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Year</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{vehicleData.year}</span>
                        </div>
                      )}
                      {vehicleData.fuelType && (
                        <div className="flex flex-col" data-testid="info-fuel">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Fuel Type</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{vehicleData.fuelType}</span>
                        </div>
                      )}
                      {vehicleData.color && (
                        <div className="flex flex-col" data-testid="info-color">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Color</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{vehicleData.color}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10" data-testid="inspection-checklist">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-testid="text-checklist-title">Inspection Checklist</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inspectionChecklist.map((item, index) => (
                        <div
                          key={item.title}
                          className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-white/10"
                          data-testid={`checklist-item-${index}`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-teal-500" />
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.description}</p>
                          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <a href="tel:+919355924133" data-testid="link-book-inspection">
                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-xl" data-testid="button-book-inspection">
                          <Phone className="w-4 h-4 mr-2" />
                          Book Full Inspection Now
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-how-it-works">
                How It Works
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Get a comprehensive vehicle inspection in 3 simple steps
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative text-center"
                  data-testid={`card-step-${index + 1}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-pricing">
                Choose Your Inspection Plan
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Transparent pricing with no hidden charges
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  className={`relative bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border transition-all ${
                    plan.popular
                      ? "border-teal-500 shadow-xl shadow-teal-500/10 scale-105"
                      : "border-slate-200 dark:border-white/10 hover:border-teal-500/30"
                  }`}
                  data-testid={`card-pricing-${index}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">{plan.price}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="tel:+919355924133">
                    <Button
                      className={`w-full rounded-xl font-semibold ${
                        plan.popular
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                      data-testid={`button-pricing-${index}`}
                    >
                      Book Now
                    </Button>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Award className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4" data-testid="text-cta-title">
                Book an Inspection
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Don't buy a used car without knowing its real condition. Our certified experts inspect 200+ checkpoints so you can buy with confidence.
              </p>
              <a href="tel:+919355924133" data-testid="link-cta-call">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 mx-auto"
                  data-testid="button-cta-call"
                >
                  <Phone className="w-4 h-4" />
                  Call +91 93559 24133
                </motion.button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
