import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grievance Redressal Policy | Nxcar",
  description: "Nxcar's grievance redressal policy. Learn how to raise and resolve complaints on our platform.",
};

export default function GrievancePolicy() {
  return (
    <div className="min-h-screen bg-[#0D1117] font-sans" data-testid="grievance-policy-page">
      <Navbar />
      <main className="pt-16 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" data-testid="heading-grievance-policy">Grievance Redressal Policy</h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-purpose">Purpose</h2>
              <p className="text-slate-300 leading-relaxed">
                This Grievance Redressal Policy aims to provide a clear, transparent, and timely mechanism for users (buyers, sellers, partners, and other stakeholders) of the Nxcar platform to raise concerns or complaints about any aspect of our products, services, or interactions.
              </p>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-scope">Scope</h2>
              <div className="text-slate-300 leading-relaxed space-y-2">
                <p>This policy applies to all:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Registered and unregistered buyers and sellers on Nxcar.in and our mobile app(Nxcar : Sell and Buy Used Cars and Nxcar Partners)</li>
                  <li>Users, dealers, and partner entities</li>
                  <li>Visitors to our website and social media channels</li>
                  <li>{"Employees, contractors, and third\u2011party service providers whose actions may give rise to grievances"}</li>
                </ul>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-definitions">Definitions</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <div>
                  <h3 className="text-white font-semibold mb-1">Grievance:</h3>
                  <p>{"Any expression of dissatisfaction or concern regarding Nxcar's services (e.g., listing quality, transaction support, loan facilitation, data privacy)."}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Complainant:</h3>
                  <p>An individual or entity raising a grievance under this policy.</p>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-redressal-team">Grievance Redressal Team</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-1">Grievance Officer:</h3>
                  <p>The primary point of contact responsible for logging, investigating, and resolving grievances.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Escalation Committee:</h3>
                  <p>{"A cross\u2011functional team (Operations, Compliance, Legal, Customer Support) that reviews unresolved or high\u2011severity cases."}</p>
                </div>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h3 className="text-white font-semibold mb-2">Grievance Officer Contact Details:</h3>
                  <ul className="space-y-2">
                    <li>
                      <span className="text-slate-400">Email:</span>{" "}
                      <a href="mailto:contact@nxcar.in" data-testid="link-contact-email" className="text-[#0EA9B2] hover:underline">contact@nxcar.in</a>
                    </li>
                    <li>
                      <span className="text-slate-400">Phone:</span>{" "}
                      <a href="tel:+919289213935" data-testid="link-contact-phone" className="text-[#0EA9B2] hover:underline">+91 9289213935</a>
                    </li>
                    <li>
                      <span className="text-slate-400">Postal Address:</span>{" "}
                      Nxfin Technologies Private Limited, 3rd Floor, Plot No. 809, Sector 42, Golf Course Road, Gurgaon Haryana, India 122009
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-principles">Guiding Principles</h2>
              <div className="text-slate-300 leading-relaxed">
                <ul className="space-y-3">
                  <li>
                    <span className="text-white font-semibold">Accessibility:</span> Multiple channels to lodge grievances (email, phone, web form, in-app support).
                  </li>
                  <li>
                    <span className="text-white font-semibold">Confidentiality:</span> {"Personal data and case details are protected; shared only on a need\u2011to\u2011know basis."}
                  </li>
                  <li>
                    <span className="text-white font-semibold">Impartiality:</span> Investigations are conducted without bias or conflict of interest.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Timeliness:</span> Acknowledgement within 2 business days; resolution communicated within 15 business days.
                  </li>
                  <li>
                    <span className="text-white font-semibold">No Retaliation:</span> Complainants will not face adverse actions for raising genuine concerns.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-lodgement-process">Grievance Lodgement Process</h2>
              <div className="text-slate-300 leading-relaxed">
                <ol className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">1</span>
                    <div><span className="text-white font-semibold">Submission</span> — Complainants can submit grievances via email, phone, or the website.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">2</span>
                    <div><span className="text-white font-semibold">Acknowledgement</span> — Grievance Officer logs the case, assigns a unique reference number, and acknowledges receipt within 7 business days.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">3</span>
                    <div><span className="text-white font-semibold">Preliminary Assessment</span> — Officer assesses scope and severity; assigns case for investigation or resolves directly if straightforward.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">4</span>
                    <div><span className="text-white font-semibold">Investigation</span> — Gather documentation, interview relevant parties (internal teams, dealers, customers).</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">5</span>
                    <div><span className="text-white font-semibold">Resolution Proposal</span> — Draft proposed corrective actions or compensatory measures.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">6</span>
                    <div><span className="text-white font-semibold">Decision & Communication</span> — Notify complainant of findings and actions within 30 business days of acknowledgement.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">7</span>
                    <div><span className="text-white font-semibold">Implementation & Closure</span> — Execute corrective measures; confirm closure with complainant and solicit feedback.</div>
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-escalation">Escalation & Appeals</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  If dissatisfied, complainants may escalate to the Escalation Committee by writing to-
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <ul className="space-y-1">
                    <li>Dinesh Kumar Sharma,</li>
                    <li>Nxfin Technologies Private Limited,</li>
                    <li>3rd Floor, Plot No. 809</li>
                    <li>Sector 42, Golf Course Road,</li>
                    <li>Gurgaon Haryana, India 122009</li>
                  </ul>
                </div>
                <p>The Committee will review and communicate its final decision within 10 business days of escalation.</p>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-policy-review">Policy Review</h2>
              <p className="text-slate-300 leading-relaxed">
                This policy is reviewed annually or upon significant changes in regulatory requirements, service offerings, or organizational structure.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
