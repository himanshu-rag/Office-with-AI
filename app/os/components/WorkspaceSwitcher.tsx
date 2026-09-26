'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CaretUpDown, Plus, SpinnerGap, Buildings } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
    // Read current cookie if possible or just assume first is active until API returns
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
        // If no cookie was set, but we have companies, set active to the first one matching
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
      // Hard refresh to reload all layout data
      window.location.href = '/os';
    } catch (e) {
      console.error(e);
    }
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  return (
    <div className="relative border-b" style={{ borderColor: 'var(--border)' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center h-16 px-4 hover:bg-white/5 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-lg"
          style={{ background: 'var(--accent)' }}>
          {activeCompany ? activeCompany.name.charAt(0).toUpperCase() : 'A'}
        </div>
        
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              className="ml-3 flex-1 flex items-center justify-between overflow-hidden"
            >
              <span className="font-semibold text-[15px] truncate" style={{ color: 'var(--text-1)' }}>
                {loading ? 'Loading...' : activeCompany?.name || 'Ai Office'}
              </span>
              <CaretUpDown size={14} className="text-zinc-500 flex-shrink-0" />
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
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              className="absolute top-16 left-2 right-2 z-50 rounded-xl shadow-2xl overflow-hidden py-1 border"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
            >
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Workspaces
              </div>
              {companies.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSwitch(c.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors"
                  style={{ color: c.id === activeCompanyId ? 'var(--accent)' : 'var(--text-1)' }}
                >
                  <Buildings size={16} weight={c.id === activeCompanyId ? 'fill' : 'regular'} />
                  <span className="truncate flex-1">{c.name}</span>
                  {c.id === activeCompanyId && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
              <div className="h-px w-full my-1" style={{ background: 'var(--border)' }} />
              <button
                onClick={() => router.push('/onboarding')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-2)' }}
              >
                <Plus size={16} />
                Create New Company
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
