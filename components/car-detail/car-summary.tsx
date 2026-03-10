"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import {
  ClipboardCheck,
  Settings2,
  Ruler,
  Wrench,
  Activity,
} from "lucide-react";

interface DetailedSpec {
  name: string;
  value: string;
  category: string;
}

export const CarSummary = React.memo(function CarSummary({ detailedSpecs }: { detailedSpecs: DetailedSpec[] }) {
  const grouped: Record<string, { name: string; value: string }[]> = {};
  for (const s of detailedSpecs) {
    if (!s.value || s.value === '' || s.value === 'not available' || s.value === 'N/A') continue;
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push({ name: s.name, value: s.value });
  }

  const categoryIcons: Record<string, any> = {
    'General': Activity,
    'Engine and Transmission': Settings2,
    'Dimension and Capacity': Ruler,
    'Miscellaneous': Wrench,
  };
  const categoryColors: Record<string, string> = {
    'General': 'text-primary bg-primary/10',
    'Engine and Transmission': 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
    'Dimension and Capacity': 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
    'Miscellaneous': 'text-green-500 bg-green-50 dark:bg-green-500/10',
  };

  if (Object.keys(grouped).length === 0) return null;

  return (
    <Card data-testid="car-summary-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-semibold">Car Summary</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => {
            const IconComp = categoryIcons[category] || Wrench;
            const colorClass = categoryColors[category] || 'text-muted-foreground bg-muted';
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${colorClass}`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
