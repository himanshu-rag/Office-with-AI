import re

with open('app/onboarding/page.tsx', 'r') as f:
    content = f.read()

# Add new states
state_addition = """
  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('B2B');
  const [tone, setTone] = useState('Professional');
"""
content = re.sub(r"const \[goal, setGoal\] = useState\(''\);", state_addition.strip(), content)

# Update Step 1 Form
step1_form = """
                <form onSubmit={handleNext} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Company Name</label>
                      <input type="text" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Corp"
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main placeholder-text-muted focus:outline-none focus:border-accent-main transition-colors" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Industry Focus</label>
                      <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main focus:outline-none focus:border-accent-main transition-colors appearance-none">
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Target Audience</label>
                      <select value={audience} onChange={(e) => setAudience(e.target.value)}
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main focus:outline-none focus:border-accent-main transition-colors appearance-none">
                        <option>B2B (Business)</option>
                        <option>B2C (Consumer)</option>
                        <option>Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Target Revenue Goal</label>
                      <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. $100,000 MRR"
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main placeholder-text-muted focus:outline-none focus:border-accent-main transition-colors" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Company Tone</label>
                      <select value={tone} onChange={(e) => setTone(e.target.value)}
                        className="w-full bg-background border border-border-main rounded-xl px-4 py-3.5 text-base text-text-main focus:outline-none focus:border-accent-main transition-colors appearance-none">
                        <option>Professional & Corporate</option>
                        <option>Casual & Friendly</option>
                        <option>Edgy & Bold</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={!name.trim()}
                      className="w-full flex items-center justify-center gap-2 bg-accent-main text-white hover:bg-accent-hover px-4 py-4 rounded-xl font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed group">
                      Configure AI Engine
                      <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-main mt-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-text-main tracking-tight">7</div>
                      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mt-1">AI Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-400 tracking-tight">$25</div>
                      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mt-1">Free Credits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-text-main tracking-tight">0</div>
                      <div className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mt-1">Setup Time</div>
                    </div>
                  </div>
                </form>
"""
content = re.sub(
    r"<form onSubmit=\{handleNext\} className=\"space-y-6\">.*?</form>",
    step1_form.strip(),
    content,
    flags=re.DOTALL
)

# Also update Step 2 benefits
step2_benefits = """
                    <h3 className="text-lg font-bold text-text-main mb-1">Ai Office Managed</h3>
                    <p className="text-sm text-text-muted mb-4">Instant setup, automatic model routing, and built-in budget controls.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-xs font-medium text-text-main"><CheckCircle size={14} className="text-emerald-400" /> Save 20% on Platform Fees</li>
                      <li className="flex items-center gap-2 text-xs font-medium text-text-main"><CheckCircle size={14} className="text-emerald-400" /> $25 Initial Credit Grant</li>
                      <li className="flex items-center gap-2 text-xs font-medium text-text-main"><CheckCircle size={14} className="text-emerald-400" /> Multi-Model Routing</li>
                    </ul>
"""
content = re.sub(
    r"<h3 className=\"text-lg font-bold text-text-main mb-1\">Ai Office Managed</h3>.*?</div>",
    step2_benefits.strip() + "\n                  </div>",
    content,
    flags=re.DOTALL
)

step2_byok = """
                    <h3 className="text-lg font-bold text-text-main mb-1">Bring Your Own Key</h3>
                    <p className="text-sm text-text-muted mb-4">Connect your own OpenAI, Anthropic, or Google API keys directly.</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-xs font-medium text-text-main"><CheckCircle size={14} className="text-text-muted" /> 0% Markup on Tokens</li>
                      <li className="flex items-center gap-2 text-xs font-medium text-text-main"><CheckCircle size={14} className="text-text-muted" /> 100% Data Privacy</li>
                      <li className="flex items-center gap-2 text-xs font-medium text-text-main"><CheckCircle size={14} className="text-text-muted" /> Unlimited Spend</li>
                    </ul>
"""
content = re.sub(
    r"<h3 className=\"text-lg font-bold text-text-main mb-1\">Bring Your Own Key</h3>.*?</div>",
    step2_byok.strip() + "\n                  </div>",
    content,
    flags=re.DOTALL
)


with open('app/onboarding/page.tsx', 'w') as f:
    f.write(content)
