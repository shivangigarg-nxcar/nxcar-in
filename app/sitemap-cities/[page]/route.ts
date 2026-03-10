import { BASE_URL } from "@lib/constants";
import { NextResponse } from "next/server";

const SITEMAP_SITE_URL = "https://www.nxcar.in";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: Request,
                                  { params }: { params: Promise<{ page: string }> }) {

    let page = (await params).page;
    if (page !== 'all.xml') {
        return new NextResponse("Invalid sitemap page", { status: 400 });
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const response = await fetch(`${BASE_URL}/available-cities`, {
        next: { revalidate: 600 }
    });
    const cities = await response.json();

    for (const city of cities?.data || []) {
        xml += `
  <url>
    <loc>${SITEMAP_SITE_URL}/used-cars/${slugify(city.city_name)}</loc>
    <lastmod>${(new Date()).toISOString()}</lastmod>
  </url>`;
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
