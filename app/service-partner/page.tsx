'use client';

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Wrench, Users, BookOpen, Star, Building2, Settings, Zap, CircleDot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@hooks/use-toast";

const benefits = [
  { icon: Users, title: "Steady Flow of Customers", desc: "Get connected with car owners looking for reliable service centers" },
  { icon: Settings, title: "Digital Service Management Tools", desc: "Manage bookings, invoices, and service history digitally" },
  { icon: BookOpen, title: "Training & Certification by Nxcar", desc: "Get certified training to enhance your team's skills" },
  { icon: Star, title: "Priority Listing on the Platform", desc: "Appear at the top of search results for your area" },
];

const whoCanApply = [
  { icon: Building2, title: "Authorized Service Centers", desc: "Official dealership service centers of any brand" },
  { icon: Wrench, title: "Multi-Brand Workshops", desc: "Workshops servicing multiple car brands" },
  { icon: Zap, title: "Specialized Repair Shops", desc: "AC, electrical, body work specialists" },
  { icon: CircleDot, title: "Tyre and Battery Shops", desc: "Tyre replacement and battery service centers" },
];

const serviceTypes = [
  "General Service & Maintenance",
  "AC Repair & Service",
  "Electrical Work",
  "Body Work & Denting",
  "Tyre & Wheel Alignment",
  "Battery Replacement",
  "Engine Repair",
  "Transmission Repair",
];

export default function ServicePartner() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    workshopName: "",
    ownerName: "",
    phone: "",
    email: "",
    city: "",
    services: [] as string[],
    yearsInBusiness: "",
  });

  const handleCheckbox = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/nxcar/service-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to submit application. Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. Our team will contact you within 48 hours.",
      });
      setForm({ workshopName: "", ownerName: "", phone: "", email: "", city: "", services: [], yearsInBusiness: "" });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] font-sans" data-testid="service-partner-page">
      <Navbar />
      <main className="pt-16 pb-16">
        <section className="container px-4 max-w-5xl mx-auto text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-6"
          >
            <Wrench className="h-8 w-8 text-[#0EA9B2]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            data-testid="heading-hero"
          >
            Become a <span className="text-[#0EA9B2]">Service Partner</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Join Nxcar's network of trusted service centers and workshops
          </motion.p>
        </section>

        <section className="container px-4 max-w-5xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center"
            data-testid="heading-why-partner"
          >
            Why Partner with <span className="text-[#0EA9B2]">Nxcar?</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 text-center"
                data-testid={`benefit-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-6 w-6 text-[#0EA9B2]" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{b.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container px-4 max-w-5xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center"
            data-testid="heading-who-can-apply"
          >
            Who Can Apply?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whoCanApply.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 text-center"
                data-testid={`apply-type-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-[#0EA9B2]" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container px-4 max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center" data-testid="heading-application-form">
              Apply Now
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Workshop Name"
                value={form.workshopName}
                onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
                required
                data-testid="input-workshop-name"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <input
                type="text"
                placeholder="Owner Name"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                required
                data-testid="input-owner-name"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  data-testid="input-phone"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  data-testid="input-email"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                  data-testid="input-city"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
                />
                <input
                  type="number"
                  placeholder="Years in Business"
                  value={form.yearsInBusiness}
                  onChange={(e) => setForm({ ...form, yearsInBusiness: e.target.value })}
                  required
                  data-testid="input-years"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
                />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-semibold mb-3">Type of Services</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviceTypes.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                      data-testid={`checkbox-${service.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service)}
                        onChange={() => handleCheckbox(service)}
                        className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0EA9B2] focus:ring-[#0EA9B2]"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-testid="button-submit-application"
                className="w-full px-6 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
