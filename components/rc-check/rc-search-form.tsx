"use client";

import { motion } from "framer-motion";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CheckCircle, Search, Loader2 } from "lucide-react";

interface RcSearchFormProps {
  vehicleNumber: string;
  setVehicleNumber: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function RcSearchForm({
  vehicleNumber, setVehicleNumber,
  phoneNumber, setPhoneNumber,
  loading, onSubmit,
}: RcSearchFormProps) {
  return (
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-rc-check">
              RC Verification
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
              Check{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                RC Details
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8" data-testid="text-hero-subtitle">
              Verify Registration Certificate, insurance status, ownership details, and more. Make informed decisions before buying any used car.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>Pan India Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>100% Authentic Data</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={onSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-rc-check">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Check RC Details</h3>
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
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl"
                  data-testid="button-check-rc"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 mr-2" />
                  )}
                  {loading ? "Checking..." : "Check RC"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
