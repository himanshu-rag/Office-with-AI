'use client';

import React, { useState, useEffect, use } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CaretLeft, Graph, BookOpen } from '@phosphor-icons/react';
import Link from 'next/link';

export default function KnowledgeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const companyId = localStorage.getItem('os_active_workspace') || '3q9yfkrlmuil1hud';
    fetch(`/api/os/knowledge?company_id=${companyId}`)
      .then(res => res.json())
      .then(res => {
        if (res.knowledge) {
          const item = res.knowledge.find((k: any) => k.id === id);
          if (item) {
            setData(item);
            try {
              const parsed = JSON.parse(item.content);
              if (parsed.type === 'diagram') {
                // Apply styling to nodes
                const styledNodes = parsed.nodes.map((n: any) => ({
                  ...n,
                  style: {
                    background: '#18181B', // zinc-900
                    color: '#F4F4F5',
                    border: '1px solid #3F3F46', // zinc-700
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }
                }));
                const styledEdges = parsed.edges.map((e: any) => ({
                  ...e,
                  animated: true,
                  style: { stroke: '#6366f1', strokeWidth: 2 } // indigo-500
                }));
                setNodes(styledNodes);
                setEdges(styledEdges);
              }
            } catch (e) {
              // It's just markdown text
            }
          }
        }
      });
  }, [id]);

  if (!data) return <div className="p-12 text-white">Loading...</div>;

  const isDiagram = nodes.length > 0;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans">
      <header className="flex items-center gap-4 p-6 border-b border-border-main bg-surface z-10">
        <Link href="/os/knowledge" className="p-2 bg-background border border-border-main rounded-lg hover:bg-border-main transition-colors">
          <CaretLeft size={20} className="text-text-main" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
            {isDiagram ? <Graph size={24} className="text-accent-main" /> : <BookOpen size={24} className="text-accent-main" />}
            {data.title}
          </h1>
          <p className="text-xs text-text-muted mt-1">Maintained by {data.updated_by}</p>
        </div>
      </header>

      <div className="flex-1 relative bg-[#09090b]">
        {isDiagram ? (
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            fitView
            className="dark-controls"
          >
            <Background color="#27272a" gap={24} size={2} />
            <Controls />
            <MiniMap 
              nodeColor="#3f3f46"
              maskColor="rgba(0,0,0,0.5)"
              style={{ backgroundColor: '#18181b' }}
            />
          </ReactFlow>
        ) : (
          <div className="p-12 max-w-4xl mx-auto overflow-y-auto h-full">
            <pre className="text-sm text-text-main font-mono whitespace-pre-wrap bg-surface p-8 rounded-2xl border border-border-main">
              {data.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
