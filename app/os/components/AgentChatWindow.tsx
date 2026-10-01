'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, PaperPlaneRight, ArrowsOutSimple } from '@phosphor-icons/react';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';

export function AgentChatWindow({ 
  agent, 
  onClose, 
  initialPosition = { x: 50, y: 50 },
  zIndex = 50,
  bringToFront
}: { 
  agent: any; 
  onClose: () => void;
  initialPosition?: { x: number, y: number };
  zIndex?: number;
  bringToFront?: () => void;
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/os/agents/${agent.id}/chat`,
    initialMessages: [
      { id: '1', role: 'assistant', content: `Hello! I'm ${agent.name}. How can I help you today?` }
    ]
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isMinimized) {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-6 right-6 bg-surface border border-border-main rounded-full p-2 flex items-center gap-3 shadow-xl cursor-pointer hover:bg-surface/80 transition-colors z-[100]"
        onClick={() => setIsMinimized(false)}
        style={{ zIndex }}
      >
        <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center border border-border-soft text-xl">
          {agent.avatar_emoji || '🤖'}
        </div>
        <div className="pr-4 flex flex-col">
          <span className="text-sm font-semibold text-text-main leading-tight">{agent.name}</span>
          <span className="text-[10px] text-text-muted leading-tight truncate max-w-[120px]">
            {agent.status === 'working' ? agent.current_task_title || 'Working...' : 'Click to open'}
          </span>
        </div>
        {agent.status === 'working' && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-success-main rounded-full border-2 border-surface animate-pulse" />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, y: 20, ...initialPosition }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      onPointerDown={bringToFront}
      style={{ zIndex }}
      className="fixed flex flex-col w-[340px] h-[480px] bg-surface/95 backdrop-blur-xl border border-border-main rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header (Drag Handle) */}
      <div className="flex items-center justify-between p-3 border-b border-border-main bg-background/50 cursor-grab active:cursor-grabbing handle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface border border-border-soft flex items-center justify-center text-lg relative">
            {agent.avatar_emoji || '🤖'}
            {agent.status === 'working' && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success-main rounded-full border border-surface animate-pulse" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-main leading-tight">{agent.name}</span>
            <span className="text-[10px] text-text-muted leading-tight">{agent.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <Link href={`/os/org/agents/${agent.id}`} className="p-1.5 hover:bg-surface rounded-md transition-colors" title="Open Full Profile">
            <ArrowsOutSimple size={14} />
          </Link>
          <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-surface rounded-md transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-surface hover:text-warn-main rounded-md transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Current Task Banner */}
      {agent.status === 'working' && (
        <div className="px-4 py-2 bg-success-main/10 border-b border-success-main/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />
          <span className="text-xs font-medium text-success-main truncate">
            Working on: {agent.current_task_title || "Delegated task"}
          </span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-text-main text-surface rounded-br-sm' 
                : 'bg-background border border-border-main text-text-main rounded-bl-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-background border border-border-main text-text-muted px-3 py-2 rounded-2xl rounded-bl-sm text-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border-main bg-background/50">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Message ${agent.name}...`}
            className="w-full bg-surface border border-border-main text-text-main text-sm rounded-full pl-4 pr-10 py-2 outline-none focus:border-accent-main transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-1 w-8 h-8 flex items-center justify-center bg-accent-main text-white rounded-full disabled:opacity-50 transition-opacity"
          >
            <PaperPlaneRight weight="fill" size={14} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
