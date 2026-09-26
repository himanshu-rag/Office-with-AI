import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { getUserCompany, getCompanyApiKeys, setCompanyApiKey, removeCompanyApiKey } from '@/lib/os-db';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const activeCompanyId = cookieStore.get('os_active_workspace')?.value;
    const company = getUserCompany(userId, activeCompanyId);
    if (!company) return NextResponse.json({ error: 'No company found' }, { status: 404 });

    const keys = getCompanyApiKeys(company.id as string);
    return NextResponse.json({ keys });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const activeCompanyId = cookieStore.get('os_active_workspace')?.value;
    const company = getUserCompany(userId, activeCompanyId);
    if (!company) return NextResponse.json({ error: 'No company found' }, { status: 404 });

    const { provider, apiKey } = await req.json();
    if (!provider || !apiKey) return NextResponse.json({ error: 'Missing provider or api key' }, { status: 400 });

    setCompanyApiKey(company.id as string, provider, apiKey);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cookieStore = await cookies();
    const activeCompanyId = cookieStore.get('os_active_workspace')?.value;
    const company = getUserCompany(userId, activeCompanyId);
    if (!company) return NextResponse.json({ error: 'No company found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider');
    if (!provider) return NextResponse.json({ error: 'Missing provider' }, { status: 400 });

    removeCompanyApiKey(company.id as string, provider);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
