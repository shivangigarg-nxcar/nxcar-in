import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const vehicleId = formData.get('vehicle_id');
    const images = formData.getAll('images');

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicle_id is required' }, { status: 400 });
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    const nxcarForm = new FormData();
    nxcarForm.append('vehicle_id', vehicleId as string);
    for (const image of images) {
      nxcarForm.append('images', image);
    }

    const response = await fetch(`${BASE_URL}/imageUpload`, {
      method: 'POST',
      body: nxcarForm,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
