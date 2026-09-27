'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Buildings, Tray, Lightning } from '@phosphor-icons/react';

interface CommandBarProps {
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { label: 'New Mission',   icon: Target,    href: '/os/missions' },
  { label: 'View Company',  icon: Buildings, href: '/os/company'  },
  { label: 'Check Inbox',   icon: Tray,      href: '/os/inbox'    },
  { label: 'See Activity',  icon: Lightning, href: '/os/activity' },
];

export default function CommandBar({ onClose }: CommandBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface-2 border border-border-main rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Input row */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-soft">
            <Brain size={20} className="text-accent-main flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask your AI CEO..."
              className="flex-1 bg-transparent text-text-main text-base placeholder:text-text-dim outline-none"
            />
          </div>

          {/* Quick actions */}
          <ul>
            {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-text-muted hover:bg-surface hover:text-text-main transition-colors cursor-pointer"
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft bg-surface">
            <span className="text-xs text-text-dim">
              Press <kbd className="font-mono bg-background border border-border-main text-text-muted px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> to close
              {' · '}
              <kbd className="font-mono bg-background border border-border-main text-text-muted px-1.5 py-0.5 rounded text-[10px]">↵</kbd> to submit
            </span>
            <span className="text-xs text-text-dim">
              <kbd className="font-mono bg-background border border-border-main text-text-muted px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd> to toggle
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
