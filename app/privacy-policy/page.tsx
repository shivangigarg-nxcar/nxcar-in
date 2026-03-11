import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nxcar",
  description: "Read Nxcar's privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0D1117] font-sans">
      <Navbar />
      <main className="pt-16 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" data-testid="heading-privacy-policy">Privacy Policy</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-introduction">01. Introduction</h2>
              <p className="text-slate-300 leading-relaxed">
                At Nxfin ('Nxcar', 'NXFIN TECHNOLOGIES PRIVATE LIMITED', 'we', 'us', or 'our'), we are committed to protecting the privacy and confidentiality of personal information entrusted to us by our users, clients, employees, partners, and other stakeholders. This Privacy Policy outlines our practices concerning the collection, use, disclosure, retention, and protection of personal information in accordance with best industry practices and regulatory requirements.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-scope">02. Scope</h2>
              <p className="text-slate-300 leading-relaxed">
                This Privacy Policy applies to all personal information collected, processed, stored, or transmitted by Nxfin in the course of conducting business operations.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-collection">03. Personal Information Collection and Use</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Types of Information</h3>
                  <p>Contact information, Financial information, Identification information, Employment information, Photos, Files and Docs, Application Data, information through cookies and similar technologies.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Purpose</h3>
                  <p>Providing Used car options, financial services, managing client relationships, complying with legal requirements, communicating with clients, improving services.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-retention">04. Data Retention and Storage</h2>
              <p className="text-slate-300 leading-relaxed">
                Nxfin retains personal information only for as long as necessary. Credit information is stored for 6 months.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-sharing">05. Sharing and Disclosure</h2>
              <p className="text-slate-300 leading-relaxed">
                May share with trusted third-party service providers for business operations.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-rights">06. Individual Rights</h2>
              <p className="text-slate-300 leading-relaxed">
                Access and Correction rights, Withdrawal of Consent, Account Information management.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-marketing">07. Marketing Communications</h2>
              <p className="text-slate-300 leading-relaxed">
                Individuals may opt out of receiving marketing communications.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-contact">08. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                For questions, contact Nxfin at{" "}
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
