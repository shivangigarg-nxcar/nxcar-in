import { NextRequest, NextResponse } from "next/server";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  if (!path.startsWith("/")) path = `/${path}`;
  const parts = path.split("/");
  if (parts.length < 3) throw new Error("Invalid path");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

async function signObjectURL(bucketName: string, objectName: string): Promise<string> {
  const response = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket_name: bucketName,
      object_name: objectName,
      method: "GET",
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    }),
  });
  if (!response.ok) throw new Error(`Failed to sign URL: ${response.status}`);
  const { signed_url } = await response.json();
  return signed_url;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const objectSubPath = path.join("/");

    let entityDir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!entityDir) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
    }
    if (!entityDir.endsWith("/")) entityDir += "/";

    const fullPath = `${entityDir}${objectSubPath}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);

    const signedUrl = await signObjectURL(bucketName, objectName);

    const fileResponse = await fetch(signedUrl);
    if (!fileResponse.ok) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    const contentType = fileResponse.headers.get("content-type") || "application/octet-stream";
    const body = fileResponse.body;

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Error serving object:", error);
    return NextResponse.json({ error: "Object not found" }, { status: 404 });
  }
}
