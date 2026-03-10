import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nxcar",
  description: "Read Nxcar's terms and conditions for using our used car marketplace platform.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0D1117] font-sans">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" data-testid="heading-terms">Terms & Conditions</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-acceptance">01. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing or using the Nxcar platform (website and mobile application), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users of the platform, including buyers, sellers, dealers, and visitors.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-services">02. Services Offered</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>Nxcar provides a platform for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Buying and selling pre-owned/used vehicles</li>
                  <li>Vehicle valuation services</li>
                  <li>Car loan facilitation through partner financial institutions</li>
                  <li>Vehicle insurance services</li>
                  <li>Pre-delivery inspection (PDI) reports</li>
                  <li>RC transfer and documentation assistance</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-eligibility">03. User Eligibility</h2>
              <p className="text-slate-300 leading-relaxed">
                You must be at least 18 years old and legally capable of entering into contracts to use our services. By using the platform, you represent that you meet these requirements and that all information you provide is accurate and complete.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-account">04. Account Registration</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>To access certain features, you may need to create an account. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-vehicle-listings">05. Vehicle Listings</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>When listing a vehicle for sale:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must be the legal owner or authorized to sell the vehicle</li>
                  <li>All information provided must be accurate and complete</li>
                  <li>The vehicle must not be stolen, encumbered, or have pending legal issues</li>
                  <li>Nxcar reserves the right to remove any listing that violates these terms</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-transactions">06. Transactions and Payments</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  Nxcar facilitates transactions between buyers and sellers but is not a party to the sale agreement. All vehicle purchases are subject to inspection and verification. Payment processing is handled securely through our platform or partner payment gateways.
                </p>
                <p>
                  Any disputes arising from transactions should be reported to Nxcar within 7 days of the transaction date for resolution assistance.
                </p>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-inspection">07. Inspection and Verification</h2>
              <p className="text-slate-300 leading-relaxed">
                Nxcar provides vehicle inspection services to verify the condition of listed vehicles. While we strive for accuracy, the inspection report is based on the visible condition at the time of inspection and should not be considered a warranty or guarantee of the vehicle's overall condition.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-liability">08. Limitation of Liability</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>Nxcar shall not be liable for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any direct, indirect, incidental, or consequential damages arising from platform use</li>
                  <li>Losses resulting from unauthorized access to your account</li>
                  <li>Vehicle defects not discovered during inspection</li>
                  <li>Disputes between buyers and sellers</li>
                  <li>Third-party service provider actions</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-prohibited">09. Prohibited Activities</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>Users are prohibited from:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing false or misleading information</li>
                  <li>Listing stolen or legally encumbered vehicles</li>
                  <li>Attempting to circumvent platform fees or processes</li>
                  <li>Harassing or threatening other users</li>
                  <li>Using the platform for illegal activities</li>
                  <li>Scraping or harvesting data from the platform</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-ip">10. Intellectual Property</h2>
              <p className="text-slate-300 leading-relaxed">
                All content on the Nxcar platform, including logos, text, graphics, and software, is the property of Nxfin Technologies Private Limited and is protected by applicable intellectual property laws. Users may not reproduce, distribute, or create derivative works without prior written consent.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-termination">11. Termination</h2>
              <p className="text-slate-300 leading-relaxed">
                Nxcar reserves the right to suspend or terminate your account and access to our services at any time, with or without cause, and without prior notice. Upon termination, your right to use the platform ceases immediately.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-governing-law">12. Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-modifications">13. Modifications</h2>
              <p className="text-slate-300 leading-relaxed">
                Nxcar reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the platform after modifications constitutes acceptance of the updated terms.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-contact">14. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                For questions or concerns regarding these Terms and Conditions, please contact us at{" "}
                <a 
                  href="mailto:contact@nxcar.in" 
                  data-testid="link-contact-email"
                  className="text-[#0EA9B2] hover:underline"
                >
                  contact@nxcar.in
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
