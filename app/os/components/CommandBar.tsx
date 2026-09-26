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
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Input row */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
            <Brain size={20} className="text-indigo-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask your AI CEO..."
              className="flex-1 bg-transparent text-white text-base placeholder:text-zinc-500 outline-none"
            />
          </div>

          {/* Quick actions */}
          <ul>
            {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800">
            <span className="text-xs text-zinc-600">
              Press <kbd className="font-mono bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded text-[10px]">ESC</kbd> to close
              {' · '}
              <kbd className="font-mono bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded text-[10px]">↵</kbd> to submit
            </span>
            <span className="text-xs text-zinc-600">
              <kbd className="font-mono bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded text-[10px]">⌘K</kbd> to toggle
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
