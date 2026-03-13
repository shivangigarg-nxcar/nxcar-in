"use client";

import { motion } from "framer-motion";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Search, Loader2, CheckCircle } from "lucide-react";

interface ChallanSearchFormProps {
  vehicleNumber: string;
  setVehicleNumber: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  loading: boolean;
  otpSent: boolean;
  otp: string;
  setOtp: (v: string) => void;
  otpLoading: boolean;
  verified: boolean;
  onSendOtp: (e?: React.FormEvent) => void;
  onVerifyOtp: () => void;
}

export function ChallanSearchForm({
  vehicleNumber, setVehicleNumber,
  phoneNumber, setPhoneNumber,
  loading,
  otpSent, otp, setOtp, otpLoading,
  verified,
  onSendOtp, onVerifyOtp,
}: ChallanSearchFormProps) {
  return (
    <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-6" data-testid="badge-challan">
              Traffic Challan
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
              Check{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                Challan
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8" data-testid="text-hero-subtitle">
              Instantly check all pending challans and traffic fines associated with your vehicle. Stay informed and avoid surprises at toll plazas or during vehicle transfers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={(e) => { e.preventDefault(); if (!otpSent && !verified) onSendOtp(e); else if (otpSent) onVerifyOtp(); }} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-challan">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Check Vehicle Challan</h3>
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
                    disabled={otpSent || verified}
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
                      disabled={otpSent || verified}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12 rounded-l-none"
                      data-testid="input-phone-number"
                    />
                  </div>
                </div>

                {!otpSent && !verified && (
                  <Button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg rounded-xl disabled:opacity-70"
                    data-testid="button-send-otp"
                  >
                    {otpLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 mr-2" />
                    )}
                    {otpLoading ? "Sending OTP..." : "Check Challan"}
                  </Button>
                )}

                {otpSent && !verified && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl" data-testid="challan-otp-section">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-3">
                      OTP sent to +91 {phoneNumber}
                    </p>
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="bg-white dark:bg-slate-900/50 border-amber-200 dark:border-amber-700/30 h-10 text-center tracking-[0.3em]"
                        maxLength={6}
                        autoFocus
                        data-testid="input-challan-otp"
                      />
                      <Button
                        type="submit"
                        disabled={otpLoading || otp.length < 4 || loading}
                        className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg"
                        data-testid="button-verify-challan-otp"
                      >
                        {otpLoading || loading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {otpLoading ? "Verifying..." : loading ? "Checking Challans..." : "Verify & Check Challans"}
                      </Button>
                    </div>
                  </div>
                )}

                {verified && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm" data-testid="otp-verified-badge">
                    <CheckCircle className="w-4 h-4" />
                    <span>Phone verified</span>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
