'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pulse, CheckCircle, Circle, MagnifyingGlass, Bell, User } from '@phosphor-icons/react';
import Link from 'next/link';
export default function AgentWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [agent, setAgent] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    Promise.all([
      fetch(`/api/os/agents/${id}`).then(r => r.json()),
      fetch(`/api/os/activity?company_id=${companyId}&limit=50`).then(r => r.json()),
      fetch(`/api/os/tasks?company_id=${companyId}`).then(r => r.json())
    ]).then(([agentData, activityData, taskData]) => {
      if (agentData.agent) setAgent(agentData.agent);
      if (activityData.activity) {
        // Filter activity for this specific agent
        const agentLogs = activityData.activity.filter((a: any) => 
          a.actor_id === id || (agentData.agent && a.event && a.event.includes(agentData.agent.name))
        );
        setLogs(agentLogs);
      }
      if (taskData.tasks) {
        setTasks(taskData.tasks.filter((t: any) => t.agent_id === id));
      }
    });
  }, [id]);
  
  const currentTask = tasks.find(t => t.state === 'in_progress' || t.state === 'WORKING' || t.state === 'TODO') || { title: 'Waiting for assignment', progress: 0 };
  
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans relative">
      
      {/* Immersive Background Image (Simulated) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0B0F14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1A2332] via-[#0B0F14] to-[#0B0F14] opacity-50" />
        
        {/* Simulate the screens glowing */}
        <div className="absolute bottom-1/4 left-1/3 w-96 h-64 bg-accent-main/20 blur-[100px] rounded-full" />
        
        {/* Floating Role Label */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-10 left-10"
        >
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent-main drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            {agent?.role || 'Developer'} Workspace
          </span>
        </motion.div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">{agent?.name || 'Agent'}</h1>
          <p className="text-sm text-text-muted">Implementing solutions and building the project</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }))} className="text-text-muted hover:text-text-main transition-colors" title="Search (Cmd+K)"><MagnifyingGlass size={20} /></button>
          <Link href="/os/inbox" className="text-text-muted hover:text-text-main transition-colors" title="Inbox"><Bell size={20} /></Link>
          <Link href="/os/settings" className="w-8 h-8 rounded-full bg-surface-2 border border-border-main flex items-center justify-center text-xs font-bold text-text-main ml-2 hover:border-accent-main transition-colors" title="Settings">A</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 p-8 flex justify-between items-start gap-8">
        
        {/* Execution Logs / Timeline (Middle Area) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 h-full max-w-3xl bg-surface/80 backdrop-blur-xl border border-border-main/50 rounded-2xl p-8 flex flex-col shadow-2xl"
        >
          <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-3">
            <Pulse size={24} className="text-accent-main" /> Execution Logs
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
            {logs.length > 0 ? logs.map((log, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={log.id} 
                className="relative pl-6 border-l-2 border-border-main"
              >
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-accent-main" />
                <div className="text-sm text-text-main font-medium">{log.event}</div>
                <div className="text-xs text-text-dim mt-1">{new Date(log.created_at).toLocaleString()}</div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-text-muted">
                <div className="w-12 h-12 rounded-full border border-border-main border-dashed flex items-center justify-center mb-4 text-text-dim">
                  <Pulse size={24} />
                </div>
                <p>No execution logs yet.</p>
                <p className="text-xs text-text-dim mt-1">Assign a task to this agent to see activity.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Overlay Panel (Current Task) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-80 bg-surface/80 backdrop-blur-xl border border-border-main/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-8 shrink-0"
        >
          {/* Current Task */}
          <div>
            <h2 className="text-lg font-bold text-text-main mb-1">Current Task</h2>
            <p className="text-sm text-text-muted mb-4">{currentTask.title}</p>
            
            <div className="flex justify-end text-xs font-bold text-text-muted mb-1">
              {currentTask.state === 'DONE' ? '100%' : currentTask.state === 'in_progress' ? '50%' : '0%'}
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border-main/30">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: currentTask.state === 'DONE' ? '100%' : currentTask.state === 'in_progress' ? '50%' : '0%' }}
                className="h-full bg-accent-main"
              />
            </div>
          </div>

          {/* Tools in use */}
          <div>
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">Tools in use</h2>
            <div className="flex justify-between gap-2">
              {[
                { name: 'Python', icon: '🐍' },
                { name: 'FastAPI', icon: '⚡' },
                { name: 'LangGraph', icon: '🕸️' },
                { name: 'PostgreSQL', icon: '🐘' }
              ].map(tool => (
                <div key={tool.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border-main flex items-center justify-center text-xl group-hover:border-accent-main/50 transition-colors shadow-inner">
                    {tool.icon}
                  </div>
                  <span className="text-[9px] font-bold text-text-dim uppercase tracking-wider group-hover:text-text-muted">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
