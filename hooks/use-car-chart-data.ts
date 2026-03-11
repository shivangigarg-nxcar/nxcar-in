"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

interface ChartCar {
  price: number;
  make: string;
  model: string;
  variant: string;
  region: string;
  year: string;
  distance: number;
  mileage?: number;
  Color: string;
  Transmission: string;
  Fuel_type: string;
}

interface YearData {
  cars: ChartCar[];
  maxPrice: number;
}

interface CarChartInput {
  vehicleId: string;
  city: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  mileage: number;
}

function processFetchedData(apiData: any[]): Record<string, YearData> {
  const processedData: Record<string, YearData> = {};
  if (!Array.isArray(apiData) || apiData.length === 0) return processedData;

  apiData.forEach((response) => {
    if (!response || !response.data || !Array.isArray(response.data)) return;

    response.data.forEach((car: any) => {
      const yearKey = car.Year ? car.Year.toString() : "Unknown";
      const parsedPrice = car.Price_numeric != null ? Number(car.Price_numeric) : null;
      if (parsedPrice === null || isNaN(parsedPrice) || parsedPrice <= 0) return;

      if (!processedData[yearKey]) {
        processedData[yearKey] = { cars: [], maxPrice: 0 };
      }

      processedData[yearKey].cars.push({
        price: parsedPrice,
        make: car.Make || "",
        model: car.Model || "",
        variant: car.Variant || "",
        region: car.City || "",
        year: String(car.Year),
        distance: Number(car.Distance_numeric) || 0,
        Color: car.Color || "#999",
        Transmission: car.Transmission || "Unknown",
        Fuel_type: car.Fuel_type || "Unknown",
      });

      processedData[yearKey].maxPrice = Math.max(processedData[yearKey].maxPrice, parsedPrice);
    });
  });

  return processedData;
}

export function useCarChartData(input: CarChartInput) {
  const [filteredRegion, setFilteredRegion] = useState("All");
  const [carData, setCarData] = useState<Record<string, YearData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overallTotalCount, setOverallTotalCount] = useState(0);
  const [cityWiseCount, setCityWiseCount] = useState<Record<string, number>>({});

  const myCarData = useMemo(() => {
    if (!input.make || !input.model) return null;
    return {
      make: input.make,
      model: input.model,
      variant: input.variant,
      year: input.year,
      region: "All",
      price: input.price,
      mileage: input.mileage,
    };
  }, [input.make, input.model, input.variant, input.year, input.price, input.mileage]);

  const yearlyData = useMemo(() => {
    if (!carData || Object.keys(carData).length === 0) return [];

    return Object.entries(carData)
      .map(([year, yearData]) => {
        let maxPrice = yearData.maxPrice || Math.max(...yearData.cars.map(c => c.price), 0);
        if (myCarData && myCarData.year.toString() === year) {
          maxPrice = Math.max(maxPrice, myCarData.price);
        }
        return { year, maxPrice: maxPrice > 0 ? maxPrice : 0 };
      })
      .filter(d => d.maxPrice > 0)
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [carData, myCarData]);

  const fetchChartData = useCallback(async (region: string) => {
    if (!input.make || !input.model || !input.variant) return;

    try {
      setLoading(true);
      setError(null);

      const body: any = {
        make: input.make,
        model: input.model,
        variant: input.variant,
      };
      if (region !== "All") {
        body.city = region;
      }

      const response = await fetch("/api/nxcar/fetch-car-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to fetch chart data");

      const data = await response.json();
      if (data) {
        const processed = processFetchedData([data]);
        setCarData(processed);
        setOverallTotalCount(data.overall_total_count || 0);
        if (data.city_wise_count) setCityWiseCount(data.city_wise_count);
      }
    } catch (err) {
      setError("Failed to fetch chart data");
      setCarData({});
    } finally {
      setLoading(false);
    }
  }, [input.make, input.model, input.variant, input.city]);

  const prevIdentity = useRef("");
  useEffect(() => {
    const identity = `${input.make}|${input.model}|${input.variant}|${input.vehicleId}`;
    if (input.make && input.model && input.variant && identity !== prevIdentity.current) {
      prevIdentity.current = identity;
      setFilteredRegion("All");
      fetchChartData("All");
    }
  }, [input.make, input.model, input.variant, input.vehicleId, fetchChartData]);

  const handleToggleButton = useCallback((region: string) => {
    setFilteredRegion(region);
    fetchChartData(region);
  }, [fetchChartData]);

  const regions = useMemo(() => {
    const regionSet = new Set<string>(["All"]);
    Object.values(carData).forEach(yearData => {
      yearData.cars.forEach(car => {
        if (car.region) regionSet.add(car.region);
      });
    });
    return Array.from(regionSet);
  }, [carData]);

  return {
    filteredRegion,
    regions,
    carData,
    loading,
    error,
    yearlyData,
    myCarData,
    overallTotalCount,
    handleToggleButton,
    cityWiseCount,
  };
}
