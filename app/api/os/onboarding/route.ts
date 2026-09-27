import { NextResponse } from 'next/server';
import { onboardUser } from '@/lib/os-db';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const userId = "dev-user-id"; // bypassed
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, companyType, departments, apiKey } = body;

    if (!companyName || !companyType || !departments || departments.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const email = user.emailAddresses[0]?.emailAddress || '';

    const result = onboardUser({
      userId,
      userEmail: email,
      companyName,
      companyType,
      departments,
      apiKey
    });

    const response = NextResponse.json({ success: true, companyId: result.companyId });
    response.cookies.set('os_active_workspace', result.companyId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });

    return response;
  } catch (error: any) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
