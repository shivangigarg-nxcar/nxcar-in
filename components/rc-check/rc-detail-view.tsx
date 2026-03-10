"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Car, Users, FileText, ShieldCheck } from "lucide-react";

interface RcDetailViewProps {
  vehicleData: any;
}

export function RcDetailView({ vehicleData }: RcDetailViewProps) {
  if (!vehicleData?.all) {
    return (
      <section className="py-12 bg-white dark:bg-[#0A0E14]" data-testid="rc-results-section">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-slate-200 dark:border-white/10 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No RC Details Found</h3>
              <p className="text-slate-600 dark:text-slate-400">We couldn't find any registration details for this vehicle number. Please check the number and try again.</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

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

  return (
    <section className="py-12 bg-white dark:bg-[#0A0E14]" data-testid="rc-results-section">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              RC Details for{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent" data-testid="text-reg-number">
                {vehicleData.all.regNo || vehicleData.vehicle_number}
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sections.map((section) => {
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
                            {...((field as any).testId ? { "data-testid": (field as any).testId } : {})}
                          >
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
