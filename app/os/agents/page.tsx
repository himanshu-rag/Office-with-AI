'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Robot, Circle, Activity, Gear, Briefcase } from '@phosphor-icons/react';
import Link from 'next/link';

export default function AgentsDirectory() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ agentId: '', title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleAssignTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskForm.agentId || !taskForm.title) return;
    setSubmitting(true);
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    await fetch('/api/os/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        agent_id: taskForm.agentId,
        title: taskForm.title,
        description: taskForm.description
      })
    });
    setSubmitting(false);
    setAssignModalOpen(false);
    setTaskForm({ agentId: '', title: '', description: '' });
    // Reload agents to reflect state if needed, or show toast
  };

  useEffect(() => {
    fetch('/api/os/org')
      .then(res => res.json())
      .then(data => {
        if (data.agents) setAgents(data.agents);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-8 lg:p-12 font-sans">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">AI Agents</h1>
          <p className="text-text-muted text-sm">Meet your virtual team. Monitor their progress and active tasks.</p>
        </div>
        <button onClick={() => setAssignModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-accent-main hover:bg-accent-hover text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-accent-main/20">
          <Plus weight="bold" /> Assign Task
        </button>
      </motion.div>

      <div className="h-px w-full bg-gradient-to-r from-border-main to-transparent mb-10" />

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-accent-main border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
          {agents.length === 0 && (
            <div className="col-span-full py-12 text-center text-text-muted bg-surface rounded-2xl border border-border-main">
              No agents found. Please build your organization first.
            </div>
          )}
        </div>
      )}

      {/* Assign Task Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-surface border border-border-main rounded-2xl shadow-2xl p-6"
          >
            <h2 className="text-xl font-bold text-text-main mb-4">Assign Task to Agent</h2>
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Select Agent</label>
                <select 
                  required
                  value={taskForm.agentId}
                  onChange={e => setTaskForm({...taskForm, agentId: e.target.value})}
                  className="w-full bg-background border border-border-main rounded-xl p-3 text-text-main focus:outline-none focus:border-accent-main"
                >
                  <option value="">-- Choose an agent --</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Task Title</label>
                <input 
                  required
                  type="text"
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="e.g. Implement API endpoint"
                  className="w-full bg-background border border-border-main rounded-xl p-3 text-text-main focus:outline-none focus:border-accent-main"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Task Details (Optional)</label>
                <textarea 
                  value={taskForm.description}
                  onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder="Provide context for the agent..."
                  className="w-full bg-background border border-border-main rounded-xl p-3 text-text-main focus:outline-none focus:border-accent-main min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 text-text-muted hover:text-text-main transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-2 bg-accent-main hover:bg-accent-hover text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent, index }: any) {
  // Simulate some random progress based on ID length or just hardcode
  const progress = Math.floor(Math.random() * 40) + 40; // 40-80%
  const isWorking = agent.status === 'working';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface border border-border-main rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:border-accent-main/50 transition-all group flex flex-col"
    >
      {/* Top Banner / Avatar */}
      <div className="p-6 pb-0 flex justify-center relative">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-background to-surface border border-border-main flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform duration-500">
          {agent.avatar_emoji || '🤖'}
        </div>
        
        {/* Status Badge */}
        <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isWorking ? 'bg-success-main/10 text-success-main border-success-main/30' : 'bg-surface-2 text-text-muted border-border-main'}`}>
          <Circle weight="fill" className={isWorking ? "animate-pulse" : ""} size={8} />
          {isWorking ? 'Active' : 'Standby'}
        </div>
      </div>

      {/* Info */}
      <div className="p-6 text-center flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-text-main mb-1">{agent.name}</h3>
        <p className="text-sm text-text-muted mb-6">{agent.role}</p>

        {/* Current Task area */}
        <div className="mt-auto bg-background rounded-xl p-4 border border-border-main text-left">
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2 font-medium">
            <Briefcase size={14} /> Current Task
          </div>
          <p className="text-sm text-text-main font-semibold truncate mb-3">
            {isWorking ? 'Analyzing Q3 Market Data...' : 'Waiting for assignment'}
          </p>

          {/* Progress Bar */}
          <div className="flex justify-between text-[10px] text-text-muted mb-1 uppercase font-bold">
            <span>Progress</span>
            <span>{isWorking ? `${progress}%` : '0%'}</span>
          </div>
          <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isWorking ? `${progress}%` : '0%' }}
              transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
              className="h-full bg-accent-main"
            />
          </div>
        </div>

        <Link href={`/os/agents/${agent.id}`} className="mt-4 w-full py-2.5 bg-surface-2 hover:bg-border-main text-text-main rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2">
          <Gear size={16} /> View Agent Profile
        </Link>
      </div>
    </motion.div>
  );
}
