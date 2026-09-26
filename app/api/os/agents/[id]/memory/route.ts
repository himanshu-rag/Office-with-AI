import { NextRequest, NextResponse } from 'next/server';
import { getAgentMemories, getAgent } from '@/lib/os-db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const agent = getAgent(id);
    if (!agent) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    
    const memories = getAgentMemories(id);
    return NextResponse.json({ memories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
