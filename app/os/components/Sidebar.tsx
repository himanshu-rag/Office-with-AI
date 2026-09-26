'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GridFour, Target, Tray, Lightning, UsersThree, Gear,
  PlusCircle, CaretLeft, CaretRight, Sun, Moon, SignIn,
  ChartLineUp, TreeStructure, AddressBook
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { SignInButton, SignUpButton, Show, UserButton, useUser } from '@clerk/nextjs';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/os',            icon: GridFour     },
  { label: 'Live Floor Plan', href: '/os/office',  icon: UsersThree   },
  { label: 'Missions',     href: '/os/missions',   icon: Target       },
  { label: 'Inbox',        href: '/os/inbox',      icon: Tray         },
  { label: 'Activity',     href: '/os/activity',   icon: Lightning    },
  { label: 'Analytics',    href: '/os/analytics',  icon: ChartLineUp  },
  { label: 'Organization', href: '/os/org',        icon: TreeStructure},
  { label: 'Directory',    href: '/os/company',    icon: AddressBook  },
];

export function Sidebar() {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 flex flex-col h-full relative overflow-hidden z-20"
      style={{
        background: 'rgba(5,5,7,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left-edge accent */}
      <div className="absolute left-0 top-20 bottom-20 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,132,255,0.4), transparent)' }} />

      {/* Workspace Switcher / Logo */}
      <div className="relative z-50">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5" style={{ isolation: 'isolate' }}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }, i) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <motion.div key={href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}>
              <Link href={href} title={collapsed ? label : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer relative"
                style={{
                  color: isActive ? 'var(--accent-2)' : 'var(--text-2)',
                  justifyContent: collapsed ? 'center' : undefined,
                  zIndex: 1,
                }}>
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(10,132,255,0.15)', border: '1px solid rgba(10,132,255,0.25)', zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} className="flex-shrink-0 relative"
                  style={{ color: isActive ? 'var(--accent)' : undefined }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }} className="truncate relative">{label}</motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 p-2.5 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', isolation: 'isolate' }}>
        <Link href="/os/missions/new" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer"
          style={{
            background: 'rgba(10,132,255,0.1)',
            border: '1px solid rgba(10,132,255,0.2)',
            color: 'var(--accent-2)',
            justifyContent: collapsed ? 'center' : undefined,
          }}>
          <PlusCircle size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}>New Mission</motion.span>
            )}
          </AnimatePresence>
        </Link>

        <Link href="/os/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer"
          style={{
            background: pathname === '/os/settings' ? 'rgba(10,132,255,0.15)' : 'transparent',
            color: pathname === '/os/settings' ? 'var(--accent-2)' : 'var(--text-3)',
            justifyContent: collapsed ? 'center' : undefined,
          }}>
          <Gear size={20} weight={pathname === '/os/settings' ? 'fill' : 'regular'} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}>Settings</motion.span>
            )}
          </AnimatePresence>
        </Link>

        <ThemeToggle collapsed={collapsed} />

        {/* Auth Controls */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer hover:bg-white/5"
              style={{ color: 'var(--text-3)', justifyContent: collapsed ? 'center' : undefined }}>
              <SignIn size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}>Sign In</motion.span>
                )}
              </AnimatePresence>
            </button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium"
               style={{ justifyContent: collapsed ? 'center' : undefined }}>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }} style={{ color: 'var(--text-2)' }}>My Account</motion.span>
              )}
            </AnimatePresence>
          </div>
        </Show>

        <button onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer"
          style={{ color: 'var(--text-3)', justifyContent: collapsed ? 'center' : undefined }}>
          {collapsed
            ? <CaretRight size={18} className="flex-shrink-0" />
            : (
              <>
                <CaretLeft size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}>Collapse</motion.span>
                </AnimatePresence>
              </>
            )}
        </button>
      </div>
    </motion.aside>
  );
}

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isLight = resolvedTheme === 'light';

  return (
    <button onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 cursor-pointer"
      style={{ color: 'var(--text-3)', justifyContent: collapsed ? 'center' : undefined }}>
      {isLight
        ? <Moon size={18} weight="fill" className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
        : <Sun  size={18} weight="fill" className="flex-shrink-0" style={{ color: '#FF9F0A' }} />
      }
      <AnimatePresence>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}>
            {isLight ? 'Dark mode' : 'Light mode'}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
