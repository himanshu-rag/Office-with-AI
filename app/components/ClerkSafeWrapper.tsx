'use client';

import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { LockKey, Key, ShieldCheck, ArrowRight } from '@phosphor-icons/react';

export function ClerkSafeWrapper({ 
  children, 
  hasKeys 
}: { 
  children: ReactNode;
  hasKeys: boolean;
}) {
  if (hasKeys) {
    return <ClerkProvider appearance={{ baseTheme: dark, variables: { colorPrimary: '#0A84FF' } }}>{children}</ClerkProvider>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-xl w-full">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0A84FF 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #30D158 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div className="card p-8 md:p-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto"
            style={{ background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)' }}>
            <ShieldCheck size={32} weight="duotone" style={{ color: 'var(--accent)' }} />
          </div>

          <h1 className="text-3xl font-bold text-center mb-3" style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            Authentication Setup Required
          </h1>
          <p className="text-center mb-10 text-base" style={{ color: 'var(--text-2)' }}>
            Before launching your Office-with-AI, we need to secure the database so agents belong exclusively to their owners.
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text-1)' }}>1</div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>Create a Clerk Account</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>Go to <a href="https://clerk.com" target="_blank" className="text-blue-400 hover:underline">clerk.com</a> and create a new Next.js application.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text-1)' }}>2</div>
              <div className="w-full">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>Add API Keys</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>Create a file named <code className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-1)' }}>.env.local</code> in the project root and add your keys:</p>
                <div className="p-3 rounded-lg font-mono text-xs overflow-x-auto w-full" style={{ background: 'rgba(5,5,7,0.8)', border: '1px solid var(--border)' }}>
                  <div className="whitespace-nowrap" style={{ color: '#ff7b72' }}>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY<span style={{ color: 'var(--text-1)' }}>=</span><span style={{ color: '#a5d6ff' }}>pk_test_...</span></div>
                  <div className="whitespace-nowrap mt-1" style={{ color: '#ff7b72' }}>CLERK_SECRET_KEY<span style={{ color: 'var(--text-1)' }}>=</span><span style={{ color: '#a5d6ff' }}>sk_test_...</span></div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text-1)' }}>3</div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>Restart the Server</h3>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>Once the `.env.local` file is saved, restart the Next.js dev server to apply the keys.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
