'use client';

import { lazy, Suspense } from "react";
import { Navbar } from "@components/navbar";
import { Hero } from "@components/hero";
import { LazySection } from "@components/lazy-section";
import { QuickServices } from "@components/quick-services";
import { SellCarProcess } from "@components/sell-car-process";
import { CarStrip } from "@components/car-strip";
import { BlogStrip } from "@components/blog-strip";
import { Footer } from "@components/footer";

const RecentlyViewedCars = lazy(() => import("@components/recently-viewed-cars").then(m => ({ default: m.RecentlyViewedCars })));
const Features = lazy(() => import("@components/features").then(m => ({ default: m.Features })));
const LoanBanner = lazy(() => import("@components/loan-banner").then(m => ({ default: m.LoanBanner })));
const LoanCalculatorSection = lazy(() => import("@components/loan-calculator-section").then(m => ({ default: m.LoanCalculatorSection })));
const PDISection = lazy(() => import("@components/pdi-section").then(m => ({ default: m.PDISection })));
const Testimonials = lazy(() => import("@components/testimonials").then(m => ({ default: m.Testimonials })));
const LocationShowcase = lazy(() => import("@components/location-showcase").then(m => ({ default: m.LocationShowcase })));
const CityGrid = lazy(() => import("@components/city-grid").then(m => ({ default: m.CityGrid })));

function LazySuspense({ children }: { children: React.ReactNode }) {
  return (
    <LazySection>
      <Suspense fallback={<div style={{ minHeight: "200px" }} />}>
        {children}
      </Suspense>
    </LazySection>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-14">
        <Hero />
        <QuickServices />
        <SellCarProcess />
        <BlogStrip stripPosition={4} />
        <CarStrip title="Featured Used Cars" />
        <LazySuspense>
          <RecentlyViewedCars />
        </LazySuspense>
        <LazySuspense>
          <Features />
        </LazySuspense>
        <LazySuspense>
          <BlogStrip stripPosition={1} />
        </LazySuspense>
        <LazySuspense>
          <LoanBanner />
        </LazySuspense>
        <LazySuspense>
          <LoanCalculatorSection />
        </LazySuspense>
        <LazySuspense>
          <PDISection />
        </LazySuspense>
        <LazySuspense>
          <BlogStrip stripPosition={2} />
        </LazySuspense>
        <LazySuspense>
          <Testimonials />
        </LazySuspense>
        <LazySuspense>
          <CarStrip title="Recently Added" />
        </LazySuspense>
        <LazySuspense>
          <LocationShowcase />
        </LazySuspense>
        <LazySuspense>
          <CityGrid />
        </LazySuspense>
        <LazySuspense>
          <BlogStrip stripPosition={3} />
        </LazySuspense>
        <LazySuspense>
          <section aria-label="Join the Revolution" className="py-16 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/80 text-white">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-heading font-bold mb-6">Join the Revolution</h2>
              <p className="max-w-2xl mx-auto text-slate-300 mb-8">
                We are building the future of automotive retail in India. 
                Passionate about cars and tech? We'd love to have you on board.
              </p>
              <div className="flex justify-center gap-4">
                <a href="https://www.linkedin.com/company/nxfin/jobs/" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin-openings" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100">
                  View Openings on LinkedIn
                </a>
              </div>
            </div>
          </section>
        </LazySuspense>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "name": "Nxcar",
                "url": "https://nxcar.in",
                "logo": "https://nxcar.in/images/nxcar-logo.png",
                "description": "India's most trusted platform for buying and selling used cars",
                "sameAs": [
                  "https://www.facebook.com/nxfin",
                  "https://www.instagram.com/nxcarindia/",
                  "https://www.linkedin.com/company/nxfin/",
                  "https://www.youtube.com/@Nxcar-sr3ce"
                ]
              },
              {
                "@type": "WebSite",
                "name": "Nxcar",
                "url": "https://nxcar.in",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://nxcar.in/used-cars?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
