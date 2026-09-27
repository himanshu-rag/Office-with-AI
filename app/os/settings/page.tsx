'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Key, Cpu, CheckCircle, WarningCircle } from '@phosphor-icons/react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('billing');

  return (
    <div className="flex h-full bg-background-2 text-text-main overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto p-10">
        
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">Platform Settings</h1>
          <p className="text-text-muted">Manage your subscription, compute credits, and AI API keys.</p>
        </header>

        <div className="flex gap-10">
          {/* Sidebar Nav */}
          <div className="w-64 flex-shrink-0 space-y-2">
            {[
              { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
              { id: 'keys', label: 'Bring Your Own AI (BYOK)', icon: Key },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-surface border border-border-main text-text-main shadow-sm' 
                    : 'text-text-muted hover:text-text-main hover:bg-surface/50 border border-transparent'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-accent-main' : 'text-text-dim'} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'billing' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* Current Plan */}
                <section className="bg-surface border border-border-main rounded-[24px] p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1 text-text-main">Managed AI Workforce</h2>
                      <p className="text-sm text-text-muted">You are currently on the fully managed plan. Platform and AI compute fees are combined.</p>
                    </div>
                    <span className="px-3 py-1 bg-success-main/10 text-success-main border border-success-main/20 rounded-full text-xs font-bold tracking-wide uppercase">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-5 bg-background rounded-2xl border border-border-soft">
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Compute Credits Available</div>
                      <div className="text-3xl font-semibold text-text-main">$142.50</div>
                    </div>
                    <div className="p-5 bg-background rounded-2xl border border-border-soft">
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Platform Fee</div>
                      <div className="text-3xl font-semibold text-text-main">$99<span className="text-sm text-text-muted font-normal">/mo</span></div>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-background border border-border-main text-text-main rounded-full text-sm font-medium hover:bg-surface-2 transition-colors">
                    Manage Subscription via Stripe
                  </button>
                </section>

                {/* Purchased Models */}
                <section className="bg-surface border border-border-main rounded-[24px] p-8 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6 text-text-main">Platform AI Models Available</h2>
                  <div className="space-y-4">
                    {['GPT-4o (OpenAI)', 'Claude 3.5 Sonnet (Anthropic)', 'Gemini 1.5 Pro (Google)'].map(model => (
                      <div key={model} className="flex items-center justify-between p-4 bg-background border border-border-soft rounded-xl">
                        <div className="flex items-center gap-3">
                          <Cpu size={20} className="text-accent-main" />
                          <span className="text-sm font-medium">{model}</span>
                        </div>
                        <CheckCircle size={20} weight="fill" className="text-success-main" />
                      </div>
                    ))}
                  </div>
                </section>

              </motion.div>
            )}

            {activeTab === 'keys' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                <section className="bg-surface border border-border-main rounded-[24px] p-8 shadow-sm">
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2 text-text-main">Bring Your Own AI</h2>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Prefer to pay API providers directly? Enter your own API keys below. When a key is active, agents using that specific model will bill directly to your personal API account instead of deducting from your platform compute credits.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* OpenAI Key */}
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-2">OpenAI API Key</label>
                      <div className="flex gap-3">
                        <input 
                          type="password" 
                          placeholder="sk-proj-..." 
                          className="flex-1 bg-background border border-border-main text-text-main rounded-xl px-4 py-3 outline-none focus:border-accent-main transition-colors placeholder:text-text-dim"
                        />
                        <button className="px-6 py-3 bg-accent-main text-white rounded-xl text-sm font-medium hover:scale-[0.98] transition-transform">Save</button>
                      </div>
                    </div>

                    {/* Anthropic Key */}
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-2">Anthropic API Key</label>
                      <div className="flex gap-3">
                        <input 
                          type="password" 
                          placeholder="sk-ant-..." 
                          className="flex-1 bg-background border border-border-main text-text-main rounded-xl px-4 py-3 outline-none focus:border-accent-main transition-colors placeholder:text-text-dim"
                        />
                        <button className="px-6 py-3 bg-accent-main text-white rounded-xl text-sm font-medium hover:scale-[0.98] transition-transform">Save</button>
                      </div>
                    </div>
                    
                    {/* Gemini Key */}
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-2">Gemini API Key</label>
                      <div className="flex gap-3">
                        <input 
                          type="password" 
                          placeholder="AIzaSy..." 
                          className="flex-1 bg-background border border-border-main text-text-main rounded-xl px-4 py-3 outline-none focus:border-accent-main transition-colors placeholder:text-text-dim"
                        />
                        <button className="px-6 py-3 bg-accent-main text-white rounded-xl text-sm font-medium hover:scale-[0.98] transition-transform">Save</button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-warn-main/10 border border-warn-main/20 rounded-xl flex gap-3 items-start">
                    <WarningCircle size={20} className="text-warn-main flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-muted leading-relaxed">
                      Your keys are encrypted at rest. If you remove a key, the platform will automatically fallback to deducting from your prepaid Platform Compute Credits.
                    </p>
                  </div>

                </section>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
