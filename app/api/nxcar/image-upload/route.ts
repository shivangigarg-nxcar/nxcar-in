import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    const formData = await request.formData();
    const vehicleId = formData.get('vehicle_id');
    const files = formData.getAll('file');
    const price = formData.get('price');

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicle_id is required' }, { status: 400 });
    }

    if ((!files || files.length === 0) && !price) {
      return NextResponse.json({ error: 'At least one file or price is required' }, { status: 400 });
    }

    const nxcarForm = new FormData();
    nxcarForm.append('vehicle_id', vehicleId as string);

    if (price) {
      nxcarForm.append('price', price as string);
    }

    for (const file of files) {
      if (file instanceof Blob) {
        const filename = (file as File).name || `image_${Date.now()}.jpg`;
        nxcarForm.append('file[]', file, filename);
      }
    }

    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = authToken;
    }

    const response = await fetch(`${BASE_URL}/imageUpload`, {
      method: 'POST',
      headers,
      body: nxcarForm,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Nxcar image upload error:', response.status, data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
