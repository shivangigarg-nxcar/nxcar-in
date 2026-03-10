'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import {
  Phone, ArrowRight, CheckCircle, Zap, ShieldCheck,
  Users, TrendingUp, Handshake, Car, CreditCard,
  FileText, Shield, Quote, Star, Briefcase, Clock, Loader2, ChevronDown
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const customerLoanPoints = [
  "2X customer satisfaction",
  "Boost revenue with payouts per transaction",
  "Speed up your sales",
  "Expand service portfolio",
];

const dealerLoanPoints = [
  "Flexible loan limit",
  "Quick loan disbursement",
  "Nxcar doesn't compete with its partners",
  "Loan for cars from multiple sources",
];

const partnerBenefits = [
  { icon: Zap, title: "Quick Disbursement", description: "Fast loan processing and disbursement so your customers don't have to wait." },
  { icon: Handshake, title: "No Competition", description: "Nxcar acts as your partner, not your competitor. We support your business growth." },
  { icon: Briefcase, title: "Extended Services", description: "Offer insurance transfer, extended warranty, and RC transfer to your customers." },
  { icon: TrendingUp, title: "Revenue Growth", description: "Earn additional revenue with payouts on every successful transaction." },
];

const testimonials = [
  {
    quote: "Thanks to Nxcar, financing is no longer a hurdle for our customers. The quick disbursement and hassle-free process have helped us close deals faster and keep our customers happy.",
    name: "Yes Cars",
    location: "Bangalore",
  },
  {
    quote: "The feedback from customers who've used Nxcar for loans has been overwhelmingly positive. It's become an integral part of our sales process and has boosted our credibility.",
    name: "Satguru Traders",
    location: "Delhi",
  },
  {
    quote: "Nxcar has simplified the loan part of buying a used car. Our customers appreciate the transparency, and we appreciate the seamless integration with our business.",
    name: "Trusted Autoz",
    location: "Delhi",
  },
];

interface CityOption {
  city_id: string;
  city_name: string;
}

interface StateOption {
  state_id: string;
  state_name: string;
}

export default function Partner() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "", email: "", phone_number: "", address: "", city_id: "", state_id: "", pincode: "", is_dealer: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    fetch("/api/nxcar/cities")
      .then(res => res.json())
      .then(data => {
        setCities(Array.isArray(data) ? data : []);
      })
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));

    fetch("/api/nxcar/states")
      .then(res => res.json())
      .then(data => {
        setStates(Array.isArray(data) ? data : []);
      })
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  }, []);

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone_number.trim() || formData.phone_number.trim().length !== 10) {
      toast({ title: "Please enter your name and a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!formData.city_id || !formData.state_id) {
      toast({ title: "Please select a city and state", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/nxcar/register-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) {
        const msg = data.message ? data.message.replace(/<[^>]*>/g, ' ').trim() : "Please try again.";
        toast({ title: "Registration Failed", description: msg, variant: "destructive" });
        return;
      }
      toast({ title: "Registration Successful!", description: "Welcome to the Nxcar partner network!" });
      setFormData({ name: "", email: "", phone_number: "", address: "", city_id: "", state_id: "", pincode: "", is_dealer: false });
    } catch {
      toast({ title: "Registration Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden" data-testid="partner-page">
      <Navbar />
      <main className="pt-20">
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0D1117] to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6" data-testid="badge-partner">
                Channel Partner Program
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
                Transform Pre-Owned Car Acquisitions & Sales with{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  Nxcar
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                We are your trusted partners. Nxcar specializes in facilitating pre-owned car acquisitions and helping dealers grow their business.
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
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-value-props">
                Why Partner with{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Nxcar</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Two powerful ways we help you grow your business
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all"
                data-testid="card-customer-loans"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Used Car Loans for Your Customers</h3>
                <ul className="space-y-3">
                  {customerLoanPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`item-customer-loan-${index}`}>
                      <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all"
                data-testid="card-dealer-loans"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Used Car Loans for You</h3>
                <ul className="space-y-3">
                  {dealerLoanPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`item-dealer-loan-${index}`}>
                      <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
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
              className="grid md:grid-cols-2 gap-12 items-center mb-20"
            >
              <motion.div variants={fadeInUp} data-testid="section-customer-detail">
                <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-4">
                  For Your Customers
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Used Car Loans for Your Customers
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  As an Nxcar channel partner, you can offer your customers seamless used car financing options. Help your buyers get quick loan approvals from our network of 25+ banking partners at competitive interest rates.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Beyond loans, enhance your customer experience by offering extended warranty packages, hassle-free insurance transfer, and complete RC transfer services — all through Nxcar's integrated platform.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: CreditCard, label: "Used Car Loans" },
                    { icon: Shield, label: "Extended Warranty" },
                    { icon: FileText, label: "Insurance Transfer" },
                    { icon: Car, label: "RC Transfer" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-white/10" data-testid={`service-customer-${index}`}>
                      <item.icon className="w-5 h-5 text-teal-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-8 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Customer Satisfaction</h3>
                  <p className="text-slate-600 dark:text-slate-400">Deliver a complete car buying experience</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-8 flex items-center justify-center order-2 md:order-1"
              >
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dealer Financing</h3>
                  <p className="text-slate-600 dark:text-slate-400">Grow your inventory with flexible funding</p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="order-1 md:order-2" data-testid="section-dealer-detail">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                  For You
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Used Car Loans for You
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Need financing to grow your car inventory? Nxcar offers dealer-specific loan products designed to help you acquire more cars from multiple sources — auctions, individual sellers, or other dealers.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Our streamlined process ensures quick loan disbursement with flexible limits, so you never miss an opportunity to stock the right cars. Nxcar works alongside you, not against you — we don't compete with our partners.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Flexible Limits", "Quick Processing", "Multiple Sources", "No Competition"].map((tag, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium" data-testid={`tag-dealer-${index}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
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
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-benefits-title">
                Partner{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Benefits</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need to supercharge your used car business
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {partnerBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  className="text-center bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all"
                  data-testid={`card-benefit-${index}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
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
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-testimonials-title">
                What Our Partners Say
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Hear from dealers who have transformed their business with Nxcar
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all"
                  data-testid={`card-testimonial-${index}`}
                >
                  <Quote className="w-8 h-8 text-teal-500/30 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white" data-testid={`text-testimonial-name-${index}`}>{testimonial.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500" data-testid={`text-testimonial-location-${index}`}>{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#0A0E14]" id="register">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-register-title">
                Register as a{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Partner</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Fill in your details below and our team will get in touch with you
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handlePartnerSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-4" data-testid="form-partner-register">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                      data-testid="input-partner-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                    <Input
                      placeholder="10-digit phone number"
                      value={formData.phone_number}
                      onChange={(e) => handleFormChange("phone_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                      data-testid="input-partner-phone"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                    data-testid="input-partner-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                  <Input
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                    data-testid="input-partner-address"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">State *</label>
                    <div className="relative">
                      <select
                        value={formData.state_id}
                        onChange={(e) => handleFormChange("state_id", e.target.value)}
                        className="w-full h-12 px-3 pr-10 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                        data-testid="select-partner-state"
                        disabled={loadingStates}
                      >
                        <option value="">{loadingStates ? "── ── ──" : "Select State"}</option>
                        {states.map((s) => (
                          <option key={s.state_id} value={s.state_id}>{s.state_name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City *</label>
                    <div className="relative">
                      <select
                        value={formData.city_id}
                        onChange={(e) => handleFormChange("city_id", e.target.value)}
                        className="w-full h-12 px-3 pr-10 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                        data-testid="select-partner-city"
                        disabled={loadingCities}
                      >
                        <option value="">{loadingCities ? "── ── ──" : "Select City"}</option>
                        {cities.map((c) => (
                          <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pincode</label>
                    <Input
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={(e) => handleFormChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                      data-testid="input-partner-pincode"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_dealer}
                    onChange={(e) => handleFormChange("is_dealer", e.target.checked)}
                    className="w-4 h-4 accent-teal-500"
                    data-testid="checkbox-partner-dealer"
                  />
                  <label className="text-sm text-slate-700 dark:text-slate-300">I am an existing car dealer</label>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl disabled:opacity-70"
                  data-testid="button-partner-submit"
                >
                  {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  {submitting ? "Registering..." : "Register as Partner"}
                </Button>
              </form>
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
                Become a Partner Today
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Join Nxcar's growing network of channel partners and unlock new revenue streams for your business.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+919355924132" data-testid="link-cta-call">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                    data-testid="button-cta-call"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93559 24132
                  </motion.button>
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                  data-testid="button-cta-learn-more"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
