import { NextRequest, NextResponse } from 'next/server';
import { getMission, updateMission, getTasks } from '@/lib/os-db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = getMission(id);
  if (!mission) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const tasks = getTasks(id);
  return NextResponse.json({ mission, tasks });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  updateMission(id, body);
  return NextResponse.json({ mission: getMission(id) });
}
