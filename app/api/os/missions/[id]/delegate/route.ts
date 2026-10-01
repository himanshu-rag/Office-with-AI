import { NextRequest, NextResponse } from 'next/server';
import { orchestrateMission } from '@/lib/os-ceo';
import { getTasks } from '@/lib/os-db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Call the CEO orchestrator
    const result = await orchestrateMission(id);
    
    // Fetch all updated tasks
    const tasks = getTasks(id);
    
    return NextResponse.json({ success: true, plan: result.plan, tasks });
  } catch (err: any) {
    console.error("Delegate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
