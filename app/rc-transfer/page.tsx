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
  FileText, CheckCircle, ArrowRight, ClipboardCheck,
  AlertTriangle, Shield, Zap, Users, RefreshCw,
  ShieldCheck, Car, Phone, Loader2, ArrowLeftRight,
  FileCheck, Scale, MapPin
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const benefits = [
  { icon: Scale, title: "Legal Ownership Transfer", description: "Legally transfer vehicle ownership to your name with proper documentation." },
  { icon: ShieldCheck, title: "Insurance Compliance", description: "Valid RC transfer is required for obtaining and claiming car insurance." },
  { icon: Zap, title: "Quick Processing", description: "Fast-track your RC transfer with our streamlined digital process." },
  { icon: Users, title: "Expert Assistance", description: "Dedicated team to handle all paperwork and RTO coordination." },
  { icon: RefreshCw, title: "End-to-End Support", description: "From document collection to final transfer — we handle everything." },
  { icon: FileCheck, title: "Document Verification", description: "Thorough verification of all documents before initiating transfer." },
];

const processSteps = [
  { number: "1", title: "Submit Details", description: "Provide vehicle registration number, buyer & seller details." },
  { number: "2", title: "Document Collection", description: "Our executive collects required documents from your doorstep." },
  { number: "3", title: "RTO Processing", description: "We handle all RTO formalities and paperwork on your behalf." },
  { number: "4", title: "Transfer Complete", description: "Receive updated RC in the new owner's name." },
];

const documents = [
  "Original RC (Registration Certificate)",
  "Insurance Policy Transfer",
  "PUC Certificate",
  "ID Proof of Buyer & Seller (Aadhar/PAN)",
  "Address Proof of Buyer",
  "Form 29 & Form 30 (Sale Agreement)",
  "NOC from the Financing Bank (if applicable)",
  "Valid Pollution Certificate",
];

const otherServices = [
  { title: "RC Check", description: "Verify RC details and vehicle history", href: "/rc-check", icon: ClipboardCheck },
  { title: "Challan Check", description: "Check pending challans and traffic fines", href: "/challan-check", icon: AlertTriangle },
  { title: "Car Insurance", description: "Buy or renew car insurance easily", href: "/insurance-check", icon: Shield },
];

export default function RCTransfer() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim() || !phone.trim() || !name.trim()) {
      toast({ title: "Missing Details", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      toast({ title: "Request Submitted!", description: "Our RC transfer team will contact you within 24 hours." });
      setVehicleNumber("");
      setPhone("");
      setName("");
    } catch {
      toast({ title: "Submission Failed", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <section className="relative py-12 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6" data-testid="badge-rc-transfer">
                RC Transfer Service
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Hassle-Free{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  RC Transfer
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Complete ownership transfer with doorstep document pickup, RTO liaison, and online tracking — all handled by our expert team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#rc-transfer-form">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                    data-testid="button-get-started"
                  >
                    Get Started
                  </motion.button>
                </a>
                <a href="tel:+919355924132" data-testid="link-call-us">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-colors flex items-center gap-2"
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

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-benefits">
                Why Choose Our{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">RC Transfer Service</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                End-to-end assistance for a smooth ownership transfer
              </motion.p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {benefits.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all group"
                  data-testid={`card-benefit-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-process">
                How It Works
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Simple 4-step process for hassle-free RC transfer
              </motion.p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center"
                  data-testid={`card-step-${index}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{step.description}</p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-blue-300 dark:text-blue-700" />
                    </div>
                  )}
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
              className="max-w-4xl mx-auto"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center" data-testid="text-documents">
                Documents Required
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-center mb-12">
                Keep these documents ready for a smooth transfer process
              </motion.p>
              <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10">
                <div className="grid sm:grid-cols-2 gap-4">
                  {documents.map((doc, index) => (
                    <div key={doc} className="flex items-center gap-3" data-testid={`text-document-${index}`}>
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="rc-transfer-form" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center" data-testid="text-form-title">
                Request RC Transfer
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
                Fill in your details and our team will assist you
              </p>
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Your Name</label>
                  <Input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-rc-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Vehicle Registration Number</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g., DL01AB1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    data-testid="input-rc-vehicle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Phone Number</label>
                  <Input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    data-testid="input-rc-phone"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" disabled={submitting} data-testid="button-rc-submit">
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <>Request RC Transfer <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        <section className="py-12 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center" data-testid="text-other-services">
              Other Services
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {otherServices.map((service) => (
                <Link key={service.title} href={service.href} data-testid={`link-service-${service.title.toLowerCase().replace(/ /g, '-')}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer border border-slate-200 dark:border-white/5"
                  >
                    <service.icon className="w-4 h-4" />
                    {service.title}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
