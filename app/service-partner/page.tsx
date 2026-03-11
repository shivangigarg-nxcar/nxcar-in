import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Partners | Nxcar",
  description: "Our trusted financial services partners - banks and NBFCs that help you access car financing.",
};

const bankingPartners = [
  "RBL Bank",
  "Kotak Mahindra Bank",
  "Equitas Small Finance Bank",
  "Axis Bank",
  "AU Small Finance Bank",
];

const nbfcPartners = [
  "Tata Capital",
  "Equitas",
  "Fortune eConnect",
  "SK Finance",
  "Piramal",
  "Kogta Finance",
  "Mahindra and Mahindra Financial Services Ltd",
  "Indostar Capital Finance Ltd",
  "Hinduja Leyland Finance Ltd",
  "MAS Finance Ltd",
  "HDB Financial Services Ltd",
];

export default function ServicePartner() {
  return (
    <div className="min-h-screen bg-[#0D1117] font-sans" data-testid="service-partner-page">
      <Navbar />
      <main className="pt-16 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" data-testid="heading-service-partners">Our Trusted Financial Services Partners</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <p className="text-slate-300 leading-relaxed">
                At Nxcar, we strive to make car buying and selling seamless by connecting our users with trusted financial institutions that provide car loans and other financing options. We do not directly offer financial services; instead, we facilitate financing through our regulated partners.
              </p>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-financial-partners">Our Financial Services Partners</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                We work with the following Reserve Bank of India (RBI) regulated banks and Non-Banking Financial Companies (NBFCs) to help you access car financing:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3" data-testid="heading-banking-partners">Banking Partners</h3>
                  <p className="text-slate-400 text-sm mb-3">These are regulated Scheduled Commercial Banks authorized by the RBI:</p>
                  <ul className="space-y-2">
                    {bankingPartners.map((partner) => (
                      <li key={partner} className="text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0EA9B2] flex-shrink-0" />
                        {partner}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3" data-testid="heading-nbfc-partners">Non-Banking Financial Company (NBFC) Partners</h3>
                  <p className="text-slate-400 text-sm mb-3">These RBI-registered NBFCs specialize in vehicle financing and consumer lending:</p>
                  <ul className="space-y-2">
                    {nbfcPartners.map((partner) => (
                      <li key={partner} className="text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0EA9B2] flex-shrink-0" />
                        {partner}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-regulatory">Regulatory Information</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>All our financial service providers are regulated under the Reserve Bank of India (RBI) and comply with applicable financial and lending regulations in India. Each of these institutions holds the necessary licenses and approvals to operate in the lending and financial services sector.</p>
                <p>{"For further details on their regulatory status, you can visit the RBI's official website to verify NBFC registrations."}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
