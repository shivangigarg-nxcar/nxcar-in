# Nxcar - Used Car Marketplace Platform

## Overview

Nxcar is a full-stack web application designed for the buying and selling of used cars in India. It connects car sellers with verified dealers, offers car valuation services, and integrates additional services such as car loans, insurance, and RC transfer assistance. The platform aims to provide a modern, dark-themed user interface with a premium automotive aesthetic, offering a comprehensive solution for the used car market. The project vision is to become a leading online marketplace in the Indian used car sector.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Framework
The application is built using **Next.js 16 with the App Router**, leveraging TypeScript for development. It incorporates various rendering strategies including SSR, SSG, ISR, and Client Components. Styling is managed with **Tailwind CSS v3** and CSS variables for theming. UI components are sourced from the **shadcn/ui library** (New York style) located in `components/ui/`. State management for client-side server state is handled by **TanStack React Query**, and **Framer Motion** is used for animations. The application runs on port 5000.

### Project Structure
The `app/` directory contains Next.js App Router pages and API routes, including dedicated folders for `api/` endpoints (e.g., `buy/`, `nxcar/`, `cars/`, `auth/`), `page.tsx` for the homepage, `layout.tsx`, and `providers.tsx`. Key page routes include `/used-cars/` for listings, `/used-cars/[city]/[car]/` for car details, `/sell-used-car/` for the sell car form, `/list-car/` for dealer listing, `/sell-car-edit/` for editing listings, and `/blogs-of-nxcar/`. Shared UI components are in `components/`, with specialized sub-component directories:
- `components/sell-car/` — Sell flow sub-components: `sell-constants.ts`, `sell-steps.tsx`, `sell-timeline-pills.tsx`, `sell-success-section.tsx`
- `components/list-car/` — List car sub-components: `list-steps.tsx`, `list-success-view.tsx`, `list-summary-badges.tsx`
- `components/car-detail/` — Car detail page sub-components: `car-specs-grid.tsx`, `seller-action-sidebar.tsx`, `mobile-action-bar.tsx`, `document-upload-section.tsx`, `add-on-services.tsx`
- `components/sell-car-edit/` — Edit listing sub-components: `collapsible-section.tsx`, `car-details-section.tsx`, `photos-section.tsx`, `rc-details-section.tsx`, `insurance-section.tsx`, `other-docs-section.tsx`, `seller-info-section.tsx`, `delete-dialog.tsx`
- `components/buy-cars/` — Buy flow components: `filter-sidebar.tsx`, `car-listing-card.tsx`
- `components/shared/` — Shared components: `car-card.tsx`
- `components/ui/` — shadcn/ui components

Utility libraries, database configurations, API functions, and custom React hooks are found in `lib/` and `hooks/`. Shared schemas and models are defined in `shared/`, and static assets are in `public/`.

### Data Storage
The application uses **PostgreSQL** as its database, with **Drizzle ORM** and `drizzle-kit` for migrations. Database schema definitions are located in `shared/schema.ts`.

### Authentication
User authentication is managed via **NxCar's backend APIs** using phone OTP. Admin authentication uses bcrypt password-based with cookie sessions. The system employs a dual cookie system for session management, storing `user_id` for local database interactions and `auth_token`/`nxcar_user_id` for NxCar backend interactions, along with localStorage for auth state with a 7-day expiry. Next.js API routes proxy requests to the NxCar backend for secure communication and CORS safety.

## External Dependencies

- **Car Listings & Master Data**: `https://api.nxcar.in/api` and `https://api.nxcar.in` for car listings, vehicle lookup, makes, models, years, fuel types, and variants.
- **Dealer Partners**: `https://api.nxcar.in/partners/web-urls` for city dealer lists, `https://api.nxcar.in/dealer-view/{slug}` for individual dealer details (info, teams, reviews, images)
- **Inspection Services**: `https://api.nxcar.in/inspection-slots`, `https://api.nxcar.in/v2/inspection-franchise`, and `https://api.nxcar.in/userprofile-book-inspection`.
- **Authentication APIs**: NxCar backend APIs at `AUTH_BASE_URL` (defined as `https://api.nxcar.in`) for mobile OTP, verification, resend OTP, and logout.
- **AI Integrations**: Requires `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` for AI recommendations.
- **Service Pages APIs**: Integrated with NxCar backend APIs for challan checks, loan eligibility, dealer login, insurance queries, and partner registration.

## Key Features
- **Car Comparison**: `CarComparisonModal` in `components/car-comparison-modal.tsx` compares up to 3 cars side-by-side. Fields: Price, Year, Kilometers, Brand, Model, Variant, Fuel Type, Transmission, Ownership (formatted as "1st Owner" etc.), Location. Comparison data sourced from `car-strip.tsx` (homepage) and `car-listing-card.tsx` (city listings). Both pass `variant` and `ownership` to `ComparisonCar`.
- **Book Inspection Modal**: `BookInspectionModal` in `app/my-cars/page.tsx` opens when clicking "Book Inspection" on SellCarCard. Collects city, date, time slot (Morning/Afternoon/Evening from `/api/nxcar/inspection-slots`), pincode, address. Cities from `/api/sell-cities` (returns `{ success, cities }` format). Submits to `POST /api/book-inspection`. After successful booking, shows "Next Step: Upload Documents" prompt with two options: "Upload Now" (redirects to car detail page with `?from=sell` to show `DocumentUploadSection`) and "I'll Do It Later" (closes modal).
- **Document Upload**: `DocumentUploadSection` in car detail page appears when `?from=sell` query param is present. Collects RC, insurance, PAN, and payment details.
- **Loan Calculator**: `CarFinanceCalculator` in `components/car-finance-calculator.tsx` supports full and compact modes. In compact mode (no down payment field), principal equals loan amount directly. In full mode, principal = loanAmount - downPayment.
- **Homepage Car Cards**: `CarCard` in `components/shared/car-card.tsx` shows seller details button when `sellerName` is available. Clicking opens a dialog with seller info fetched from `/api/nxcar/showsellerinfo`. Requires authentication (shows login modal if not logged in).
- **Experience Centers**: `LocationShowcase` in `components/location-showcase.tsx` fetches active cities from Nxcar dealer cities API (`/api/nxcar/dealer-cities-web`) instead of local DB. Shows cities with images from `https://nxcar.in/assets/img/city-images/` or fallback local images.
- **Mobile Responsiveness**: All pages have `overflow-x-hidden` on root container to prevent horizontal scroll from decorative blur elements (500px wide). Calculator page uses responsive padding (`p-4 sm:p-8`) and text sizes (`text-3xl sm:text-5xl` for EMI). Sell page form container uses `items-start sm:items-center` to keep Continue button visible on mobile. Contact form uses responsive padding (`p-4 sm:p-8`).
- **Sell Form Auto-Advance**: Steps auto-advance when complete. Single-selection steps (brand, model, variant, location) advance on click with 300ms delay. Dual-field steps (fuel-year, km-transmission) auto-advance via useEffect when both fields are filled (400ms delay). Steps needing explicit Continue: vehicle-number ("Fetch Details"), color-owners, price, photos, seller-info ("Submit Listing"). All auto-advance steps hide the Continue button, showing only Back.
- **Modal Theming**: Login, Feedback, and Notification modals use theme-aware classes (bg-background, text-foreground, bg-muted, border-border) instead of hardcoded dark colors. All modals adapt to light/dark theme automatically.
- **Full Theme Awareness**: All pages support light/dark mode using Tailwind `dark:` variants. Pages converted from hardcoded dark-only styling: login, OTP, OTP-submitted, blogs, blog detail, service-partner, dealer-login, sell-form-submitted, refer-to-friend, web-inspection-booked, sell-used-cars-gurugram, extended-warranty-terms, city-filter. Pattern: `bg-white dark:bg-[#0A0E14]` for backgrounds, `text-slate-900 dark:text-white` for headings, `bg-slate-50 dark:bg-slate-900/50` for cards, `border-slate-200 dark:border-slate-800` for borders, `bg-slate-100 dark:bg-white/5` for inputs.
- **Image Upload to Nxcar**: Upload API at `/api/nxcar/image-upload` uses `file[]` field name (not `images[]`) matching Nxcar backend expectation. Includes `vehicle_id`, `price` (Indian locale format), and `Authorization` header from `auth_token` cookie.
- **Colors API Fix**: `/api/nxcar/colors/route.ts` reads from `data.color` (was incorrectly `data.owner`).
- **Dealer Detail Page**: `app/used-car-dealers-in/[city]/[dealer]/page.tsx` uses `/api/nxcar/dealer-view/{slug}` for rich dealer data (showroom info, team members, reviews, dealership images, services offered, social links, rating, business hours) and `/api/nxcar/listallcars` with `user_id` filter for car listings. Sections: Hero with image slider, sticky tabs, listed cars tape, why choose us, dealership images gallery with lightbox, services, contact form with social links, reviews carousel, full car listing grid.