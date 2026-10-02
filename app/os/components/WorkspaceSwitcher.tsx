'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CaretUpDown, Plus, SpinnerGap, Buildings } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
    const cookies = document.cookie.split(';');
    const workspaceCookie = cookies.find(c => c.trim().startsWith('os_active_workspace='));
    if (workspaceCookie) {
      setActiveCompanyId(workspaceCookie.split('=')[1]);
    }
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/os/workspace/list');
      const data = await res.json();
      if (data.companies) {
        setCompanies(data.companies);
        if (data.companies.length > 0) {
           const cookies = document.cookie.split(';');
           const workspaceCookie = cookies.find(c => c.trim().startsWith('os_active_workspace='));
           if (!workspaceCookie) {
             setActiveCompanyId(data.companies[0].id);
           }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (companyId: string) => {
    if (companyId === activeCompanyId) return setIsOpen(false);
    setIsOpen(false);
    try {
      await fetch('/api/os/workspace/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId })
      });
      setActiveCompanyId(companyId);
      window.location.href = '/os';
    } catch (e) {
      console.error(e);
    }
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  return (
    <div className="relative border-b border-border-main">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center h-20 px-4 hover:bg-surface-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-main"
      >
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-lg shadow-accent-main/20 bg-accent-main transition-transform hover:scale-105 active:scale-95">
          {activeCompany ? activeCompany.name.charAt(0).toUpperCase() : 'A'}
        </div>
        
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              className="ml-3 flex-1 flex items-center justify-between overflow-hidden"
            >
              <div className="flex flex-col items-start truncate">
                <span className="text-[10px] font-medium tracking-widest uppercase text-text-muted mb-0.5">Workspace</span>
                <span className="font-semibold text-[15px] truncate text-text-main leading-none">
                  {loading ? 'Loading...' : activeCompany?.name || 'Ai Office'}
                </span>
              </div>
              <CaretUpDown size={14} className="text-text-muted flex-shrink-0 ml-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !collapsed && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              className="absolute top-20 left-2 right-2 z-50 rounded-[20px] shadow-2xl overflow-hidden p-1.5 border border-border-soft bg-background border border-border-main shadow-2xl z-50"
            >
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Switch Workspace
              </div>
              {companies.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSwitch(c.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm text-left transition-colors ${c.id === activeCompanyId ? 'bg-accent-main/10 text-accent-hover font-medium' : 'text-text-main hover:bg-surface'}`}
                >
                  <Buildings size={18} weight={c.id === activeCompanyId ? 'fill' : 'regular'} className={c.id === activeCompanyId ? 'text-accent-main' : 'text-text-dim'} />
                  <span className="truncate flex-1">{c.name}</span>
                  {c.id === activeCompanyId && <div className="w-2 h-2 rounded-full bg-accent-main shadow-[0_0_8px_rgba(10,132,255,0.8)]" />}
                </button>
              ))}
              <div className="h-px w-full my-1.5 bg-border-soft" />
              <button
                onClick={() => { window.location.href = '/onboarding'; }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm text-left text-text-muted hover:text-text-main hover:bg-surface transition-colors"
              >
                <Plus size={18} />
                Create New Company
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
