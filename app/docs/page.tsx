import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col">
      {/* Header */}
      <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border-main flex items-center px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-main rounded text-white flex items-center justify-center text-xs">A</div>
            Ai Office
          </Link>
          <div className="h-4 w-px bg-border-main" />
          <span className="text-text-muted text-sm font-medium">Documentation</span>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border-main py-10 pr-8 hidden md:block">
          <nav className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Getting Started</h4>
              <ul className="space-y-2 text-sm text-text-dim">
                <li className="text-accent-main font-medium cursor-pointer">Introduction</li>
                <li className="hover:text-text-main cursor-pointer">Quickstart</li>
                <li className="hover:text-text-main cursor-pointer">Architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Platform Concepts</h4>
              <ul className="space-y-2 text-sm text-text-dim">
                <li className="hover:text-text-main cursor-pointer">Agents & Roles</li>
                <li className="hover:text-text-main cursor-pointer">Mission Control</li>
                <li className="hover:text-text-main cursor-pointer">The Live Campus</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Billing & Models</h4>
              <ul className="space-y-2 text-sm text-text-dim">
                <li className="hover:text-text-main cursor-pointer">Managed vs BYOK</li>
                <li className="hover:text-text-main cursor-pointer">API Key Configuration</li>
                <li className="hover:text-text-main cursor-pointer">Compute Limits</li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 py-12 md:pl-16 pr-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-main/10 border border-accent-main/20 text-accent-main text-xs font-bold uppercase tracking-wider mb-6">
            Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Welcome to Ai Office</h1>
          <p className="text-lg text-text-muted leading-relaxed mb-10">
            Ai Office is the operating system for your autonomous digital workforce. Stop managing chat threads and start managing a company.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 border-b border-border-main pb-2">The Hybrid Intelligence Model</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            We designed Ai Office to be flexible for both enterprise and technical operators. You can run your company using one of two billing modes:
          </p>
          
          <div className="space-y-4 my-8">
            <div className="p-6 bg-surface border border-border-main rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">1. Fully Managed (Recommended)</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Pay a single platform subscription fee. We handle the model routing, API limits, and context windows. You purchase compute credits directly through our platform and deploy any model (OpenAI, Anthropic, Gemini) instantly without touching developer consoles.
              </p>
            </div>
            <div className="p-6 bg-background border border-border-main rounded-2xl">
              <h3 className="text-lg font-semibold mb-2">2. Bring Your Own Key (BYOK)</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Already have negotiated rates with OpenAI or Anthropic? Simply navigate to your <strong>Settings {'>'} Bring Your Own AI</strong> page and inject your private API keys. The platform will route all token generation directly to your account with zero markup.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-12 mb-4 border-b border-border-main pb-2">Next Steps</h2>
          <p className="text-text-muted leading-relaxed mb-6">
            To get started, navigate to your OS dashboard, create your first company, and hire your CEO agent.
          </p>
          
          <Link href="/os" className="inline-flex items-center gap-2 px-6 py-3 bg-accent-main text-white rounded-full font-medium shadow-lg hover:scale-[1.02] transition-transform">
            Launch Platform
          </Link>
        </main>
      </div>
    </div>
  );
}
