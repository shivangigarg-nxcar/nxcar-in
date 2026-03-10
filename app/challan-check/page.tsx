'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import {
  Search, FileText, Eye, ArrowRight, AlertTriangle,
  Car, Shield, Ban, Gauge, Wine, ClipboardCheck, Info,
  Loader2, CheckCircle, MapPin, Calendar, IndianRupee
} from "lucide-react";

const howToSteps = [
  {
    icon: Search,
    number: "1",
    title: "Search",
    description: "Enter your vehicle registration number in the search box above.",
  },
  {
    icon: FileText,
    number: "2",
    title: "Details",
    description: "Enter your details and verify your identity to access challan records.",
  },
  {
    icon: Eye,
    number: "3",
    title: "View Challans",
    description: "View all pending and paid challans associated with your vehicle for free.",
  },
];

const commonChallans = [
  { icon: AlertTriangle, title: "Violation of Traffic Rules", description: "Running red lights, illegal turns, not following road signs and signals." },
  { icon: FileText, title: "Driving Without Licence", description: "Operating a vehicle without a valid driving licence or with an expired one." },
  { icon: Gauge, title: "Driving Over Speed Limit", description: "Exceeding the prescribed speed limits on roads and highways." },
  { icon: Wine, title: "Drink and Drive", description: "Driving under the influence of alcohol or drugs — a serious criminal offence." },
  { icon: Shield, title: "Driving Without Insurance", description: "Operating a vehicle without valid insurance coverage as mandated by law." },
  { icon: Ban, title: "Wrong Side Driving", description: "Driving on the wrong side of the road, causing risk to oncoming traffic." },
];

const otherServices = [
  { title: "RC Check", description: "Verify RC details and ownership history", href: "/rc-check", icon: ClipboardCheck },
  { title: "Car Insurance", description: "Buy or renew car insurance easily", href: "/insurance-check", icon: Shield },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function ChallanCheck() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [challans, setChallans] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [inlineToken, setInlineToken] = useState("");

  const handleSendOtp = async () => {
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/nxcar/dealer-login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneNumber.trim() }),
      });
      const data = await res.json();
      if (data.status === true || data.success) {
        setOtpSent(true);
        toast({ title: "OTP sent to +91 " + phoneNumber.trim() });
      } else {
        toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast({ title: "Please enter a valid OTP", variant: "destructive" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/nxcar/dealer-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneNumber.trim(), otp }),
      });
      const data = await res.json();
      const token = data.access_token || data.data?.access_token || data.token;
      if (token) {
        const userId = data.user_id || data.data?.user_id || data.id;
        if (userId) {
          localStorage.setItem("nxcar_user_id", String(userId));
        }
        setInlineToken(token);
        setNeedsLogin(false);
        setOtpSent(false);
        setOtp("");
        toast({ title: "Logged in! Now checking challans..." });
        setTimeout(() => submitChallanCheck(token, userId ? String(userId) : undefined), 500);
      } else {
        toast({ title: "Error", description: data.message || "Invalid OTP", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify OTP", variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  const submitChallanCheck = async (tokenOverride?: string, userIdOverride?: string) => {
    setLoading(true);
    setSearched(false);
    setChallans([]);
    try {
      const userId = userIdOverride || (typeof window !== "undefined" ? localStorage.getItem("nxcar_user_id") || "" : "");
      const authToken = tokenOverride || inlineToken;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) {
        headers["x-auth-token"] = authToken;
      }
      const res = await fetch("/api/nxcar/challan-check", {
        method: "POST",
        headers,
        body: JSON.stringify({
          vehicle_number: vehicleNumber.replace(/\s/g, "").trim(),
          phone_number: phoneNumber.trim(),
          ...(userId ? { user_id: userId } : {}),
        }),
      });
      const data = await res.json();
      if (data.message === "Authentication failed" || data.message === "Token not valid") {
        setNeedsLogin(true);
        toast({ title: "Login Required", description: "Please verify your phone number to check challans", variant: "destructive" });
        return;
      }
      if (!res.ok || (data.success === false && data.status === false)) {
        toast({ title: "Error", description: data.message || "Failed to fetch challan data", variant: "destructive" });
        return;
      }
      setChallans(Array.isArray(data.data) ? data.data : (Array.isArray(data.challans) ? data.challans : []));
      setSearched(true);
    } catch (err: any) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
    await submitChallanCheck();
  };

  const totalPendingAmount = challans
    .filter((c) => c.challanStatus?.toLowerCase() === "pending")
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-6" data-testid="badge-challan">
                  Traffic Challan
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                  Check{" "}
                  <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                    Challan
                  </span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8" data-testid="text-hero-subtitle">
                  Instantly check all pending challans and traffic fines associated with your vehicle. Stay informed and avoid surprises at toll plazas or during vehicle transfers.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-challan">
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
                      disabled={loading || needsLogin}
                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg rounded-xl disabled:opacity-70"
                      data-testid="button-view-challan"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 mr-2" />
                      )}
                      {loading ? "Checking..." : "View Challan"}
                    </Button>

                    {needsLogin && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl" data-testid="challan-otp-section">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-3">
                          Phone verification required to check challans
                        </p>
                        {!otpSent ? (
                          <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading}
                            className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg"
                            data-testid="button-send-challan-otp"
                          >
                            {otpLoading ? "Sending OTP..." : "Send OTP to +91 " + phoneNumber}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <Input
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              className="bg-white dark:bg-slate-900/50 border-amber-200 dark:border-amber-700/30 h-10 text-center tracking-[0.3em]"
                              maxLength={6}
                              data-testid="input-challan-otp"
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={otpLoading || otp.length < 4}
                              className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg"
                              data-testid="button-verify-challan-otp"
                            >
                              {otpLoading ? "Verifying..." : "Verify & Check Challans"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {searched && (
          <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]" data-testid="challan-results-section">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {challans.length === 0 ? (
                  <div className="max-w-lg mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-green-500/30 shadow-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Challans Found</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Great news! No pending challans were found for your vehicle.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Challans</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="text-total-challans">{challans.length}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-amber-500/30 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Pending Amount</p>
                        <p className="text-3xl font-bold text-amber-500" data-testid="text-total-amount">{formatAmount(totalPendingAmount)}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {challans.map((challan, index) => {
                        const isPending = challan.challanStatus?.toLowerCase() === "pending";
                        return (
                          <motion.div
                            key={challan.challanNo || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all"
                            data-testid={`challan-card-${index}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">#{challan.challanNo}</span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  isPending
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-green-500/10 text-green-600 dark:text-green-400"
                                }`}
                              >
                                {challan.challanStatus}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                              {challan.offenseDetails}
                            </p>
                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                                <span className="truncate">{challan.challanPlace || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
                                <span>{challan.challanDate ? formatDate(challan.challanDate) : "N/A"}</span>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                              <span className="text-xs text-slate-500 dark:text-slate-400">Fine Amount</span>
                              <span className="text-lg font-bold text-slate-900 dark:text-white">{formatAmount(Number(challan.amount) || 0)}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-how-to-check">
                How to Check e-Challan?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Follow these simple steps to check your vehicle's challan status
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {howToSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative text-center"
                  data-testid={`card-step-${index + 1}`}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/25">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  {index < howToSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-amber-500/50 to-transparent" />
                  )}
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-3">
                    Step {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-what-is-challan">
                    What is Traffic e-Challan?
                  </h2>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>
                    A traffic e-challan is an electronic challan (fine) issued by traffic police for violation of traffic rules. The Government of India has digitized the challan system to make it more transparent, efficient, and corruption-free.
                  </p>
                  <p>
                    When a traffic violation is detected — either by traffic cameras or by police personnel — an e-challan is generated electronically and linked to the vehicle's registration number. The vehicle owner can check and pay these challans online through official portals.
                  </p>
                  <p>
                    It is important to regularly check for pending challans, especially before selling or transferring your vehicle, as unpaid challans can create complications during RC transfer and ownership change.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-common-challans">
                Common Challans
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Be aware of the most common traffic violations and their penalties
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {commonChallans.map((challan, index) => (
                <motion.div
                  key={challan.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all group"
                  data-testid={`card-challan-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <challan.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{challan.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{challan.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
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
