import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMissions, getAgents, getTasks, getActivity, getDb } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  let companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) {
    const cookieStore = await cookies();
    companyId = cookieStore.get('os_active_workspace')?.value || null;
  }
  
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  
  const missions = getMissions(companyId);
  const activeMissions = missions.filter(m => m.status === 'in_progress').length;
  
  const agents = getAgents(companyId);
  
  // Tasks for today
  const db = getDb();
  const allTasksCount = (db.prepare('SELECT count(*) as c FROM tasks WHERE company_id = ? AND created_at >= date("now", "-1 day")').get(companyId) as any).c;
  
  const activityRaw = getActivity(companyId, 5);
  const activity = activityRaw.map(act => {
    let actorName = act.actor_type;
    if (act.actor_type === 'agent') {
      const agent = agents.find(a => a.id === act.actor_id);
      actorName = agent?.name || 'Unknown Agent';
    } else if (act.actor_type === 'user') {
      actorName = 'You';
    }
    return { ...act, actor_name: actorName };
  });
  
  return NextResponse.json({ 
    stats: {
      missions: activeMissions || missions.length,
      agents: agents.length,
      tasks_today: allTasksCount
    },
    activity
  });
}
