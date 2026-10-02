import { NextRequest, NextResponse } from 'next/server';
import { processTask } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.task_id || !body.company_id || !body.agent_id || !body.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fire and forget: process in the background!
    // We don't await this so the HTTP request returns immediately.
    // The background promise will execute the LLM and update the database.
    void processTask(body.task_id, body.company_id, body.agent_id, body.title, body.description);

    return NextResponse.json({ status: 'queued', message: 'Task processing started in the background' }, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
