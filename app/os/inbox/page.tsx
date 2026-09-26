"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Briefcase,
  Robot
} from "@phosphor-icons/react";

import { useCompany } from '@/lib/hooks/use-company';

export default function InboxPage() {
  const { companyId, loading: companyLoading } = useCompany();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyLoading || !companyId) return;

    const fetchInbox = async () => {
      try {
        const res = await fetch(`/api/os/inbox`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data.items || []);
        } else {
          throw new Error("No API");
        }
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [companyId, companyLoading]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Global Inbox</h1>
          <p className="text-zinc-400">Tasks and approvals requiring your attention across all agents.</p>
        </header>


        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[var(--bg-2)] border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center flex-shrink-0 mt-1">
                    <Robot weight="fill" className="text-zinc-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5"><Briefcase className="text-zinc-500"/> {task.agent}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1.5"><Clock className="text-zinc-500"/> {task.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button 
                    onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <XCircle size={24} weight="fill" />
                  </button>
                  <button 
                    onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                    className="flex items-center gap-2 px-5 py-2 bg-white text-zinc-950 font-medium rounded-full hover:bg-zinc-200 transition-colors">
                    <CheckCircle size={20} weight="fill" />
                    Approve
                  </button>
                </div>
              </motion.div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-[var(--bg-2)]/50">
                <Robot size={48} className="mx-auto text-zinc-600 mb-4" weight="thin" />
                <h3 className="text-xl font-medium text-zinc-300 mb-2">You're all caught up!</h3>
                <p className="text-zinc-500">No pending tasks or approvals.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
