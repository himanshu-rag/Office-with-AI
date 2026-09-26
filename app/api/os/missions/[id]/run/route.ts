import { NextRequest, NextResponse } from 'next/server';
import { orchestrateMission } from '@/lib/os-ceo';
import { runTask } from '@/lib/os-agent-runner';

// Background execution loop
function executeTasksSequentially(tasks: any[]) {
  // Fire and forget so we don't block the HTTP response
  (async () => {
    for (const task of tasks) {
      if (task.id) {
        // Run each task sequentially (in a real app, this might be parallelized based on dependencies)
        await runTask(task.id);
      }
    }
  })();
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const result = await orchestrateMission(id);
    
    // Kick off execution loop in background
    executeTasksSequentially(result.tasks);
    
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
