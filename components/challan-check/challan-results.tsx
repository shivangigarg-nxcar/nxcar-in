"use client";

import { motion } from "framer-motion";
import { CheckCircle, MapPin, Calendar } from "lucide-react";

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

interface ChallanResultsProps {
  challans: any[];
}

export function ChallanResults({ challans }: ChallanResultsProps) {
  const totalPendingAmount = challans
    .filter((c) => c.challanStatus?.toLowerCase() === "pending")
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0D1117] dark:to-[#0A0E14]" data-testid="challan-results-section">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {challans.length === 0 ? (
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-8 border border-green-500/30 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Challans Found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Great news! No pending challans were found for your vehicle.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Challans</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="text-total-challans">{challans.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-amber-500/30 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Pending Amount</p>
                  <p className="text-3xl font-bold text-amber-500" data-testid="text-total-amount">{formatAmount(totalPendingAmount)}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challans.map((challan, index) => {
                  const isPending = challan.challanStatus?.toLowerCase() === "pending";
                  return (
                    <motion.div
                      key={challan.challanNo || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all"
                      data-testid={`challan-card-${index}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">#{challan.challanNo}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isPending
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-green-500/10 text-green-600 dark:text-green-400"
                          }`}
                        >
                          {challan.challanStatus}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                        {challan.offenseDetails}
                      </p>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="truncate">{challan.challanPlace || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span>{challan.challanDate ? formatDate(challan.challanDate) : "N/A"}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Fine Amount</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{formatAmount(Number(challan.amount) || 0)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
