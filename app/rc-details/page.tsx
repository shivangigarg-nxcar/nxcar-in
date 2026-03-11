'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import { lookupVehicle, type VehicleDetails } from "@lib/api";
import {
  Search, Phone, Shield, FileText, CheckCircle, Car,
  AlertTriangle, UserCheck, Loader2
} from "lucide-react";

const benefits = [
  { icon: UserCheck, title: "Verify Ownership", description: "Confirm the rightful owner of the vehicle before making any purchase decision." },
  { icon: Shield, title: "Check Insurance Status", description: "Verify if the vehicle's insurance is active and valid to avoid future complications." },
  { icon: Car, title: "Confirm Vehicle Details", description: "Cross-check all vehicle specifications including make, model, and manufacturing year." },
  { icon: AlertTriangle, title: "Fraud Prevention", description: "Protect yourself from fraudulent sellers by verifying authentic registration data." },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function RCDetails() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleDetails | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = vehicleNumber.replace(/\s/g, "").trim();
    if (!trimmed) {
      toast({ title: "Please enter a vehicle registration number", variant: "destructive" });
      return;
    }
    setLoading(true);
    setError(false);
    setVehicleData(null);
    try {
      const data = await lookupVehicle(trimmed);
      if (!data || !data.all) {
        setError(true);
      } else {
        setVehicleData(data);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const reportFields = vehicleData
    ? [
        { label: "Registration Number", value: vehicleData.all.regNo || vehicleData.vehicle_number },
        { label: "Owner Name", value: vehicleData.all.owner },
        { label: "Vehicle Class", value: vehicleData.all.vehicleClass },
        { label: "Fuel Type", value: vehicleData.fule_type || vehicleData.all.normsType },
        { label: "Maker / Model", value: `${vehicleData.make} ${vehicleData.model}` },
        { label: "Manufacturing Year", value: vehicleData.all.vehicleManufacturingMonthYear || vehicleData.year },
        { label: "Registration Date", value: vehicleData.all.regDate },
        { label: "Insurance Valid Until", value: vehicleData.all.vehicleInsuranceUpto || "N/A" },
        { label: "Fitness Valid Until", value: vehicleData.all.rcExpiryDate || "N/A" },
        { label: "PUC Valid Until", value: "N/A" },
        { label: "Engine Number", value: vehicleData.all.engine },
        { label: "Chassis Number", value: vehicleData.all.chassis },
        { label: "Vehicle Colour", value: vehicleData.all.vehicleColour || vehicleData.color },
        { label: "Seat Capacity", value: vehicleData.all.vehicleSeatCapacity },
        { label: "Owner Count", value: vehicleData.all.ownerCount },
        { label: "Registration Authority", value: vehicleData.all.regAuthority },
        { label: "Financed", value: vehicleData.all.financed ? "Yes" : "No" },
        { label: "Status", value: vehicleData.all.status },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden" data-testid="rc-details-page">
      <Navbar />
      <main className="pt-14">
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-rc-report">
                RC Report
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Vehicle{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  RC Report
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Complete registration details and ownership history
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-rc-details">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Enter Vehicle Number</h3>
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
                    data-testid="button-get-rc-report"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 mr-2" />
                    )}
                    {loading ? "Fetching Report..." : "Get RC Report"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {loading && (
          <section className="py-20 bg-white dark:bg-[#0A0E14]">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-teal-500 animate-spin" data-testid="loading-spinner" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">Fetching vehicle details...</p>
            </div>
          </section>
        )}

        {error && !loading && (
          <section className="py-20 bg-white dark:bg-[#0A0E14]">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-slate-700 dark:text-slate-300 text-lg" data-testid="text-error-message">
                    No RC details found for this vehicle number. Please check the number and try again.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {vehicleData && !loading && (
          <section className="py-20 bg-white dark:bg-[#0A0E14]">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-report-title">
                      Vehicle Information
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      RC Report for {vehicleData.all.regNo || vehicleData.vehicle_number}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/10" data-testid="card-vehicle-info">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {reportFields.map((field, index) => (
                      <div
                        key={field.label}
                        className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5"
                        data-testid={`field-${field.label.toLowerCase().replace(/[\s/]+/g, '-')}-${index}`}
                      >
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                          {field.label}
                        </span>
                        <span className="text-base font-semibold text-slate-900 dark:text-white">
                          {field.value || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-benefits-title">
                Why Check RC Details?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Protect yourself and make informed decisions with verified vehicle data
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                  data-testid={`card-benefit-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4" data-testid="text-cta-title">
                Need help? Call +91 93559 24132
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Our experts are available to assist you with RC verification and vehicle history reports.
              </p>
              <a href="tel:+919355924132" data-testid="link-cta-call">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 mx-auto"
                  data-testid="button-cta-call"
                >
                  <Phone className="w-4 h-4" />
                  +91 93559 24132
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
