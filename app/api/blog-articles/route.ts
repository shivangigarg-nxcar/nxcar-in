import { NextResponse } from 'next/server';
import { storage } from '@lib/storage';

const blogImageFallbackMap: Record<string, string> = {
  "new_car_depreciation": "/images/blog/new-car-depreciation.jpg",
  "post-pandemic_mobility": "/images/blog/urban-mobility.jpg",
  "infotainment_distraction": "/images/blog/infotainment-danger.jpg",
  "indian_road_safety": "/images/blog/car-safety-india.jpg",
  "boring_reliable_car": "/images/blog/boring-reliable-car.jpg",
  "renault_india_ev": "/images/blog/renault-ev-platform.jpg",
  "autonomous_testing": "/images/blog/autonomous-testing.jpg",
  "flex-fuel_ethanol": "/images/blog/flex-fuel-ethanol.jpg",
  "two-wheeler_sales": "/images/blog/two-wheeler-sales.jpg",
  "auto_component": "/images/blog/auto-components-export.jpg",
  "800v_ev_charging": "/images/blog/engine-oil-viscosity.jpg",
  "rollover_stability": "/images/blog/suspension-geometry.jpg",
  "nexa_engine": "/images/blog/wheel-alignment.jpg",
  "bollywood_car": "/images/blog/bollywood-cars.jpg",
  "tata_punch_safety": "/images/blog/vehicle-electrical.jpg",
  "connected_car_privacy": "/images/blog/vehicle-data-privacy.jpg",
  "vehicle_recycling": "/images/blog/vehicle-recycling.jpg",
  "maas_integration": "/images/blog/mobility-service.jpg",
  "used_suvs_value": "/images/blog/used-suvs-value.jpg",
  "mustang_gt": "/images/blog/mustang-gt.jpg",
};

function fixBlogImageUrl(imageUrl: string): string {
  if (!imageUrl) return "/images/blog/new-car-depreciation.jpg";
  for (const [key, localPath] of Object.entries(blogImageFallbackMap)) {
    if (imageUrl.includes(key)) return localPath;
  }
  return "/images/blog/new-car-depreciation.jpg";
}

function fixBlogExternalUrl(externalUrl: string, category: string): string {
  if (!externalUrl) return "https://www.nxcar.in/blog";
  return externalUrl;
}

export async function GET() {
  try {
    const articles = await storage.getAllBlogArticles();
    const fixedArticles = articles.map(a => ({
      ...a,
      imageUrl: fixBlogImageUrl(a.imageUrl),
      externalUrl: fixBlogExternalUrl(a.externalUrl, a.category),
    }));
    return NextResponse.json(fixedArticles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog articles" }, { status: 500 });
  }
}
