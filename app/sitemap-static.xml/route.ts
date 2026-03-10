import { NextResponse } from "next/server";

const SITEMAP_SITE_URL = "https://www.nxcar.in";

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/used-car-loan",
  "/calculator",
  "/car-services",
  "/partner",
  "/contact-us",
  "/insurance-check",
  "/challan-check",
  "/rc-check",
  "/login",
  "/faq",
  "/sell-used-car",
  "/sell-used-car/gurugram",
  "/sell-used-car/gurgaon",
  "/sell-used-car/delhi",
  "/used-car-dealers-in",
  "/privacy-policy",
  "/terms",
  "/grievance-policy",
  "/extended-warranty-terms",
  "/loan-eligibility",
  "/rc-details",
  "/carscope",
  "/dealers",
  "/favorites",
  "/test-drive",
  "/used-cars",
  "/refer-to-friend",
  "/blogs-of-nxcar",
  "/service-partner",
];

const DEALER_CITIES = [
  "delhi",
  "bangalore",
  "borivali",
  "mumbai",
  "gurgaon",
  "thane",
  "bathinda",
  "hyderabad",
  "faridabad",
  "pune",
  "rangareddy",
  "kolkata",
  "ghaziabad",
  "jaipur",
  "chandigarh",
  "noida",
  "mohali",
  "ajmer",
];

export async function GET() {
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const path of STATIC_PATHS) {
    const priority = path === "/" ? "1.0" : "0.8";
    xml += `
  <url>
    <loc>${SITEMAP_SITE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  for (const city of DEALER_CITIES) {
    xml += `
  <url>
    <loc>${SITEMAP_SITE_URL}/used-car-dealers-in/${city}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
