import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getActivity, addActivity } from '@/lib/os-db';
import { processChat } from '@/lib/ai-engine';

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
  
  // Trigger AI reply if user posts a message in chat
  if (body.actor_type === 'user' && body.event && body.event.includes('Message:')) {
    const text = body.event.replace('Message:', '').trim();
    void processChat(body.company_id, body.mission_id || null, text);
  }
  
  return NextResponse.json({ ok: true });

}
