import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDepartments, getAgents } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  try {
    let companyId = req.nextUrl.searchParams.get('company_id');
    if (!companyId) {
      const cookieStore = await cookies();
      companyId = cookieStore.get('os_active_workspace')?.value || null;
    }
    companyId = companyId || 'demo-company';
    
    const departments = getDepartments(companyId);
    const agents = getAgents(companyId);
    
    // Always include a virtual Coffee Room for idle agents
    const coffeeRoom = { id: 'coffee', name: 'Coffee Room', icon: '☕', color: '#f59e0b' };
    
    return NextResponse.json({ 
      departments: [...departments, coffeeRoom], 
      agents 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
