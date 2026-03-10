import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchWithTimeout } from "@lib/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicle_number, phone_number } = body;

    if (!vehicle_number || typeof vehicle_number !== "string" || !vehicle_number.trim()) {
      return NextResponse.json(
        { success: false, message: "Vehicle number is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const nxcarUserId = cookieStore.get("nxcar_user_id")?.value || "";

    const response = await fetchWithTimeout(
      "https://api.nxcar.in/user-service-challans-check",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_number: vehicle_number.trim(),
          phone_number: phone_number?.trim() || "",
          user_id: nxcarUserId,
        }),
      },
      15000
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch challan data" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { success: false, message: "Request timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { success: false, message: "An error occurred while checking challans" },
      { status: 500 }
    );
  }
}
