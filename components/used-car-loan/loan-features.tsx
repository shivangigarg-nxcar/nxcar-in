"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wallet, CreditCard, ArrowLeftRight, Globe, Clock, Percent,
  Zap, Eye, DollarSign, FileCheck, Home, Briefcase, Car,
  CheckCircle, Phone, ArrowRight, Shield, Users
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

export function LoanFeatures({ onApply }: { onApply: () => void }) {
  return (
    <>
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
            className="grid md:grid-cols-3 gap-4 sm:gap-8"
          >
            {loanTypes.map((loan, index) => (
              <motion.div
                key={loan.title}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
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
            <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10">
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

            <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10">
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

            <motion.div variants={fadeInUp} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10">
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
                onClick={onApply}
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
    </>
  );
}
