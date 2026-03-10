import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, mobile, loan_type, salary, pancard, existing_emi } = body;
    if (!full_name || !mobile) {
      return NextResponse.json({ error: "full_name and mobile are required" }, { status: 400 });
    }

    const authToken = request.cookies.get("auth_token")?.value
      || request.headers.get("x-auth-token")
      || (process.env.NXCAR_AUTH_TOKEN || "");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = authToken;
    }

    const response = await fetch(`${BASE_URL}/user-service-loan-eligibility`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        full_name,
        mobile,
        loan_type: loan_type || "",
        salary: salary || "0",
        pancard: pancard || "",
        existing_emi: existing_emi || "0",
      }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking loan eligibility:", error);
    return NextResponse.json({ error: "Failed to check loan eligibility" }, { status: 500 });
  }
}
