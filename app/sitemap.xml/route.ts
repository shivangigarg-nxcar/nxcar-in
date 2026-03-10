import { NextResponse } from "next/server";

const SITEMAP_SITE_URL = "https://www.nxcar.in";

export async function GET() {
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  xml += `
  <sitemap>
    <loc>${SITEMAP_SITE_URL}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  xml += `
  <sitemap>
    <loc>${SITEMAP_SITE_URL}/sitemap-cities/all.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  for (let i = 1; i <= 4; i++) {
    xml += `
  <sitemap>
    <loc>${SITEMAP_SITE_URL}/sitemap-individual-cars/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  }

  xml += `
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
