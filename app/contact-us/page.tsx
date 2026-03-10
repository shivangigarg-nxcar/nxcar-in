"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useToast } from "@hooks/use-toast";
import {
  Phone, Mail, MapPin, Clock, Send,
  Facebook, Instagram, Linkedin, MessageCircle, Loader2
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const subjects = [
  "General Inquiry",
  "Sell My Car",
  "Buy a Car",
  "Car Loan",
  "Insurance",
  "RC Transfer",
  "Other",
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/nxfin", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/nxcarindia/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/nxfin/", label: "LinkedIn" },
  { icon: MessageCircle, href: "https://api.whatsapp.com/send/?phone=%2B919355924132", label: "WhatsApp" },
];

export default function ContactUs() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.trim().length !== 10) {
      toast({ title: "Please enter your name and a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/nxcar/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mobile: phone.trim(),
          subject: subject || "General Inquiry",
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) {
        toast({ title: "Submission Failed", description: data.error || data.message || "Please try again.", variant: "destructive" });
        return;
      }
      toast({ title: "Thank you!", description: data.message || "Our team will contact you shortly." });
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      toast({ title: "Submission Failed", description: "Something went wrong. Please try again or call us directly.", variant: "destructive" });
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
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-contact">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Hit the Brakes,{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  Let's Talk Cars!
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                We're here to answer your questions and help you hit the road smoothly
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-contact">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-testid="text-form-heading">Send us a Message</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                      <Input
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-white/10 rounded-l-md text-sm text-slate-600 dark:text-slate-300">
                          +91
                        </span>
                        <Input
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12 rounded-l-none"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-12 px-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        data-testid="select-subject"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                      <textarea
                        placeholder="Tell us how we can help..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        data-testid="textarea-message"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl"
                      data-testid="button-submit"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10" data-testid="card-contact-info">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4" data-testid="text-company-name">NXFIN TECHNOLOGIES PRIVATE LIMITED</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Phone</p>
                        <a href="tel:+919289992797" className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors block" data-testid="link-phone-1">+91 92899 92797</a>
                        <a href="tel:+919355924133" className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors block" data-testid="link-phone-2">+91 93559 24133</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Email</p>
                        <a href="mailto:contact@nxcar.in" className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 transition-colors" data-testid="link-email">contact@nxcar.in</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Working Hours</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Mon - Sat: 9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10" data-testid="card-corporate-office">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-teal-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Corporate Office</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        3rd Floor Plot No 809, Sector 42, Golf Course Road, Gurgaon Haryana, India 122009
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10" data-testid="card-registered-office">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-teal-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Registered Office</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Unit No. 105, First Floor, KLJ Tower, North, Netaji Subhash Place, Pitampura New Delhi, India, 110034
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10" data-testid="card-connect-with-us">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-4">Connect With Us</p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center hover:bg-teal-500/20 hover:scale-110 transition-all border border-slate-200 dark:border-white/5"
                        data-testid={`link-social-${link.label.toLowerCase()}`}
                      >
                        <link.icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
