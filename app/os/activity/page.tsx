"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Lightning,
  CheckCircle,
  ChatCircle,
  FileText,
  Clock,
  Robot
} from "@phosphor-icons/react";
import { useCompany } from '@/lib/hooks/use-company';

export default function ActivityFeedPage() {
  const { companyId, loading: companyLoading } = useCompany();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyLoading || !companyId) return;
    const fetchActivity = async () => {
      try { 
        const res = await fetch(`/api/os/activity?company_id=${companyId}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.activity || []);
        } else {
          throw new Error("No API");
        }
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [companyId, companyLoading]);

  const getIcon = (type: string) => {
    switch (type) {
      case "check": return <CheckCircle size={20} className="text-emerald-400" weight="fill" />;
      case "chat": return <ChatCircle size={20} className="text-blue-400" weight="fill" />;
      case "file": return <FileText size={20} className="text-purple-400" weight="fill" />;
      default: return <Lightning size={20} className="text-zinc-400" weight="fill" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-zinc-50 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Global Activity Feed</h1>
          <p className="text-zinc-400">Real-time pulse of your autonomous workforce.</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-[var(--surface)]"></div>

            <div className="space-y-8 relative z-10">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-[var(--bg-2)] border-4 border-zinc-950 flex items-center justify-center shadow-sm relative z-10">
                      {getIcon(event.icon)}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-[var(--bg-2)]/50 border border-zinc-800/80 rounded-2xl p-5 hover:bg-[var(--bg-2)] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{event.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-[var(--bg)] px-2.5 py-1 rounded-full border border-zinc-800">
                        <Clock size={12} />
                        {event.time}
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                      <Robot size={16} weight="duotone" className="text-zinc-400" />
                      {event.agent}
                    </div>
                  </div>
                </motion.div>
              )) }
            </div>
            
            {events.length === 0 && (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-[var(--bg-2)]/50">
                <Lightning size={48} className="mx-auto text-zinc-600 mb-4" weight="thin" />
                <h3 className="text-xl font-medium text-zinc-300 mb-2">Quiet in the office</h3>
                <p className="text-zinc-500">No recent activity found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
