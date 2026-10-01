'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, Plus, Clock, Users, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    fetch(`/api/os/missions?company_id=${companyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.missions) setMissions(data.missions);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-8 lg:p-12 font-sans">
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Projects</h1>
            <p className="text-text-muted text-sm">Manage your company's active missions and objectives.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-main hover:bg-accent-hover text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-accent-main/20">
            <Plus weight="bold" /> New Project
          </button>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-border-main to-transparent mt-6" />
      </motion.div>

      {loading ? (
        <div className="text-text-muted flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-accent-main border-t-transparent animate-spin" />
          Loading projects...
        </div>
      ) : missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border-main rounded-2xl border-dashed">
          <Folder size={48} className="text-text-dim mb-4" />
          <h3 className="text-lg font-semibold text-text-main mb-2">No active projects</h3>
          <p className="text-sm text-text-muted mb-6 max-w-sm">You haven't launched any missions yet. Create a new project to assign tasks to your AI agents.</p>
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-2 hover:bg-border-main text-text-main rounded-xl text-sm font-semibold transition-colors">
            <Plus weight="bold" /> Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border-main rounded-2xl p-6 shadow-sm hover:border-accent-main/50 transition-colors flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Folder size={24} weight="fill" />
                </div>
                <span className="px-3 py-1 bg-success-main/10 text-success-main text-xs font-semibold rounded-full border border-success-main/20">
                  Active
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-1">{mission.title}</h3>
              <p className="text-sm text-text-muted mb-6 line-clamp-2 flex-grow">{mission.objective}</p>
              
              <div className="flex justify-between items-center pt-6 border-t border-border-main">
                <div className="flex items-center gap-1.5 text-xs text-text-dim">
                  <Clock size={14} /> {new Date(mission.created_at).toLocaleDateString()}
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-accent-main group-hover:text-accent-hover transition-colors">
                  View <ArrowRight weight="bold" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
