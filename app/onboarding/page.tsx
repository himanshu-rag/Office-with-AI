'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Buildings, ArrowRight, CircleNotch, Robot } from '@phosphor-icons/react';

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Software');
  const [loading, setLoading] = useState(false);

  const INDUSTRIES = ['Software', 'E-Commerce', 'Marketing Agency', 'Research', 'General'];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/os/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: industry })
      });
      const data = await res.json();
      
      if (data.company) {
        document.cookie = `os_active_workspace=${data.company.id}; path=/; max-age=31536000`;
        window.location.href = '/os';
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface border border-border-main rounded-3xl shadow-2xl p-8"
      >
        <div className="w-16 h-16 bg-accent-main/10 border border-accent-main/20 rounded-2xl flex items-center justify-center mb-6">
          <Buildings size={32} weight="duotone" className="text-accent-main" />
        </div>
        
        <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2">Create New Workspace</h1>
        <p className="text-sm text-text-muted mb-8">
          Enter a name for your new organization. We will automatically provision an AI CEO and department leads.
        </p>

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">
              Company Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              disabled={loading}
              className="w-full bg-background border border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-accent-main transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">
              Industry Focus
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full bg-background border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-accent-main transition-colors disabled:opacity-50 appearance-none"
            >
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-text-main text-background hover:bg-white px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
          >
            {loading ? (
              <CircleNotch size={18} className="animate-spin text-background" />
            ) : (
              <>
                Initialize Workspace
                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-main flex items-center gap-3">
          <Robot size={20} className="text-accent-main" />
          <p className="text-xs text-text-muted leading-tight">
            An autonomous <strong className="text-text-main">Alex (CEO)</strong> agent will be initialized with a $25 credit balance for this workspace.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
