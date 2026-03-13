'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import {
  Users, IndianRupee, Briefcase, Car, CreditCard,
  FileText, Phone, CheckCircle, Calendar, TrendingUp,
  MapPin, Mail, User, Loader2
} from "lucide-react";
import { useToast } from "@hooks/use-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const eligibilityCriteria = [
  { icon: Calendar, title: "Age", description: "21-65 years", color: "from-teal-500 to-cyan-500" },
  { icon: IndianRupee, title: "Income", description: "Minimum ₹15,000/month", color: "from-blue-500 to-indigo-500" },
  { icon: Briefcase, title: "Employment", description: "Minimum 1 year", color: "from-amber-500 to-orange-500" },
  { icon: Car, title: "Car Age", description: "Maximum 10 years old", color: "from-purple-500 to-pink-500" },
  { icon: TrendingUp, title: "Credit Score", description: "650+ preferred", color: "from-emerald-500 to-teal-500" },
];

const documentsRequired = [
  "PAN Card",
  "Aadhaar Card",
  "Income Proof (last 3 months salary slips or ITR)",
  "Bank Statements (last 6 months)",
  "Address Proof",
];

export default function LoanEligibility() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    salary: "",
    pancard: "",
    existingEmi: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      toast({ title: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!formData.salary.trim()) {
      toast({ title: "Monthly salary is required", variant: "destructive" });
      return;
    }
    if (!formData.pancard.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pancard.trim())) {
      toast({ title: "Please enter a valid PAN card number (e.g., ABCDE1234F)", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/nxcar/loan-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          mobile: formData.phone.trim(),
          salary: formData.salary.trim(),
          pancard: formData.pancard.trim(),
          existing_emi: formData.existingEmi.trim() || "0",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.message?.includes("violated") || data.status === false) {
        toast({ title: "Submission Failed", description: data.message || "Please check your details and try again.", variant: "destructive" });
        return;
      }
      if (data.lead_id) setLeadId(String(data.lead_id));
      setSubmitted(true);
      toast({ title: "Application Submitted!", description: data.message || "Our team will contact you within 24 hours." });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden" data-testid="loan-eligibility-page">
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-eligibility">
                Loan Eligibility
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Check Your{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  Loan Eligibility
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Find out if you qualify for a used car loan in minutes
              </p>
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
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-form-title">
                Check Your Eligibility
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Fill in your details and we'll let you know if you qualify
              </motion.p>
            </motion.div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-10 border border-slate-200 dark:border-white/10 text-center"
                data-testid="eligibility-success-message"
              >
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Your eligibility check has been submitted!
                </h3>
                {leadId && <p className="text-teal-600 dark:text-teal-400 font-medium mb-2" data-testid="text-lead-id">Reference: #{leadId}</p>}
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Our team will contact you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10"
                data-testid="eligibility-form"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp} className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        data-testid="input-full-name"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <span className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm font-medium">+91</span>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        required
                        placeholder="9876543210"
                        className="w-full pl-[4.5rem] pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        data-testid="input-phone"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monthly Salary (₹) *</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value.replace(/\D/g, "") })}
                        required
                        placeholder="e.g., 50000"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        data-testid="input-salary"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">PAN Card Number *</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="pancard"
                        value={formData.pancard}
                        onChange={(e) => setFormData({ ...formData, pancard: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) })}
                        required
                        placeholder="e.g., ABCDE1234F"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        data-testid="input-pancard"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Existing Monthly EMI (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="existingEmi"
                        value={formData.existingEmi}
                        onChange={(e) => setFormData({ ...formData, existingEmi: e.target.value.replace(/\D/g, "") })}
                        placeholder="e.g., 5000 (0 if none)"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        data-testid="input-existing-emi"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={fadeInUp} className="mt-8">
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-shadow text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-testid="button-check-eligibility"
                  >
                    {submitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Checking...</>) : "Check Eligibility"}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-eligibility-criteria">
                Eligibility Criteria
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Check if you meet the basic requirements for a used car loan
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {eligibilityCriteria.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                  data-testid={`card-criteria-${index}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.description}</p>
                </motion.div>
              ))}
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
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-documents-required">
                Documents Required
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Keep these documents handy for a smooth application process
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              {documentsRequired.map((doc, index) => (
                <motion.div
                  key={doc}
                  variants={fadeInUp}
                  className="flex items-center gap-4 bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-white/10 mb-3 last:mb-0"
                  data-testid={`card-document-${index}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-teal-500" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium">{doc}</span>
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
                Need help? Call us at +91 93559 24133
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Our loan experts are ready to help you get the best deal on your used car loan.
              </p>
              <a href="tel:+919355924133" data-testid="link-call-cta">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 mx-auto"
                  data-testid="button-call-cta"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
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
