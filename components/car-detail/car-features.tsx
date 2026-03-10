"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import {
  Sparkles,
  Check,
  Wrench,
  ChevronDown,
  Radio,
  Sofa,
  ExternalLink,
  Shield,
} from "lucide-react";

const categoryConfig: Record<string, { icon: any; color: string }> = {
  Safety: { icon: Shield, color: "text-red-500 bg-red-50 dark:bg-red-500/10" },
  Comfort: { icon: Sparkles, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
  Interior: { icon: Sofa, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
  Exterior: { icon: ExternalLink, color: "text-green-500 bg-green-50 dark:bg-green-500/10" },
  Entertainment: { icon: Radio, color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
};

interface CarFeaturesProps {
  groupedFeatures: Record<string, string[]>;
  totalCount: number;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function CarFeatures({ groupedFeatures, totalCount, expanded, onToggleExpanded }: CarFeaturesProps) {
  if (Object.keys(groupedFeatures).length === 0) return null;

  return (
    <Card data-testid="features-card">
      <CardHeader
        className="pb-3 cursor-pointer select-none"
        onClick={onToggleExpanded}
        data-testid="button-toggle-features-section"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-semibold">Features</h2>
          <Badge variant="secondary" className="ml-1">
            {totalCount}
          </Badge>
          <ChevronDown className={`ml-auto h-5 w-5 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {Object.entries(groupedFeatures).map(([category, features]) => {
            const config = categoryConfig[category] || {
              icon: Wrench,
              color: "text-muted-foreground bg-muted",
            };
            const CategoryIcon = config.icon;
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${config.color}`}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-sm font-semibold">
                    {category}
                  </h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-1.5 ml-8">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
