"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import { Phone, ArrowRight, Loader2, ChevronDown } from "lucide-react";

interface CityOption {
  city_id: string;
  city_name: string;
}

interface StateOption {
  state_id: string;
  state_name: string;
}

export function PartnerRegistrationForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "", email: "", phone_number: "", address: "", city_id: "", state_id: "", pincode: "", is_dealer: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    fetch("/api/nxcar/cities")
      .then(res => res.json())
      .then(data => {
        setCities(Array.isArray(data) ? data : []);
      })
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));

    fetch("/api/nxcar/states")
      .then(res => res.json())
      .then(data => {
        setStates(Array.isArray(data) ? data : []);
      })
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  }, []);

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone_number.trim() || formData.phone_number.trim().length !== 10) {
      toast({ title: "Please enter your name and a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!formData.city_id || !formData.state_id) {
      toast({ title: "Please select a city and state", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/nxcar/register-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.status === false) {
        const msg = data.message ? data.message.replace(/<[^>]*>/g, ' ').trim() : "Please try again.";
        toast({ title: "Registration Failed", description: msg, variant: "destructive" });
        return;
      }
      toast({ title: "Registration Successful!", description: "Welcome to the Nxcar partner network!" });
      setFormData({ name: "", email: "", phone_number: "", address: "", city_id: "", state_id: "", pincode: "", is_dealer: false });
    } catch {
      toast({ title: "Registration Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="py-20 bg-white dark:bg-[#0A0E14]" id="register">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-register-title">
              Register as a{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">Partner</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Fill in your details below and our team will get in touch with you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handlePartnerSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-4" data-testid="form-partner-register">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                    data-testid="input-partner-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                  <Input
                    placeholder="10-digit phone number"
                    value={formData.phone_number}
                    onChange={(e) => handleFormChange("phone_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                    data-testid="input-partner-phone"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                  data-testid="input-partner-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                <Input
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                  data-testid="input-partner-address"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">State *</label>
                  <div className="relative">
                    <select
                      value={formData.state_id}
                      onChange={(e) => handleFormChange("state_id", e.target.value)}
                      className="w-full h-12 px-3 pr-10 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                      data-testid="select-partner-state"
                      disabled={loadingStates}
                    >
                      <option value="">{loadingStates ? "── ── ──" : "Select State"}</option>
                      {states.map((s) => (
                        <option key={s.state_id} value={s.state_id}>{s.state_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City *</label>
                  <div className="relative">
                    <select
                      value={formData.city_id}
                      onChange={(e) => handleFormChange("city_id", e.target.value)}
                      className="w-full h-12 px-3 pr-10 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                      data-testid="select-partner-city"
                      disabled={loadingCities}
                    >
                      <option value="">{loadingCities ? "── ── ──" : "Select City"}</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pincode</label>
                  <Input
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={(e) => handleFormChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12"
                    data-testid="input-partner-pincode"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_dealer}
                  onChange={(e) => handleFormChange("is_dealer", e.target.checked)}
                  className="w-4 h-4 accent-teal-500"
                  data-testid="checkbox-partner-dealer"
                />
                <label className="text-sm text-slate-700 dark:text-slate-300">I am an existing car dealer</label>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl disabled:opacity-70"
                data-testid="button-partner-submit"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                {submitting ? "Registering..." : "Register as Partner"}
              </Button>
            </form>
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
              Become a Partner Today
            </h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">
              Join Nxcar's growing network of channel partners and unlock new revenue streams for your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+919355924133" data-testid="link-cta-call">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                  data-testid="button-cta-call"
                >
                  <Phone className="w-4 h-4" />
                  +91 93559 24133
                </motion.button>
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-2"
                data-testid="button-cta-learn-more"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
