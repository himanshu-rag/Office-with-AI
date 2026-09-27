import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const userId = "dev-user-id"; // bypassed
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { companyId } = await req.json();
    if (!companyId) return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });

    const cookieStore = await cookies();
    cookieStore.set('os_active_workspace', companyId, { path: '/' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
