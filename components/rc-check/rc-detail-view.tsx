"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Car,
  Users,
  FileText,
  ShieldCheck,
  Shield,
  Truck,
  Zap,
  Ban,
  Calendar,
  type LucideIcon,
} from "lucide-react";

interface RcDetailViewProps {
  vehicleData: any;
}

function formatDate(val: string | null | undefined): string {
  if (!val || val === "0000-00-00") return "";
  if (val.includes("/")) return val;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return val;
  }
}

function yesNo(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "") return "";
  return String(val) === "1" ? "Yes" : String(val) === "0" ? "No" : String(val);
}

interface SectionConfig {
  title: string;
  icon: LucideIcon;
  fields: { label: string; value: any; testId?: string }[];
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

  const statusBadge = r.status === "ACTIVE"
    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
    : r.status === "INACTIVE" || r.status === "EXPIRED"
      ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";

  const sections: SectionConfig[] = [
    {
      title: "Registration Details",
      icon: FileText,
      fields: [
        { label: "Registration No", value: r.regNo, testId: "text-reg-no" },
        { label: "Registration Date", value: formatDate(r.regDate) },
        { label: "RC Expiry Date", value: formatDate(r.rcExpiryDate) },
        { label: "Registering Authority", value: r.regAuthority },
        { label: "RTO", value: vehicleData.rto_code ? `${vehicleData.rto_code} - ${vehicleData.rto_state_name || ""}`.trim() : "" },
        { label: "Vehicle Category", value: r.vehicleCategory },
        { label: "Status", value: r.status, testId: "text-rc-status" },
        { label: "Status As On", value: formatDate(r.statusAsOn) },
      ],
    },
    {
      title: "Vehicle Information",
      icon: Car,
      fields: [
        { label: "Manufacturer", value: r.vehicleManufacturerName || vehicleData.make },
        { label: "Model", value: r.model || vehicleData.model },
        { label: "Variant", value: vehicleData.variant },
        { label: "Vehicle Class", value: r.vehicleClass },
        { label: "Body Type", value: r.bodyType },
        { label: "Color", value: r.vehicleColour || vehicleData.color },
        { label: "Fuel Type", value: r.fuelType || vehicleData.fule_type },
        { label: "Emission Norms", value: r.normsType },
        { label: "Manufacturing Date", value: r.vehicleManufacturingMonthYear },
        { label: "Year", value: vehicleData.year },
        { label: "Electric Vehicle", value: yesNo(r.electricVehicle) },
      ],
    },
    {
      title: "Owner Information",
      icon: Users,
      fields: [
        { label: "Owner Name", value: r.owner, testId: "text-owner-name" },
        { label: "Father's Name", value: r.ownerFatherName },
        { label: "Mobile Number", value: r.mobileNumber },
        { label: "Ownership Count", value: r.ownerCount ? `${r.ownerCount} Owner(s)` : vehicleData.ownership ? `${vehicleData.ownership} Owner(s)` : "" },
        { label: "Present Address", value: r.presentAddress },
        { label: "Permanent Address", value: r.permanentAddress && r.permanentAddress !== r.presentAddress ? r.permanentAddress : "" },
      ],
    },
    {
      title: "Engine & Technical",
      icon: Zap,
      fields: [
        { label: "Engine Number", value: r.engine },
        { label: "Chassis Number", value: r.chassis },
        { label: "Cubic Capacity", value: r.vehicleCubicCapacity ? `${r.vehicleCubicCapacity} cc` : "" },
        { label: "No. of Cylinders", value: r.vehicleCylindersNo },
        { label: "Unladen Weight", value: r.unladenWeight ? `${r.unladenWeight} kg` : "" },
        { label: "Gross Vehicle Weight", value: r.grossVehicleWeight ? `${r.grossVehicleWeight} kg` : "" },
        { label: "Wheelbase", value: r.wheelbase ? `${r.wheelbase} mm` : "" },
        { label: "Seating Capacity", value: r.vehicleSeatCapacity },
        { label: "Sleeper Capacity", value: r.vehicleSleeperCapacity && r.vehicleSleeperCapacity !== "0" ? r.vehicleSleeperCapacity : "" },
        { label: "Standing Capacity", value: r.vehicleStandingCapacity && r.vehicleStandingCapacity !== "0" ? r.vehicleStandingCapacity : "" },
      ],
    },
    {
      title: "Insurance Details",
      icon: ShieldCheck,
      fields: [
        { label: "Insurance Company", value: r.vehicleInsuranceCompanyName || r.insuranceCompany },
        { label: "Policy Number", value: r.vehicleInsurancePolicyNumber },
        { label: "Insurance Valid Until", value: formatDate(r.vehicleInsuranceUpto || r.insuranceUpto) },
      ],
    },
    {
      title: "Tax & Compliance",
      icon: Shield,
      fields: [
        { label: "Tax Paid Until", value: r.vehicleTaxUpto || formatDate(r.taxPaidUpto) },
        { label: "Fitness Until", value: formatDate(r.fitnessUpto) },
        { label: "PUC Number", value: r.puccNumber },
        { label: "PUC Valid Until", value: formatDate(r.puccUpto || r.pucExpiryDate) },
      ],
    },
    {
      title: "Finance & Hypothecation",
      icon: Calendar,
      fields: [
        { label: "Financed", value: yesNo(r.financed) },
        { label: "Financer", value: r.rcFinancer },
      ],
    },
    {
      title: "Permit Details",
      icon: Truck,
      fields: [
        { label: "Commercial Vehicle", value: yesNo(r.isCommercial) },
        { label: "Permit Type", value: r.permitType },
        { label: "Permit Number", value: r.permitNumber },
        { label: "Permit Valid From", value: formatDate(r.permitValidFrom) },
        { label: "Permit Valid Until", value: formatDate(r.permitValidUpto) },
        { label: "Permit Issue Date", value: formatDate(r.permitIssueDate) },
        { label: "National Permit Number", value: r.nationalPermitNumber },
        { label: "National Permit Until", value: formatDate(r.nationalPermitUpto) },
        { label: "National Permit Issued By", value: r.nationalPermitIssuedBy },
      ],
    },
    {
      title: "Blacklist & NOC",
      icon: Ban,
      fields: [
        { label: "Blacklist Status", value: r.blacklistStatus },
        { label: "Blacklist Details", value: r.blacklistDetails },
        { label: "NOC Details", value: r.nocDetails },
        { label: "Non-Use Status", value: r.nonUseStatus },
        { label: "Non-Use From", value: formatDate(r.nonUseFrom) },
        { label: "Non-Use To", value: formatDate(r.nonUseTo) },
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                RC Details for{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent" data-testid="text-reg-number">
                  {r.regNo || vehicleData.vehicle_number}
                </span>
              </h2>
              {r.status && (
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${statusBadge}`} data-testid="badge-rc-status">
                  {r.status}
                </span>
              )}
            </div>

            {(r.vehicleManufacturerName || vehicleData.make) && (
              <div className="mb-8 bg-gradient-to-r from-teal-500/10 to-cyan-400/10 dark:from-teal-500/5 dark:to-cyan-400/5 rounded-2xl p-6 border border-teal-500/20">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Vehicle</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white" data-testid="text-vehicle-name">
                      {r.vehicleManufacturerName || vehicleData.make} {r.model || vehicleData.model}
                    </p>
                  </div>
                  {vehicleData.variant && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Variant</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{vehicleData.variant}</p>
                    </div>
                  )}
                  {vehicleData.year && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Year</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{vehicleData.year}</p>
                    </div>
                  )}
                  {(r.fuelType || vehicleData.fule_type) && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Fuel</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{r.fuelType || vehicleData.fule_type}</p>
                    </div>
                  )}
                  {r.vehicleColour && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Color</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{r.vehicleColour}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {sections.map((section, sectionIndex) => {
                const filtered = section.fields.filter(
                  (f) => f.value !== null && f.value !== undefined && f.value !== "" && f.value !== "0000-00-00"
                );
                if (filtered.length === 0) return null;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: sectionIndex * 0.05 }}
                    className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-teal-500/30 transition-colors"
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
                            className={`text-sm font-medium text-right break-words max-w-[60%] ${
                              field.label === "Status" && field.value === "ACTIVE"
                                ? "text-green-600 dark:text-green-400"
                                : field.label === "Status" && (field.value === "INACTIVE" || field.value === "EXPIRED")
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-slate-900 dark:text-white"
                            }`}
                            {...(field.testId ? { "data-testid": field.testId } : {})}
                          >
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
