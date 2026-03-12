import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from '@lib/constants';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const nxcarUserId = cookieStore.get('nxcar_user_id')?.value;

    const formData = await request.formData();
    const vehicleId = formData.get('vehicle_id');

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicle_id is required' }, { status: 400 });
    }

    const nxcarForm = new FormData();
    nxcarForm.append('vehicle_id', vehicleId as string);

    if (nxcarUserId) {
      nxcarForm.append('user_id', nxcarUserId);
    }

    const docFields = ['rc_copy', 'rc_copy_back', 'insurance_policy_copy', 'pan_card', 'cheque_or_bank_details'];
    for (const field of docFields) {
      const file = formData.get(field);
      if (file instanceof Blob) {
        const filename = (file as File).name || `${field}_${Date.now()}.jpg`;
        nxcarForm.append(field, file, filename);
      }
    }

    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = authToken;
    }

    const response = await fetch(`${BASE_URL}/sellform-documents-upload`, {
      method: 'POST',
      headers,
      body: nxcarForm,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Nxcar sellform documents upload error:', response.status, data);
      let errorMsg = 'Failed to upload documents';
      if (typeof data === 'string') errorMsg = data;
      else if (data?.message) errorMsg = data.message;
      else if (data?.error) errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Sellform documents upload error:', error);
    return NextResponse.json({ error: 'Failed to upload documents' }, { status: 500 });
  }
}
