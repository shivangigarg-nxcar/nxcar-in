"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare } from "lucide-react";
import { Button } from "@components/ui/button";
import { useCarComparison } from "@hooks/use-car-comparison";
import { CarComparisonModal } from "./car-comparison-modal";

export function ComparisonBar() {
  const { comparisonCars, removeFromCompare, clearComparison } = useCarComparison();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (comparisonCars.length === 0) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D1117] border-t border-[#0EA9B2]/30 shadow-[0_-4px_20px_rgba(14,169,178,0.2)]"
          data-testid="comparison-bar"
        >
          <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <GitCompare className="h-5 w-5 text-[#0EA9B2]" />
                <span className="text-white font-medium text-sm whitespace-nowrap">
                  Compare ({comparisonCars.length}/3)
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0 overflow-x-auto">
                <AnimatePresence mode="popLayout">
                  {comparisonCars.map((car) => (
                    <motion.div
                      key={car.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="relative shrink-0"
                      data-testid={`comparison-thumbnail-${car.id}`}
                    >
                      <div className="w-12 h-9 sm:w-20 sm:h-14 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="w-full h-full object-contain p-0.5 sm:p-1"
                        />
                      </div>
                      <button
                        onClick={() => removeFromCompare(car.id)}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-0.5 sm:p-1 rounded-full bg-red-500 text-white"
                        data-testid={`button-remove-compare-${car.id}`}
                      >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {Array.from({ length: 3 - comparisonCars.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-12 h-9 sm:w-20 sm:h-14 rounded-lg border border-dashed border-white/20 hidden sm:flex items-center justify-center shrink-0"
                  >
                    <span className="text-xs text-slate-500">+</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearComparison}
                  className="text-slate-400 hover:text-white px-1.5 sm:px-3 h-7 sm:h-8 text-[10px] sm:text-sm"
                  data-testid="button-clear-comparison"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  disabled={comparisonCars.length < 2}
                  className="bg-[#0EA9B2] hover:bg-[#0EA9B2]/80 text-white font-bold h-7 sm:h-9 px-2 sm:px-4 text-[10px] sm:text-sm"
                  data-testid="button-compare-now"
                >
                  <GitCompare className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-2" />
                  <span className="hidden sm:inline">Compare Now</span>
                  <span className="sm:hidden">{comparisonCars.length}/3</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <CarComparisonModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
