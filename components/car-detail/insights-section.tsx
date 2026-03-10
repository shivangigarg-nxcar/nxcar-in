"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Zap } from "lucide-react";

interface InsightsSectionProps {
  insights: { heading: string; body: string }[];
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  if (!insights?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="font-semibold">AI Insights</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{insight.heading}</p>
              <p className="text-sm text-muted-foreground">{insight.body}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
