# Nxcar - Used Car Marketplace Platform

## Overview

Nxcar is a full-stack web application designed for the buying and selling of used cars in India. It aims to connect car sellers with verified dealers, offer car valuation services, and integrate additional services such as car loans, insurance, and RC transfer assistance. The platform provides a modern, dark-themed user interface with a premium automotive aesthetic, offering a comprehensive solution for the used car market. The project vision is to become a leading online marketplace in the Indian used car sector.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application is built using Next.js 16 with the App Router and TypeScript, incorporating various rendering strategies (SSR, SSG, ISR, Client Components). Styling is managed with Tailwind CSS v3 and CSS variables. UI components are sourced from shadcn/ui. State management for client-side server state is handled by TanStack React Query, and Framer Motion is used for animations.

The project structure is organized around the Next.js App Router, with `app/` containing pages and API routes. Server-side API routes are defined under `server/routes/` and handle various functionalities such as Nxcar API proxying, buying/listings, public data, user management, authentication, admin operations, and AI recommendations. Client-side API interactions are abstracted in `lib/api/`.

Key UI components are modularized by feature, including flows for selling cars, listing cars, displaying car details, buying cars, dealer details, user dashboards, city listings, and specialized service pages like car loans and partner registrations. Shared components and custom hooks are used for common functionalities such as form management, vehicle lookup, image uploads, and authentication.

Data storage utilizes PostgreSQL with Drizzle ORM for schema management. Authentication leverages NxCar's backend APIs for phone OTP-based user authentication and bcrypt password-based authentication for admins, employing a dual cookie system for session management.

Features include a car comparison modal, a book inspection modal with dynamic slot availability, a dedicated document upload page, a car finance calculator, homepage car cards with seller details, location showcases with real-time dealer counts, mobile responsiveness, auto-advancing sell form steps, full theme awareness for light/dark mode, and a listing price chart using D3.

## External Dependencies

-   **Car Listings & Master Data**: `https://api.nxcar.in/api` and `https://api.nxcar.in` for car listings, vehicle lookup, makes, models, years, fuel types, and variants.
-   **Dealer Partners**: `https://api.nxcar.in/partners/web-urls` for city dealer lists, `https://api.nxcar.in/dealer-view/{slug}` for individual dealer details.
-   **Inspection Services**: `https://api.nxcar.in/inspection-slots`, `https://api.nxcar.in/v2/inspection-franchise`, and `https://api.nxcar.in/userprofile-book-inspection`.
-   **Authentication APIs**: NxCar backend APIs (defined by `AUTH_BASE_URL` as `https://api.nxcar.in`) for mobile OTP, verification, resend OTP, and logout.
-   **AI Integrations**: Requires `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` for AI recommendations.
-   **Service Pages APIs**: Integrated with NxCar backend APIs for challan checks, loan eligibility, dealer login, insurance queries, RC queries, and partner registration.
-   **Service Pages OTP Flow**: All service pages (challan-check, rc-check, insurance-check) require OTP verification before submitting data to CRM. Flow: enter vehicle + phone → send OTP via `/api/nxcar/dealer-login/send-otp` → verify OTP via `/api/nxcar/dealer-login/verify-otp` → submit to CRM with auth token. CRM endpoints: challan → `user-service-challans-check`, insurance → `user-service-insurance`, RC → `contact` (Contact Us API).

## Legal & Policy Pages

All legal pages match exact content from dev.nxcar.in:

-   `/privacy-policy` — Full privacy policy (Introduction, Scope, Collection, Retention, Sharing, Rights, Marketing, Compliance, Review, Contact, Data Review)
-   `/terms-of-use` — Full 21-section Terms Of Use legal text
-   `/grievance-policy` — Grievance Redressal Policy (Purpose, Scope, Definitions, Team, Principles, Process, Escalation, Review)
-   `/service-partner` — Financial Services Partners page (banking + NBFC partners list with regulatory info)
-   `/nxcar-p1rtn5rs-pr1va3y-poli3y` — Partners Privacy Policy (same as privacy, but "Review/Delete" links to `/p1rtn5rs-@ccou5t`)
-   `/partners-account` — Data Collection & Storage Inquiry form (canonical URL for `/p1rtn5rs-@ccou5t`)

### Special Character URL Rewrites (next.config.ts)

-   `/p1rtn5rs-*` → `/partners-account` (handles `@` character which conflicts with Next.js parallel routes)
-   `/nxcar-t3rms-*` → `/terms-of-use` (handles `$` characters in URL)

### Legacy URL Redirects & Host Normalization (middleware.ts)

-   `www.nxcar.in` → `nxcar.in` (301 redirect for canonical host normalization)
-   `/used-car-in/{city}/{make}/{model}/{variant}/{id}` → `/used-cars/{city}/{make}-{model}-{variant}-{id}` (individual car page)
-   `/used-car-in/{city}/{slug}` → `/used-cars/{city}` (city listing fallback when no numeric ID)
-   Same pattern for `/used-cars-in/` prefix
-   Middleware extracts last segment as car ID if numeric, builds slugified car detail URL

## SEO & Canonical Tags

-   Server-side canonical tags via Next.js metadata API (`alternates.canonical: './'` in `app/layout.tsx`)
-   `metadataBase: new URL('https://nxcar.in')` ensures all canonical URLs use `nxcar.in` domain
-   Each page automatically gets `<link rel="canonical" href="https://nxcar.in{pathname}">`
-   All sitemaps and `robots.txt` consistently use `https://nxcar.in` (without www)
-   Middleware performs 301 redirect from `www.nxcar.in` → `nxcar.in` for host normalization

## Navbar & Footer City Links

-   **Navbar**: Both "Sell Car" and "Buy Car" are hover dropdowns with city-specific links (Delhi, Mumbai, Bangalore, Hyderabad, Gurgaon, Pune, Kolkata). Mobile has expandable sections.
-   **Footer**: "Buy Used Cars" section (10 cities), "Sell Used Cars" section (2 cities: Delhi, Gurgaon)

## Listing Date Display

-   Listings older than 30 days show "1 month ago" (capped, never shows "2 months ago" etc.)
-   Format: today, yesterday, X days ago, 1 month ago
-   Logic in `components/buy-cars/car-listing-card.tsx` and `components/car-detail/quick-specs.tsx`

## Post-Inspection Success UI

After inspection is booked, the sell flow shows a redesigned success view:
-   **4-step stepper bar**: Car Details ✓ → Nxcar Price ✓ → Inspection Booked ✓ → Best Offers (active)
-   **Process diagram**: Visual 4-step cards (Car Details, Price Recommendation, Inspection, Car Auction)
-   **"What to Expect Next" section**: 5 bullet points about the process + Google Maps embed of inspection location
-   **Fixed footer bar**: Document upload CTA with "Upload Later" and "Upload Documents" buttons
-   **Inline document upload**: When user clicks "Upload Documents", an inline form appears on the same page with RC Copy (front/back side-by-side), Insurance Policy, PAN Card, Payment Details (Bank Account Details OR Cancelled Cheque Copy)
-   Components: `components/sell-car/success/inspection-success-view.tsx`, `components/sell-car/success/inline-document-upload.tsx`
-   Standalone upload documents page (`/upload-documents?vehicle_id=...`) redesigned to match same layout

## Price Prediction (Sell Flow)

-   Price step calls `POST https://dev-ai.nxcar.in/price-prediction` with car details
-   Payload fields: make, model, variant, variant_id, year, fuel_type, transmission, distance (km), owner_count, rto_code, color
-   Displays seller price range from `pricing.seller.lower` / `pricing.seller.upper`

## Buy Page Cities

-   `/used-cars` page shows top 50 cities sorted by car count with images/initials
-   Remaining cities behind "View More Cities" toggle
-   Cities with local images in `public/images/buy/cities/` show photos; others show gradient + initial letter