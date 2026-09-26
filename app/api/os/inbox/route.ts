import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTasks } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  let companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) {
    const cookieStore = await cookies();
    companyId = cookieStore.get('os_active_workspace')?.value || null;
  }
  
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  
  // For inbox, we want tasks that are completed and might need review
  const tasks = getTasks(companyId);
  const inboxItems = tasks
    .filter(t => t.state === 'completed' || t.state === 'failed')
    .map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.state,
      agent: t.agent_id ? 'Agent' : 'System',
      time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      result: t.state === 'completed' ? 'Task executed successfully.' : 'Task failed.'
    }));
    
  return NextResponse.json({ items: inboxItems });
}
