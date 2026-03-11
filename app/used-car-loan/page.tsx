'use client';

import { useState } from "react";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { LoanHero } from "@components/used-car-loan/loan-hero";
import { LoanFeatures } from "@components/used-car-loan/loan-features";
import { LoanApplicationDialog } from "@components/used-car-loan/loan-application-dialog";

export default function UsedCarLoan() {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const handleApply = () => {
    setApplyDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
        <LoanHero onApply={handleApply} />
        <LoanFeatures onApply={handleApply} />
      </main>
      <Footer />
      <LoanApplicationDialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen} />
    </div>
  );
}
