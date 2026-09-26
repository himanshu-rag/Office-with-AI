'use client'

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatCircleText, 
  Tray, 
  Gear, 
  Robot, 
  Money, 
  Briefcase, 
  Buildings,
  CircleNotch,
  PaperPlaneRight,
  Brain,
  CheckCircle,
  XCircle,
  Clock
} from '@phosphor-icons/react';

export default function AgentProfileWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [agent, setAgent] = useState<any>(null);
  const [inbox, setInbox] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [agentRes, inboxRes] = await Promise.all([
          fetch(`/api/os/agents/${id}`),
          fetch(`/api/os/agents/${id}/inbox`)
        ]);
        
        if (agentRes.ok) {
          const agentData = await agentRes.json();
          setAgent(agentData);
        } else {
          setAgent({
            id: id,
            name: 'Agent ' + id,
            role: 'AI Assistant',
            department: 'Operations',
            status: 'Active',
            budget: 5000,
            avatar: '',
            systemPrompt: 'You are an advanced AI assistant...'
          });
        }

        if (inboxRes.ok) {
          const inboxData = await inboxRes.json();
          setInbox(inboxData.items || inboxData || []);
        } else {
          setInbox([
            { id: 1, title: 'Review System Logs', status: 'pending', type: 'approval' },
            { id: 2, title: 'Process background jobs', status: 'in-progress', type: 'work' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-zinc-400">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <CircleNotch className="w-8 h-8" weight="bold" />
        </motion.div>
      </div>
    );
  }

  if (!agent) {
    return <div className="min-h-screen bg-[var(--bg)] text-white flex items-center justify-center">Agent not found</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-zinc-100 flex flex-col md:flex-row p-4 md:p-8 gap-8 font-sans">
      {/* Left Sidebar */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-[var(--bg-2)]/50 border border-zinc-800/50 rounded-3xl p-8 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-[var(--surface)]/50 flex items-center justify-center mb-6 text-4xl font-light text-zinc-400 border border-zinc-700/50">
            {agent.avatar || <Robot className="w-16 h-16" weight="duotone" />}
          </div>
          <h1 className="text-2xl font-medium tracking-tight mb-2 text-zinc-50">{agent.name}</h1>
          <div className="flex items-center gap-2 text-sm mb-8">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {agent.status}
            </span>
          </div>

          <div className="w-full space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
              <span className="text-zinc-500 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Role</span>
              <span className="text-zinc-300 font-medium">{agent.role}</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
              <span className="text-zinc-500 flex items-center gap-2"><Buildings className="w-4 h-4" /> Department</span>
              <span className="text-zinc-300 font-medium">{agent.department}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-zinc-500 flex items-center gap-2"><Money className="w-4 h-4" /> Budget</span>
              <span className="text-zinc-300 font-medium">${agent.budget?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-h-[600px] bg-[var(--bg-2)]/30 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800/50 px-4 pt-4 gap-2">
          {[
            { id: 'chat', icon: ChatCircleText, label: 'Chat' },
            { id: 'memory', icon: Brain, label: 'Memory' },
            { id: 'inbox', icon: Tray, label: 'Inbox' },
            { id: 'settings', icon: Gear, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative rounded-t-xl ${
                activeTab === tab.id ? 'text-zinc-100 bg-[var(--surface)]/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[var(--surface)]/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-400"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 relative overflow-hidden bg-[var(--bg-2)]/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-8 overflow-y-auto"
            >
              {activeTab === 'chat' && <ChatTab agent={agent} />}
              {activeTab === 'memory' && <MemoryTab agent={agent} />}
              {activeTab === 'inbox' && <InboxTab inbox={inbox} />}
              {activeTab === 'settings' && <SettingsTab agent={agent} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { useChat } from 'ai/react';

function ChatTab({ agent }: { agent: any }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/os/agents/${agent.id}/chat`,
    initialMessages: [
      { id: '1', role: 'assistant', content: `Hello! I'm ${agent.name}. How can I assist you today?` }
    ]
  });

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="flex-1 space-y-6 mb-6 overflow-y-auto pr-4 scrollbar-thin">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-zinc-100 text-zinc-950 rounded-br-sm' 
                : 'bg-[var(--surface)]/80 text-zinc-200 border border-zinc-700/50 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed bg-[var(--surface)]/80 text-zinc-200 border border-zinc-700/50 rounded-bl-sm flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span>
               <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse delay-75"></span>
               <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse delay-150"></span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Message agent..."
          className="w-full bg-[var(--bg)]/50 border border-zinc-800 rounded-2xl px-6 py-4 pr-14 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all shadow-inner"
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[var(--surface)] rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          <PaperPlaneRight className="w-4 h-4" weight="fill" />
        </button>
      </form>
    </div>
  );
}

function InboxTab({ inbox }: { inbox: any[] }) {
  if (inbox.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Tray className="w-12 h-12 text-zinc-700" weight="thin" />
        <p>No tasks in the inbox</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {inbox.map(task => (
        <div key={task.id} className="bg-[var(--bg-2)]/50 border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between group hover:border-zinc-700 hover:bg-[var(--surface)]/30 transition-all cursor-pointer">
          <div className="flex items-center gap-5">
            <div className={`p-3 rounded-xl flex-shrink-0 ${
              task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {task.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : 
               task.status === 'in-progress' ? <Clock className="w-6 h-6" /> : 
               <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-medium text-zinc-200 text-base mb-1">{task.title}</h3>
              <div className="flex gap-3 text-xs font-medium">
                <span className="text-zinc-500 uppercase tracking-wider">{task.type}</span>
                <span className="text-zinc-600">•</span>
                <span className={`capitalize ${
                  task.status === 'completed' ? 'text-emerald-500' :
                  task.status === 'in-progress' ? 'text-blue-500' :
                  'text-amber-500'
                }`}>{task.status}</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-xl bg-[var(--surface)]/80 hover:bg-zinc-700 text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 border border-zinc-700/50">
            Review
          </button>
        </div>
      ))}
    </div>
  );
}

function SettingsTab({ agent }: { agent: any }) {
  const [model, setModel] = useState(agent.model || 'gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState(agent.system_prompt || '');
  const [budget, setBudget] = useState(agent.budget || 1000);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/os/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, system_prompt: systemPrompt, budget }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-8">
      <div className="space-y-3">
        <label className="text-sm font-medium text-zinc-400 ml-1">Model Provider</label>
        <div className="relative">
          <select 
            value={model}
            onChange={e => setModel(e.target.value)}
            className="w-full bg-[var(--bg)]/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 appearance-none shadow-inner">
            <option value="gpt-4o">OpenAI GPT-4o</option>
            <option value="claude-3-5-sonnet-20240620">Anthropic Claude 3.5 Sonnet</option>
            <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            <Gear className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-zinc-400 ml-1">System Prompt</label>
        <textarea 
          className="w-full bg-[var(--bg)]/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 min-h-[160px] resize-y shadow-inner leading-relaxed"
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          placeholder="Enter the core instructions and personality for this agent..."
        />
      </div>

      <div className="space-y-5 bg-[var(--bg-2)]/30 p-6 rounded-2xl border border-zinc-800/50">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-400">Monthly Budget Limit</label>
          <span className="text-lg font-medium text-zinc-200">${Number(budget).toLocaleString()}</span>
        </div>
        <input 
          type="range" 
          min="100" 
          max="10000" 
          step="100" 
          value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          className="w-full h-2 bg-[var(--surface)] rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-zinc-300 [&::-webkit-slider-thumb]:rounded-full"
        />
        <div className="flex justify-between text-xs font-medium text-zinc-500">
          <span>$100</span>
          <span>$10,000+</span>
        </div>
      </div>
      
      <div className="pt-6 border-t border-zinc-800/50 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-zinc-100 text-zinc-950 font-medium rounded-xl text-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/5 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}

function MemoryTab({ agent }: { agent: any }) {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/os/agents/${agent.id}/memory`)
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || []);
        setLoading(false);
      });
  }, [agent.id]);

  if (loading) {
    return <div className="flex justify-center p-8"><CircleNotch className="w-8 h-8 text-zinc-500 animate-spin" /></div>;
  }

  if (memories.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Brain className="w-12 h-12 text-zinc-700" weight="thin" />
        <p>No memories yet. This agent hasn't completed any tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {memories.map(memory => {
        let data = { date: memory.created_at || Date.now(), task: memory.key, output: memory.value };
        try {
          data = JSON.parse(memory.value);
        } catch(e) {}
        return (
          <div key={memory.id} className="bg-[var(--surface)]/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">Mission Task</span>
              <span className="text-xs text-zinc-500">{new Date(data.date).toLocaleString()}</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">{data.task}</h4>
            <div className="text-sm text-zinc-400 bg-black/20 p-4 rounded-xl border border-white/5 font-mono whitespace-pre-wrap">
              {data.output}
            </div>
          </div>
        );
      })}
    </div>
  );
}
