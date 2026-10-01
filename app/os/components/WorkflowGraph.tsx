'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle, Hourglass, ArrowsClockwise } from '@phosphor-icons/react';

// Custom Node Component
const AgentNode = ({ data }: any) => {
  return (
    <div className="px-4 py-3 bg-[#121923] border border-[#1F2937] rounded-xl shadow-lg min-w-[200px] font-sans relative group">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-[#4F46E5] border-none" />
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">{data.role}</span>
        {data.status === 'done' && <CheckCircle className="text-[#10B981]" size={16} weight="fill" />}
        {data.status === 'working' && <ArrowsClockwise className="text-[#4F46E5] animate-spin" size={16} weight="bold" />}
        {data.status === 'waiting' && <Hourglass className="text-[#F59E0B]" size={16} weight="fill" />}
      </div>
      
      <div className="text-sm font-semibold text-white mb-1">{data.task}</div>
      <div className="text-xs text-[#9CA3AF] truncate">{data.agentName}</div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-[#4F46E5] border-none" />
    </div>
  );
};

const nodeTypes = { agentNode: AgentNode };

const initialNodes = [
  { id: '1', type: 'agentNode', position: { x: 250, y: 0 }, data: { role: 'Manager', agentName: 'Alex (CEO)', task: 'Project Kickoff & Spec', status: 'done' } },
  { id: '2', type: 'agentNode', position: { x: 100, y: 150 }, data: { role: 'Researcher', agentName: 'Sam', task: 'Market Analysis', status: 'done' } },
  { id: '3', type: 'agentNode', position: { x: 400, y: 150 }, data: { role: 'Analyst', agentName: 'Sarah', task: 'Data Extraction', status: 'done' } },
  { id: '4', type: 'agentNode', position: { x: 250, y: 300 }, data: { role: 'Developer', agentName: 'Linus', task: 'Build API Integration', status: 'working' } },
  { id: '5', type: 'agentNode', position: { x: 250, y: 450 }, data: { role: 'Reviewer', agentName: 'Agent Q', task: 'Code & Security Review', status: 'waiting' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: false, style: { stroke: '#4F46E5', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: false, style: { stroke: '#4F46E5', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#4F46E5', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#4F46E5', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: false, style: { stroke: '#1F2937', strokeWidth: 2, strokeDasharray: '5 5' } },
];

export default function WorkflowGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="w-full h-full bg-[#0B0F14] rounded-2xl border border-[#1F2937] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="dark-theme-flow"
      >
        <Background color="#1F2937" gap={16} />
        <Controls className="!bg-[#121923] !border-[#1F2937] !fill-white" />
      </ReactFlow>
    </div>
  );
}
