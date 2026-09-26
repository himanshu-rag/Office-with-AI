import { NextRequest, NextResponse } from 'next/server';
import { getAgent, updateAgentStatus, dbRun } from '@/lib/os-db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ agent });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  if (body.status) updateAgentStatus(id, body.status, body.current_task_id);
  
  if (body.system_prompt || body.model) {
    dbRun(
      `UPDATE agents SET system_prompt = COALESCE(?, system_prompt), model = COALESCE(?, model) WHERE id = ?`,
      [body.system_prompt || null, body.model || null, id]
    );
  }
  
  return NextResponse.json({ agent: getAgent(id) });
}
