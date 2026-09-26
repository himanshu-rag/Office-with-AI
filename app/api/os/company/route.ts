import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserCompany, deleteCompany } from '@/lib/os-db';

export async function DELETE() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = getUserCompany(userId);
    
    if (!company) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    // Delete the company (Cascade deletion handles the rest)
    deleteCompany(company.id as string);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete company:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
