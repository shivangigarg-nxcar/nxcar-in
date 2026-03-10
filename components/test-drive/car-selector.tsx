"use client";

import { motion } from "framer-motion";
import { Car, Sparkles } from "lucide-react";

export interface CarModel {
  id: string;
  name: string;
  brand: string;
  image: string;
  specs: {
    power: string;
    torque: string;
    acceleration: string;
    topSpeed: number;
    fuelType: string;
    transmission: string;
  };
  description: string;
  color: string;
}

export function CarSelector({ cars, selectedCar, onSelect }: { 
  cars: CarModel[]; 
  selectedCar: CarModel | null; 
  onSelect: (car: CarModel) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cars.map((car) => (
        <motion.button
          key={car.id}
          onClick={() => onSelect(car)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            selectedCar?.id === car.id
              ? "border-primary bg-primary/10 dark:bg-primary/20"
              : "border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800"
          }`}
        >
          <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${car.color} flex items-center justify-center mb-2`}>
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-white text-sm">{car.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{car.brand}</div>
          </div>
          {selectedCar?.id === car.id && (
            <motion.div
              layoutId="selectedIndicator"
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
