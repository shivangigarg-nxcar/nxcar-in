'use client';

import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, MapPin, ClipboardList, FileText, Phone } from "lucide-react";
import { motion } from "framer-motion";

const expectations = [
  { icon: MapPin, title: "Inspector Arrives", desc: "Inspector arrives at your location" },
  { icon: ClipboardList, title: "200+ Checkpoint Inspection", desc: "Comprehensive inspection taking ~2 hours" },
  { icon: FileText, title: "Digital Report", desc: "Digital report shared within 24 hours" },
];

export default function WebInspectionBooked() {
  const params = useParams() as { id: string };
  const bookingId = params?.id || "N/A";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] font-sans" data-testid="web-inspection-booked-page">
      <Navbar />
      <main className="pt-16 pb-16">
        <div className="container px-4 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" data-testid="icon-check-circle" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            data-testid="heading-booked"
          >
            Inspection Booked!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-10"
            data-testid="text-subtitle"
          >
            Your DriveAway inspection has been scheduled.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 mb-10 text-left"
          >
            <h2 className="text-2xl font-bold text-[#0EA9B2] mb-6 text-center" data-testid="heading-booking-details">
              Booking Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Booking ID</span>
                <span className="text-slate-900 dark:text-white font-semibold" data-testid="text-booking-id">#{bookingId}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Status</span>
                <span className="text-green-400 font-semibold" data-testid="text-status">Confirmed</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm pt-2" data-testid="text-inspector-contact">
                Our inspector will contact you to confirm the date and time.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 mb-10"
          >
            <h2 className="text-2xl font-bold text-[#0EA9B2] mb-6 text-center" data-testid="heading-what-to-expect">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {expectations.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                  data-testid={`expect-step-${i + 1}`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-[#0EA9B2]" />
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link
              href="/carscope"
              data-testid="button-book-another"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors"
            >
              Book Another Inspection
            </Link>
            <Link
              href="/"
              data-testid="button-go-home"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-white dark:bg-slate-800 transition-colors"
            >
              Go to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400"
            data-testid="text-need-help"
          >
            <Phone className="h-4 w-4" />
            <span>Need help? Call </span>
            <a href="tel:+919355924133" className="text-[#0EA9B2] hover:underline" data-testid="link-phone">
              +91 93559 24133
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
