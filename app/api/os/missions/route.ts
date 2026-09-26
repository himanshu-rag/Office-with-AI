import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMissions, createMission } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  let companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) {
    const cookieStore = await cookies();
    companyId = cookieStore.get('os_active_workspace')?.value || null;
  }
  
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  const missions = getMissions(companyId);
  return NextResponse.json({ missions });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.company_id || !body.objective) return NextResponse.json({ error: 'company_id and objective required' }, { status: 400 });
    const title = body.title || body.objective.slice(0, 60);
    const mission = createMission({ company_id: body.company_id, title, objective: body.objective, deadline: body.deadline });
    return NextResponse.json({ mission }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
