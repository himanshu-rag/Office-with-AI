'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Buildings, Brain, Storefront, ChartLineUp, Terminal, Atom, ArrowRight, CaretLeft, Key, CheckCircle, SpinnerGap, Briefcase } from '@phosphor-icons/react';

const COMPANY_TYPES = [
  { id: 'SaaS Startup', icon: Terminal, desc: 'Digital products & platforms' },
  { id: 'Marketing Agency', icon: Storefront, desc: 'Campaigns & social media' },
  { id: 'Software Agency', icon: Briefcase, desc: 'Client development work' },
  { id: 'Research Lab', icon: Atom, desc: 'Deep analytics & data' },
  { id: 'E-commerce', icon: ChartLineUp, desc: 'Retail & storefronts' },
];

const DEFAULT_DEPARTMENTS = [
  { id: 'Strategy', icon: '🎯' },
  { id: 'Engineering', icon: '💻' },
  { id: 'Design', icon: '🎨' },
  { id: 'Marketing', icon: '📢' },
  { id: 'Operations', icon: '⚙️' },
  { id: 'Data', icon: '📊' },
  { id: 'QA', icon: '🧪' }
];

export default function OrganizationBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    departments: [] as string[],
    apiKey: '',
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleDept = (id: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(id) 
        ? prev.departments.filter(d => d !== id)
        : [...prev.departments, id]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStep(4);
    setError(null);
    try {
      const res = await fetch('/api/os/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate organization');

      // Add a slight delay for the 'Booting up CEO' visual effect
      setTimeout(() => {
        router.push('/os');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animated-mesh-bg" style={{ background: 'var(--bg)' }}>
      
      {/* Dynamic Background Glow based on steps */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{
            background: step === 3 ? 'radial-gradient(circle, #30D158 0%, transparent 70%)' : 'radial-gradient(circle, #0A84FF 0%, transparent 70%)',
            scale: step === 4 ? 1.5 : 1,
            opacity: step === 4 ? 0.2 : 0.1
          }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[80px]" 
        />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : i < step ? 'w-4 bg-blue-500/50' : 'w-4'}`} style={{ background: i >= step ? 'var(--border)' : undefined }} />
            ))}
          </div>
          {step > 1 && step < 4 && (
            <button onClick={handleBack} className="flex items-center gap-2 text-xs font-semibold transition-colors" style={{ color: 'var(--text-3)' }}>
              <CaretLeft weight="bold" /> BACK
            </button>
          )}
        </div>

        <div className="card glass-panel relative overflow-hidden" style={{ minHeight: 480, background: 'var(--surface)' }}>
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <AnimatePresence mode="wait">
            
            {/* STEP 1: Company Profile */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12 flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>Create Your AI Company</h1>
                  <p style={{ color: 'var(--text-2)' }}>First, give your organization an identity.</p>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>Company Name</label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                      placeholder="e.g. Acme Corp"
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>Company Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {COMPANY_TYPES.map(type => {
                        const Icon = type.icon;
                        const isSelected = formData.companyType === type.id;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setFormData({...formData, companyType: type.id})}
                            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200`}
                            style={{ 
                              background: isSelected ? 'var(--accent-bg)' : 'var(--surface-2)', 
                              borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                            }}
                          >
                            <Icon size={24} weight={isSelected ? "duotone" : "regular"} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-3)' }} />
                            <div>
                              <div className="font-semibold text-sm" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-1)' }}>{type.id}</div>
                              <div className="text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--text-3)' }}>{type.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!formData.companyName || !formData.companyType}
                  className="mt-8 w-full py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue to Departments <ArrowRight weight="bold" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Departments */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12 flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>Structure Organization</h1>
                  <p style={{ color: 'var(--text-2)' }}>Choose the AI departments your CEO will manage. Don't worry, you can change these later.</p>
                </div>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
                  {DEFAULT_DEPARTMENTS.map(dept => {
                    const isSelected = formData.departments.includes(dept.id);
                    return (
                      <button
                        key={dept.id}
                        onClick={() => toggleDept(dept.id)}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 ${isSelected ? 'shadow-[0_0_20px_rgba(10,132,255,0.2)] scale-[1.02]' : ''}`}
                        style={{ 
                          background: isSelected ? 'var(--accent-bg)' : 'var(--surface-2)', 
                          borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                        }}
                      >
                        <span className="text-2xl">{dept.icon}</span>
                        <span className="text-sm font-medium" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-2)' }}>{dept.id}</span>
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={handleNext}
                  disabled={formData.departments.length === 0}
                  className="mt-8 w-full py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Configure AI CEO <ArrowRight weight="bold" />
                </button>
              </motion.div>
            )}

            {/* STEP 3: API Key */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12 flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>Connect AI CEO</h1>
                  <p style={{ color: 'var(--text-2)' }}>Your AI CEO needs intelligence to orchestrate the company. Provide an OpenAI API key to boot up the orchestrator.</p>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="p-5 rounded-xl mb-8 flex gap-4 items-start" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                    <Brain size={24} weight="duotone" className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                    <div>
                      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--accent)' }}>Provider-Agnostic Architecture</h4>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--accent)', opacity: 0.8 }}>
                        Currently locking in OpenAI for the CEO orchestrator. Your keys are stored entirely securely and are only used locally by your agents. You can skip this and add it later in the OS settings.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-between" style={{ color: 'var(--text-3)' }}>
                      OpenAI API Key
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">ENCRYPTED</span>
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                      <input 
                        type="password" 
                        value={formData.apiKey}
                        onChange={e => setFormData({...formData, apiKey: e.target.value})}
                        placeholder="sk-proj-... (Optional for now)"
                        className="w-full rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono text-sm"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                        autoFocus
                      />
                    </div>
                  </div>
                  {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">{error}</div>}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Generate Organization <ArrowRight weight="bold" />
                  </button>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, apiKey: '' }));
                      handleSubmit();
                    }}
                    disabled={loading}
                    className="px-6 py-3.5 rounded-xl font-medium transition-colors text-zinc-400 hover:text-white bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)]"
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Loading / Generating */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-12 flex flex-col items-center justify-center h-full text-center">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: 'var(--border)' }} />
                  <div className="absolute inset-0 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)' }} />
                  <Brain size={40} weight="duotone" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: 'var(--accent)' }} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>Generating Organization...</h2>
                <p style={{ color: 'var(--text-2)' }}>Your AI CEO is booting up and assigning departments.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
