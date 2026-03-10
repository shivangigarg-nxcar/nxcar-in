'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useToast } from "@hooks/use-toast";
import {
  Shield, FileText, CheckCircle, ArrowRight, ClipboardCheck,
  AlertTriangle, Scale, Zap, Globe, Eye, Users, RefreshCw,
  ShieldCheck, Search, Car, Info, Phone, Loader2
} from "lucide-react";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function RCCheck() {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast({ title: "Please enter your vehicle number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicle-lookup/${encodeURIComponent(vehicleNumber.replace(/\s/g, "").trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch vehicle details");
      }
      setVehicleData(data);
      setSearched(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch vehicle details", variant: "destructive" });
      setVehicleData(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6" data-testid="badge-rc-check">
                  RC Verification
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight" data-testid="text-hero-title">
                  Check{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                    RC Details
                  </span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8" data-testid="text-hero-subtitle">
                  Verify Registration Certificate, insurance status, ownership details, and more. Make informed decisions before buying any used car.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>Pan India Coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span>100% Authentic Data</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-xl" data-testid="form-rc-check">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Check RC Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle Number</label>
                      <Input
                        placeholder="e.g., DL 01 AB 1234"
                        value={vehicleNumber}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
                          setVehicleNumber(val.replace(/  +/g, " "));
                        }}
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12 text-lg uppercase"
                        data-testid="input-vehicle-number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-white/10 rounded-l-md text-sm text-slate-600 dark:text-slate-300">
                          +91
                        </span>
                        <Input
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 h-12 rounded-l-none"
                          data-testid="input-phone-number"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl"
                      data-testid="button-check-rc"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 mr-2" />
                      )}
                      {loading ? "Checking..." : "Check RC"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {searched && (
          <section className="py-12 bg-white dark:bg-[#0A0E14]" data-testid="rc-results-section">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {!vehicleData?.all ? (
                  <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10 text-center">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No RC Details Found</h3>
                    <p className="text-slate-600 dark:text-slate-400">We couldn't find any registration details for this vehicle number. Please check the number and try again.</p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                      RC Details for{" "}
                      <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent" data-testid="text-reg-number">
                        {vehicleData.all.regNo || vehicleData.vehicle_number}
                      </span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {(() => {
                        const r = vehicleData.all;
                        const sections = [
                          {
                            title: "Vehicle Information",
                            icon: Car,
                            fields: [
                              { label: "Registration No", value: r.regNo },
                              { label: "Registration Date", value: r.regDate },
                              { label: "Make", value: r.vehicleManufacturerName || vehicleData.make },
                              { label: "Model", value: r.model || vehicleData.model },
                              { label: "Vehicle Class", value: r.vehicleClass },
                              { label: "Color", value: r.vehicleColour || vehicleData.color },
                              { label: "Fuel Type", value: r.fuelType || vehicleData.fule_type },
                              { label: "Body Type", value: r.bodyType },
                              { label: "Norms Type", value: r.normsType },
                            ],
                          },
                          {
                            title: "Owner Information",
                            icon: Users,
                            fields: [
                              { label: "Owner Name", value: r.owner, testId: "text-owner-name" },
                              { label: "Father's Name", value: r.ownerFatherName },
                              { label: "Address", value: r.permanentAddress || r.presentAddress },
                              { label: "RTO", value: r.registeredAt || `${vehicleData.rto_code} - ${vehicleData.rto_state_name}` },
                              { label: "Ownership", value: r.ownerCount ? `${r.ownerCount} Owner(s)` : vehicleData.ownership ? `${vehicleData.ownership} Owner` : "" },
                            ],
                          },
                          {
                            title: "Technical Details",
                            icon: FileText,
                            fields: [
                              { label: "Engine No", value: r.engine },
                              { label: "Chassis No", value: r.chassis },
                              { label: "Manufacturing Date", value: r.manufacturingDate || r.manufacturerMonthYear },
                              { label: "Unladen Weight", value: r.unladenWeight ? `${r.unladenWeight} kg` : "" },
                              { label: "Gross Weight", value: r.grossWeight ? `${r.grossWeight} kg` : "" },
                              { label: "Wheelbase", value: r.wheelbase ? `${r.wheelbase} mm` : "" },
                              { label: "Seating Capacity", value: r.seatCapacity },
                            ],
                          },
                          {
                            title: "Compliance",
                            icon: ShieldCheck,
                            fields: [
                              { label: "Insurance Company", value: r.insuranceCompany },
                              { label: "Insurance Valid Until", value: r.insuranceUpto },
                              { label: "Fitness Until", value: r.fitnessUpto },
                              { label: "PUC Valid Until", value: r.pucExpiryDate },
                              { label: "Tax Paid Until", value: r.taxPaidUpto },
                            ],
                          },
                        ];
                        return sections.map((section) => {
                          const filtered = section.fields.filter((f) => f.value);
                          if (filtered.length === 0) return null;
                          return (
                            <div
                              key={section.title}
                              className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                                  <section.icon className="w-5 h-5 text-teal-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h3>
                              </div>
                              <div className="space-y-3">
                                {filtered.map((field) => (
                                  <div key={field.label} className="flex justify-between items-start gap-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">{field.label}</span>
                                    <span
                                      className="text-sm font-medium text-slate-900 dark:text-white text-right"
                                      {...(field.testId ? { "data-testid": field.testId } : {})}
                                    >
                                      {field.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-[#0A0E14]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
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
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-white/10">
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
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
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
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
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
          <div className="max-w-screen-xl mx-auto px-6 lg:px-8 text-center">
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
      </main>
      <Footer />
    </div>
  );
}
