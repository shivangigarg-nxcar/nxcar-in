'use client';

import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { PartnerHero } from "@components/partner/partner-hero";
import { PartnerBenefits } from "@components/partner/partner-benefits";
import { PartnerRegistrationForm } from "@components/partner/partner-registration-form";

export default function Partner() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E14] overflow-x-hidden" data-testid="partner-page">
      <Navbar />
      <main className="pt-14">
        <PartnerHero />
        <PartnerBenefits />
        <PartnerRegistrationForm />
      </main>
      <Footer />
    </div>
  );
}
