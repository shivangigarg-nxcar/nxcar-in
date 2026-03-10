"use client";

import { motion } from "framer-motion";
import {
  CheckCircle, Zap, Handshake, Users, TrendingUp, Briefcase,
  CreditCard, Car, FileText, Shield, Quote, Star, Phone, ArrowRight
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

export function PartnerBenefits() {
  return (
    <>
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
    </>
  );
}
