import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

/**
 * POST /api/uploads/request-url
 * 
 * Generates a presigned upload URL for file uploads to object storage.
 * 
 * Request body:
 * {
 *   "name": "filename.jpg",
 *   "size": 12345,
 *   "contentType": "image/jpeg"
 * }
 * 
 * Response:
 * {
 *   "uploadURL": "https://storage.googleapis.com/...",
 *   "objectPath": "/replit-objstore-.../cars/filename-uuid.jpg",
 *   "metadata": { "name": "filename.jpg", "size": 12345, "contentType": "image/jpeg" }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, size, contentType } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Get the private object directory from environment
    const privateObjectDir = process.env.PRIVATE_OBJECT_DIR;
    if (!privateObjectDir) {
      return NextResponse.json(
        { error: 'Object storage not configured' },
        { status: 500 }
      );
    }

    // Generate a unique filename by combining original name with UUID
    const fileNameWithoutExt = name.split('.').slice(0, -1).join('.');
    const extension = name.includes('.') ? name.split('.').pop() : '';
    const uniqueFileName = extension 
      ? `${fileNameWithoutExt}-${randomUUID()}.${extension}`
      : `${name}-${randomUUID()}`;

    // Construct the full object path within the private directory
    const objectPath = `${privateObjectDir}/cars/${uniqueFileName}`;

    // Parse bucket name and object name from the path
    const pathParts = objectPath.split('/');
    const bucketName = pathParts[1]; // e.g., "replit-objstore-..."
    const objectName = pathParts.slice(2).join('/'); // e.g., ".private/cars/filename-uuid.jpg"

    // Request a presigned URL from the Replit sidecar
    const REPLIT_SIDECAR_ENDPOINT = 'http://127.0.0.1:1106';
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const signResponse = await fetch(
      `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket_name: bucketName,
          object_name: objectName,
          method: 'PUT',
          expires_at: expiresAt,
        }),
      }
    );

    if (!signResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to generate upload URL' },
        { status: 500 }
      );
    }

    const { signed_url: uploadURL } = await signResponse.json();

    let normalizedPath = objectPath;
    const privateDir = privateObjectDir.endsWith('/') ? privateObjectDir : `${privateObjectDir}/`;
    if (objectPath.startsWith(privateDir)) {
      const entityId = objectPath.slice(privateDir.length);
      normalizedPath = `/objects/${entityId}`;
    }

    return NextResponse.json(
      {
        uploadURL,
        objectPath: normalizedPath,
        metadata: { name, size, contentType },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
