'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { PaperPlaneRight, Paperclip, FileText, Image as ImageIcon } from '@phosphor-icons/react';

const TEAM = [
  { id: '1', name: 'Alex', role: 'Manager', avatar: '👑', color: 'bg-indigo-500/20 text-indigo-400' },
  { id: '2', name: 'Sam', role: 'Researcher', avatar: '🧭', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: '3', name: 'Sarah', role: 'Analyst', avatar: '📊', color: 'bg-blue-500/20 text-blue-400' },
  { id: '4', name: 'Linus', role: 'Developer', avatar: '💻', color: 'bg-amber-500/20 text-amber-400' },
  { id: '5', name: 'Agent Q', role: 'Reviewer', avatar: '🧪', color: 'bg-fuchsia-500/20 text-fuchsia-400' },
];

import { useEffect } from 'react';

export default function TeamChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    const text = `📎 [Attached File: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]`;
    
    // Optimistic UI update
    const newMsg = {
      id: Date.now().toString(),
      agentId: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);

    // Send to DB
    fetch('/api/os/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        actor_type: 'user',
        event: text
      })
    });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    const text = inputText;
    setInputText('');
    
    // Optimistic UI update
    const newMsg = {
      id: Date.now().toString(),
      agentId: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);

    // Send to DB
    await fetch('/api/os/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        actor_type: 'user',
        event: text
      })
    });
  };

  useEffect(() => {
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    fetch(`/api/os/activity?company_id=${companyId}&limit=50`)
      .then(res => res.json())
      .then(data => {
        if (data.activity) {
          // Convert activity events into "chat" messages for now
          const mapped = data.activity.map((act: any) => ({
            id: act.id,
            agentId: act.actor_id || '1',
            text: `[System Action] ${act.event}`,
            time: new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(mapped.reverse());
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full bg-background overflow-hidden font-sans">
      
      {/* Sidebar: Agents List */}
      <div className="w-72 border-r border-border-main bg-surface/30 flex flex-col shrink-0">
        <div className="p-6 pb-4 border-b border-border-main">
          <h2 className="text-xl font-bold text-text-main">Team Chat</h2>
          <p className="text-xs text-text-muted mt-1">AI agents collaborating on projects</p>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          {TEAM.map((agent) => (
            <div key={agent.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl border border-border-main flex items-center justify-center text-lg ${agent.color}`}>
                {agent.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-text-main leading-none mb-1">{agent.name}</h4>
                <p className="text-xs text-text-muted truncate">{agent.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => {
            const agent = msg.agentId === 'user' 
              ? { name: 'You', color: 'bg-accent-main/20 text-accent-main', avatar: '🧑‍💻' }
              : (TEAM.find(a => a.id === msg.agentId) || { name: 'System', color: 'bg-surface-2 text-text-muted', avatar: '⚙️' });
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 max-w-3xl"
              >
                <div className={`w-12 h-12 shrink-0 rounded-2xl border border-border-main flex items-center justify-center text-xl shadow-sm ${agent.color} bg-surface`}>
                  {agent.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-text-main">{agent.name}</span>
                    <span className="text-xs text-text-muted">{msg.time}</span>
                  </div>
                  
                  <div className="bg-surface border border-border-main rounded-2xl rounded-tl-sm p-4 text-sm text-text-main leading-relaxed shadow-sm">
                    {msg.text.split('\n').map((line, j) => (
                      <span key={j}>{line}<br/></span>
                    ))}

                    {/* Attachment rendering */}
                    {msg.attachment && (
                      <div className="mt-4 flex items-center gap-3 p-3 bg-background border border-border-main rounded-xl max-w-sm hover:border-accent-main/50 cursor-pointer transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                          <FileText size={24} weight="duotone" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-main truncate">{msg.attachment.name}</p>
                          <p className="text-xs text-text-muted">{msg.attachment.size}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-surface border-t border-border-main shrink-0">
          <div className="max-w-4xl relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type a message to the team..." 
              className="w-full bg-background border border-border-main rounded-2xl py-4 pl-4 pr-32 text-text-main focus:outline-none focus:border-accent-main transition-colors shadow-inner"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                className="hidden" 
              />
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-text-muted hover:text-text-main transition-colors">
                <Paperclip size={20} />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-text-muted hover:text-text-main transition-colors">
                <ImageIcon size={20} />
              </button>
              <button onClick={handleSend} className="p-2 bg-accent-main hover:bg-accent-hover text-white rounded-xl shadow-md transition-all hover:scale-105">
                <PaperPlaneRight size={18} weight="fill" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
