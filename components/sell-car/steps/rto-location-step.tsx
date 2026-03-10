"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@components/ui/input";
import { Search, CheckCircle2, Loader2, ChevronDown, MapPin, Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SellStepsProps } from "../sell-steps";

interface NxcarState {
  state_id: string;
  state_name: string;
}

interface NxcarRto {
  rto_id: string;
  state_code: string;
  rto_number: string;
  rto_location: string;
}

type Props = Pick<SellStepsProps, "formData" | "updateField" | "autoFilledSteps">;

export function RtoLocationStep({ formData, updateField, autoFilledSteps }: Props) {
  const [stateSearch, setStateSearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(true);
  const [rtoSearch, setRtoSearch] = useState("");
  const [rtoDropdownOpen, setRtoDropdownOpen] = useState(true);

  const { data: nxcarStates = [], isLoading: statesLoading } = useQuery<NxcarState[]>({
    queryKey: ["nxcar-states"],
    queryFn: async () => {
      const res = await fetch("/api/nxcar/states");
      if (!res.ok) throw new Error("Failed to fetch states");
      return res.json();
    },
    staleTime: 3600000,
  });

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return nxcarStates;
    const q = stateSearch.toLowerCase();
    return nxcarStates.filter((s) => s.state_name.toLowerCase().includes(q));
  }, [nxcarStates, stateSearch]);

  const selectedStateId = useMemo(() => {
    const found = nxcarStates.find((s) => s.state_name === formData.state);
    return found?.state_id || "";
  }, [nxcarStates, formData.state]);

  const { data: nxcarRtos = [], isLoading: rtosLoading } = useQuery<NxcarRto[]>({
    queryKey: ["nxcar-rtos", selectedStateId],
    queryFn: async () => {
      const res = await fetch(`/api/nxcar/rto?state_id=${selectedStateId}`);
      if (!res.ok) throw new Error("Failed to fetch RTOs");
      return res.json();
    },
    staleTime: 3600000,
    enabled: !!selectedStateId,
  });

  const filteredRtos = useMemo(() => {
    if (!rtoSearch.trim()) return nxcarRtos;
    const q = rtoSearch.toLowerCase();
    return nxcarRtos.filter((r) =>
      r.rto_location.toLowerCase().includes(q) ||
      `${r.state_code}${r.rto_number}`.toLowerCase().includes(q)
    );
  }, [nxcarRtos, rtoSearch]);

  return (
    <div className="space-y-6">
      {autoFilledSteps.current.has("rto-location") && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Auto-filled: {formData.state} — {formData.rtoCode}</span>
        </div>
      )}
      <div>
        <p className="text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Select State</p>
        <div className="relative mb-3 cursor-pointer" onClick={() => { if (!stateDropdownOpen) { setStateDropdownOpen(true); setStateSearch(""); } }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            data-testid="input-state-search"
            value={stateDropdownOpen ? stateSearch : formData.state || ""}
            onChange={(e) => { setStateSearch(e.target.value); if (!stateDropdownOpen) setStateDropdownOpen(true); }}
            onFocus={() => { if (!stateDropdownOpen) { setStateDropdownOpen(true); setStateSearch(""); } }}
            placeholder={formData.state || "Search state..."}
            readOnly={!stateDropdownOpen}
            className={`h-14 pl-12 pr-10 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!stateDropdownOpen ? "cursor-pointer" : ""}`}
          />
          <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${stateDropdownOpen ? "rotate-180" : ""}`} />
        </div>
        {stateDropdownOpen && (
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
            {statesLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
            ) : filteredStates.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No states found</p>
            ) : (
              filteredStates.map((s) => (
                <button
                  key={s.state_id}
                  type="button"
                  data-testid={`state-${s.state_id}`}
                  onClick={() => { updateField("state", s.state_name); updateField("rtoCode", ""); setStateSearch(""); setStateDropdownOpen(false); setRtoSearch(""); setRtoDropdownOpen(true); }}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                    formData.state === s.state_name ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="font-medium">{s.state_name}</span>
                  {formData.state === s.state_name && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {formData.state && (
        <div>
          <p className="text-muted-foreground mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-primary" /> Select RTO</p>
          <div className="relative mb-3 cursor-pointer" onClick={() => { if (!rtoDropdownOpen) { setRtoDropdownOpen(true); setRtoSearch(""); } }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              data-testid="input-rto-search"
              value={rtoDropdownOpen ? rtoSearch : formData.rtoCode || ""}
              onChange={(e) => { setRtoSearch(e.target.value); if (!rtoDropdownOpen) setRtoDropdownOpen(true); }}
              onFocus={() => { if (!rtoDropdownOpen) { setRtoDropdownOpen(true); setRtoSearch(""); } }}
              placeholder={formData.rtoCode || "Search RTO code or location..."}
              readOnly={!rtoDropdownOpen}
              className={`h-14 pl-12 pr-10 text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl text-foreground ${!rtoDropdownOpen ? "cursor-pointer" : ""}`}
            />
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-transform ${rtoDropdownOpen ? "rotate-180" : ""}`} />
          </div>
          {rtoDropdownOpen && (
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
              {rtosLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
              ) : filteredRtos.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No RTOs found</p>
              ) : (
                filteredRtos.map((r) => {
                  const code = `${r.state_code}${r.rto_number}`;
                  return (
                    <button
                      key={r.rto_id}
                      type="button"
                      data-testid={`rto-${r.rto_id}`}
                      onClick={() => { updateField("rtoCode", code); setRtoSearch(""); setRtoDropdownOpen(false); }}
                      className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                        formData.rtoCode === code ? "border-primary bg-primary/20 text-primary" : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="text-left">
                        <span className="font-bold text-sm">{code}</span>
                        <span className="text-xs text-muted-foreground ml-2">{r.rto_location}</span>
                      </div>
                      {formData.rtoCode === code && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
