import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkSafeWrapper } from './components/ClerkSafeWrapper';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Office-with-AI — Your AI Workforce',
  description: 'Deploy specialized AI agents and watch your autonomous CEO orchestrate your operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Check if Clerk keys exist to safely wrap the app without crashing
  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans min-h-screen antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
