'use client';

import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Wrench } from "lucide-react";

const servicesData = [
  { title: "Used Car Loan", desc: "Get competitive interest rates and quick approvals for your used car loan." },
  { title: "Car Insurance", desc: "Comprehensive insurance plans offering hassle-free coverage." },
  { title: "RC Transfer", desc: "Quick and hassle-free RC transfer service for smooth ownership transition." },
  { title: "Extended Warranty", desc: "Extended warranty plans to drive with peace of mind." },
  { title: "Car Inspection", desc: "Every car undergoes a thorough expert inspection." },
  { title: "RSA(Road Side Assistance)", desc: "24/7 roadside assistance ensuring help is always a call away." },
  { title: "Service History", desc: "Complete transparency with detailed service history." },
];

interface DealerServiceGridProps {
  servicesOffered: string[];
}

export function DealerServiceGrid({ servicesOffered }: DealerServiceGridProps) {
  const [showAll, setShowAll] = useState(false);

  const dealerServices = servicesOffered
    .map(s => servicesData.find(sd => sd.title.toLowerCase() === s.toLowerCase()))
    .filter(Boolean) as typeof servicesData;

  if (dealerServices.length === 0) return null;

  const visibleServices = showAll ? dealerServices : dealerServices.slice(0, 3);

  return (
    <section id="services" className="py-8 border-t border-border">
      <h2 className="text-xl font-bold text-foreground mb-4">
        <Wrench className="h-5 w-5 inline mr-2 text-muted-foreground" />
        Services Provided
      </h2>
      <div className="space-y-3">
        {visibleServices.map((service, i) => (
          <Card key={i} className="border-border overflow-hidden">
            <CardContent className="p-4 md:p-5 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-0.5 text-sm">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {dealerServices.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-primary hover:underline font-medium"
          data-testid="button-toggle-services"
        >
          {showAll ? "Show Less" : `View More Services (${dealerServices.length - 3})`}
        </button>
      )}
    </section>
  );
}
