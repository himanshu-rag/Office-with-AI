import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { getUserCompany, getDepartments, getAgents, dbRun, createDepartment, createAgent } from '@/lib/os-db';

export async function GET() {
  try {
    const userId = "dev-user-id"; // bypassed
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const activeCompanyId = cookieStore.get('os_active_workspace')?.value;
    let company = getUserCompany(userId, activeCompanyId);
    if (!company) {
      const all = require('@/lib/os-db').getAllCompanies();
      if (all.length > 0) company = all[0];
      else return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    const departments = getDepartments(company.id as string);
    const agents = getAgents(company.id as string);

    return NextResponse.json({ company, departments, agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = "dev-user-id"; // bypassed
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const activeCompanyId = cookieStore.get('os_active_workspace')?.value;
    let company = getUserCompany(userId, activeCompanyId);
    if (!company) {
      const all = require('@/lib/os-db').getAllCompanies();
      if (all.length > 0) company = all[0];
      else return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    const body = await req.json();
    const { departments, agents } = body;

    if (!departments || !agents) {
      return NextResponse.json({ error: 'Missing departments or agents' }, { status: 400 });
    }

    // For simplicity in the Org Builder:
    // We update existing records (if they have a string UUID id) and insert new ones (if they have numeric temporary IDs)
    // We also delete ones that were removed.

    const existingDepts = getDepartments(company.id as string);
    const existingAgents = getAgents(company.id as string);

    // Keep track of what we process to know what to delete
    const processedDeptIds = new Set<string>();
    const processedAgentIds = new Set<string>();

    // Process Departments
    // Map temporary ID to real ID for new departments so we can link agents
    const deptIdMap = new Map<any, string>();

    for (const d of departments) {
      if (typeof d.id === 'string' && d.id.length > 10) {
        // Update existing
        dbRun('UPDATE departments SET name = ?, icon = ? WHERE id = ? AND company_id = ?', 
          [d.name, d.icon, d.id, company.id]);
        processedDeptIds.add(d.id);
        deptIdMap.set(d.id, d.id);
      } else {
        // Create new
        const newDept = createDepartment({ company_id: company.id as string, name: d.name, icon: d.icon });
        deptIdMap.set(d.id, newDept?.id as string);
        if (newDept) processedDeptIds.add(newDept.id as string);
      }
    }

    // Delete removed departments
    for (const ed of existingDepts) {
      if (!processedDeptIds.has(ed.id as string) && !ed.is_default) {
        dbRun('DELETE FROM departments WHERE id = ?', [ed.id]);
      }
    }

    // Process Agents
    for (const a of agents) {
      const realDeptId = deptIdMap.get(a.deptId) || null;
      if (typeof a.id === 'string' && a.id.length > 10) {
        // Update existing
        dbRun('UPDATE agents SET name = ?, role = ?, avatar_emoji = ?, department_id = ? WHERE id = ? AND company_id = ?', 
          [a.name, a.role, a.emoji, realDeptId, a.id, company.id]);
        processedAgentIds.add(a.id);
      } else {
        // Create new
        const newAgent = createAgent({
          company_id: company.id as string,
          name: a.name,
          role: a.role,
          department_id: realDeptId as string,
          avatar_emoji: a.emoji,
          is_ceo: false
        });
        if (newAgent) processedAgentIds.add(newAgent.id as string);
      }
    }

    // Delete removed agents
    for (const ea of existingAgents) {
      if (!processedAgentIds.has(ea.id as string) && !ea.is_ceo) {
        dbRun('DELETE FROM agents WHERE id = ?', [ea.id]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Org Builder Save Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
