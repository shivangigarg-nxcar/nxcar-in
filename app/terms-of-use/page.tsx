import Link from "next/link";
import { Navbar } from "@components/navbar";
import { Footer } from "@components/footer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Read Nxcar's terms of use for using our used car marketplace platform.",
};

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-[#0D1117] font-sans">
      <Navbar />
      <main className="pt-16 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/" data-testid="link-back-home" className="inline-flex items-center gap-2 text-[#0EA9B2] hover:text-[#0EA9B2]/80 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8" data-testid="heading-terms">Terms Of Use</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <p className="text-slate-300 leading-relaxed">
                {"The terms and conditions contained herein (\"T&C\") contain the complete terms and conditions that apply to a User and govern the User's access to and use of the Service (as defined below) . However, it is made clear that some of the Services may require the User to agree to additional terms and conditions. Unless otherwise provided, those additional terms shall be deemed to be incorporated into the T&C."}
              </p>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">1. Acceptance Of Terms</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) By (i) using the Platform or availing the Services provided through the Platform in any way; or (ii) browsing the Platform, the user is deemed to have read, understood and accepted the T&C as well as the privacy policy which is available on the Platform.</p>
                <p>(b) The user acknowledges that by accessing and using the Platform and availing any of the Services, it agrees to be bound by the T&Cs. The T&C establishes a relationship between the company and the user, whereby the user shall act in the capacity as may be mutually agreed between the user and company.</p>
                <p>(c) In the event the user is not agreeable to the T&C, it shall not access the Platform or avail the Services.</p>
                <p>(d) The T&C contained herein expressly supersede all prior agreements or arrangements between the company and the user.</p>
                <p>{"(e) The user understands that the access to the Platform and the offer of Services is conditional upon the user's irrevocable consent and acceptance of all the terms, conditions and obligations contained in the T&C (as may be amended from time to time). For utilising the Services, the user agrees to enter into or execute any document, agreement or terms and conditions which is required by the company and agrees to abide by such document or agreement or terms and conditions while utilising the services on the Platform."}</p>
                <p>(f) By accessing the Platform, the user hereby agrees to receive communication regarding registration on the Platform or Platform Services (including but not limited to any promotional, transactional messages) through Email and/or SMS and/ or any other electronic medium, third party channels (including WhatsApp) from the company.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">2. User Representations</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) By agreeing to the T&C and by availing the Services, the user represents that it is lawfully able to enter into contracts (if an individual) or has the legal authority to enter into contracts on behalf of the body corporate/company/partnership.</p>
                <p>(b) The user acknowledges in relation to the Services that the company is merely providing a platform for facilitating the transactions between the user and the financial institutions(FIs) on the Platform and shall in no manner be liable or responsible for any such transactions or be construed as an agent of the user in relation to the Services.</p>
                <p>{"(c) The user acknowledges and agrees that any use of the Platform and the availing of the Services is at the sole risk of the user."}</p>
                <p>(d) The user acknowledges and agrees that it is solely responsible for its data uploaded to or transmitted through the Platform, as well as, the consequences of uploading or transmitting its data onto or through the Platform.</p>
                <p>(e) The user acknowledges, represents, and warrants that with respect to any data posted on or transmitted through the Platform:</p>
                <p className="ml-4">(i) It has all necessary licences, rights, consents, and permissions to upload, transmit, or publish such data and that it grants company, express, irrevocable licence and authorization to use such data for the Services; and</p>
                <p className="ml-4">(ii) Any use by the company of the data uploaded, transmitted, or published by it on the Platform will not constitute infringement of any third party's rights, over such data posted or transmitted through the Platform.</p>
                <p>(f) The user agrees and acknowledges that it is solely responsible to the company and to any counterparties for any breach of its obligations under the T&C and for the consequences of any such breach (including any loss or damage which company may suffer).</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">3. Use Of Platform And Services</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The user acknowledges and agrees that the profile of the user created on the Platform may be visible to other users on the Platform and to the company.</p>
                <p>(b) The company reserves the right to reject any request for creation of an account on the Platform, at its sole discretion without assigning any reason.</p>
                <p>(c) The user is solely responsible for maintaining the confidentiality and security of its account including its password, user name or any means of authentication and for restricting access to its device/computer to prevent unauthorized access to its account.</p>
                <p>(d) The user is solely responsible for all the activities that occur under its account or through the use of its password, user name or any means of authentication. The user must immediately notify the company if it becomes aware of any unauthorized use of its account or password or any other breach of security.</p>
                <p>(e) The user acknowledges and agrees that the company may use certain technologies from time to time, to track the activity of the users on the Platform.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">4. General Undertakings Of The User</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>The user shall not:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Upload, post, email, transmit, share or otherwise make available any content (including personal information) that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of the right to privacy (including but not limited to bodily privacy), hateful, or racially, ethnically, religiously, or otherwise objectionable;</li>
                  <li>Upload, post, email, transmit, share or otherwise make available any content that infringes any patent, trademark, trade secret, copyright or other proprietary right(s) of any party;</li>
                  <li>Download any file/content that the user knows, or reasonably should know, cannot be legally distributed;</li>
                  <li>Violate the T&C, any applicable or local law or regulations, or any code of practice or other guidelines issued by any relevant regulatory or other authority;</li>
                  <li>Create derivative works from any information on the Platform;</li>
                  <li>Use any data mining, crawling, robots or similar data gathering or extraction methods on the Platform;</li>
                  <li>Use the Platform to collect or store personal data about other users in connection with any prohibited activity;</li>
                  <li>Use any meta tags or any other hidden text utilising the name or trademarks of the company without the express written consent of the company;</li>
                  <li>Forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the Platform;</li>
                  <li>Provide another user's personal information without such user's consent.</li>
                </ul>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">5. Confidentiality</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The user acknowledges that any and all information and data exchanged between the company and the user/client is confidential in nature.</p>
                <p>(b) The user shall maintain the confidentiality and secrecy of the information received from the company and the data that is accessible through the use of the Platform.</p>
                <p>(c) Neither party shall disclose the confidential information to any third party without the prior written approval of the other party, unless required by any governmental authority or as per applicable law.</p>
                <p>(d) The user is obligated to protect, by reasonable means, such confidential information and data.</p>
                <p>(e) The user is further obligated to protect, by reasonable means, its/his user name and password to prevent any unauthorized access.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">6. Data Protection</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>{"(a) The collection of any data by the company from the user shall be subject to the company's data protection and privacy policy."}</p>
                <p>(b) The company takes reasonable measures to protect the confidentiality, integrity and security of the personal data and information.</p>
                <p>(c) The company will ensure that all personal data and personal information it collects and stores (and any personal data and personal information collected and stored by its third party service providers) will be held securely and will be held and processed strictly in compliance with all applicable law.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">7. Limitation Of Liability</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The company shall not be liable for any damages of any kind arising from the use of the Platform, or from any information, content, materials, or services included on or otherwise made available to the user through the Platform.</p>
                <p>(b) The company shall not be liable for any errors, omissions, interruptions, deletion of files, defects, delays in operation or transmission, unauthorized access to or alteration of user data, or any other failures of performance whether or not limited to acts of God, communication failure, theft, destruction or unauthorized access to the company records, programs or services.</p>
                <p>(c) The user acknowledges that the company acts only as a provider of intermediary services and is not responsible for the quality, safety, or legality of the products or services offered by the counterparties.</p>
                <p>(d) The company provides the Platform on an "as is" basis without any warranties or guarantees, whether express or implied.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">8. Refunds</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The company may, in its sole discretion, consider requests for refunds of any fees or charges paid by the user.</p>
                <p>(b) Any refund requests must be made within 7 days of the transaction date.</p>
                <p>(c) The company reserves the right to reject any refund request without assigning any reason.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">9. Transfer Of Rights</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The user shall not assign or transfer any of its rights or obligations under the T&C to any third party without the prior written consent of the company.</p>
                <p>(b) The company may assign or transfer its rights and obligations under the T&C to any third party without the consent of the user.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">10. Security Of Data</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The company takes reasonable measures to protect the security of the data and information provided by the user.</p>
                <p>(b) The user acknowledges that no method of transmission over the internet or electronic storage is 100% secure and the company cannot guarantee absolute security.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">11. Intellectual Property</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) All content on the Platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the property of the company and is protected by Indian and international copyright laws.</p>
                <p>(b) The user shall not reproduce, distribute, or create derivative works from any content on the Platform without the prior written consent of the company.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">12. Communication With Counterparties</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The user acknowledges that any communication or transaction with the counterparties is solely between the user and the counterparty.</p>
                <p>(b) The company shall not be responsible for any communication, transaction, or dispute between the user and the counterparty.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">13. Taxes</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The user shall be solely responsible for all taxes, duties, levies, or assessments imposed by any governmental authority in connection with the use of the Platform or the Services.</p>
                <p>(b) The company shall not be responsible for any tax liability of the user.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">14. Modification Of T&C</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The company reserves the right to modify, amend, or update the T&C at any time without prior notice to the user.</p>
                <p>(b) The continued use of the Platform by the user after any modification to the T&C shall constitute acceptance of the modified T&C.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">15. Temporary Suspension And Termination</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) The company may temporarily suspend or permanently terminate the access of the user to the Platform and the Services at any time, without prior notice, for any reason, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Violation of the T&C;</li>
                  <li>Illegal or unauthorized use of the Platform;</li>
                  <li>Request by law enforcement or other government authorities;</li>
                  <li>Discontinuation of the Platform or the Services.</li>
                </ul>
                <p>(b) Upon termination, the right of the user to access or use the Platform or the Services shall immediately cease.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">16. Disclaimer Of Warranties</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>{"(a) The Platform and the Services are provided on an \"as is\" and \"as available\" basis without any warranties of any kind, whether express, implied, or statutory."}</p>
                <p>(b) The company does not warrant that the Platform or the Services will be uninterrupted, timely, secure, or error-free.</p>
                <p>(c) The company does not warrant the accuracy, completeness, or reliability of any information obtained through the Platform or the Services.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">17. Indemnification</h2>
              <div className="text-slate-300 leading-relaxed">
                <p>{"The user hereby agrees to indemnify and hold harmless company (including its directors, employees, representatives and agents) from time to time, against any and all losses, liabilities, obligations, damages, judgments, costs, expenses (including, without limitation, advisors' fees), claims, fines, penalties, proceedings, actions or demands, of any kind or nature incurred by company/caused to company on account of user's use of the Platform or the Services, including but not limited to the violation of the T&C."}</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">18. Governing Law And Jurisdiction</h2>
              <div className="text-slate-300 leading-relaxed">
                <p>The T&C are governed and construed in accordance with the laws of India and the user hereby submits himself to the exclusive jurisdiction of courts and tribunals at Delhi, India. The user irrevocably waives any objection it may have now or in the future to the choice of courts and tribunal of Delhi, India as an inconvenient forum.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">19. Severability</h2>
              <div className="text-slate-300 leading-relaxed">
                <p>Every provision contained in the T&C shall be severable and distinct from every other provision and if at any time any one or more of such provisions is or becomes invalid illegal or unenforceable, the validity, legality and enforceability of the remaining provisions hereof shall not be in any way affected or impaired thereby.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">20. Waivers</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>(a) Neither the failure to exercise nor any delay in exercising any right, power, privilege or remedy under the T&C shall in any way impair or affect the exercise thereof or operate as a waiver thereof in whole or in part.</p>
                <p>(b) No single or partial exercise of any right, power, or privilege under the T&C shall prevent any further or other exercise thereof or the exercise of any other right, power, privilege or remedy.</p>
              </div>
            </section>

            <section className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-2xl font-bold text-[#0EA9B2] mb-4">21. Definitions</h2>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>Unless repugnant to the context, the terms used in the T&C have the following meaning:</p>
                <p><span className="text-white font-semibold">{'"company"'}</span> means Nxfin Technologies Private Limited (including its successors and assigns)</p>
                <p><span className="text-white font-semibold">{'"user"'}</span> means</p>
                <p className="ml-4">(a) In case of an individual, any person who has an account on the Platform; or</p>
                <p className="ml-4">(b) In case of persons other than individuals,</p>
                <p className="ml-8">(i) An entity who holds an account on the Platform, and who may access the Platform through its representatives or authorised officials; or</p>
                <p className="ml-8">(ii) An entity on whose behalf any authorised representative or person may hold an account on and access the Platform.</p>
                <p><span className="text-white font-semibold">{'"Counterparty"'}</span> means any person with which the user:</p>
                <p className="ml-4">(a) Enters into any arrangement/contract/agreement with, pursuant to or by way of the Services or the Platform; and/or</p>
                <p className="ml-4">(b) May potentially enter into any arrangement/contract/agreement with, by availing the Services on the Platform.</p>
                <p><span className="text-white font-semibold">{'"Force Majeure Event"'}</span> includes any act, event, non-happening, omission or accident beyond the reasonable control of company and includes, without limitation, the following events:</p>
                <p className="ml-4">(a) Strikes, lock-outs or other industrial action;</p>
                <p className="ml-4">(b) Riot, invasion, terrorist attack or threat of terrorist attack, war (whether declared or not) or threat or preparation for war;</p>
                <p className="ml-4">(c) Fire, explosion, storm, flood, earthquake, subsidence, epidemic or other natural disaster;</p>
                <p className="ml-4">(d) Impossibility of the use of public or private telecommunications networks or internet services; and</p>
                <p className="ml-4">(e) The acts, decrees, legislation, regulations or restrictions of any government, as may be applicable.</p>
                <p><span className="text-white font-semibold">{'"Platform"'}</span> means the Nxcar platform launched by the company for offering Services to the user.</p>
                <p><span className="text-white font-semibold">{'"Personal Data"'}</span> {"shall have the same meaning as ascribed to the term \"Sensitive Personal Data or Information\" under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (as amended from time to time)."}</p>
                <p><span className="text-white font-semibold">{'"Services"'}</span> means the product or services offered by the company through the Platform, including but not limited to facilitation interaction between the user and Counter parties to enable them to enter into transactions, including (without limitation) for securitisation, direct assignments, or any other product or services offered.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
