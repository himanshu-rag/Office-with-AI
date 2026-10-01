'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TreeStructure, Sparkle, Database, Robot, Graph, CircleNotch, CaretRight, Cpu } from '@phosphor-icons/react';
import Link from 'next/link';

export default function KnowledgeBase() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'library' | 'processing'>('library');
  
  // Processing state
  const [processingItems, setProcessingItems] = useState<{id: string, title: string, progress: number}[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    try {
      const res = await fetch(`/api/os/knowledge?company_id=${companyId}`);
      const data = await res.json();
      if (data.knowledge) setKnowledge(data.knowledge);
    } catch (err) {}
    setLoading(false);
  };

  const handleRequestAgent = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    const taskTitle = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
    const processId = Math.random().toString(36).substring(7);
    
    // Switch to processing tab
    setActiveTab('processing');
    
    // Add to processing queue
    setProcessingItems(prev => [...prev, { id: processId, title: taskTitle, progress: 0 }]);
    setPrompt('');

    // Simulate the CEO taking time to map out the complex workflow (updating progress)
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 90) progress = 90;
      setProcessingItems(prev => prev.map(p => p.id === processId ? { ...p, progress } : p));
    }, 800);

    // Generate actual diagram structure
    const fakeContent = JSON.stringify({
      type: 'diagram',
      nodes: [
        { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start: ' + taskTitle }, type: 'input' },
        { id: '2', position: { x: 100, y: 200 }, data: { label: 'Analyze Requirements' } },
        { id: '3', position: { x: 400, y: 200 }, data: { label: 'Setup Environment' } },
        { id: '4', position: { x: 250, y: 350 }, data: { label: 'Execute Task' } },
        { id: '5', position: { x: 250, y: 500 }, data: { label: 'Review & Deliver' }, type: 'output' }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3', source: '1', target: '3' },
        { id: 'e2-4', source: '2', target: '4' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' }
      ]
    });

    // Wait 5 seconds total for "processing"
    setTimeout(async () => {
      clearInterval(interval);
      setProcessingItems(prev => prev.map(p => p.id === processId ? { ...p, progress: 100 } : p));
      
      const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
      await fetch('/api/os/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          category: 'Generated Workflows',
          title: taskTitle,
          content: fakeContent,
          updated_by: 'Alex (CEO)'
        })
      });
      
      setTimeout(() => {
        setProcessingItems(prev => prev.filter(p => p.id !== processId));
        fetchData();
        setActiveTab('library');
      }, 1000);
      
    }, 5000);
  };

  const categories = [...new Set(knowledge.map(k => k.category))];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-8 lg:p-12 font-sans">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight flex items-center gap-3">
            <BookOpen size={32} className="text-accent-main" /> Organization Knowledge
          </h1>
          <p className="text-text-muted mt-2 max-w-xl">
            Company workflows, architecture diagrams, and standard operating procedures. 
            <span className="text-accent-main ml-1 font-medium">Managed automatically by your AI CEO.</span>
          </p>
        </div>
        
        {/* CEO Request Form */}
        <form onSubmit={handleRequestAgent} className="relative w-full md:w-96">
          <input 
            type="text" 
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask CEO to document a workflow..."
            className="w-full bg-surface border border-border-main rounded-2xl py-3 pl-4 pr-12 text-sm text-text-main focus:outline-none focus:border-accent-main shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-accent-main hover:bg-accent-hover text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Sparkle size={16} weight="fill" />
          </button>
        </form>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-border-main pb-px">
        <button 
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'library' ? 'border-accent-main text-accent-main' : 'border-transparent text-text-muted hover:text-text-main'}`}
        >
          Library
        </button>
        <button 
          onClick={() => setActiveTab('processing')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'processing' ? 'border-accent-main text-accent-main' : 'border-transparent text-text-muted hover:text-text-main'}`}
        >
          Processing {processingItems.length > 0 && <span className="bg-accent-main/20 text-accent-main py-0.5 px-2 rounded-full text-[10px]">{processingItems.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent-main border-t-transparent rounded-full animate-spin" /></div>
      ) : activeTab === 'processing' ? (
        <div className="space-y-4 max-w-3xl">
          {processingItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-muted border border-border-main border-dashed rounded-2xl bg-surface/50">
              <Cpu size={32} className="mb-4 opacity-50" />
              <p>No active processing tasks.</p>
              <p className="text-xs mt-1">Ask the CEO to document a workflow to see it here.</p>
            </div>
          ) : (
            processingItems.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-accent-main/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(79,70,229,0.1)] relative overflow-hidden"
              >
                {/* Progress Background Fill */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-accent-main/5 transition-all duration-300 ease-out z-0" 
                  style={{ width: `${item.progress}%` }} 
                />
                
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background border border-border-main flex items-center justify-center">
                      <Robot size={20} className="text-accent-main" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-sm">CEO Agent Mapping Workflow...</h3>
                      <p className="text-xs text-text-muted">{item.title}</p>
                    </div>
                  </div>
                  <div className="text-accent-main animate-spin">
                    <CircleNotch size={24} />
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-text-muted">
                    <span>{item.progress < 30 ? 'Analyzing request...' : item.progress < 60 ? 'Generating node structure...' : item.progress < 90 ? 'Connecting edges...' : 'Finalizing diagram...'}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border-main">
                    <div 
                      className="h-full bg-accent-main transition-all duration-300 ease-out"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : knowledge.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-surface border border-border-main flex items-center justify-center mb-6 shadow-xl">
            <Robot size={40} className="text-accent-main opacity-80" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">Knowledge Base is Empty</h2>
          <p className="text-text-muted mb-8">
            Your CEO agent hasn't documented any workflows yet. Ask the CEO to map out a specific process to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2 border-b border-border-main pb-3">
                <TreeStructure size={20} className="text-text-muted" /> {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {knowledge.filter(k => k.category === category).map((item, i) => (
                  <Link href={`/os/knowledge/${item.id}`} key={item.id}>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-surface border border-border-main rounded-2xl p-6 hover:border-accent-main/50 transition-colors shadow-sm group cursor-pointer flex flex-col h-64"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-text-main text-lg group-hover:text-accent-main transition-colors line-clamp-2">{item.title}</h3>
                        <Database size={20} className="text-text-muted opacity-50 shrink-0 ml-2" />
                      </div>
                      
                      <div className="flex-1 bg-background rounded-xl p-4 mb-4 border border-border-main/50 overflow-hidden relative flex flex-col">
                        {item.content.trim().startsWith('{') ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-accent-main/50 group-hover:text-accent-main transition-colors">
                            <Graph size={48} weight="duotone" className="mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Interactive Diagram</span>
                          </div>
                        ) : (
                          <>
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent z-10" />
                            <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap">{item.content}</pre>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-medium mt-auto pt-2 border-t border-border-main/50">
                        <span className="text-text-dim flex items-center gap-1.5"><Robot size={14} /> Maintained by {item.updated_by}</span>
                        <span className="text-text-dim flex items-center gap-1 group-hover:text-accent-main transition-colors">Open <CaretRight size={12} weight="bold" /></span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
