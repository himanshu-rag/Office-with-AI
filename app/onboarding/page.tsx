'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Buildings, ArrowRight, CircleNotch, Robot, Key, ShieldCheck, CheckCircle } from '@phosphor-icons/react';

const INDUSTRIES = ['Software', 'E-Commerce', 'Marketing Agency', 'Research', 'General'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Software');
  const [goal, setGoal] = useState('');
  
  // AI Config State
  const [aiMode, setAiMode] = useState<'managed' | 'byok'>('managed');
  const [apiKey, setApiKey] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name.trim()) setStep(2);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/os/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: industry, goal, aiMode, apiKey })
      });
      const data = await res.json();
      
      if (data.company) {
        document.cookie = `os_active_workspace=${data.company.id}; path=/; max-age=31536000`;
        window.location.href = '/os';
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-main/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        layout
        className="w-full max-w-2xl bg-surface border border-border-main rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        {/* Progress Bar */}
        <div className="h-1 w-full bg-surface-2">
          <motion.div 
            className="h-full bg-accent-main" 
            initial={{ width: '50%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: COMPANY DETAILS */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-14 h-14 bg-accent-main/10 border border-accent-main/20 rounded-2xl flex items-center justify-center mb-6">
                  <Buildings size={28} weight="duotone" className="text-accent-main" />
                </div>
                
                <h1 className="text-3xl font-bold text-text-main tracking-tight mb-2">Build Your Organization</h1>
                <p className="text-base text-text-muted mb-8">
                  Let's set up your autonomous workspace. What are we building today?
                </p>

                <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Company Name</label>
                    <input type="text" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Corp"
                      className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main placeholder-text-muted focus:outline-none focus:border-accent-main transition-colors" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Industry Focus</label>
                      <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main focus:outline-none focus:border-accent-main transition-colors appearance-none">
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Primary Goal (Optional)</label>
                      <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Scale revenue"
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main placeholder-text-muted focus:outline-none focus:border-accent-main transition-colors" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={!name.trim()}
                      className="w-full flex items-center justify-center gap-2 bg-text-main text-background hover:bg-white px-4 py-4 rounded-xl font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed group">
                      Configure AI Engine
                      <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: AI ENGINE CONFIGURATION */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <Robot size={28} weight="duotone" className="text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight mb-2">AI Engine Setup</h1>
                    <p className="text-base text-text-muted">
                      How would you like to power your AI workforce?
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors px-4 py-2 border border-border-main rounded-lg">
                    Back
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* Managed Plan */}
                  <div 
                    onClick={() => setAiMode('managed')}
                    className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 ${aiMode === 'managed' ? 'border-accent-main bg-accent-main/5' : 'border-border-main bg-background hover:border-border-soft'}`}
                  >
                    {aiMode === 'managed' && <div className="absolute top-4 right-4 text-accent-main"><CheckCircle size={24} weight="fill" /></div>}
                    <div className="w-10 h-10 rounded-full bg-accent-main/10 flex items-center justify-center mb-4">
                      <ShieldCheck size={20} className="text-accent-main" weight="duotone" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-1">Ai Office Managed</h3>
                    <p className="text-sm text-text-muted mb-4">Buy AI directly through our platform. Instant setup, no keys required.</p>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
                      Save 20% on Platform Fees
                    </div>
                  </div>

                  {/* BYOK Plan */}
                  <div 
                    onClick={() => setAiMode('byok')}
                    className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 ${aiMode === 'byok' ? 'border-text-main bg-surface-2' : 'border-border-main bg-background hover:border-border-soft'}`}
                  >
                    {aiMode === 'byok' && <div className="absolute top-4 right-4 text-text-main"><CheckCircle size={24} weight="fill" /></div>}
                    <div className="w-10 h-10 rounded-full bg-surface-2 border border-border-main flex items-center justify-center mb-4">
                      <Key size={20} className="text-text-main" weight="duotone" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-1">Bring Your Own Key</h3>
                    <p className="text-sm text-text-muted mb-4">Connect your own OpenAI, Anthropic, or Google API keys.</p>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface border border-border-main text-text-muted text-xs font-bold tracking-wide uppercase">
                      Standard Fees Apply
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {aiMode === 'byok' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Provider API Key</label>
                      <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..."
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main placeholder-text-muted focus:outline-none focus:border-text-main transition-colors" />
                      <p className="text-xs text-text-muted mt-2">Your key is encrypted and stored securely.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={handleCreate} 
                  disabled={loading || (aiMode === 'byok' && !apiKey.trim())}
                  className="w-full flex items-center justify-center gap-2 bg-accent-main text-white hover:bg-accent-hover px-4 py-4 rounded-xl font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <CircleNotch size={20} className="animate-spin" />
                      Initializing Organization...
                    </>
                  ) : (
                    <>
                      Deploy Workforce
                      <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
