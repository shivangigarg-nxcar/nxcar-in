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
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" data-testid="heading-grievance-policy">Grievance Redressal Policy</h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-purpose">01. Purpose</h2>
              <p className="text-slate-300 leading-relaxed">
                This Grievance Redressal Policy aims to provide a clear, transparent, and timely mechanism for users (buyers, sellers, partners, and other stakeholders) of the Nxcar platform to raise concerns or complaints about any aspect of our products, services, or interactions.
              </p>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-scope">02. Scope</h2>
              <div className="text-slate-300 leading-relaxed space-y-2">
                <p>This policy applies to all:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Registered and unregistered buyers and sellers on Nxcar.in and our mobile app</li>
                  <li>Users, dealers, and partner entities</li>
                  <li>Visitors to our website and social media channels</li>
                  <li>Employees, contractors, and third‑party service providers whose actions may give rise to grievances</li>
                </ul>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-definitions">03. Definitions</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <div>
                  <h3 className="text-white font-semibold mb-1">Grievance</h3>
                  <p>Any expression of dissatisfaction or concern regarding Nxcar's services.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Complainant</h3>
                  <p>An individual or entity raising a grievance.</p>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-redressal-team">04. Grievance Redressal Team</h2>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-1">Grievance Officer</h3>
                  <p>The primary point of contact for all grievances raised on the platform.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Escalation Committee</h3>
                  <p>A cross‑functional team comprising members from Operations, Compliance, Legal, and Customer Support.</p>
                </div>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h3 className="text-white font-semibold mb-2">Contact Details</h3>
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
                      <span className="text-slate-400">Address:</span>{" "}
                      Nxfin Technologies Private Limited, 3rd Floor, Plot No. 809, Sector 42, Golf Course Road, Gurgaon Haryana, India 122009
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-principles">05. Guiding Principles</h2>
              <div className="text-slate-300 leading-relaxed">
                <ul className="space-y-3">
                  <li>
                    <span className="text-white font-semibold">Accessibility:</span> Easy-to-use channels for lodging grievances.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Confidentiality:</span> All grievance details are handled with strict confidentiality.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Impartiality:</span> Grievances are assessed objectively without bias.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Timeliness:</span> Acknowledgement within 2 business days; resolution within 15 business days.
                  </li>
                  <li>
                    <span className="text-white font-semibold">No Retaliation:</span> No adverse action will be taken against any individual for raising a grievance in good faith.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-lodgement-process">06. Grievance Lodgement Process</h2>
              <div className="text-slate-300 leading-relaxed">
                <ol className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">1</span>
                    <div><span className="text-white font-semibold">Submission</span> — The complainant submits a grievance via email, phone, or the website.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">2</span>
                    <div><span className="text-white font-semibold">Acknowledgement</span> — The grievance is acknowledged within 7 business days with a unique reference number.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">3</span>
                    <div><span className="text-white font-semibold">Preliminary Assessment</span> — The Grievance Officer reviews the complaint to determine its nature and urgency.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">4</span>
                    <div><span className="text-white font-semibold">Investigation</span> — Relevant teams investigate the grievance thoroughly.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">5</span>
                    <div><span className="text-white font-semibold">Resolution Proposal</span> — A resolution is proposed to the complainant.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">6</span>
                    <div><span className="text-white font-semibold">Decision & Communication</span> — Final decision is communicated within 30 business days of receipt.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0EA9B2]/20 text-[#0EA9B2] flex items-center justify-center text-sm font-bold">7</span>
                    <div><span className="text-white font-semibold">Implementation & Closure</span> — The agreed resolution is implemented and the grievance is formally closed.</div>
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-escalation">07. Escalation & Appeals</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  If a complainant is not satisfied with the resolution, they may escalate the matter to the Escalation Committee. The committee will review the case within 10 business days.
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h3 className="text-white font-semibold mb-2">Escalation Contact</h3>
                  <ul className="space-y-2">
                    <li>
                      <span className="text-slate-400">Name:</span> Dinesh Kumar Sharma
                    </li>
                    <li>
                      <span className="text-slate-400">Address:</span> Nxfin Technologies Private Limited, 3rd Floor, Plot No. 809, Sector 42, Golf Course Road, Gurgaon Haryana, India 122009
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4" data-testid="heading-policy-review">08. Policy Review</h2>
              <p className="text-slate-300 leading-relaxed">
                This Grievance Redressal Policy is reviewed annually or upon significant regulatory or operational changes to ensure its continued effectiveness and relevance.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
