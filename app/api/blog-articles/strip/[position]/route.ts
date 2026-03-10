import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@lib/storage';

const blogIdImageMap: Record<number, string> = {
  25: "/images/blog/new-car-depreciation.jpg",
  26: "/images/blog/infotainment-danger.jpg",
  27: "/images/blog/boring-reliable-car.jpg",
  28: "/images/blog/car-safety-india.jpg",
  29: "/images/blog/used-suvs-value.jpg",
  6: "/images/blog/renault-ev-platform.jpg",
  7: "/images/blog/autonomous-testing.jpg",
  8: "/images/blog/flex-fuel-ethanol.jpg",
  9: "/images/blog/two-wheeler-sales.jpg",
  10: "/images/blog/auto-components-export.jpg",
  11: "/images/blog/engine-oil-viscosity.jpg",
  12: "/images/blog/suspension-geometry.jpg",
  13: "/images/blog/wheel-alignment.jpg",
  14: "/images/blog/bollywood-cars.jpg",
  15: "/images/blog/vehicle-electrical.jpg",
  21: "/images/blog/mustang-gt.jpg",
  22: "/images/blog/urban-mobility.jpg",
  23: "/images/blog/vehicle-data-privacy.jpg",
  24: "/images/blog/vehicle-recycling.jpg",
};

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

function fixBlogImageUrl(imageUrl: string, articleId: number): string {
  if (blogIdImageMap[articleId]) {
    return blogIdImageMap[articleId];
  }
  if (!imageUrl) return "/images/blog/new-car-depreciation.jpg";
  if (imageUrl.startsWith("/images/blog/") && imageUrl !== "/images/blog/new-car-depreciation.jpg") {
    return imageUrl;
  }
  for (const [key, localPath] of Object.entries(blogImageFallbackMap)) {
    if (imageUrl.includes(key)) {
      return localPath;
    }
  }
  return imageUrl || "/images/blog/new-car-depreciation.jpg";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ position: string }> }
) {
  try {
    const { position } = await params;
    const positionNum = parseInt(position);
    const articles = await storage.getBlogArticlesByStrip(positionNum);
    const fixedArticles = articles.map(a => ({
      ...a,
      imageUrl: fixBlogImageUrl(a.imageUrl, a.id),
    }));
    return NextResponse.json(fixedArticles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog articles" }, { status: 500 });
  }
}
