import re

with open('app/onboarding/page.tsx', 'r') as f:
    content = f.read()

replacement = """
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Software');
  const [loading, setLoading] = useState(false);

  const INDUSTRIES = ['Software', 'E-Commerce', 'Marketing Agency', 'Research', 'General'];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/os/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: industry })
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
"""

content = re.sub(
    r"const \[name, setName\].*?catch \(e\) \{\n      setLoading\(false\);\n    \}\n  \};",
    replacement.strip(),
    content,
    flags=re.DOTALL
)

form_replacement = """
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">
              Company Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              disabled={loading}
              className="w-full bg-background border border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-accent-main transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-dim mb-2">
              Industry Focus
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={loading}
              className="w-full bg-background border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-accent-main transition-colors disabled:opacity-50 appearance-none"
            >
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-text-main text-background hover:bg-white px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
          >
            {loading ? (
              <CircleNotch size={18} className="animate-spin text-background" />
            ) : (
              <>
                Initialize Workspace
                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
"""

content = re.sub(
    r"<form onSubmit=\{handleCreate\} className=\"space-y-6\">.*?</form>",
    form_replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('app/onboarding/page.tsx', 'w') as f:
    f.write(content)
