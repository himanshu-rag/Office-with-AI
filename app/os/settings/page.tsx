'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gear, WarningCircle, Trash, SpinnerGap, Key, Plus, CheckCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '🧠', prefix: 'sk-proj-...' },
  { id: 'anthropic', name: 'Anthropic', icon: '📝', prefix: 'sk-ant-...' },
  { id: 'google', name: 'Google (Gemini)', icon: '✨', prefix: 'AIzaSy...' },
  { id: 'openrouter', name: 'OpenRouter', icon: '🌐', prefix: 'sk-or-v1-...' }
];

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [keys, setKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [addingKeyFor, setAddingKeyFor] = useState<string | null>(null);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/os/company/keys');
      const data = await res.json();
      if (res.ok) setKeys(data.keys || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleSaveKey = async (providerId: string) => {
    if (!newKeyValue) return;
    setSavingKey(true);
    try {
      await fetch('/api/os/company/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, apiKey: newKeyValue })
      });
      await fetchKeys();
      setAddingKeyFor(null);
      setNewKeyValue('');
    } catch (e) {
      console.error(e);
    } finally {
      setSavingKey(false);
    }
  };

  const handleRemoveKey = async (providerId: string) => {
    if (!window.confirm(`Are you sure you want to remove the API key for ${providerId}? Agents using this provider will fail.`)) return;
    try {
      await fetch(`/api/os/company/keys?provider=${providerId}`, { method: 'DELETE' });
      await fetchKeys();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWorkspace = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete this workspace?\\n\\nThis will instantly destroy all AI Agents, Missions, Tasks, and Memories associated with this company. This action cannot be undone."
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch('/api/os/company', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete workspace');
      window.location.href = '/os';
    } catch (error) {
      console.error(error);
      alert("There was an error deleting the workspace.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto pb-32">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center shadow-lg">
            <Gear size={24} weight="duotone" className="text-zinc-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>Settings</h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>Manage your workspace preferences, AI Providers, and security.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* AI PROVIDERS VAULT */}
        <div className="card p-8 border border-white/5 rounded-2xl relative overflow-hidden shadow-lg" style={{ background: 'var(--surface)' }}>
          <div className="flex items-center gap-3 mb-2">
            <Key size={20} weight="duotone" style={{ color: 'var(--accent)' }} />
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>AI Providers Vault</h2>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
            Connect API keys from different AI providers. Once connected, you can assign these "brains" to specific agents in the Organization Builder based on their capabilities.
          </p>

          <div className="space-y-3">
            {loadingKeys ? (
              <div className="p-8 flex justify-center"><SpinnerGap size={24} className="animate-spin text-zinc-500" /></div>
            ) : (
              PROVIDERS.map(p => {
                const connectedKey = keys.find(k => k.provider === p.id);
                const isAdding = addingKeyFor === p.id;

                return (
                  <div key={p.id} className="p-4 rounded-xl border flex flex-col gap-3 transition-colors" style={{ background: 'var(--surface-2)', borderColor: connectedKey ? 'var(--accent)' : 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{p.icon}</span>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{p.name}</div>
                          {connectedKey ? (
                            <div className="text-[11px] font-mono text-green-400 flex items-center gap-1 mt-0.5">
                              <CheckCircle weight="fill" /> {connectedKey.masked_key}
                            </div>
                          ) : (
                            <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>Not connected</div>
                          )}
                        </div>
                      </div>
                      
                      {connectedKey ? (
                        <button onClick={() => handleRemoveKey(p.id)} className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">Disconnect</button>
                      ) : (
                        <button 
                          onClick={() => setAddingKeyFor(isAdding ? null : p.id)} 
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1 transition-colors"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-1)', background: isAdding ? 'var(--surface)' : 'transparent' }}
                        >
                          {isAdding ? 'Cancel' : <><Plus weight="bold" /> Connect</>}
                        </button>
                      )}
                    </div>

                    {/* Add Key Form Expansion */}
                    {isAdding && !connectedKey && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-3 border-t mt-1 flex gap-2" style={{ borderColor: 'var(--border)' }}>
                        <input 
                          type="password"
                          placeholder={p.prefix}
                          value={newKeyValue}
                          onChange={e => setNewKeyValue(e.target.value)}
                          className="flex-1 text-sm bg-black/20 border border-white/5 rounded-lg px-3 py-2 font-mono text-zinc-300 focus:outline-none focus:border-blue-500"
                        />
                        <button 
                          onClick={() => handleSaveKey(p.id)}
                          disabled={!newKeyValue || savingKey}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                          {savingKey ? <SpinnerGap className="animate-spin" /> : 'Save'}
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="rounded-2xl border border-red-500/30 overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="border-b border-red-500/20 bg-red-500/5 px-6 py-4 flex items-center gap-3">
            <WarningCircle size={20} className="text-red-500" weight="fill" />
            <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Delete Workspace</h3>
                <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  Permanently erase your company, all specialized agents, historical tasks, and organizational memory.
                </p>
              </div>
              
              <button 
                onClick={handleDeleteWorkspace}
                disabled={isDeleting}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/30 hover:border-red-500 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                {isDeleting ? <><SpinnerGap size={18} className="animate-spin" /> Destroying...</> : <><Trash size={18} /> Delete Workspace</>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
