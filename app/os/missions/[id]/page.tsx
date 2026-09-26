'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MissionControlPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [mission, setMission] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [thoughtStreams, setThoughtStreams] = useState<Record<string, string>>({});

  // Connect to SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const setupSSE = () => {
      eventSource = new EventSource(`/api/os/missions/${id}/stream`);

      eventSource.addEventListener('update', (event) => {
        try {
          const data = JSON.parse(event.data);
          setMission(data.mission);
          setTasks(data.tasks);
          setLoading(false);
        } catch (err) {
          console.error('Failed to parse SSE data', err);
        }
      });
      
      eventSource.addEventListener('thought', (event) => {
        try {
          const data = JSON.parse(event.data);
          setThoughtStreams(prev => ({
            ...prev,
            [data.task_id]: (prev[data.task_id] || '') + data.chunk
          }));
        } catch (err) {}
      });

      eventSource.addEventListener('error', (err) => {
        console.error('SSE Error, falling back to polling');
        eventSource?.close();
        
        // Fallback to REST polling if SSE fails
        pollInterval = setInterval(async () => {
          try {
             const res = await fetch(`/api/os/missions/${id}/report`);
             if (res.ok) {
               const data = await res.json();
               setMission(data.mission);
               setTasks(data.tasks);
             }
          } catch(e) {}
        }, 3000);
      });
    };

    setupSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [id]);

  const handleRunMission = async () => {
    setIsStarting(true);
    try {
      const res = await fetch(`/api/os/missions/${id}/run`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to start mission');
      }
      setIsStarting(false);
    } catch (err) {
      console.error(err);
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-r-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }} />
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Establishing live connection to CEO...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="h-full flex items-center justify-center text-sm" style={{ color: 'var(--text-2)' }}>
        Mission not found.
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.state === 'completed').length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between p-6 md:px-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" 
               style={{ background: 'rgba(10,132,255,0.05)', border: '1px solid rgba(10,132,255,0.1)' }}>
            <span className="text-2xl text-white font-light">{progress}%</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">{mission.title}</h1>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider"
                    style={{ background: mission.status === 'in_progress' ? 'rgba(10,132,255,0.15)' : 'rgba(255,255,255,0.05)', color: mission.status === 'in_progress' ? 'var(--accent-2)' : 'var(--text-3)' }}>
                {mission.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-2)' }}>{mission.objective}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {mission.status === 'draft' && (
            <button 
              onClick={handleRunMission} 
              disabled={isStarting}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ background: 'var(--accent)', boxShadow: '0 0 20px rgba(10,132,255,0.3)' }}
            >
              {isStarting ? 'Starting...' : 'Run Mission'}
            </button>
          )}

          {mission.status === 'completed' && (
            <a 
              href={`/os/missions/${id}/report`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              View Report
            </a>
          )}
          
          {/* CEO Status Live Ring */}
          <div className="hidden md:flex items-center gap-4 px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: 'var(--accent)' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }}></span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-3)' }}>Live Connection</p>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>Streaming from DB</p>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold tracking-wider uppercase">${Math.floor(Math.random() * 5) + 2} Viewers</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        
        {/* Task DAG (Directed Acyclic Graph) - Center Stage */}
        <main className="lg:col-span-2 overflow-y-auto p-6 md:p-10 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
               style={{ background: 'radial-gradient(circle, #0A84FF 0%, transparent 60%)', filter: 'blur(100px)' }} />
          
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-8 flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
            <span style={{ color: 'var(--accent)' }}>●</span> Execution DAG
          </h2>

          <div className="space-y-6 max-w-3xl relative z-10">
            <AnimatePresence>
              {tasks.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-2xl text-center" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>Waiting for CEO to formulate plan and generate tasks...</p>
                </motion.div>
              ) : (
                tasks.map((task, idx) => {
                  const isCompleted = task.state === 'completed';
                  const isInProgress = task.state === 'in_progress';
                  const isFailed = task.state === 'failed';
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative p-5 md:p-6 rounded-2xl card overflow-hidden group"
                      style={{ 
                        border: isInProgress ? '1px solid rgba(10,132,255,0.4)' : undefined,
                        boxShadow: isInProgress ? '0 0 30px rgba(10,132,255,0.1)' : undefined
                      }}
                    >
                      {/* Connecting Line to next task */}
                      {idx < tasks.length - 1 && (
                        <div className="absolute left-[39px] top-full h-8 w-px z-0" style={{ background: isCompleted ? 'rgba(48,209,88,0.5)' : 'rgba(255,255,255,0.05)' }} />
                      )}

                      {/* Moving progress bar for active task */}
                      {isInProgress && (
                        <motion.div className="absolute bottom-0 left-0 h-0.5 bg-blue-500" 
                          initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} />
                      )}

                      <div className="flex items-start gap-5 relative z-10">
                        {/* Status Node */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-500/10 text-green-400' : isInProgress ? 'bg-blue-500/10 text-blue-400' : isFailed ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/40'}`}>
                          {isCompleted ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-white mb-1.5">{task.title}</h3>
                          {task.description && <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>{task.description}</p>}
                          
                          <div className="flex flex-wrap items-center gap-3">
                            {task.agent_name ? (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="text-sm">{task.avatar_emoji}</span>
                                <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>{task.agent_name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <span className="text-xs font-medium" style={{ color: 'var(--text-4)' }}>Unassigned</span>
                              </div>
                            )}
                            <span className="px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase" 
                                  style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-3)' }}>
                              {task.state}
                            </span>
                            
                            {/* Handoff Badge */}
                            {idx > 0 && tasks[idx - 1].state === 'completed' && (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                                <span className="text-[10px] text-purple-400 font-medium">Received from {tasks[idx - 1].avatar_emoji}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Live Thought Stream */}
                          {isInProgress && thoughtStreams[task.id] && (
                            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[13px] text-zinc-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                              <span className="text-blue-400 mr-2">❯</span>
                              {thoughtStreams[task.id]}
                              <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-blue-500 animate-pulse"></span>
                            </div>
                          )}
                          
                          {/* Completed Output */}
                          {isCompleted && task.output && (
                            <div className="mt-4 p-4 rounded-xl bg-[var(--surface)]/50 border border-white/5 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                              {task.output}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* CEO Rationale / Side Panel */}
        <aside className="border-l border-white/5 bg-black/20 overflow-y-auto p-6 md:p-10 flex flex-col gap-8">
          
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-white">CEO Rationale</h3>
            <div className="p-5 rounded-2xl text-sm leading-relaxed" 
                 style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-2)' }}>
              {mission.ceo_plan ? (
                <div className="whitespace-pre-wrap">{mission.ceo_plan}</div>
              ) : (
                <p className="italic text-white/30">The CEO is currently analyzing the objective...</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-white">Resource Usage</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-4)' }}>Total Cost</p>
                <p className="text-lg font-mono text-white">${(mission.total_cost || 0).toFixed(4)}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-4)' }}>Tokens</p>
                <p className="text-lg font-mono text-white">${(mission.cost || 0).toLocaleString()} tokens</p>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
