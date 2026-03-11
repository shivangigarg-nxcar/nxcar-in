"use client";

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import type { Metadata } from "next";

export default function PartnersAccount() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    subject: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] font-sans" data-testid="partners-account-page">
      <Navbar />
      <main className="pt-16 pb-16">
        <div className="container px-4 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="heading-data-inquiry">Data Collection And Storage Inquiry</h1>
          <p className="text-slate-400 mb-8">Fill this form to review, update or delete your personal Information/Account</p>

          {submitted ? (
            <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 text-center">
              <p className="text-[#0EA9B2] text-lg font-semibold mb-2">Request Submitted</p>
              <p className="text-slate-400">We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                data-testid="input-name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                required
                data-testid="input-mobile"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                data-testid="input-subject"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2]"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                data-testid="input-description"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA9B2] resize-none"
              />
              <button
                type="submit"
                data-testid="button-submit"
                className="w-full px-6 py-3 rounded-lg bg-[#0EA9B2] text-white font-semibold hover:bg-[#0EA9B2]/80 transition-colors"
              >
                Submit
              </button>
            </form>
          )}

          <div className="mt-12 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">NXFIN TECHNOLOGIES PRIVATE LIMITED</h2>
            <div className="text-slate-300 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Locations</h3>
                <p className="text-slate-400 mb-2">
                  <span className="text-white">Corporate Address:</span> 3rd Floor Plot No 809, Sector 42, Golf Course Road, Gurgaon Haryana, India 122009
                </p>
                <p className="text-slate-400">
                  <span className="text-white">Reg. Address:</span> Unit No. 105, First Floor, KLJ Tower, North, Netaji Subhash Place, Pitampura New Delhi, India, 110034
                </p>
              </div>
              <div className="space-y-1">
                <p><a href="tel:+919289992797" className="text-[#0EA9B2] hover:underline">+91 92899 92797</a></p>
                <p><a href="tel:+919355924133" className="text-[#0EA9B2] hover:underline">+91 93559 24133</a></p>
                <p><a href="mailto:contact@nxcar.in" className="text-[#0EA9B2] hover:underline">contact@nxcar.in</a></p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
