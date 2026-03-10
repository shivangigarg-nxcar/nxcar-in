'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import {
  Wallet, CreditCard, ArrowLeftRight, Globe, Clock, Percent,
  Zap, Eye, DollarSign, FileCheck, Home, Briefcase, Car,
  CheckCircle, Phone, ArrowRight, Shield, ClipboardCheck,
  AlertTriangle, Users
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const loanTypes = [
  {
    icon: Wallet,
    title: "Refinance",
    description: "Use your car's current value to secure a new loan with better terms. Lower your monthly payments or get cash out from your vehicle's equity.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: CreditCard,
    title: "Pre Owned Car Purchase",
    description: "Finance a pre-owned car with ease. Whether buying from a dealer, online, or an individual seller, we've got you covered with quick approvals.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: ArrowLeftRight,
    title: "Balance Transfer & Top Up",
    description: "Switch your existing car loan to Nxcar for better interest rates and deals. Get additional top-up amount on your existing loan.",
    color: "from-amber-500 to-orange-500",
  },
];

const features = [
  { icon: Globe, title: "Online Application", description: "Apply from anywhere with our simple digital process" },
  { icon: Clock, title: "Flexible Loan Terms", description: "Choose tenure from 12 to 84 months as per your comfort" },
  { icon: Percent, title: "Competitive Interest Rate", description: "Get the best rates from 25+ banking partners" },
  { icon: Zap, title: "Quick Approval Process", description: "Get loan approval within 24 hours of application" },
  { icon: Eye, title: "Transparent Fees", description: "No hidden charges — complete transparency in all fees" },
  { icon: DollarSign, title: "Low/No Down Payment", description: "Finance up to 100% of the car value with minimal down payment" },
  { icon: FileCheck, title: "Pre-Approval Options", description: "Get pre-approved before you start car shopping" },
  { icon: Users, title: "Excellent Customer Service", description: "Dedicated loan advisors to guide you through the process" },
];

const eligibility = [
  { icon: Users, title: "Minimum Age 21", description: "Applicant must be at least 21 years of age" },
  { icon: Shield, title: "Clear Credit History", description: "A good credit score improves your chances of approval" },
  { icon: Home, title: "Proof of Residence", description: "Valid address proof such as Aadhar, utility bill, or passport" },
  { icon: Briefcase, title: "Valid Income Proof", description: "Salary slips, ITR, or bank statements for income verification" },
  { icon: Car, title: "Ownership of Vehicle", description: "For refinance and balance transfer, you must own the vehicle" },
];

const quickLinks = [
  { title: "View All Cars", href: "/used-cars", icon: Car },
  { title: "Challan Check", href: "/challan-check", icon: AlertTriangle },
  { title: "Insurance", href: "/insurance-check", icon: Shield },
  { title: "RC Check", href: "/rc-check", icon: ClipboardCheck },
];

export default function UsedCarLoan() {
  const { toast } = useToast();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [loanName, setLoanName] = useState("");
  const [loanPhone, setLoanPhone] = useState("");
  const [loanType, setLoanType] = useState("");
  const [loanIncome, setLoanIncome] = useState("");
  const [loanPancard, setLoanPancard] = useState("");
  const [loanExistingEmi, setLoanExistingEmi] = useState("");

  const handleApply = () => {
    setApplyDialogOpen(true);
  };

  const [loanSubmitting, setLoanSubmitting] = useState(false);
  const [panError, setPanError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const validatePan = (value: string) => {
    if (!value) {
      setPanError("");
      return false;
    }
    if (!PAN_REGEX.test(value)) {
      setPanError("Please enter a correct PAN number (e.g., ABCDE1234F)");
      return false;
    }
    setPanError("");
    return true;
  };

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSendOtp = async () => {
    if (!validatePhone(loanPhone)) return;
    setOtpSending(true);
    try {
      const response = await fetch('/api/nxcar/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: loanPhone }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast({ title: "OTP Sent", description: "A verification code has been sent to your mobile number." });
      } else {
        toast({ title: "Failed to send OTP", description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to send OTP", description: "Please try again.", variant: "destructive" });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      toast({ title: "Invalid OTP", description: "Please enter the complete OTP.", variant: "destructive" });
      return;
    }
    setOtpVerifying(true);
    try {
      const response = await fetch('/api/nxcar/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: loanPhone, otp }),
      });
      const data = await response.json();
      if (response.ok && data.verified) {
        setOtpVerified(true);
        toast({ title: "Mobile Verified", description: "Your mobile number has been verified successfully." });
      } else {
        toast({ title: "Invalid OTP", description: data.error || "Please enter the correct OTP.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Verification Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePan(loanPancard)) return;
    if (!validatePhone(loanPhone)) return;
    if (!otpVerified) {
      toast({ title: "Verify Mobile Number", description: "Please verify your mobile number with OTP before submitting.", variant: "destructive" });
      return;
    }

    setLoanSubmitting(true);
    try {
      const response = await fetch('/api/nxcar/loan-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: loanName,
          mobile: loanPhone,
          loan_type: loanType || "",
          salary: loanIncome || "0",
          pancard: loanPancard,
          existing_emi: loanExistingEmi || "0",
        }),
      });
      const data = await response.json();
      if (!response.ok || data.message?.includes("violated")) {
        toast({ title: "Submission Failed", description: data.message || "Please try again.", variant: "destructive" });
        return;
      }
      const leadInfo = data.lead_id ? ` (Ref: #${data.lead_id})` : "";
      toast({ title: "Application Submitted!" + leadInfo, description: data.message || "Our loan team will contact you within 24 hours." });
      setApplyDialogOpen(false);
      setLoanName("");
      setLoanPhone("");
      setLoanType("");
      setLoanIncome("");
      setLoanPancard("");
      setLoanExistingEmi("");
      setOtpSent(false);
      setOtp("");
      setOtpVerified(false);
    } catch {
      toast({ title: "Submission Failed", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setLoanSubmitting(false);
    }
  };

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
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-loan">
                Used Car Loans
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Your One-Stop Destination for{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  Second Hand Car Loans
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Whether you're purchasing from a dealer, online marketplace, or an individual seller — get the best car loan deals with quick approvals and competitive rates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-shadow"
                  data-testid="button-apply-now"
                >
                  Apply Now
                </motion.button>
                <a href="tel:+919355924132" data-testid="link-call-us">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:border-teal-500/50 transition-colors flex items-center gap-2"
                    data-testid="button-call-us"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93559 24132
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-8 bg-white dark:bg-[#0A0E14] border-b border-slate-200 dark:border-white/5">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link) => (
                <Link key={link.title} href={link.href} data-testid={`link-quick-${link.title.toLowerCase().replace(/ /g, '-')}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-500 hover:bg-teal-500/10 transition-all cursor-pointer border border-slate-200 dark:border-white/5"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.title}
                  </motion.div>
                </Link>
              ))}
            </div>
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-loan-types">
                Used Car Loans{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Fit for Every Need</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Choose the loan type that best suits your requirements
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {loanTypes.map((loan, index) => (
                <motion.div
                  key={loan.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                  data-testid={`card-loan-type-${index}`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${loan.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <loan.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{loan.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{loan.description}</p>
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-features">
                Why Choose Our Car Loans
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Benefits that make us the preferred choice
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
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-eligibility">
                Eligibility Criteria
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Check if you meet the basic requirements
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {eligibility.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="flex items-start gap-4 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10"
                  data-testid={`card-eligibility-${index}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.description}</p>
                  </div>
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
              className="space-y-12 max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-why-loan">
                  Why you should go for a used car loan?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  A used car loan allows you to purchase a quality pre-owned vehicle without straining your savings. With competitive interest rates and flexible tenures, you can drive home your dream car while maintaining financial stability.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Used cars depreciate slower than new cars, making them a smarter financial choice. With Nxcar's verified dealer network and 280+ point inspections, you can be confident about the quality of your purchase.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-when-refinance">
                  When should you Refinance?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Consider refinancing when interest rates have dropped since you took your original loan, your credit score has improved significantly, or you want to lower your monthly payments by extending the loan term.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Refinancing can also help if you need cash for an emergency — you can tap into your car's equity while potentially getting better terms on your existing loan.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-when-balance-transfer">
                  When should you opt for Balance Transfer & Top Up?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  A balance transfer makes sense when you find a lender offering significantly lower interest rates than your current loan. This can save you thousands over the remaining tenure of your loan.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Top-up loans are ideal when you need additional funds for car repairs, modifications, or personal needs. By combining balance transfer with top-up, you get better rates on your existing loan plus extra funds — all in one convenient package.
                </p>
              </motion.div>
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
                Ready to Get Your Car Loan?
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Apply now and get approved within 24 hours with the best interest rates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  data-testid="button-cta-apply"
                >
                  Apply Now
                </motion.button>
                <Link href="/calculator" data-testid="link-calculator">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                    data-testid="button-calculator"
                  >
                    EMI Calculator
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Car Loan</DialogTitle>
            <DialogDescription>Fill in your details and our team will get back to you.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoanSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loan-name">Full Name</Label>
              <Input
                id="loan-name"
                type="text"
                required
                placeholder="Enter your full name"
                value={loanName}
                onChange={(e) => setLoanName(e.target.value)}
                data-testid="input-loan-name"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="text-name-hint">Enter name as per your PAN Card</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-phone">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  id="loan-phone"
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={loanPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setLoanPhone(val);
                    setPhoneError("");
                    if (otpVerified || otpSent) {
                      setOtpSent(false);
                      setOtpVerified(false);
                      setOtp("");
                    }
                  }}
                  disabled={otpVerified}
                  className={`flex-1 ${phoneError ? "border-red-500" : ""} ${otpVerified ? "bg-green-50 dark:bg-green-900/20 border-green-500" : ""}`}
                  data-testid="input-loan-phone"
                />
                {!otpVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOtp}
                    disabled={otpSending || loanPhone.length !== 10}
                    className="shrink-0 text-sm"
                    data-testid="button-send-otp"
                  >
                    {otpSending ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                )}
                {otpVerified && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 shrink-0" data-testid="text-phone-verified">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
              {phoneError && <p className="text-xs text-red-500" data-testid="text-phone-error">{phoneError}</p>}
              {otpSent && !otpVerified && (
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1"
                    data-testid="input-otp"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpVerifying || otp.length < 4}
                    className="shrink-0 bg-teal-600 hover:bg-teal-700"
                    data-testid="button-verify-otp"
                  >
                    {otpVerifying ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-type">Loan Type</Label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger data-testid="select-loan-type">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refinance">Refinance</SelectItem>
                  <SelectItem value="pre-owned-purchase">Pre Owned Car Purchase</SelectItem>
                  <SelectItem value="balance-transfer-topup">Balance Transfer & Top Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-income">Monthly Income (₹)</Label>
              <Input
                id="loan-income"
                type="text"
                required
                placeholder="e.g., 50000"
                value={loanIncome}
                onChange={(e) => setLoanIncome(e.target.value.replace(/\D/g, ""))}
                data-testid="input-loan-income"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-pancard">PAN Card Number</Label>
              <Input
                id="loan-pancard"
                type="text"
                required
                placeholder="e.g., ABCDE1234F"
                value={loanPancard}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().slice(0, 10);
                  setLoanPancard(val);
                  if (panError) validatePan(val);
                }}
                onBlur={() => { if (loanPancard) validatePan(loanPancard); }}
                className={panError ? "border-red-500" : ""}
                data-testid="input-loan-pancard"
              />
              {panError && <p className="text-xs text-red-500" data-testid="text-pan-error">{panError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-emi">Existing Monthly EMI (₹)</Label>
              <Input
                id="loan-emi"
                type="text"
                placeholder="e.g., 5000 (enter 0 if none)"
                value={loanExistingEmi}
                onChange={(e) => setLoanExistingEmi(e.target.value.replace(/\D/g, ""))}
                data-testid="input-loan-emi"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loanSubmitting || !otpVerified} data-testid="button-loan-submit">
              {loanSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
