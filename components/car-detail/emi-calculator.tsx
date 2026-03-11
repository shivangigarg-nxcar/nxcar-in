"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Slider } from "@components/ui/slider";

export function EMICalculator({ carPrice }: { carPrice: number }) {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));

  useEffect(() => {
    setDownPayment(prev => Math.min(prev, carPrice));
  }, [carPrice]);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(36);
  const tenureOptions = [12, 24, 36, 48, 60];

  const loanAmount = Math.max(carPrice - downPayment, 0);

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(Math.min(value, carPrice));
  };

  const calculations = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure;
    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0, principal: 0 };
    }
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalAmount: Math.round(totalAmount), principal };
  }, [loanAmount, interestRate, tenure]);

  const principalPercent = calculations.totalAmount > 0 ? (calculations.principal / calculations.totalAmount) * 100 : 0;
  const circumference = 2 * Math.PI * 60;

  return (
    <Card className="overflow-hidden" data-testid="card-emi-calculator">
      <div className="h-1.5 bg-gradient-to-r from-primary/80 to-primary" />
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">Car Price</label>
                <span className="text-sm font-bold text-primary">₹{carPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-4">Loan & down payment are calculated based on this price</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Down Payment</label>
                <span className="text-sm font-bold text-primary" data-testid="text-emi-down-payment">₹{downPayment.toLocaleString('en-IN')}</span>
              </div>
              <Slider value={[downPayment]} min={0} max={carPrice} step={10000} onValueChange={([v]) => handleDownPaymentChange(v)} data-testid="slider-down-payment" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹0</span>
                <span>₹{carPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Loan Amount</label>
                <span className="text-sm font-bold text-primary" data-testid="text-emi-loan-amount">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${carPrice > 0 ? (loanAmount / carPrice) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{carPrice > 0 ? Math.round((loanAmount / carPrice) * 100) : 0}% of car price</span>
                <span>₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Interest Rate</label>
                <span className="text-sm font-bold text-primary" data-testid="text-emi-interest-rate">{interestRate}%</span>
              </div>
              <Slider value={[interestRate]} min={7} max={18} step={0.25} onValueChange={([v]) => setInterestRate(v)} data-testid="slider-interest-rate" />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Tenure (Months)</label>
              <div className="flex gap-2">
                {tenureOptions.map((t) => (
                  <button key={t} onClick={() => setTenure(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${tenure === t ? 'bg-primary text-white border-primary' : 'bg-muted/50 text-foreground border-border hover:border-primary/50'}`} data-testid={`button-tenure-${t}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="60" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/30" />
                <circle cx="75" cy="75" r="60" fill="none" stroke="currentColor" strokeWidth="12" className="text-primary" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * principalPercent) / 100} strokeLinecap="round" transform="rotate(-90 75 75)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Monthly EMI</span>
                <span className="text-xl font-bold" data-testid="text-emi-monthly">₹{calculations.emi.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Down Payment</p>
                <p className="text-sm font-bold">₹{downPayment.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                <p className="text-sm font-bold" data-testid="text-emi-principal">₹{calculations.principal.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                <p className="text-sm font-bold" data-testid="text-emi-total-interest">₹{calculations.totalInterest.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-primary/10 rounded-xl p-3 text-center w-full mt-4">
              <p className="text-xs text-muted-foreground mb-1">Total Amount Payable</p>
              <p className="text-lg font-bold text-primary" data-testid="text-emi-total-amount">₹{calculations.totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
