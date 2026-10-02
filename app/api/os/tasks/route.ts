import { NextRequest, NextResponse } from 'next/server';
import { getAllTasks, createTask, addActivity } from '@/lib/os-db';
import { processTask } from '@/lib/ai-engine';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  const tasks = getAllTasks(companyId);
  return NextResponse.json({ tasks });
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.company_id || !body.title) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    
    const task = createTask({
      company_id: body.company_id,
      mission_id: body.mission_id || 'manual',
      agent_id: body.agent_id,
      title: body.title,
      description: body.description,
      priority: body.priority || 'normal',
    });

    addActivity({
      company_id: body.company_id,
      actor_type: 'user',
      event: `Assigned manual task: ${body.title}`
    });

    
    // Fire and forget: trigger the AI engine in the background
    if (task && task.agent_id) {
      void processTask(task.id as string, body.company_id, body.agent_id, body.title, body.description);
    }
    
    return NextResponse.json({ task }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
