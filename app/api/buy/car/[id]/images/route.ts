import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@lib/cache';
import { BASE_URL } from '@lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;

    const response = await fetchWithTimeout(`${BASE_URL}/getImage?vehicle_id=${vehicleId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }, 8000);

    if (!response.ok) return NextResponse.json({ images: [] });
    const json = await response.json();
    if (!json.images || !Array.isArray(json.images)) return NextResponse.json({ images: [] });

    const sortedImages = [...json.images].sort((a: any, b: any) => {
      if (a.is_primary === "1" && b.is_primary !== "1") return -1;
      if (b.is_primary === "1" && a.is_primary !== "1") return 1;
      return parseInt(a.image_id || "0", 10) - parseInt(b.image_id || "0", 10);
    });

    const imageUrls = sortedImages
      .map((img: any) => img.image_url || "")
      .filter((url: string) => url !== "");

    const data = { images: imageUrls };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ images: [] });
  }
}
