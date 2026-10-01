import { NextRequest, NextResponse } from 'next/server';
import { getKnowledge, addKnowledge, addActivity } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  const knowledge = getKnowledge(companyId);
  return NextResponse.json({ knowledge });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.company_id || !body.title || !body.content || !body.category) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const item = addKnowledge(body);
    
    // Log activity
    addActivity({
      company_id: body.company_id,
      actor_type: 'agent',
      actor_id: body.updated_by, // CEO agent
      event: `Updated knowledge base: ${body.title}`
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
