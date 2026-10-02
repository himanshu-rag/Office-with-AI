'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendUp, Lightning, CheckCircle, WarningCircle, CurrencyDollar, Users, Activity } from '@phosphor-icons/react';
import { useCompany } from '@/lib/hooks/use-company';

export default function CEODashboard() {
  const { companyId } = useCompany();
  const [goal, setGoal] = useState<string>('Maximize Operational Efficiency & Growth');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    fetch('/api/os/org')
      .then(r => r.json())
      .then(data => {
        if (data.company && data.company.goal) setGoal(data.company.goal);
        setLoading(false);
      })
      .catch(console.error);
  }, [companyId]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-8 lg:p-12 font-sans relative">
      
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-96 bg-accent-main/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2 flex items-center gap-3">
            <Brain size={32} weight="duotone" className="text-accent-main" /> AI CEO Terminal
          </h1>
          <p className="text-text-muted text-sm">Real-time strategic oversight and predictive insights from your Chief Executive Agent.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-surface border border-border-main rounded-xl shadow-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-semibold text-text-main">Alex (CEO) is Online</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Goal & Primary Stats */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Active Strategic Objective */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-2 border border-accent-main/30 rounded-2xl p-8 relative shadow-lg overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-main/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-accent-main p-2 rounded-lg text-white shadow-md shadow-accent-main/20">
                <Target size={20} weight="fill" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent-main">Active Strategic Objective</h2>
            </div>
            
            <h3 className="text-3xl font-bold text-text-main mb-4 relative z-10">
              "{loading ? 'Synchronizing...' : goal}"
            </h3>
            
            <p className="text-base text-text-muted max-w-3xl mb-8 relative z-10">
              The AI CEO is continuously re-routing tasks, adjusting department budgets, and monitoring live metrics to maximize the probability of achieving this target.
            </p>

            <div className="bg-background border border-border-main p-6 rounded-xl relative z-10">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Target Trajectory</span>
                  <span className="text-lg font-semibold text-text-main">AI Prediction: On Track</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-emerald-400">84%</span>
                  <span className="block text-xs text-text-muted font-medium mt-1">Probability of Success</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden border border-border-soft">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-emerald-400 relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* CEO Directives / Recommendations */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <Lightning size={20} className="text-accent-main" /> Latest Executive Directives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface border border-border-main rounded-xl p-5 hover:border-accent-main/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-accent-main">
                  <WarningCircle size={18} weight="bold" />
                  <span className="text-xs font-bold uppercase tracking-wider">High Priority</span>
                </div>
                <p className="text-sm text-text-main font-medium mb-2">Reallocate Marketing Budget</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Inbound pipeline is saturating. Shift 15% of resources to Outbound Sales immediately to maintain 84% success probability for the primary goal.
                </p>
              </div>
              
              <div className="bg-surface border border-border-main rounded-xl p-5 hover:border-accent-main/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                  <CheckCircle size={18} weight="bold" />
                  <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
                </div>
                <p className="text-sm text-text-main font-medium mb-2">Launch Strategy Mission Beta</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Approved the engineering timeline for Q3. Delegated 3 sub-tasks to Backend and Design departments for immediate execution.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Resource Allocation & Activity */}
        <div className="flex flex-col gap-6">
          
          {/* Resource Allocation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border border-border-main rounded-xl p-6"
          >
            <h3 className="text-sm font-bold text-text-main mb-5 flex items-center gap-2 uppercase tracking-widest">
              <CurrencyDollar size={18} className="text-text-muted" /> Resource Allocation
            </h3>
            
            <div className="space-y-4">
              <AllocationRow label="Strategy" percentage={35} color="bg-purple-500" />
              <AllocationRow label="Engineering" percentage={25} color="bg-emerald-500" />
              <AllocationRow label="Marketing" percentage={20} color="bg-blue-500" />
              <AllocationRow label="Research" percentage={15} color="bg-orange-500" />
              <AllocationRow label="Design" percentage={5} color="bg-pink-500" />
            </div>
          </motion.div>

          {/* CEO Activity Stream */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface border border-border-main rounded-xl p-6 flex-1"
          >
            <h3 className="text-sm font-bold text-text-main mb-5 flex items-center gap-2 uppercase tracking-widest">
              <Activity size={18} className="text-text-muted" /> CEO Execution Log
            </h3>
            
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-main before:to-transparent">
              
              <div className="relative flex items-start gap-4">
                <div className="absolute left-0 mt-1.5 w-6 h-6 rounded-full bg-accent-main border-4 border-surface shadow-sm z-10" />
                <div className="ml-10">
                  <p className="text-sm font-medium text-text-main">Adjusted Strategy Target</p>
                  <p className="text-xs text-text-muted mt-1">Recalculated parameters based on new goal.</p>
                  <span className="text-[10px] text-text-dim mt-2 block font-medium uppercase tracking-wider">Just now</span>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="absolute left-0 mt-1.5 w-6 h-6 rounded-full bg-surface-2 border-4 border-surface shadow-sm z-10" />
                <div className="ml-10">
                  <p className="text-sm font-medium text-text-main">Reviewed Engineering Output</p>
                  <p className="text-xs text-text-muted mt-1">Approved architecture draft for Mission Alpha.</p>
                  <span className="text-[10px] text-text-dim mt-2 block font-medium uppercase tracking-wider">2 hrs ago</span>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="absolute left-0 mt-1.5 w-6 h-6 rounded-full bg-surface-2 border-4 border-surface shadow-sm z-10" />
                <div className="ml-10">
                  <p className="text-sm font-medium text-text-main">Orchestration Cycle Complete</p>
                  <p className="text-xs text-text-muted mt-1">Synced all department leads.</p>
                  <span className="text-[10px] text-text-dim mt-2 block font-medium uppercase tracking-wider">Yesterday</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

function AllocationRow({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-main font-medium">{label}</span>
        <span className="text-text-muted">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
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
