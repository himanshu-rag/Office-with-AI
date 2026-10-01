import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  let companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) {
    const cookieStore = await cookies();
    companyId = cookieStore.get('os_active_workspace')?.value || null;
  }
  
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  
  const db = getDb();
  
  // We can calculate cost by number of tasks. Let's say each task is roughly $0.15
  const tasks = db.prepare('SELECT state, created_at, agent_id FROM tasks WHERE company_id = ?').all(companyId) as any[];
  
  const completedTasks = tasks.filter(t => t.state === 'completed');
  const totalCost = completedTasks.length * 0.15;
  const tokens = completedTasks.length * 1500;
  
  // Group by agent (department cost mock)
  const agentCosts: Record<string, number> = {};
  for (const t of completedTasks) {
    if (t.agent_id) {
       agentCosts[t.agent_id] = (agentCosts[t.agent_id] || 0) + 0.15;
    }
  }

  // Get department names for the agents
  const agents = db.prepare('SELECT id, department_id, name FROM agents WHERE company_id = ?').all(companyId) as any[];
  
  const departmentCosts: Record<string, number> = {};
  for (const a of agents) {
     const cost = agentCosts[a.id] || 0;
     departmentCosts[a.department_name] = (departmentCosts[a.department_name] || 0) + cost;
  }

  const breakdown = Object.entries(departmentCosts).map(([name, cost]) => ({
    name,
    value: cost > 0 ? cost : 0.01 // give it a tiny sliver if 0
  })).filter(d => d.value > 0);

  if (breakdown.length === 0) {
     breakdown.push({ name: 'Engineering', value: 100 }, { name: 'Marketing', value: 45 }); // Mock fallback
  }

  // Generate 30 days of data for the chart
  const chartData = [];
  let currentCost = totalCost > 0 ? totalCost * 0.2 : 5; // starting point
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    
    // Add random daily spend
    currentCost += (Math.random() * 2) + 0.1;
    
    chartData.push({
      date: d.toISOString().split('T')[0],
      cost: Number(currentCost.toFixed(2))
    });
  }

  // Make the last day exactly the total cost if we have tasks, otherwise mock curve
  if (totalCost > 0) {
    chartData[29].cost = totalCost;
  }

  return NextResponse.json({ 
    totalCost,
    tokens,
    activeAgents: agents.length,
    tasksCount: tasks.length,
    breakdown,
    chartData
  });
}
