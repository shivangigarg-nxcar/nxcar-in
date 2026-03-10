"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, CheckCircle, ArrowRight, AlertTriangle,
  Scale, ClipboardCheck, Zap, Globe, Eye, Users, RefreshCw,
  ShieldCheck, Info, Phone
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const benefits = [
  { icon: Scale, title: "Guaranteed Legal Ownership", description: "Ensure the vehicle you're buying has a clean legal record and rightful ownership." },
  { icon: ClipboardCheck, title: "Thorough RC Verification", description: "Complete verification of Registration Certificate including all details and history." },
  { icon: ShieldCheck, title: "No Legal Headaches", description: "Avoid future legal complications by verifying all documents beforehand." },
  { icon: Zap, title: "Streamlined Process", description: "Our efficient process makes RC verification quick and hassle-free." },
  { icon: RefreshCw, title: "Fast and Efficient Processing", description: "Get your RC details verified within minutes, not days." },
  { icon: Users, title: "Seamless Ownership Transition", description: "Smooth transfer of ownership with all paperwork handled by experts." },
  { icon: Eye, title: "Transparent and Trustworthy", description: "Complete transparency in the verification process with authentic data." },
  { icon: Globe, title: "Nationwide Reach", description: "Check RC details for vehicles registered anywhere across India." },
];

const importanceList = [
  { title: "Legal Ownership", description: "RC transfer legally establishes you as the rightful owner of the vehicle." },
  { title: "Avoids Legal Issues", description: "Without proper RC transfer, you may face legal complications and penalties." },
  { title: "Insurance Coverage", description: "Valid RC is required for obtaining and claiming car insurance." },
  { title: "Smooth Transactions", description: "Proper RC records ensure smooth future sale or transfer of the vehicle." },
  { title: "Accurate Records", description: "Keeps government records updated with the correct owner information." },
];

const processSteps = [
  { number: "1", title: "Enter Vehicle Details", description: "Provide the vehicle registration number and your phone number for verification." },
  { number: "2", title: "We Verify Everything", description: "Our system checks RC status, insurance validity, ownership history, and pending dues." },
  { number: "3", title: "Get Your Report", description: "Receive a comprehensive report with all vehicle details and verification status." },
  { number: "4", title: "Expert Assistance", description: "Our team assists you with any issues found and guides you through the resolution." },
];

const otherServices = [
  { title: "Challan Check", description: "Check pending challans and traffic fines", href: "/challan-check", icon: AlertTriangle },
  { title: "Car Insurance", description: "Buy or renew car insurance easily", href: "/insurance-check", icon: Shield },
];

export function RcInfoSections() {
  return (
    <>
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
              Why Check RC with Nxcar?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive vehicle verification for a safe and secure purchase
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-all group"
                data-testid={`card-benefit-${index}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-teal-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-what-is-rc">
                  What is RC Transfer and Why is it Important?
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                <p>
                  RC (Registration Certificate) Transfer is the legal process of transferring the ownership of a vehicle from one person to another. When you buy a used car, it is mandatory to get the RC transferred to your name within a specified time period as per the Motor Vehicles Act.
                </p>
                <p>
                  The RC is the most important document for any vehicle as it serves as proof of registration and ownership. It contains vital information such as the owner's name, vehicle details, registration number, engine and chassis numbers, and more.
                </p>
                <p>
                  Without proper RC transfer, the vehicle legally still belongs to the previous owner, which can lead to various complications including insurance claims rejection, legal disputes, and difficulties in future resale.
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-importance">
                Why is RC Transfer Important?
              </h3>
              <div className="space-y-3">
                {importanceList.map((item, index) => (
                  <div key={item.title} className="flex items-start gap-3" data-testid={`item-importance-${index}`}>
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.title}: </span>
                      <span className="text-slate-600 dark:text-slate-400">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
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
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-how-we-do">
              Here's How We Do It
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our simple 4-step process for comprehensive RC verification
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
                className="relative text-center"
                data-testid={`card-process-${index + 1}`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
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

      <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4" data-testid="text-cta-title">
              Need Help with RC Transfer?
            </h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">
              Our experts are here to help you with complete RC transfer assistance. Call us now!
            </p>
            <a href="tel:+919355924132" data-testid="link-cta-call">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 mx-auto"
                data-testid="button-cta-call"
              >
                <Phone className="w-4 h-4" />
                +91 93559 24132
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
