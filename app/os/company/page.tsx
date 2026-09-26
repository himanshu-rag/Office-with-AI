'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gear, Users, Building, CaretRight } from '@phosphor-icons/react';
import AgentStatusBadge from '../components/AgentStatus';

interface Company {
  id: string;
  name: string;
  industry?: string;
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'idle' | 'working' | 'offline' | 'error';
  is_ceo?: boolean;
}
import { useCompany } from '@/lib/hooks/use-company';

export default function CompanyOverviewPage() {
  const router = useRouter();
  const { companyId, loading: companyLoading } = useCompany();
  const [company, setCompany] = useState<Company | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companyLoading) return;
    if (!companyId) {
      router.push('/onboarding');
      return;
    }
  }, [companyId, companyLoading, router]);

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [companiesRes, agentsRes] = await Promise.all([
          fetch('/api/os/companies').catch(() => null),
          fetch(`/api/os/agents?company_id=${companyId}`).catch(() => null)
        ]);

        if (companiesRes?.ok) {
          const data = await companiesRes.json();
          const currentCompany = Array.isArray(data) ? data.find((c: any) => c.id === companyId) || data[0] : data;
          setCompany(currentCompany);
        }

        if (agentsRes?.ok) {
          const agentsData = await agentsRes.json();
          setAgents(Array.isArray(agentsData) ? agentsData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg)] text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p>Loading org chart...</p>
        </div>
      </div>
    );
  }

  const ceo = agents.find(a => a.is_ceo || a.role.toLowerCase().includes('ceo'));
  const otherAgents = agents.filter(a => a.id !== ceo?.id);
  
  const departments = otherAgents.reduce((acc, agent) => {
    const dept = (agent as any).department_name || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as any, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-6 sm:p-8 md:p-12 font-sans text-zinc-100 selection:bg-gradient-brand hover-glow/30">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-900 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fuchsia-400">
              <Building size={20} weight="duotone" />
              <span className="text-sm font-semibold tracking-wider uppercase">Company Overview</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {company?.name || 'Your Company'}
            </h1>
          </div>
          <Link href="/os/settings" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-2)] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-[var(--surface)] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950">
            <Gear size={18} />
            Company Settings
          </Link>
        </header>

        <motion.div 
          className="relative space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {ceo && (
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <Link href={`/os/org/agents/${ceo.id}`} className="group relative w-full max-w-sm">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[var(--bg-2)]/50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-[var(--bg-2)] hover:shadow-[0_0_40px_-15px_rgba(99,102,241,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-400 transition-colors">{ceo.name}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{ceo.role}</p>
                    </div>
                    <AgentStatusBadge status={ceo.status} />
                  </div>
                  <div className="mt-6 flex items-center justify-end text-sm font-medium text-zinc-500 transition-colors group-hover:text-fuchsia-400">
                    View profile <CaretRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
              <div className="mt-4 h-12 w-px bg-gradient-to-b from-zinc-800 to-transparent" />
            </motion.div>
          )}

          {Object.keys(departments).length === 0 && !ceo && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm">
              <Users size={48} weight="light" className="text-zinc-600 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">No agents deployed yet</h2>
              <p className="text-zinc-400 mb-6 max-w-sm">Use the Organization builder to generate your departments and deploy your AI workforce.</p>
              <Link href="/os/org" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25">
                Go to Organization Builder
              </Link>
            </div>
          )}

          {Object.keys(departments).length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(departments).map(([deptName, deptAgents]) => (
                <motion.div key={deptName} variants={itemVariants} className="space-y-6 rounded-2xl border border-zinc-900/50 bg-[var(--bg)]/50 p-6 shadow-xl shadow-black/20 ring-1 ring-white/5">
                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-2)] text-fuchsia-400">
                      <Users size={20} weight="duotone" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-100">{deptName}</h2>
                  </div>

                  <div className="space-y-4">
                    {deptAgents.map(agent => (
                      <Link key={agent.id} href={`/os/org/agents/${agent.id}`} className="block group">
                        <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[var(--bg-2)]/40 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-[var(--surface)]/80">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-base font-medium text-zinc-200 transition-colors group-hover:text-white">
                                {agent.name}
                              </h4>
                              <p className="mt-0.5 truncate text-sm text-zinc-500 group-hover:text-zinc-400">
                                {agent.role}
                              </p>
                            </div>
                            <AgentStatusBadge status={agent.status} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
