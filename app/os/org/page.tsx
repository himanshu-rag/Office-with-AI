'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Buildings, PlusCircle, Brain, Users, Robot, CaretRight, Trash, MagicWand } from '@phosphor-icons/react';

export default function OrgBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', icon: '💻' },
    { id: 2, name: 'Marketing', icon: '📈' }
  ]);
  const [agents, setAgents] = useState([
    { id: 1, name: 'Alex', role: 'Lead Dev', deptId: 1, emoji: '🤖' },
    { id: 2, name: 'Sam', role: 'Copywriter', deptId: 2, emoji: '✍️' }
  ]);

  useEffect(() => {
    fetch('/api/os/org')
      .then(res => res.json())
      .then(data => {
        if (data.departments && data.departments.length > 0) {
          setDepartments(data.departments.map((d: any) => ({
            id: d.id, name: d.name, icon: d.icon
          })));
        }
        if (data.agents && data.agents.length > 0) {
          // Filter out CEO as they are not part of a specific department in the builder
          setAgents(data.agents.filter((a: any) => !a.is_ceo).map((a: any) => ({
            id: a.id, name: a.name, role: a.role, deptId: a.department_id, emoji: a.avatar_emoji
          })));
        }
      });
  }, []);

  const addDepartment = () => {
    setDepartments([...departments, { id: Date.now(), name: 'New Dept', icon: '🏢' }]);
  };

  const saveOrg = async () => {
    setLoading(true);
    try {
      await fetch('/api/os/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departments, agents })
      });
      alert('Organization structure saved successfully!');
      router.push('/os/company');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to save organization');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGenerate = async () => {
    const prompt = window.prompt("Describe the company you want to build (e.g. 'A startup that makes developer tools')");
    if (!prompt) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/os/org/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.departments) setDepartments(data.departments);
      if (data.agents) setAgents(data.agents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] overflow-y-auto">
      <header className="flex-shrink-0 h-16 border-b border-zinc-900 px-8 flex items-center justify-between sticky top-0 bg-[var(--bg)]/80 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-brand hover-glow/10 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Organization Builder</h1>
            <p className="text-xs text-zinc-500">Design your AI workforce</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAutoGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-2)] hover:bg-[var(--surface)] text-white rounded-lg text-sm transition-colors border border-zinc-800"
          >
            <MagicWand className="w-4 h-4 text-purple-400" /> Auto-Generate
          </button>
          <button 
            onClick={saveOrg}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-brand hover-glow hover:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? <span className="animate-pulse">Saving...</span> : 'Save Organization'}
          </button>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <motion.div 
              key={dept.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-2)]/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-zinc-800 bg-[var(--bg-2)] flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{dept.icon}</span>
                  <input 
                    type="text" 
                    value={dept.name}
                    onChange={(e) => {
                      setDepartments(departments.map(d => d.id === dept.id ? { ...d, name: e.target.value } : d));
                    }}
                    className="bg-transparent text-sm font-medium text-white focus:outline-none focus:border-b border-indigo-500 w-32"
                  />
                </div>
                <button 
                  onClick={() => setDepartments(departments.filter(d => d.id !== dept.id))}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-3">
                {agents.filter(a => a.deptId === dept.id).map(agent => (
                  <div key={agent.id} className="bg-[var(--bg)] border border-zinc-800/50 rounded-xl p-3 flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-2)] flex items-center justify-center text-sm border border-zinc-800 flex-shrink-0 overflow-hidden">
                      <input 
                        type="text"
                        value={agent.emoji}
                        onChange={(e) => {
                          const val = e.target.value;
                          // simple way to keep only the last typed character/emoji
                          const emoji = val.length > 0 ? Array.from(val).pop() : '🤖';
                          setAgents(agents.map(a => a.id === agent.id ? { ...a, emoji: emoji as string } : a));
                        }}
                        className="bg-transparent text-center w-full h-full focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <input 
                        type="text"
                        value={agent.name}
                        onChange={(e) => {
                          setAgents(agents.map(a => a.id === agent.id ? { ...a, name: e.target.value } : a));
                        }}
                        className="bg-transparent text-sm text-zinc-200 font-medium focus:outline-none focus:text-white truncate w-full placeholder:text-zinc-600"
                        placeholder="Agent Name"
                      />
                      <input 
                        type="text"
                        value={agent.role}
                        onChange={(e) => {
                          setAgents(agents.map(a => a.id === agent.id ? { ...a, role: e.target.value } : a));
                        }}
                        className="bg-transparent text-xs text-zinc-500 focus:outline-none focus:text-zinc-400 truncate w-full placeholder:text-zinc-700"
                        placeholder="Agent Role"
                      />
                    </div>
                    <button 
                      onClick={() => setAgents(agents.filter(a => a.id !== agent.id))}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 p-1"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    setAgents([...agents, { id: Date.now(), name: 'New Agent', role: 'Assistant', deptId: dept.id, emoji: '🤖' }]);
                  }}
                  className="mt-2 w-full py-3 border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 hover:bg-gradient-brand hover-glow/5 rounded-xl flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-fuchsia-400 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Add Agent
                </button>
              </div>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={addDepartment}
            className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-[var(--bg-2)]/30 rounded-2xl flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-zinc-400 transition-colors min-h-[300px]"
          >
            <Buildings className="w-8 h-8" />
            <span className="text-sm font-medium">Add Department</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
