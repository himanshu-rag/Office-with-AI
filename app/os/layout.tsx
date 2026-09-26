import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getUserCompany } from '@/lib/os-db';
import { Sidebar } from './components/Sidebar';
import CommandBarWrapper from './components/CommandBarWrapper';

export default async function OSLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  // If not logged in, clerk middleware handles it, but just in case:
  if (!userId) {
    redirect('/sign-in');
  }

  const cookieStore = await cookies();
  const activeCompanyId = cookieStore.get('os_active_workspace')?.value;

  // Multi-tenant check: Does this user have a company?
  const company = getUserCompany(userId, activeCompanyId);
  
  if (!company) {
    redirect('/onboarding');
  }

  return (
    <div className="flex h-screen overflow-hidden animated-mesh-bg" style={{ fontFamily: 'inherit' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <CommandBarWrapper />
    </div>
  );
}
