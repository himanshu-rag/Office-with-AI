'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Users, Folder, CheckSquareOffset, ChartLineUp, CheckCircle, ArrowRight, Hourglass, Target, Lightbulb, RocketLaunch, WarningCircle } from '@phosphor-icons/react';
import { useCompany } from '@/lib/hooks/use-company';

export default function HomeDashboard() {
  const [stats, setStats] = useState({ activeAgents: 0, activeProjects: 0, tasksToday: 0, completion: 0 });
  const [missions, setMissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [goal, setGoal] = useState<string>('');
  const { companyId, loading: companyLoading } = useCompany();
  
  useEffect(() => {
    if (!companyId) return;
    
    // Fetch stats & missions
    Promise.all([
      fetch(`/api/os/org`).then(r => r.json()),
      fetch(`/api/os/missions?company_id=${companyId}`).then(r => r.json()),
      fetch(`/api/os/tasks?company_id=${companyId}`).then(r => r.json()),
      fetch(`/api/os/activity?company_id=${companyId}&limit=5`).then(r => r.json())
    ]).then(([orgData, missData, taskData, actData]) => {
      const activeAgents = (orgData.agents || []).filter((a:any) => a.status === 'working').length;
      const missionsList = missData.missions || [];
      const tasksList = taskData.tasks || [];
      const completedTasks = tasksList.filter((t:any) => t.state === 'DONE').length;
      const completionRate = tasksList.length ? Math.round((completedTasks / tasksList.length) * 100) : 0;
      
      setMissions(missionsList);
      setTasks(tasksList);
      if (actData.activity) setActivities(actData.activity);
      if (orgData.company && orgData.company.goal) setGoal(orgData.company.goal);
      
      setStats({
        activeAgents: activeAgents || orgData.agents?.length || 0,
        activeProjects: missionsList.length,
        tasksToday: tasksList.length,
        completion: completionRate
      });
    }).catch(console.error);
  }, [companyId]);
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-8 lg:p-12 font-sans">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Project Dashboard</h1>
            <p className="text-text-muted text-sm">Track progress, tasks and agent activities.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-main hover:bg-accent-hover text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-accent-main/20">
              <Plus weight="bold" /> New Project
          </button>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-border-main to-transparent mt-6" />
      </motion.div>

      
      {/* CEO Strategic Goal Section */}
      <div className="mb-10 bg-surface-2 border border-accent-main/30 rounded-2xl p-8 relative shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-accent-main p-2 rounded-lg text-white shadow-md shadow-accent-main/20">
            <RocketLaunch size={20} weight="fill" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-accent-main">CEO Strategic Objective</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-text-main mb-3">
            {goal || 'Maximize Operational Efficiency & Growth'}
          </h3>
          <p className="text-base text-text-muted max-w-3xl">
            The CEO agent is currently orchestrating the organization to hit this target. Cross-departmental tasks are prioritized automatically based on direct revenue impact.
          </p>
        </div>

        <div className="bg-background/80 border border-border-main p-5 rounded-xl flex items-center gap-5">
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-400/10 text-emerald-400">
            <ChartLineUp size={24} weight="bold" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-text-main">AI Prediction: On Track</span>
              <span className="font-bold text-emerald-400">84% Probability</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border-soft">
              <div className="h-full bg-emerald-400 w-[84%]" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3 items-start p-4 rounded-xl bg-accent-main/10 border border-accent-main/20">
          <WarningCircle size={20} className="text-accent-main shrink-0 mt-0.5" />
          <p className="text-sm text-text-main">
            <span className="font-bold text-accent-main">Live Recommendation:</span> Re-allocate Marketing budget to Outbound Sales to accelerate pipeline by 12%.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          title="Active Agents" 
          value={stats.activeAgents} 
          icon={<Users size={24} weight="duotone" />} 
          color="text-accent-main"
          delay={0.1}
        />
        <MetricCard 
          title="Active Projects" 
          value={stats.activeProjects} 
          icon={<Folder size={24} weight="duotone" />} 
          color="text-accent-2"
          delay={0.2}
        />
        <MetricCard 
          title="Tasks Today" 
          value={stats.tasksToday} 
          icon={<CheckSquareOffset size={24} weight="duotone" />} 
          color="text-success-main"
          delay={0.3}
        />
        <MetricCard 
          title="Completion Rate" 
          value={`${stats.completion}%`} 
          icon={<ChartLineUp size={24} weight="duotone" />} 
          color="text-blue-400"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-surface border border-border-main rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        >
          <h2 className="text-lg font-semibold text-text-main mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-main animate-pulse" /> Live Activity Feed
          </h2>
          
          <div className="space-y-6">
            {activities.length > 0 ? activities.map((act, i) => (
              <div key={act.id}>
                <ActivityItem 
                  icon={act.event.includes('complete') ? <CheckCircle size={18} weight="fill" className="text-success-main" /> : <ArrowRight size={18} weight="bold" className="text-accent-main" />}
                  agent={act.actor_name || 'System'}
                  action={act.event}
                  time={new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  isActive={i === 0}
                />
                {i < activities.length - 1 && <div className="w-px h-6 bg-border-main ml-[9px] -my-4" />}
              </div>
            )) : <div className="text-sm text-text-muted">No recent activity.</div>}
          </div>
        </motion.div>

        {/* System Health / Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface border border-border-main rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        >
          <div>
            <h2 className="text-lg font-semibold text-text-main mb-6">System Health</h2>
            <div className="space-y-4">
              <HealthBar label="API Latency" value={15} max={100} color="bg-success-main" suffix="ms" />
              <HealthBar label="CPU Load (Simulated)" value={42} max={100} color="bg-accent-main" suffix="%" />
              <HealthBar label="Memory Usage" value={78} max={100} color="bg-warn-main" suffix="%" />
            </div>
          </div>
          
          <Link href="/os/agents" className="w-full mt-8 py-3 bg-accent-main/10 hover:bg-accent-main/20 border border-accent-main/30 text-accent-main rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            Configure Agents
          </Link>
        </motion.div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-surface border border-border-main rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(79,70,229,0.1)] hover:border-accent-main/50 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-background border border-border-main group-hover:bg-background-2 transition-colors ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
      <div className="text-3xl font-bold text-text-main">{value}</div>
    </motion.div>
  );
}

function ActivityItem({ icon, agent, action, time, isActive }: any) {
  return (
    <div className="flex items-start gap-4 group">
      <div className={`mt-0.5 p-1 bg-background rounded-full border border-border-main ${isActive ? 'shadow-[0_0_10px_rgba(79,70,229,0.3)]' : ''}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-text-main">
          <span className="font-semibold">{agent}</span> <span className="text-text-muted">{action}</span>
        </p>
        <span className="text-xs text-text-dim mt-1 block">{time}</span>
      </div>
    </div>
  );
}

function HealthBar({ label, value, max, color, suffix }: any) {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-muted">{label}</span>
        <span className="text-text-main font-medium">{value}{suffix}</span>
      </div>
      <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border-main/50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
