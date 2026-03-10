"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@hooks/use-auth";
import { getFavoriteIds, getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from "@lib/api";
import { toast } from "sonner";
import type { Car } from "@shared/schema";

export interface CarMeta {
  image?: string;
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  fuelType?: string;
  transmission?: string;
  kilometers?: number;
  location?: string;
}

interface FavoritesContextType {
  favoriteIds: number[];
  favorites: Car[];
  isLoading: boolean;
  isFavorite: (carId: number) => boolean;
  toggleFavorite: (carId: number, e?: React.MouseEvent, carMeta?: CarMeta) => void;
  removeFavoriteById: (carId: number) => void;
  refreshFavorites: () => void;
  syncExternalIds: (ids: number[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: [],
  favorites: [],
  isLoading: true,
  isFavorite: () => false,
  toggleFavorite: () => {},
  removeFavoriteById: () => {},
  refreshFavorites: () => {},
  syncExternalIds: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inFlightRef = useRef<Set<number>>(new Set());
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      debounceTimers.current.forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([
      getFavoriteIds().catch(() => [] as number[]),
      getFavorites().catch(() => [] as Car[]),
    ]).then(([ids, cars]) => {
      setFavoriteIds(ids);
      setFavorites(cars);
    }).finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const isFavorite = useCallback((carId: number) => {
    return favoriteIds.includes(carId);
  }, [favoriteIds]);

  const pendingMetaRef = useRef<Map<number, CarMeta>>(new Map());

  const executeToggle = useCallback((carId: number) => {
    if (inFlightRef.current.has(carId)) return;
    inFlightRef.current.add(carId);
    const meta = pendingMetaRef.current.get(carId);
    pendingMetaRef.current.delete(carId);

    setFavoriteIds(prev => {
      const removing = prev.includes(carId);
      if (removing) {
        setFavorites(f => f.filter(car => car.id !== carId));

        apiRemoveFavorite(carId)
          .catch(() => {
            setFavoriteIds(p => [...p, carId]);
          })
          .finally(() => { inFlightRef.current.delete(carId); });

        return prev.filter(id => id !== carId);
      } else {
        apiAddFavorite(carId, meta)
          .then(() => {
            getFavorites().then(cars => setFavorites(cars)).catch(() => {});
          })
          .catch(() => {
            setFavoriteIds(p => p.filter(id => id !== carId));
          })
          .finally(() => { inFlightRef.current.delete(carId); });

        return [...prev, carId];
      }
    });
  }, []);

  const toggleFavorite = useCallback((carId: number, e?: React.MouseEvent, carMeta?: CarMeta) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isAuthenticated) {
      toast.error("Please login to shortlist cars");
      return;
    }

    if (carMeta) {
      pendingMetaRef.current.set(carId, carMeta);
    }

    const existing = debounceTimers.current.get(carId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      debounceTimers.current.delete(carId);
      executeToggle(carId);
    }, 500);
    debounceTimers.current.set(carId, timer);
  }, [isAuthenticated, executeToggle]);

  const removeFavoriteById = useCallback((carId: number) => {
    setFavoriteIds(prev => prev.filter(id => id !== carId));
    setFavorites(prev => prev.filter(car => car.id !== carId));
    apiRemoveFavorite(carId).catch(() => {});
  }, []);

  const refreshFavorites = useCallback(() => {
    if (!isAuthenticated) return;
    Promise.all([
      getFavoriteIds().catch(() => [] as number[]),
      getFavorites().catch(() => [] as Car[]),
    ]).then(([ids, cars]) => {
      setFavoriteIds(ids);
      setFavorites(cars);
    });
  }, [isAuthenticated]);

  const syncExternalIds = useCallback((ids: number[]) => {
    setFavoriteIds(prev => {
      const merged = new Set([...prev, ...ids]);
      if (merged.size === prev.length) return prev;
      return Array.from(merged);
    });
  }, []);

  const contextValue = useMemo(() => ({ favoriteIds, favorites, isLoading, isFavorite, toggleFavorite, removeFavoriteById, refreshFavorites, syncExternalIds }), [favoriteIds, favorites, isLoading, isFavorite, toggleFavorite, removeFavoriteById, refreshFavorites, syncExternalIds]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
