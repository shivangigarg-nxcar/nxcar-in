"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search, FileText, Eye, ArrowRight, AlertTriangle,
  Shield, Ban, Gauge, Wine, ClipboardCheck, Info
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

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

export function ChallanGuide() {
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
            className="grid md:grid-cols-3 gap-4 sm:gap-8"
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
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10">
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
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </>
  );
}
