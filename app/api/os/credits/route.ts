import { NextRequest, NextResponse } from 'next/server';
import { getCredits, deductCredits } from '@/lib/os-db';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('company_id');
  if (!companyId) return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  const credits = getCredits(companyId);
  return NextResponse.json({ credits });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.deduct) deductCredits(body.company_id, body.amount);
  return NextResponse.json({ credits: getCredits(body.company_id) });
}
