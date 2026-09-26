import { Wrench } from '@phosphor-icons/react/dist/ssr';

export default function ToolsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Tools</h1>
        <p className="mt-1 text-sm text-zinc-500">Integrations and capabilities for your AI agents.</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-5">
          <Wrench size={32} className="text-zinc-500" weight="duotone" />
        </div>
        <h2 className="text-base font-semibold text-zinc-200 mb-2">Tools &amp; Integrations</h2>
        <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
          Connect your agents to external services — GitHub, Slack, search, and more.
        </p>
        <span className="mt-5 text-xs text-zinc-600 bg-zinc-800 px-3 py-1.5 rounded-full">Coming soon</span>
      </div>
    </div>
  );
}
