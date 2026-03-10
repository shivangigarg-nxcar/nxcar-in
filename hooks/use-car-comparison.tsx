"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ComparisonCar {
  id: number | string;
  name: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  kilometers: number;
  location: string;
  imageUrl: string;
  ownership?: string;
}

interface CarComparisonContextType {
  comparisonCars: ComparisonCar[];
  addToCompare: (car: ComparisonCar) => boolean;
  removeFromCompare: (carId: number | string) => void;
  clearComparison: () => void;
  isInComparison: (carId: number | string) => boolean;
  isComparisonFull: boolean;
}

const CarComparisonContext = createContext<CarComparisonContextType | null>(null);

const MAX_COMPARISON_CARS = 3;

export function CarComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonCars, setComparisonCars] = useState<ComparisonCar[]>([]);

  const addToCompare = useCallback((car: ComparisonCar): boolean => {
    let added = false;
    setComparisonCars((prev) => {
      if (prev.length >= MAX_COMPARISON_CARS) {
        return prev;
      }
      if (prev.some((c) => String(c.id) === String(car.id))) {
        return prev;
      }
      added = true;
      return [...prev, car];
    });
    return added;
  }, []);

  const removeFromCompare = useCallback((carId: number | string) => {
    setComparisonCars((prev) => prev.filter((car) => String(car.id) !== String(carId)));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonCars([]);
  }, []);

  const isInComparison = useCallback(
    (carId: number | string) => comparisonCars.some((car) => String(car.id) === String(carId)),
    [comparisonCars]
  );

  const isComparisonFull = comparisonCars.length >= MAX_COMPARISON_CARS;

  return (
    <CarComparisonContext.Provider
      value={{
        comparisonCars,
        addToCompare,
        removeFromCompare,
        clearComparison,
        isInComparison,
        isComparisonFull,
      }}
    >
      {children}
    </CarComparisonContext.Provider>
  );
}

export function useCarComparison() {
  const context = useContext(CarComparisonContext);
  if (!context) {
    throw new Error("useCarComparison must be used within a CarComparisonProvider");
  }
  return context;
}
