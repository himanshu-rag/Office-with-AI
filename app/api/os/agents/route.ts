import { NextRequest, NextResponse } from 'next/server';
import { getAgents, createAgent } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  const agents = getAgents(companyId);
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.company_id || !body.name || !body.role) return NextResponse.json({ error: 'company_id, name, role required' }, { status: 400 });
    const agent = createAgent(body);
    return NextResponse.json({ agent }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
