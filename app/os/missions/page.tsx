'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Target, Clock, CheckCircle, RocketLaunch, CurrencyDollar } from '@phosphor-icons/react';
import { useCompany } from '@/lib/hooks/use-company';

interface Mission {
  id: string;
  title: string;
  objective: string;
  status: 'draft' | 'in_progress' | 'completed';
  progress: number;
  cost: number;
  created_at: string;
}

export default function MissionsPage() {
  const { companyId, loading: companyLoading } = useCompany();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyLoading) return;
    
    const fetchMissions = async () => {
      try {
        if (!companyId) {
          setError('No company selected.');
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/os/missions`);
        if (!res.ok) {
          throw new Error('Failed to fetch missions');
        }
        const data = await res.json();
        setMissions(data.missions || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [companyId, companyLoading]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle weight="fill" className="text-emerald-500" />;
      case 'in_progress': return <RocketLaunch weight="fill" className="text-fuchsia-500" />;
      default: return <Clock weight="fill" className="text-zinc-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Draft';
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans" style={{ background: 'var(--bg)', color: 'var(--text-1)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
              <Target weight="duotone" className="text-fuchsia-500" />
              Missions
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">Strategic objectives and ongoing operations.</p>
          </div>
          <Link
            href="/os/missions/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-gradient-brand hover-glow text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus weight="bold" />
            New Mission
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm">
            {error}
          </div>
        ) : missions.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <Target weight="duotone" className="text-zinc-700 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-300">No active missions</h3>
            <p className="text-zinc-500 mt-1 text-sm">Create your first mission to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link href={`/os/missions/${mission.id}`} className="block group">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] h-full flex flex-col">
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(mission.status)}
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          {getStatusLabel(mission.status)}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {new Date(mission.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-zinc-100 mb-2 group-hover:text-fuchsia-400 transition-colors">
                      {mission.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-400 mb-6 line-clamp-2 flex-grow">
                      {mission.objective}
                    </p>

                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-zinc-300">{mission.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-brand hover-glow rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${mission.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <CurrencyDollar weight="bold" className="text-zinc-500" />
                          <span className="text-sm font-medium text-zinc-300">
                            ${(mission.cost || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
