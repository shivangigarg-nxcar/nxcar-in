"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCarById } from "@lib/api";
import type { Car } from "@shared/schema";

const STORAGE_KEY = "recentlyViewedCars";
const MAX_ITEMS = 10;

function getStoredIds(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

function setStoredIds(ids: number[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
}

export function useRecentlyViewed() {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  useEffect(() => {
    setRecentlyViewedIds(getStoredIds());
  }, []);

  const addRecentlyViewed = useCallback((carId: number) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== carId);
      const updated = [carId, ...filtered].slice(0, MAX_ITEMS);
      setStoredIds(updated);
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewedIds([]);
  }, []);

  const { data: recentlyViewedCars = [], isLoading } = useQuery({
    queryKey: ["recentlyViewedCars", recentlyViewedIds],
    queryFn: async () => {
      if (recentlyViewedIds.length === 0) return [];
      const results = await Promise.all(
        recentlyViewedIds.map(async (id) => {
          try {
            const car = await getCarById(id);
            return { id, car };
          } catch {
            return { id, car: null };
          }
        })
      );
      const validCars = results.filter((r): r is { id: number; car: Car } => r.car !== null);
      const staleIds = results.filter((r) => r.car === null).map((r) => r.id);
      if (staleIds.length > 0) {
        const cleanedIds = recentlyViewedIds.filter((id) => !staleIds.includes(id));
        setStoredIds(cleanedIds);
        setRecentlyViewedIds(cleanedIds);
      }
      return validCars.map((r) => r.car);
    },
    enabled: recentlyViewedIds.length > 0,
    staleTime: 60000,
  });

  return {
    recentlyViewedIds,
    recentlyViewedCars,
    addRecentlyViewed,
    clearRecentlyViewed,
    isLoading,
  };
}
