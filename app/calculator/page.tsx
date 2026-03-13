'use client';

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Calculator, IndianRupee, Clock, Percent, ArrowRight,
  Phone, CheckCircle
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

function formatIndian(num: number): string {
  const rounded = Math.round(num);
  const str = rounded.toString();
  if (str.length <= 3) return str;
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

export default function EMICalculator() {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [duration, setDuration] = useState(12);
  const [interestRate, setInterestRate] = useState(12);

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = duration;

    if (r === 0) {
      const emi = P / n;
      return { emi, totalInterest: 0, totalPayable: P };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    return { emi, totalInterest, totalPayable };
  }, [loanAmount, duration, interestRate]);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyName, setApplyName] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applySalary, setApplySalary] = useState("");
  const [applyPancard, setApplyPancard] = useState("");
  const [applyExistingEmi, setApplyExistingEmi] = useState("");
  const [applySubmitting, setApplySubmitting] = useState(false);

  const handleApply = () => {
    setApplyOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyPhone.trim() || applyPhone.trim().length !== 10) {
      toast({ title: "Please enter your name and a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    setApplySubmitting(true);
    try {
      const res = await fetch("/api/nxcar/loan-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: applyName.trim(),
          mobile: applyPhone.trim(),
          salary: applySalary.trim() || "0",
          pancard: applyPancard.trim(),
          existing_emi: applyExistingEmi.trim() || "0",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false || data.message?.includes("violated")) {
        toast({ title: "Submission Failed", description: data.message || "Please try again.", variant: "destructive" });
        return;
      }
      const leadInfo = data.lead_id ? ` (Ref: #${data.lead_id})` : "";
      toast({ title: "Application Submitted!" + leadInfo, description: data.message || "Our loan team will contact you within 24 hours." });
      setApplyOpen(false);
      setApplyName("");
      setApplyPhone("");
      setApplySalary("");
      setApplyPancard("");
      setApplyExistingEmi("");
    } catch {
      toast({ title: "Submission Failed", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setApplySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-calculator">
                EMI Calculator
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Car{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  EMI Calculator
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Customize your loan amount with ease and plan your car purchase budget
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl"
                data-testid="card-calculator"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-teal-500" />
                  Calculate Your EMI
                </h3>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-teal-500" />
                        Loan Amount
                      </label>
                      <span className="text-lg font-bold text-teal-500" data-testid="text-loan-amount">₹{formatIndian(loanAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={2000000}
                      step={10000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-styled"
                      style={{ background: `linear-gradient(to right, #0EA9B2 ${((loanAmount - 100000) / (2000000 - 100000)) * 100}%, var(--slider-track-empty) ${((loanAmount - 100000) / (2000000 - 100000)) * 100}%)` }}
                      data-testid="slider-loan-amount"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>₹1,00,000</span>
                      <span>₹20,00,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-500" />
                        Duration (Months)
                      </label>
                      <span className="text-lg font-bold text-teal-500" data-testid="text-duration">{duration} months</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={84}
                      step={1}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-styled"
                      style={{ background: `linear-gradient(to right, #0EA9B2 ${((duration - 12) / (84 - 12)) * 100}%, var(--slider-track-empty) ${((duration - 12) / (84 - 12)) * 100}%)` }}
                      data-testid="slider-duration"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>12 months</span>
                      <span>84 months</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-teal-500" />
                        Interest Rate
                      </label>
                      <span className="text-lg font-bold text-teal-500" data-testid="text-interest-rate">{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={24}
                      step={0.5}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-styled"
                      style={{ background: `linear-gradient(to right, #0EA9B2 ${((interestRate - 12) / (24 - 12)) * 100}%, var(--slider-track-empty) ${((interestRate - 12) / (24 - 12)) * 100}%)` }}
                      data-testid="slider-interest-rate"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>12%</span>
                      <span>24%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleApply}
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl"
                    data-testid="button-apply-now"
                  >
                    Apply Now
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-4 sm:p-8 text-white shadow-xl shadow-teal-500/20" data-testid="card-emi-breakdown">
                  <h3 className="text-lg font-medium mb-6 opacity-90" data-testid="text-emi-breakdown-heading">Your EMI Breakdown</h3>
                  <div className="text-center mb-8">
                    <p className="text-sm opacity-75 mb-2">EMI Per Month</p>
                    <p className="text-3xl sm:text-5xl font-black" data-testid="text-emi-result">₹{formatIndian(emi)}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Principal</span>
                      <span className="font-bold text-lg" data-testid="text-total-principal">₹{formatIndian(loanAmount)}</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Interest</span>
                      <span className="font-bold text-lg" data-testid="text-total-interest">₹{formatIndian(totalInterest)}</span>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 flex justify-between items-center">
                      <span className="text-sm font-medium">Total Payable Amount</span>
                      <span className="font-black text-xl" data-testid="text-total-payable">₹{formatIndian(totalPayable)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10" data-testid="card-loan-eligibility">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3" data-testid="text-eligibility-title">Loan Eligibility</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    Use our EMI calculator to plan your car loan budget. Adjust the loan amount, tenure, and interest rate to find the perfect EMI that fits your monthly budget. Get pre-approved and drive home your dream car.
                  </p>
                  <Link href="/used-car-loan" data-testid="link-check-eligibility">
                    <span className="inline-flex items-center text-teal-500 font-medium text-sm hover:gap-2 transition-all cursor-pointer">
                      Check Eligibility <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </Link>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10" data-testid="card-quick-tips">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3" data-testid="text-quick-tips-heading">Quick Tips</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2" data-testid="tip-item-0">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">A shorter tenure means higher EMI but less total interest</p>
                    </div>
                    <div className="flex items-start gap-2" data-testid="tip-item-1">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Good credit score can help you get lower interest rates</p>
                    </div>
                    <div className="flex items-start gap-2" data-testid="tip-item-2">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Keep EMI under 40% of your monthly income for comfortable repayment</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
                Ready to Get Your Car Loan?
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Apply now and get approved within 24 hours with the best interest rates from 25+ banking partners.
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
                <a href="tel:+919355924133" data-testid="link-cta-call">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                    data-testid="button-cta-call"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93559 24133
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Car Loan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplySubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <Input
                placeholder="Enter your full name"
                value={applyName}
                onChange={(e) => setApplyName(e.target.value)}
                data-testid="input-apply-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <Input
                placeholder="Enter 10-digit phone number"
                value={applyPhone}
                onChange={(e) => setApplyPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                data-testid="input-apply-phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Salary *</label>
              <Input
                placeholder="e.g., 50000"
                value={applySalary}
                onChange={(e) => setApplySalary(e.target.value.replace(/\D/g, ""))}
                data-testid="input-apply-salary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PAN Card Number *</label>
              <Input
                placeholder="e.g., ABCDE1234F"
                value={applyPancard}
                onChange={(e) => setApplyPancard(e.target.value.toUpperCase().slice(0, 10))}
                data-testid="input-apply-pancard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Existing Monthly EMI (₹)</label>
              <Input
                placeholder="e.g., 5000 (enter 0 if none)"
                value={applyExistingEmi}
                onChange={(e) => setApplyExistingEmi(e.target.value.replace(/\D/g, ""))}
                data-testid="input-apply-emi"
              />
            </div>
            <Button
              type="submit"
              disabled={applySubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              data-testid="button-submit-apply"
            >
              {applySubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {applySubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
