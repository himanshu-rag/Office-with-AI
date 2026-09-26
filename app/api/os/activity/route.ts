import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getActivity, addActivity } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  let companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) {
    const cookieStore = await cookies();
    companyId = cookieStore.get('os_active_workspace')?.value || null;
  }
  
  const limit = Number(req.nextUrl.searchParams.get('limit') || 50);
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  const activity = getActivity(companyId, limit);
  return NextResponse.json({ activity });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  addActivity(body);
  return NextResponse.json({ ok: true });
}
