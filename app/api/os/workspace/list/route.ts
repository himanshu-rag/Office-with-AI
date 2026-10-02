import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllCompanies } from '@/lib/os-db';

export async function GET() {
  try {
    const userId = "dev-user-id"; // bypassed
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const companies = getAllCompanies();
    return NextResponse.json({ companies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
