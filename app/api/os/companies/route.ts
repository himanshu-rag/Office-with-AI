import { NextRequest, NextResponse } from 'next/server';
import { getAllCompanies, createCompany, seedDemo } from '@/lib/os-db';

export async function GET() {
  try {
    const companies = getAllCompanies();
    return NextResponse.json({ companies });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
    const company = createCompany({ name: body.name, type: body.type });
    seedDemo(String(company!.id), body.type, body.goal, body.aiMode, body.apiKey);
    return NextResponse.json({ company }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
