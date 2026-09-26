import { BookOpen } from '@phosphor-icons/react/dist/ssr';

export default function KnowledgePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Knowledge Base</h1>
        <p className="mt-1 text-sm text-zinc-500">Company context, documents, and AI memory.</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-5">
          <BookOpen size={32} className="text-zinc-500" weight="duotone" />
        </div>
        <h2 className="text-base font-semibold text-zinc-200 mb-2">Knowledge Base</h2>
        <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
          Upload documents and add context so your AI workforce understands your business.
        </p>
        <span className="mt-5 text-xs text-zinc-600 bg-zinc-800 px-3 py-1.5 rounded-full">Coming soon</span>
      </div>
    </div>
  );
}
