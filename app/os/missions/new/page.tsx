'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, CalendarBlank, CaretRight, CircleNotch } from '@phosphor-icons/react';
import { useCompany } from '@/lib/hooks/use-company';

export default function NewMissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [deadline, setDeadline] = useState('');
  const { companyId } = useCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!companyId) {
        throw new Error('No company selected.');
      }

      const res = await fetch('/api/os/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          title,
          objective,
          deadline: deadline || undefined,
          status: 'draft',
          progress: 0,
          cost: 0
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create mission');
      }

      const data = await res.json();
      router.push(`/os/missions/${data.mission?.id || data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-zinc-50 p-8 font-sans flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Link 
          href="/os/missions"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-8"
        >
          <ArrowLeft weight="bold" />
          Back to Missions
        </Link>

        <div className="bg-[var(--bg-2)] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <header className="mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand hover-glow/10 flex items-center justify-center border border-indigo-500/20">
              <Target weight="duotone" className="text-fuchsia-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white">Initialize Mission</h1>
              <p className="text-zinc-500 text-sm mt-1">Define new strategic objectives.</p>
            </div>
          </header>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🚀', title: 'Product Launch', obj: 'Research the market, define positioning, and draft a go-to-market strategy for our new product.' },
                { icon: '🔍', title: 'Competitor Analysis', obj: 'Identify our top 5 competitors, analyze their strengths and weaknesses, and produce a battle card.' },
                { icon: '✍️', title: 'Content Strategy', obj: 'Build a 30-day content calendar with topics, channels, and briefs for each piece.' },
                { icon: '🔧', title: 'Technical Audit', obj: 'Review the codebase architecture, identify technical debt, and produce an improvement roadmap.' }
              ].map(t => (
                <button
                  key={t.title}
                  type="button"
                  onClick={() => { setTitle(t.title); setObjective(t.obj); }}
                  className="flex items-start gap-2 p-3 rounded-xl border border-white/5 bg-[var(--surface)] hover:bg-[var(--surface)]/80 hover:border-white/10 transition-colors text-left"
                >
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <div className="text-[13px] font-medium text-zinc-200">{t.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
                Mission Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Project Phoenix"
                className="w-full bg-[var(--bg)] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="objective" className="block text-sm font-medium text-zinc-300">
                Objective
              </label>
              <textarea
                id="objective"
                required
                rows={4}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Describe the primary goal and expected outcomes..."
                className="w-full bg-[var(--bg)] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="deadline" className="block text-sm font-medium text-zinc-300">
                Deadline <span className="text-zinc-600 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <CalendarBlank weight="regular" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-gradient-brand hover-glow text-white font-medium py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                {loading ? (
                  <>
                    <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    Launch Mission
                    <CaretRight weight="bold" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
