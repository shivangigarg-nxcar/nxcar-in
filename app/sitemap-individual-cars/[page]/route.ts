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

const API_PER_PAGE = 48;
const XML_LIMIT = 1000;
const CALLS_PER_XML = Math.ceil(XML_LIMIT / API_PER_PAGE);

export async function GET(request: Request,
                                  { params }: { params: Promise<{ page: string }> }) {
    let page: string | number = (await params).page;
    if (typeof page === 'string' && page.endsWith('.xml')) {
        page = page.replace('.xml','');
        page = Number(page);
    }

    const xmlPage = Number(page);
    let recordsFound = false;

    if (!xmlPage || xmlPage < 1) {
        return new NextResponse("Invalid sitemap page", { status: 400 });
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const startApiPage = (xmlPage - 1) * CALLS_PER_XML + 1;
    const endApiPage = startApiPage + CALLS_PER_XML - 1;

    for (let apiPage = startApiPage; apiPage <= endApiPage; apiPage++) {
        try {
            const response = await fetch(BASE_URL + '/listallcars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fltr: [], page: apiPage }),
                next: { revalidate: 300 }
            });
            const data = await response.json();

            if (!data.allcars || typeof data.allcars === 'string' || !Array.isArray(data.allcars)) break;

            recordsFound = true;
            for (const car of data.allcars) {
                if (car.is_active !== "1") continue;

                const city = slugify(car.city_name || "");
                if (!city) continue;

                const make = slugify(car.make || "");
                const model = slugify(car.model || "");
                const variant = slugify(car.variant || "");
                const vehicleId = car.vehicle_id || car.id;
                if (!vehicleId) continue;

                const combined = [make, model, variant].filter(Boolean).join("-");
                const carSlug = combined ? `${combined}-${vehicleId}` : `car-${vehicleId}`;

                xml += `
      <url>
        <loc>${SITEMAP_SITE_URL}/used-cars/${city}/${carSlug}</loc>
        <lastmod>${new Date(car.updated_date).toISOString()}</lastmod>
      </url>`;
            }
        } catch {
            break;
        }
    }

    xml += `</urlset>`;

    if (!recordsFound) {
        return new NextResponse("Invalid sitemap page", { status: 400 });
    }

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
