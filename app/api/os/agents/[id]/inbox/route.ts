import { NextRequest, NextResponse } from 'next/server';
import { getInbox, createInboxItem, updateInboxStatus } from '@/lib/os-db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = getInbox(id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  if (body.action && body.item_id) {
    updateInboxStatus(body.item_id, body.action);
    return NextResponse.json({ ok: true });
  }
  const item = createInboxItem({ receiver_id: id, ...body });
  return NextResponse.json({ item }, { status: 201 });
}
