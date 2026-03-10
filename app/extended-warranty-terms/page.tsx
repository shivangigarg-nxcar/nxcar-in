"use client";

import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    num: "01",
    title: "Definitions",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-2">
        <li><span className="text-white font-semibold">Vehicle:</span> The used car purchased through or registered on the Nxcar platform that is covered under this warranty.</li>
        <li><span className="text-white font-semibold">Warranty Provider:</span> Nxfin Technologies Private Limited, operating under the brand name Nxcar.</li>
        <li><span className="text-white font-semibold">Coverage Period:</span> The duration of warranty coverage as specified in the chosen plan, starting from the date of purchase or activation.</li>
      </ul>
    ),
  },
  {
    num: "02",
    title: "Coverage",
    content: (
      <div className="space-y-2">
        <p>The extended warranty covers the following major components:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Engine and internal components</li>
          <li>Transmission system (manual and automatic)</li>
          <li>Electrical components and wiring harness</li>
          <li>Air conditioning (AC) system including compressor and condenser</li>
        </ul>
      </div>
    ),
  },
  {
    num: "03",
    title: "Exclusions",
    content: (
      <div className="space-y-2">
        <p>The following are not covered under the extended warranty:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Wear and tear items (brake pads, clutch plates, wiper blades, tyres, belts, filters)</li>
          <li>Cosmetic damage (scratches, dents, paint peeling, interior wear)</li>
          <li>Pre-existing conditions identified before warranty activation</li>
          <li>Modifications or aftermarket additions not approved by the manufacturer</li>
        </ul>
      </div>
    ),
  },
  {
    num: "04",
    title: "Claim Process",
    content: (
      <ol className="space-y-3 list-none">
        {[
          { step: "Report Issue", desc: "Contact Nxcar support via phone or email to report the issue with your vehicle." },
          { step: "Get Authorization", desc: "Our team will review the claim and provide an authorization number if approved." },
          { step: "Visit Authorized Service Center", desc: "Take your vehicle to an Nxcar-authorized service center for repair." },
          { step: "Claim Settled", desc: "The repair cost is settled directly with the service center, subject to coverage limits." },
        ].map((item, i) => (
          <li key={item.step} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">{i + 1}</span>
            <div><span className="text-white font-semibold">{item.step}</span> — {item.desc}</div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    num: "05",
    title: "Coverage Duration",
    content: (
      <div className="space-y-2">
        <p>Extended warranty plans are available in the following durations:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>6 months</li>
          <li>1 year</li>
          <li>18 months</li>
          <li>2 years</li>
        </ul>
        <p className="mt-2">The coverage begins from the date of warranty activation and is valid until the end of the chosen plan period.</p>
      </div>
    ),
  },
  {
    num: "06",
    title: "Transfer",
    content: (
      <p>The extended warranty is transferable with the ownership of the vehicle. In case of vehicle resale, the remaining warranty period can be transferred to the new owner by notifying Nxcar in writing within 15 days of the ownership transfer.</p>
    ),
  },
  {
    num: "07",
    title: "Cancellation",
    content: (
      <div className="space-y-2">
        <p>The warranty can be cancelled within the first 30 days of activation for a pro-rata refund, provided no claims have been made during this period. After 30 days, cancellation is not eligible for a refund.</p>
      </div>
    ),
  },
  {
    num: "08",
    title: "Contact",
    content: (
      <div className="space-y-2">
        <p>For warranty-related queries, claims, or support, please contact:</p>
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <ul className="space-y-2">
            <li>
              <span className="text-slate-400">Email:</span>{" "}
              <a href="mailto:warranty@nxcar.in" className="text-[#0EA9B2] hover:underline" data-testid="link-warranty-email">warranty@nxcar.in</a>
            </li>
            <li>
              <span className="text-slate-400">Phone:</span>{" "}
              <a href="tel:+919355924132" className="text-[#0EA9B2] hover:underline" data-testid="link-warranty-phone">+91 93559 24132</a>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default function ExtendedWarrantyTerms() {
  return (
    <div className="min-h-screen bg-[#0A0E14] font-sans" data-testid="extended-warranty-terms-page">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-[#0EA9B2]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-testid="heading-warranty-terms">
              Extended Warranty Terms & Conditions
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Read the terms of Nxcar's extended warranty program
            </p>
          </motion.div>

          <div className="prose prose-invert prose-lg max-w-none">
            {sections.map((section, i) => (
              <motion.section
                key={section.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800"
                data-testid={`section-${section.num}`}
              >
                <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">
                  {section.num}. {section.title}
                </h2>
                <div className="text-slate-300 leading-relaxed">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
