import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserCompanies } from '@/lib/os-db';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const companies = getUserCompanies(userId);
    return NextResponse.json({ companies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
