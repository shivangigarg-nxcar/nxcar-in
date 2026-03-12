import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
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
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-introduction">Introduction</h2>
              <p className="text-slate-300 leading-relaxed">
                {"At Nxfin('Nxcar', 'NXFIN TECHNOLOGIES PRIVATE LIMITED', 'we', 'us', or 'our' ), we are committed to protecting the privacy and confidentiality of personal information entrusted to us by our users, clients, employees, partners, and other stakeholders. This Privacy Policy outlines our practices concerning the collection, use, disclosure, retention, and protection of personal information in accordance with best industry practices and regulatory requirements."}
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-scope">Scope</h2>
              <p className="text-slate-300 leading-relaxed">
                This Privacy Policy applies to all personal information collected, processed, stored, or transmitted by Nxfin in the course of conducting business operations. It applies to all employees, contractors, consultants, temporary workers, and third-party vendors who handle personal information on behalf of Nxfin.
              </p>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-collection">Personal Information Collection and Use</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Types of Information:</h3>
                  <p className="mb-2">Nxfin collects and processes personal information necessary for providing financial services, managing client accounts, and conducting business operations. This may include:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Contact information (e.g., name, address, email, phone number)</li>
                    <li>Financial information (e.g., bank account details, transaction history, Credit Information)</li>
                    <li>Identification information (e.g., ID numbers, passport details)</li>
                    <li>Employment information (e.g., job title, company affiliation)</li>
                    <li>Photos, Files and Docs</li>
                    <li>Application Data (e.g., Geolocation Information, Mobile Device Data)</li>
                    <li>information through cookies and similar technologies (e.g., Device Data, Location Data, Crash logs, Diagnostics Data)</li>
                    <li>Other (May collect limited data from public databases, marketing partners, and other outside sources)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Purpose of Collection:</h3>
                  <p className="mb-2">Personal information is collected for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Providing Used car options</li>
                    <li>Providing recommendations for financial services and loan products</li>
                    <li>Managing client relationships and accounts</li>
                    <li>Complying with legal and regulatory requirements</li>
                    <li>Communicating with clients and stakeholders</li>
                    <li>Improving our services and customer experience</li>
                    <li>Uploaded by users in order to use various mobile application functionalities</li>
                    <li>Derived Insights for Marketing</li>
                    <li>User Analytics, Performance Metrics, Analyze, Usage patterns, Derive User Profiles</li>
                    <li>Push Notifications regarding your account or certain features of the application(s)</li>
                    <li>Facilitate account creation and authentication and otherwise manage user accounts</li>
                    <li>Deliver and facilitate delivery of services to the user</li>
                    <li>Respond to user inquiries/offer support to users</li>
                    <li>Send administrative information to users</li>
                    <li>Fulfil and manage customer orders</li>
                    <li>Marketing and promotional communications</li>
                    <li>To protect our Services</li>
                    <li>Evaluate and improve our Services, products, marketing, and user experience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Legal Basis:</h3>
                  <p>Nxfin collects and processes personal information based on legitimate interests, contractual necessity, compliance with legal obligations, and consent when applicable.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-retention">Data Retention and Storage</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Retention Period:</h3>
                  <p>Nxfin retains personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law or regulatory obligations. Specifically, credit information obtained from credit bureaus is stored for 6 months. If this information needs to be retained for more than six months, renewed consent from the individual will be obtained.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Data Security:</h3>
                  <p>Nxfin implements technical, administrative, and physical security measures to protect personal information from unauthorised access, misuse, alteration, or destruction. These measures include encryption, access controls, regular security assessments, and staff training.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-sharing">Sharing and Disclosure</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Third-Party Service Providers:</h3>
                  <p className="mb-2">Nxfin may share personal information with trusted third-party service providers who assist in delivering services, managing operations, or conducting business activities on our behalf including Cloud Computing Services, Communication & Collaboration Tools, Data Analytics Services, Data Storage Service Providers, Payment Processors, Product Engineering & Design Tools, Sales & Marketing Tools, Social Networks, User Account Registration & Authentication Services, Website Hosting Service Providers.</p>
                  <p>We also may need to share your personal information in the following situations:</p>
                  <p>Business Transfers, Google Maps Platform APIs (e.g. Geocoding API), Business/Financial Partners.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Legal Requirements:</h3>
                  <p>{"Nxfin may disclose personal information when required by law, legal proceedings, or governmental requests, or to protect the rights, property, or safety of Nxfin, its clients, employees, or others."}</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-rights">Individual Rights</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Access and Correction:</h3>
                  <p>Individuals have the right to access their personal information held by Nxfin and request corrections or updates if inaccuracies are identified.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Withdrawal of Consent:</h3>
                  <p>Where consent is the legal basis for processing personal information, individuals have the right to withdraw consent at any time, subject to legal or contractual restrictions.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Account Information:</h3>
                  <p>Review or change the information in your account or terminate your account. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-marketing">Marketing Communications</h2>
              <div className="text-slate-300 leading-relaxed">
                <h3 className="text-white font-semibold mb-2">Opt-Out:</h3>
                <p>Individuals may opt out of receiving marketing communications from Nxfin by following the instructions provided in the communication or contacting Nxfin directly.</p>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-compliance">Compliance and Accountability</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Regulatory Compliance:</h3>
                  <p>{"Nxfin adheres to applicable data protection laws, regulations, and industry standards governing the collection, use, and disclosure of personal information."}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Accountability:</h3>
                  <p>Nxfin maintains internal policies, procedures, and training programs to ensure compliance with this Privacy Policy and to handle inquiries, complaints, and requests regarding personal information.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-review">Policy Review and Updates</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Policy Review:</h3>
                  <p>{"Nxfin reviews and updates this Privacy Policy periodically to reflect changes in business practices, regulatory requirements, and industry standards."}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Notification:</h3>
                  <p>{"Material changes to this Privacy Policy will be communicated to affected individuals through appropriate channels or by posting updates on Nxfin's website."}</p>
                </div>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-contact">Contact Information</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  {"For questions, concerns, or requests related to this Privacy Policy or Nxfin's handling of personal information, individuals may contact Nxfin's Privacy Officer at "}
                  <a href="mailto:contact@nxcar.in" data-testid="link-contact-email" className="text-[#0EA9B2] hover:underline">contact@nxcar.in</a>
                </p>
                <p>Contact us by post at the address given at <a href="https://nxcar.in/contact-us" className="text-[#0EA9B2] hover:underline">https://nxcar.in/contact-us</a>, or by filling in a online form by following these steps-</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Enter your Name</li>
                  <li>Enter the mobile number registered with us for existing users and the Mobile number used while signing up for new users</li>
                  <li>{"Subject- Inquiry Regarding [Specific Aspect] of Nxcar's Privacy Policy"}</li>
                  <li>Enter a Detailed description in enter enquiry input field</li>
                  <li>Submit</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-data-review">Review, Update, Or Delete The Data We Collect</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>To request to review, update, or delete your personal information/account, please fill out and submit a request at <a href="https://nxcar.in/contact-us" className="text-[#0EA9B2] hover:underline">https://nxcar.in/contact-us</a>. Follow these steps-</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Enter your Name</li>
                  <li>Enter the mobile number registered with us for existing users and the Mobile number used while signing up for new users</li>
                  <li>Subject- Inquiry Regarding [Specific Aspect] of Data Collection</li>
                  <li>Enter a Detailed description in enter enquiry input field</li>
                  <li>Submit</li>
                </ul>
                <div className="mt-4">
                  <h3 className="text-white font-semibold mb-2">To Withdraw Consent for Credit Information Data -</h3>
                  <p className="mb-2">To withdraw consent for writing an email to <a href="mailto:contact@nxcar.in" className="text-[#0EA9B2] hover:underline">contact@nxcar.in</a></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Enter your Name</li>
                    <li>Enter the mobile number registered with us</li>
                    <li>Subject- Request to withdraw consent for credit information data</li>
                    <li>Enter a description in the body</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
