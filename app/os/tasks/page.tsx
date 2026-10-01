'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, DotsThree, Clock, CheckCircle, Circle, ArrowsClockwise, Kanban, GitFork } from '@phosphor-icons/react';
import WorkflowGraph from '../components/WorkflowGraph';

export default function KanbanBoard() {
  const [view, setView] = useState<'kanban' | 'flow'>('kanban');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    fetch(`/api/os/tasks?company_id=${companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.tasks) {
          // Map DB states (todo, in_progress, etc) to UI columns
          const mapped = data.tasks.map((t:any) => ({
            id: t.id,
            title: t.title,
            assignee: t.agent_name || 'Unassigned',
            status: t.state === 'in_progress' ? 'WORKING' : t.state === 'review' ? 'REVIEW' : t.state === 'done' ? 'DONE' : 'TODO',
            priority: t.priority === 'high' ? 'High' : 'Medium',
            date: new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          }));
          setTasks(mapped);
        }
      });
  }, []);
  const columns = [
    { id: 'TODO', title: 'To Do', icon: <Circle size={16} /> },
    { id: 'WORKING', title: 'In Progress', icon: <ArrowsClockwise size={16} /> },
    { id: 'REVIEW', title: 'In Review', icon: <Clock size={16} /> },
    { id: 'DONE', title: 'Done', icon: <CheckCircle size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden p-8 lg:p-12 font-sans">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Workflow / Tasks</h1>
          <p className="text-text-muted text-sm">Monitor tasks across the organization.</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-lg border border-border-main mr-4">
          <button 
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${view === 'kanban' ? 'bg-surface text-text-main shadow-sm border border-border-main' : 'text-text-muted hover:text-text-main'}`}
          >
            <Kanban size={16} /> Board
          </button>
          <button 
            onClick={() => setView('flow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${view === 'flow' ? 'bg-surface text-text-main shadow-sm border border-border-main' : 'text-text-muted hover:text-text-main'}`}
          >
            <GitFork size={16} /> Workflow
          </button>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-main hover:bg-accent-hover text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-accent-main/20">
          <Plus weight="bold" /> New Task
        </button>
      </motion.div>

      {/* Board */}
      {view === 'kanban' ? (
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col, index) => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <motion.div 
                key={col.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-80 flex flex-col bg-surface/50 border border-border-main rounded-2xl overflow-hidden h-full"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-border-main flex items-center justify-between bg-surface">
                  <div className="flex items-center gap-2 font-semibold text-text-main text-sm">
                    <span className="text-text-muted">{col.icon}</span>
                    {col.title}
                  </div>
                  <span className="bg-background px-2 py-0.5 rounded-full text-xs font-bold text-text-muted border border-border-main">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                  {columnTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index * 0.1) + (i * 0.05) }}
                      className="bg-background border border-border-main rounded-xl p-4 shadow-sm hover:border-accent-main/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          task.priority === 'High' ? 'bg-warn-main/10 text-warn-main border-warn-main/30' : 'bg-surface-2 text-text-muted border-border-main'
                        }`}>
                          {task.priority}
                        </span>
                        <button className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-main">
                          <DotsThree size={16} weight="bold" />
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-bold text-text-main mb-3 leading-snug">{task.title}</h4>
                      
                      <div className="flex items-center justify-between border-t border-border-main pt-3 mt-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-accent-main/20 flex items-center justify-center text-[10px]">
                            🤖
                          </div>
                          <span className="text-xs text-text-muted font-medium">{task.assignee}</span>
                        </div>
                        <span className="text-[10px] text-text-dim font-medium">{task.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
            })}
        </div>
      </div>
      ) : (
        <div className="flex-1 w-full h-full pb-4">
          <WorkflowGraph />
        </div>
      )}
    </div>
  );
}
