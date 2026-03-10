"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const storedState = typeof window !== 'undefined' ? localStorage.getItem('authState') : null;
  if (storedState) {
    try {
      const parsed = JSON.parse(storedState);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (!parsed.token || !parsed.loginTime || (Date.now() - parsed.loginTime >= sevenDays)) {
        localStorage.removeItem('authState');
        localStorage.removeItem('nxcar_user_id');
        localStorage.removeItem('nxcar_role_id');
        return null;
      }
    } catch {
      localStorage.removeItem('authState');
      localStorage.removeItem('nxcar_user_id');
      localStorage.removeItem('nxcar_role_id');
      return null;
    }
  }

  const response = await fetch("/api/auth/user", {
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authState');
      localStorage.removeItem('nxcar_user_id');
      localStorage.removeItem('nxcar_role_id');
    }
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.user || data;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const [roleId, setRoleId] = useState<string | null>(null);

  useEffect(() => {
    if ((user as any)?.role_id) {
      setRoleId(String((user as any).role_id));
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nxcar_role_id');
      setRoleId(stored);
    }
  }, [user]);

  const isDealer = roleId === '2';

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      return res.json();
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
        localStorage.removeItem('nxcar_user_id');
        localStorage.removeItem('nxcar_role_id');
        localStorage.removeItem('dealer_access_token');
      }
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/";
    },
    onError: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
        localStorage.removeItem('nxcar_user_id');
        localStorage.removeItem('nxcar_role_id');
        localStorage.removeItem('dealer_access_token');
      }
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/";
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isDealer,
    roleId,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
