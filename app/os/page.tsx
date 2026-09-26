'use client';

import { motion } from 'framer-motion';
import { Brain, Lightning, Target, Users, Play, Command, Sparkle } from '@phosphor-icons/react';
import Link from 'next/link';

import { useCompany } from '@/lib/hooks/use-company';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

export default function DashboardHome() {
  const { companyId, loading: companyLoading } = useCompany();
  const [stats, setStats] = useState({ missions: 0, agents: 0, tasks_today: 0, burn_rate: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickLaunchText, setQuickLaunchText] = useState('');
  const [launching, setLaunching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (companyLoading || !companyId) return;

    fetch('/api/os/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.stats) {
          setStats({ ...data.stats, burn_rate: 1240 }); // Mock burn rate for now
        }
        if (data.activity) {
          setRecentActivity(data.activity);
        }
        setLoading(false);
      });
  }, [companyId, companyLoading]);

  const handleQuickLaunch = async () => {
    if (!quickLaunchText.trim() || launching || !companyId) return;
    setLaunching(true);
    
    try {
      const res = await fetch('/api/os/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          title: quickLaunchText.slice(0, 40) + '...',
          objective: quickLaunchText,
        }),
      });
      
      const data = await res.json();
      if (data.mission) {
        // Run it immediately
        await fetch(`/api/os/missions/${data.mission.id}/run`, { method: 'POST' });
        router.push(`/os/missions/${data.mission.id}`);
      }
    } catch (err) {
      console.error(err);
      setLaunching(false);
    }
  };

  const STATS = [
    { label: 'Active Missions', value: stats.missions.toString(), icon: Target, color: '#30D158' },
    { label: 'Agents Online', value: stats.agents.toString(), icon: Users, color: '#0A84FF' },
    { label: 'Tasks Today', value: stats.tasks_today.toString(), icon: Lightning, color: '#FF9F0A' },
    { label: 'Burn Rate (cr/hr)', value: stats.burn_rate.toLocaleString(), icon: Sparkle, color: '#a78bfa' },
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Headquarters</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-3)' }}>Live command center for your AI workforce.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.2)', color: '#30D158' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#30D158' }} />
            Systems Operational
          </div>
        </motion.div>

        {/* CEO Status Banner */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="card p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 20%, var(--accent-bg) 0%, transparent 60%)' }} />
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-bg)', border: '1px solid rgba(10,132,255,0.2)' }}>
                <Brain size={28} style={{ color: 'var(--accent)' }} weight="fill" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}>CEO Orchestrator</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(10,132,255,0.1)', color: 'var(--accent)' }}>Active</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  Currently orchestrating <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{stats.missions} missions</span> and monitoring <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{stats.agents} agents</span>.
                </p>
              </div>
            </div>
            
            <Link href="/os/missions/new" className="btn-primary px-6 py-3 w-full md:w-auto shrink-0 shadow-lg text-sm">
              <Command size={16} />
              New Objective
            </Link>
          </div>
        </motion.div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} custom={i + 1} initial="hidden" animate="visible" variants={fadeUp}
                whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                className="card p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: stat.color + '15', border: `1px solid ${stat.color}30` }}>
                    <Icon size={16} color={stat.color} weight="fill" />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>{stat.label}</span>
                </div>
                <div className="text-3xl font-bold mt-1" style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                  {loading ? '...' : stat.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Quick Launch */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}
            className="card p-6 flex flex-col h-full">
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-1)' }}>Quick Launch</h2>
            <div className="flex-1 flex flex-col justify-end">
              <textarea 
                value={quickLaunchText}
                onChange={e => setQuickLaunchText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleQuickLaunch(); }}
                placeholder="What should the company accomplish today?"
                className="w-full bg-transparent resize-none h-24 text-sm focus:outline-none placeholder:text-zinc-600 mb-4"
                style={{ color: 'var(--text-1)' }}
              />
              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>Press ⌘ Enter to deploy</span>
                <button 
                  onClick={handleQuickLaunch}
                  disabled={launching || !quickLaunchText.trim()}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                  style={{ background: 'var(--text-1)', color: 'var(--bg)' }}>
                  <Play size={12} weight="fill" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Live Activity Ticker */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}
            className="card p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Live Activity</h2>
              <Link href="/os/activity" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>View all</Link>
            </div>
            
            <div className="space-y-4 flex-1">
              {loading ? (
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>Loading activity...</p>
              ) : recentActivity.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>No recent activity.</p>
              ) : recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 transition-colors"
                    style={{ background: i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }} />
                  <div>
                    <p className="text-sm leading-snug" style={{ color: i === 0 ? 'var(--text-1)' : 'var(--text-2)' }}>
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-3)' }}>{act.actor_name || act.actor_type}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>•</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
