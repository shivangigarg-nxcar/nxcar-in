"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Slider } from "@components/ui/slider";
import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import Link from "next/link";

interface CarFinanceCalculatorProps {
  carPrice?: number;
  compact?: boolean;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

export function CarFinanceCalculator({ carPrice, compact = false }: CarFinanceCalculatorProps) {
  const defaultLoanAmount = carPrice || 500000;
  
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(36);
  const [downPayment, setDownPayment] = useState(carPrice ? Math.round(carPrice * 0.2) : 100000);

  const tenureOptions = [12, 24, 36, 48, 60];

  useEffect(() => {
    if (carPrice) {
      setLoanAmount(carPrice);
      setDownPayment(Math.round(carPrice * 0.2));
    }
  }, [carPrice]);

  const calculations = useMemo(() => {
    const principal = compact ? loanAmount : loanAmount - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure;

    if (principal <= 0 || monthlyRate <= 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0, principal: 0 };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principal: Math.round(principal),
    };
  }, [loanAmount, interestRate, tenure, downPayment, compact]);

  const principalPercentage = calculations.totalAmount > 0 
    ? (calculations.principal / calculations.totalAmount) * 100 
    : 0;
  const interestPercentage = calculations.totalAmount > 0 
    ? (calculations.totalInterest / calculations.totalAmount) * 100 
    : 0;

  const handleLoanAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    setLoanAmount(Math.min(numValue, 10000000));
  };

  const handleDownPaymentChange = (value: string) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    setDownPayment(Math.min(numValue, loanAmount - 10000));
  };

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-[#0EA9B2]" />
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
              <Input
                data-testid="input-loan-amount-compact"
                type="text"
                value={formatNumber(loanAmount)}
                onChange={(e) => handleLoanAmountChange(e.target.value)}
                className="h-8 text-sm pl-5 bg-muted/50 border-border"
              />
            </div>
            <Slider
              value={[loanAmount]}
              onValueChange={(v) => setLoanAmount(v[0])}
              min={100000}
              max={10000000}
              step={10000}
              className="[&_[role=slider]]:bg-[#0EA9B2] [&_[role=slider]]:border-[#0EA9B2] [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#0EA9B2]" />
              Interest Rate
            </label>
            <div className="h-8 flex items-center justify-center bg-muted/50 border border-border rounded-md text-sm font-semibold text-foreground">
              {interestRate}%
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={(v) => setInterestRate(v[0])}
              min={8.5}
              max={12}
              step={0.1}
              className="[&_[role=slider]]:bg-[#0EA9B2] [&_[role=slider]]:border-[#0EA9B2] [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Tenure</label>
          <div className="flex gap-1.5">
            {tenureOptions.map((months) => (
              <Button
                key={months}
                variant={tenure === months ? "default" : "outline"}
                size="sm"
                onClick={() => setTenure(months)}
                className={`flex-1 h-7 text-xs ${
                  tenure === months 
                    ? "bg-[#0EA9B2] text-white border-[#0EA9B2] hover:bg-[#0EA9B2]/90" 
                    : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {months}mo
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-border">
          <div className="text-center min-w-0">
            <div className="text-[10px] text-muted-foreground uppercase truncate">Monthly EMI</div>
            <div className="text-sm sm:text-base font-bold text-[#0EA9B2] truncate" data-testid="text-emi-compact">
              {formatCurrency(calculations.emi)}
            </div>
          </div>
          <div className="text-center min-w-0">
            <div className="text-[10px] text-muted-foreground uppercase truncate">Interest</div>
            <div className="text-sm sm:text-base font-bold text-blue-500 truncate">
              {formatCurrency(calculations.totalInterest)}
            </div>
          </div>
          <div className="text-center min-w-0">
            <div className="text-[10px] text-muted-foreground uppercase truncate">Total</div>
            <div className="text-sm sm:text-base font-bold text-foreground truncate">
              {formatCurrency(calculations.totalAmount)}
            </div>
          </div>
        </div>

        <Link href="/used-car-loan">
          <Button
            data-testid="button-apply-compact"
            className="w-full h-9 bg-[#0EA9B2] hover:bg-[#0EA9B2]/90 text-white font-semibold text-sm"
          >
            Apply for Loan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-[#0D1117] border-[#0EA9B2]/30 overflow-hidden">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-[#0EA9B2]/20 rounded-lg">
              <Calculator className="h-5 w-5 text-[#0EA9B2]" />
            </div>
            <span className="font-heading font-bold text-xl">EMI Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-[#0EA9B2]" />
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <Input
                    data-testid="input-loan-amount"
                    type="text"
                    value={formatNumber(loanAmount)}
                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                    className="w-36 pl-7 bg-white/5 border-white/10 text-white text-right"
                  />
                </div>
              </div>
              <Slider
                data-testid="slider-loan-amount"
                value={[loanAmount]}
                onValueChange={(v) => setLoanAmount(v[0])}
                min={100000}
                max={10000000}
                step={10000}
                className="[&_[role=slider]]:bg-[#0EA9B2] [&_[role=slider]]:border-[#0EA9B2] [&_.bg-primary]:bg-[#0EA9B2]"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>₹1 Lakh</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-[#0EA9B2]" />
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <Input
                    data-testid="input-down-payment"
                    type="text"
                    value={formatNumber(downPayment)}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="w-36 pl-7 bg-white/5 border-white/10 text-white text-right"
                  />
                </div>
              </div>
              <Slider
                data-testid="slider-down-payment"
                value={[downPayment]}
                onValueChange={(v) => setDownPayment(v[0])}
                min={0}
                max={loanAmount * 0.9}
                step={5000}
                className="[&_[role=slider]]:bg-[#0EA9B2] [&_[role=slider]]:border-[#0EA9B2] [&_.bg-primary]:bg-[#0EA9B2]"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>₹0</span>
                <span>{formatCurrency(loanAmount * 0.9)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#0EA9B2]" />
                  Interest Rate (p.a.)
                </label>
                <span className="text-white font-bold bg-[#0EA9B2]/20 px-3 py-1 rounded-lg">{interestRate}%</span>
              </div>
              <Slider
                data-testid="slider-interest-rate"
                value={[interestRate]}
                onValueChange={(v) => setInterestRate(v[0])}
                min={8.5}
                max={12}
                step={0.1}
                className="[&_[role=slider]]:bg-[#0EA9B2] [&_[role=slider]]:border-[#0EA9B2] [&_.bg-primary]:bg-[#0EA9B2]"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>8.5%</span>
                <span>12%</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#0EA9B2]" />
                Loan Tenure
              </label>
              <div className="flex gap-1.5 sm:gap-2">
                {tenureOptions.map((months) => (
                  <Button
                    key={months}
                    data-testid={`button-tenure-${months}`}
                    variant={tenure === months ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTenure(months)}
                    className={`flex-1 px-1 sm:px-3 text-xs sm:text-sm ${
                      tenure === months 
                        ? "bg-[#0EA9B2] text-white border-[#0EA9B2] hover:bg-[#0EA9B2]/90" 
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {months}mo
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={calculations.emi}
                className="bg-gradient-to-br from-[#0EA9B2]/20 to-[#0EA9B2]/5 rounded-xl p-4 border border-[#0EA9B2]/30 text-center"
              >
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly EMI</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0EA9B2]" data-testid="text-monthly-emi">
                  {formatCurrency(calculations.emi)}
                </div>
              </motion.div>
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Interest</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-400" data-testid="text-total-interest">
                  {formatCurrency(calculations.totalInterest)}
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-400">Total Amount Payable</span>
                <span className="text-xl font-bold text-white" data-testid="text-total-amount">
                  {formatCurrency(calculations.totalAmount)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${principalPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-[#0EA9B2]"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${interestPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-blue-400"
                  />
                </div>
                
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#0EA9B2] rounded-full" />
                    <span className="text-slate-400">Principal: {formatCurrency(calculations.principal)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    <span className="text-slate-400">Interest: {formatCurrency(calculations.totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#0EA9B2"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ 
                    strokeDasharray: `${(principalPercentage / 100) * 251.2} 251.2` 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ 
                    strokeDasharray: "0 251.2",
                    strokeDashoffset: 0 
                  }}
                  animate={{ 
                    strokeDasharray: `${(interestPercentage / 100) * 251.2} 251.2`,
                    strokeDashoffset: `${-(principalPercentage / 100) * 251.2}`
                  }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs text-slate-400">EMI</div>
                <div className="text-lg font-bold text-white">{formatCurrency(calculations.emi)}</div>
              </div>
            </div>

            <Link href="/used-car-loan">
              <Button
                data-testid="button-apply-now"
                className="w-full bg-[#0EA9B2] hover:bg-[#0EA9B2]/90 text-white font-bold py-3"
                size="lg"
              >
                Apply for Loan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
