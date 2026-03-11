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
-   **Service Pages APIs**: Integrated with NxCar backend APIs for challan checks, loan eligibility, dealer login, insurance queries, and partner registration.