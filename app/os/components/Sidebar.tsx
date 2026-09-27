'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Buildings, Target, Tray, Users, Lightning, ChartBar, Gear, CaretLeft, CaretRight, PlusCircle, BookOpen, Wrench } from '@phosphor-icons/react';
import WorkspaceSwitcher from './WorkspaceSwitcher';

const NAV_ITEMS = [
  { label: 'Campus',       href: '/os/office',     icon: Buildings },
  { label: 'Missions',     href: '/os/missions',   icon: Target    },
  { label: 'Inbox',        href: '/os/inbox',      icon: Tray      },
  { label: 'Organization', href: '/os/org',        icon: Users     },
  { label: 'Activity',     href: '/os/activity',   icon: Lightning },
  { label: 'Analytics',    href: '/os/analytics',  icon: ChartBar  },
  { label: 'Knowledge',    href: '/os/knowledge',  icon: BookOpen  },
  { label: 'Tools',        href: '/os/tools',      icon: Wrench    },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const userId = "dev-user-id";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-full bg-surface border-r border-border-main flex flex-col relative z-20 flex-shrink-0"
    >
      <div className="p-4 border-b border-border-main flex items-center h-[72px]">
        {collapsed ? (
          <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-serif font-bold text-lg bg-background text-text-main border-2 border-text-main">
            A
          </div>
        ) : (
          <WorkspaceSwitcher />
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
        {NAV_ITEMS.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${isActive ? 'bg-background text-text-main border border-border-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-surface-2 border border-transparent'}
              `}
              style={{ justifyContent: collapsed ? 'center' : undefined }}>
              <item.icon size={20} weight={isActive ? "fill" : "regular"} className={isActive ? 'text-accent-main' : ''} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }} className="whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border-main flex flex-col gap-2 bg-surface">
        <Link href="/os/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-main hover:bg-surface-2 transition-colors cursor-pointer w-full text-left"
          style={{ justifyContent: collapsed ? 'center' : undefined }}>
          <Gear size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>
        
        {userId && (
          <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium"
               style={{ justifyContent: collapsed ? 'center' : undefined }}>
            <div className="w-8 h-8 rounded-full bg-accent-main text-white flex items-center justify-center font-bold text-xs border border-border-main">H</div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }} className="text-text-muted whitespace-nowrap">My Account</motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        <button onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer text-text-dim hover:text-text-muted hover:bg-surface-2"
          style={{ justifyContent: collapsed ? 'center' : undefined }}>
          {collapsed
            ? <CaretRight size={20} className="flex-shrink-0" />
            : (
              <>
                <CaretLeft size={20} className="flex-shrink-0" />
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

export default Sidebar;
