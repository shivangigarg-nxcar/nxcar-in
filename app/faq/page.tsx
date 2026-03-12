"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { ChevronDown, Search, Phone } from "lucide-react";
import { FAQJsonLd } from "@components/seo/structured-data";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

type Category = "All" | "Buying" | "Selling" | "Loans" | "Services";

interface FAQ {
  question: string;
  answer: string;
  category: Category;
}

const faqs: FAQ[] = [
  {
    question: "How do I buy a car listed on Nxcar?",
    answer: "Browse listings, select a car, contact the dealer, schedule inspection, and complete the purchase with our assistance. Our team guides you through every step of the process to ensure a smooth buying experience.",
    category: "Buying",
  },
  {
    question: "Can I list my car for sale on Nxcar?",
    answer: "Yes! Visit the Sell Car page, enter your vehicle details, and our team will help you find verified buyers. The listing process is quick and easy — you can have your car listed within minutes.",
    category: "Selling",
  },
  {
    question: "How does Nxcar verify the quality of listed cars?",
    answer: "Every car goes through a comprehensive 280+ point inspection covering engine, transmission, body, electrical systems, and more. Our certified inspectors ensure that only quality vehicles make it to our platform.",
    category: "Buying",
  },
  {
    question: "Are there any fees for listing my car on Nxcar?",
    answer: "Listing your car on Nxcar is completely free. We only charge a small service fee once your car is successfully sold. There are no hidden charges or upfront costs.",
    category: "Selling",
  },
  {
    question: "What's included in a car inspection report?",
    answer: "Our 280+ point inspection covers engine health, transmission, suspension, brakes, electrical systems, body condition, paint quality, interior condition, and tire health. You get a detailed report with photos and ratings for each category.",
    category: "Services",
  },
  {
    question: "What is covered under the Nxcar extended warranty?",
    answer: "Our extended warranty covers major mechanical and electrical components including engine, transmission, AC system, and electrical systems for up to 1 year. This gives you complete peace of mind after your purchase.",
    category: "Services",
  },
  {
    question: "Can I purchase insurance for a used car on Nxcar?",
    answer: "Yes, we offer comprehensive insurance options including third-party, comprehensive, and zero depreciation plans through our partner ACKO. Compare plans and buy instantly with zero paperwork.",
    category: "Services",
  },
  {
    question: "How does Nxcar assist with RC transfer?",
    answer: "We handle the entire RC transfer process including NOC from seller's RTO, document preparation, ownership transfer, bank hypothecation, and insurance transfer. Our team manages all the paperwork so you don't have to.",
    category: "Services",
  },
  {
    question: "What documents are required for RC transfer?",
    answer: "You'll need the original RC, insurance papers, PUC certificate, Form 29/30, NOC from the financing bank (if applicable), and valid ID proof. Our team will guide you through the complete documentation process.",
    category: "Services",
  },
  {
    question: "How long does the RC transfer process take?",
    answer: "The RC transfer process typically takes 15-30 working days depending on the RTO location and document completeness. We keep you updated on the progress at every step.",
    category: "Services",
  },
  {
    question: "Does Nxcar offer documentation support for car purchases?",
    answer: "Yes, we provide complete documentation support including agreement drafting, verification, and filing through our RTO services. Our legal team ensures all documents are properly prepared and filed.",
    category: "Buying",
  },
  {
    question: "What is the Challan Check service on Nxcar?",
    answer: "Our Challan Check service lets you instantly check any pending traffic challans or fines on your vehicle by entering the registration number. This is essential before buying or selling a used car.",
    category: "Services",
  },
  {
    question: "How can I book a car inspection on Nxcar?",
    answer: "You can book an inspection through our app or website. Select your preferred date, time, and location, and our certified inspector will visit you. The inspection report is shared digitally within 24 hours.",
    category: "Services",
  },
];

const categories: Category[] = ["All", "Buying", "Selling", "Loans", "Services"];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <FAQJsonLd items={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <Navbar />
      <main className="pt-14">
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-faq">
                Help Center
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                Find answers to common questions about buying, selling, and servicing cars on Nxcar
              </p>
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setOpenIndex(null); }}
                  className="pl-12 h-14 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 rounded-xl text-lg"
                  data-testid="input-search"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => { setActiveCategory(category); setOpenIndex(null); }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25"
                      : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/5"
                  }`}
                  data-testid={`tab-${category.toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-4"
            >
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400 text-lg" data-testid="text-no-results">No questions found matching your search.</p>
                </div>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                    data-testid={`faq-item-${index}`}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      data-testid={`button-faq-${index}`}
                    >
                      <span className="text-lg font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
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
                Still Have Questions?
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Our team is here to help. Reach out to us anytime and we'll get back to you within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact-us" data-testid="link-contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    data-testid="button-contact-us"
                  >
                    Contact Us
                  </motion.button>
                </a>
                <a href="tel:+919355924132" data-testid="link-cta-call">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                    data-testid="button-cta-call"
                  >
                    <Phone className="w-4 h-4" />
                    +91 93559 24132
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
