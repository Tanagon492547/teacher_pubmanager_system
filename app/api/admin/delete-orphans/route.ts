import { NextResponse } from 'next/server';

export async function POST() {
  // This endpoint was removed. Keep a harmless response to avoid runtime import errors.
  return NextResponse.json({ success: false, error: 'Endpoint removed' }, { status: 410 });
}
