import { NextRequest, NextResponse } from 'next/server';
import { getMission, getTasks, getCompany } from '@/lib/os-db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = getMission(id);
  if (!mission) return NextResponse.json({ error: 'not found' }, { status: 404 });
  
  const tasks = getTasks(id);
  const company = getCompany(mission.company_id as string);
  
  return NextResponse.json({ mission, tasks, company });
}
