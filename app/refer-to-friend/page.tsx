'use client';

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Gift, Share2, Car, Trophy, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

const howItWorks = [
  { icon: Share2, title: "Step 1", desc: "Share your referral link with friends" },
  { icon: Car, title: "Step 2", desc: "Your friend buys or sells a car on Nxcar" },
  { icon: Trophy, title: "Step 3", desc: "Both of you earn rewards!" },
];

const faqs = [
  { q: "Who can refer?", a: "Any registered Nxcar user can refer friends and family. Simply sign up or log in to get your unique referral link." },
  { q: "How do I get paid?", a: "Rewards are credited to your bank account within 7 business days after your friend completes a successful transaction on Nxcar." },
  { q: "Is there a limit?", a: "No! There is no limit on the number of referrals. The more friends you refer, the more you earn." },
];

export default function ReferToFriend() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setReferralLink(`https://nxcar.in/ref/NXCAR${randomDigits}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] font-sans" data-testid="refer-to-friend-page">
      <Navbar />
      <main className="pt-16 pb-16">
        <section className="container px-4 max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-6"
          >
            <Gift className="h-8 w-8 text-[#0EA9B2]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            data-testid="heading-hero"
          >
            Refer & Earn with <span className="text-[#0EA9B2]">Nxcar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Invite your friends and earn rewards when they buy or sell a car
          </motion.p>
        </section>

        <section className="container px-4 max-w-4xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center"
            data-testid="heading-how-it-works"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center"
                data-testid={`how-step-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#0EA9B2]/20 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="h-6 w-6 text-[#0EA9B2]" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container px-4 max-w-md mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center" data-testid="heading-referral-form">
              Get Your Referral Link
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-name"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                data-testid="input-phone"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <button
                type="submit"
                data-testid="button-get-referral"
                className="w-full px-6 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors"
              >
                Get My Referral Link
              </button>
            </form>

            {referralLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-700"
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Your Referral Link:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[#0EA9B2] text-sm break-all" data-testid="text-referral-link">
                    {referralLink}
                  </code>
                  <button
                    onClick={handleCopy}
                    data-testid="button-copy-link"
                    className="flex-shrink-0 p-2 rounded-lg bg-[#0EA9B2]/20 text-[#0EA9B2] hover:bg-[#0EA9B2]/30 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>

        <section className="container px-4 max-w-4xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center"
            data-testid="heading-what-you-earn"
          >
            What You Earn
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center"
              data-testid="earn-sell"
            >
              <div className="text-4xl font-bold text-[#0EA9B2] mb-2">₹500</div>
              <p className="text-slate-900 dark:text-white font-semibold mb-1">For Each Friend Who Sells</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Earn ₹500 when your referred friend successfully sells a car on Nxcar</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center"
              data-testid="earn-buy"
            >
              <div className="text-4xl font-bold text-[#0EA9B2] mb-2">₹1,000</div>
              <p className="text-slate-900 dark:text-white font-semibold mb-1">For Each Friend Who Buys</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Earn ₹1,000 when your referred friend successfully buys a car on Nxcar</p>
            </motion.div>
          </div>
        </section>

        <section className="container px-4 max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center"
            data-testid="heading-faq"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
                data-testid={`faq-${i + 1}`}
              >
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
