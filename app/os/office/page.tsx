'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Buildings, Lightning } from '@phosphor-icons/react';
import { useCompany } from '@/lib/hooks/use-company';

function WorkstationPod({ x, y }: { x: number, y: number }) {
  return (
    <g>
      {/* 4 desks */}
      <rect x={x} y={y} width={96} height={45} className="office-desk" />
      <rect x={x + 96} y={y} width={96} height={45} className="office-desk" />
      <rect x={x} y={y + 45} width={96} height={45} className="office-desk" />
      <rect x={x + 96} y={y + 45} width={96} height={45} className="office-desk" />
      
      {/* 4 chairs */}
      <circle cx={x + 48} cy={y - 18} r={16} className="office-chair" />
      <circle cx={x + 144} cy={y - 18} r={16} className="office-chair" />
      <circle cx={x + 48} cy={y + 108} r={16} className="office-chair" />
      <circle cx={x + 144} cy={y + 108} r={16} className="office-chair" />
      
      {/* 4 screens glowing */}
      <rect x={x + 32} y={y + 8} width={32} height={4} className="office-screen" filter="url(#glow)" />
      <rect x={x + 128} y={y + 8} width={32} height={4} className="office-screen" filter="url(#glow)" />
      <rect x={x + 32} y={y + 78} width={32} height={4} className="office-screen" filter="url(#glow)" />
      <rect x={x + 128} y={y + 78} width={32} height={4} className="office-screen" filter="url(#glow)" />
    </g>
  );
}

export default function OfficeSimulatorPage() {
  const { companyId, loading: companyLoading } = useCompany();
  const [agents, setAgents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (companyLoading || !companyId) return;

    fetch(`/api/os/floorplan`)
      .then(r => r.json())
      .then(data => {
        if (data.agents) {
          setAgents(data.agents);
          setCredits(Math.max(10, data.agents.length * 28.50));
        }
      });
  }, [companyId, companyLoading]);

  useEffect(() => {
    if (!mounted || agents.length === 0) return;
    const interval = setInterval(() => {
      setAgents(current => current.map(agent => {
        if (Math.random() > 0.85 && !agent.is_ceo) {
          const newStatus = agent.status === 'working' ? 'recharging' : 'working';
          setActivities(prev => [{
            id: Date.now().toString() + Math.random().toString(),
            text: `${agent.name} went to ${newStatus === 'recharging' ? 'the breakroom' : 'their desk'}`,
            time: 'Just now'
          }, ...prev].slice(0, 8));
          return { ...agent, status: newStatus };
        }
        return agent;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted, agents.length]);

  const uniqueDepts = useMemo(() => {
    const d = new Set<string>();
    agents.forEach(a => { if (!a.is_ceo && a.department_name) d.add(a.department_name); });
    return Array.from(d);
  }, [agents]);

  const zoneNames = [
     uniqueDepts[0] || 'Unassigned Space',
     uniqueDepts[1] || 'Unassigned Space',
     uniqueDepts[2] || 'Unassigned Space'
  ];

  const agentPositions = useMemo(() => {
    const SLOTS = {
      ceo: [ { x: 208, y: 216 } ],
      conference: [
        { x: 608, y: 108 }, { x: 688, y: 108 }, { x: 768, y: 108 }, { x: 848, y: 108 },
        { x: 608, y: 270 }, { x: 688, y: 270 }, { x: 768, y: 270 }, { x: 848, y: 270 }
      ],
      zone0: [
        { x: 528, y: 428 }, { x: 624, y: 428 }, { x: 528, y: 562 }, { x: 624, y: 562 },
        { x: 528, y: 653 }, { x: 624, y: 653 }, { x: 528, y: 787 }, { x: 624, y: 787 }
      ],
      zone1: [
        { x: 912, y: 428 }, { x: 1008, y: 428 }, { x: 912, y: 562 }, { x: 1008, y: 562 },
        { x: 912, y: 653 }, { x: 1008, y: 653 }, { x: 912, y: 787 }, { x: 1008, y: 787 }
      ],
      zone2: [
        { x: 1296, y: 428 }, { x: 1392, y: 428 }, { x: 1296, y: 562 }, { x: 1392, y: 562 },
        { x: 1296, y: 653 }, { x: 1392, y: 653 }, { x: 1296, y: 787 }, { x: 1392, y: 787 }
      ],
      recharging: [
        { x: 160, y: 495 }, { x: 96, y: 558 }, { x: 224, y: 558 },
        { x: 160, y: 630 }, { x: 96, y: 693 }, { x: 224, y: 693 },
        { x: 304, y: 540 }, { x: 304, y: 594 }
      ]
    };

    const posRecord: Record<string, {x: number, y: number}> = {};
    const usedSlots = { ceo: 0, conference: 0, zone0: 0, zone1: 0, zone2: 0, recharging: 0 };
    
    agents.forEach(a => {
      let region: keyof typeof SLOTS = 'zone0';
      if (a.status === 'working') {
        if (a.is_ceo) region = 'ceo';
        else if (a.department_name?.toLowerCase().includes('strat') || a.department_name?.toLowerCase().includes('market')) {
          region = 'conference';
        } else {
          if (a.department_name === zoneNames[1]) region = 'zone1';
          else if (a.department_name === zoneNames[2]) region = 'zone2';
          else region = 'zone0';
        }
      } else {
        region = 'recharging';
      }

      const availableSlots = SLOTS[region];
      const slotIndex = usedSlots[region] % availableSlots.length;
      posRecord[a.id] = availableSlots[slotIndex];
      usedSlots[region]++;
    });

    return posRecord;
  }, [agents, zoneNames]);

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-transparent overflow-hidden font-sans">
      <div className="flex-1 flex flex-col p-6 relative">
        <header className="mb-6 flex justify-between items-end relative z-20">
          <div>
            <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
              <Buildings weight="fill" className="text-white/80" /> Digital Office
            </h1>
            <p className="text-white/50 text-sm mt-1 font-medium tracking-wide">Live Campus Simulator</p>
          </div>
          <div className="flex items-center gap-8 bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl shadow-2xl">
            <div className="text-center">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Active Agents</div>
              <div className="text-xl font-medium text-white">{agents.filter(a => a.status === 'working').length} <span className="text-white/30 text-sm">/ {Math.max(1, agents.length)}</span></div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Compute Credits</div>
              <div className="text-xl font-medium text-white">${credits.toFixed(2)}</div>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full h-full relative flex items-center justify-center">
          <div className="w-full relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 bg-[#070b14]" style={{ aspectRatio: '16/9', maxHeight: '100%' }}>
            
            <svg viewBox="0 0 1600 900" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <style>
                {`
                  .office-wall { fill: rgba(255,255,255,0.02); stroke: rgba(255,255,255,0.05); stroke-width: 2px; rx: 20px; }
                  .glass-wall { stroke: rgba(255,255,255,0.1); stroke-width: 2px; stroke-dasharray: 8 8; }
                  .office-desk { fill: rgba(15,23,42,0.6); stroke: rgba(56,189,248,0.15); stroke-width: 1.5px; rx: 6px; }
                  .office-chair { fill: rgba(30,41,59,0.8); stroke: rgba(56,189,248,0.1); stroke-width: 1px; }
                  .office-screen { fill: #38bdf8; }
                  .office-table { fill: rgba(15,23,42,0.6); stroke: rgba(56,189,248,0.15); stroke-width: 1.5px; rx: 24px; }
                  .office-server { fill: rgba(15,23,42,0.8); stroke: rgba(56,189,248,0.2); stroke-width: 1.5px; rx: 4px; }
                  .server-led { fill: #22c55e; }
                  .office-text { fill: rgba(255,255,255,0.2); font-size: 18px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; font-family: system-ui, sans-serif; }
                `}
              </style>

              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* CEO Suite */}
              <rect x="32" y="36" width="352" height="315" className="office-wall" />
              <text x="208" y="315" textAnchor="middle" className="office-text">CEO Suite</text>
              <rect x="128" y="135" width="160" height="54" className="office-table" />
              <circle cx="208" cy="216" r="24" className="office-chair" />
              <circle cx="160" cy="99" r="24" className="office-chair" />
              <circle cx="256" cy="99" r="24" className="office-chair" />
              <rect x="160" y="144" width="96" height="5" className="office-screen" filter="url(#glow)" />

              {/* Conference Room */}
              <rect x="416" y="36" width="720" height="315" className="office-wall" />
              <text x="776" y="315" textAnchor="middle" className="office-text">Strategy Boardroom</text>
              <rect x="560" y="135" width="416" height="108" className="office-table" />
              {[608,688,768,848].map(x => (
                <g key={`conf-top-${x}`}>
                  <circle cx={x} cy="108" r="18" className="office-chair" />
                  <circle cx={x} cy="270" r="18" className="office-chair" />
                </g>
              ))}

              {/* Server Room */}
              <rect x="1168" y="36" width="400" height="315" className="office-wall" />
              <text x="1368" y="315" textAnchor="middle" className="office-text">Datacenter</text>
              {[1216, 1328, 1440].map(x => (
                <g key={`server-${x}`}>
                  <rect x={x} y="90" width="64" height="180" className="office-server" />
                </g>
              ))}
              {/* Server LEDs */}
              {[110, 140, 170, 200, 230].map(y => (
                <g key={y}>
                  <rect x="1232" y={y} width="12" height="4" className="server-led" filter="url(#glow)" />
                  <rect x="1344" y={y} width="12" height="4" className="server-led" filter="url(#glow)" />
                  <rect x="1456" y={y} width="12" height="4" className="server-led" filter="url(#glow)" />
                </g>
              ))}

              {/* Cafeteria / Breakroom */}
              <rect x="32" y="378" width="352" height="486" className="office-wall" />
              <text x="208" y="828" textAnchor="middle" className="office-text">Cafeteria</text>
              <rect x="32" y="378" width="240" height="45" className="office-table" rx="4" />
              
              <circle cx="160" cy="540" r="48" className="office-table" />
              <circle cx="160" cy="495" r="18" className="office-chair" />
              <circle cx="96" cy="558" r="18" className="office-chair" />
              <circle cx="224" cy="558" r="18" className="office-chair" />
              
              <circle cx="160" cy="675" r="48" className="office-table" />
              <circle cx="160" cy="630" r="18" className="office-chair" />
              <circle cx="96" cy="693" r="18" className="office-chair" />
              <circle cx="224" cy="693" r="18" className="office-chair" />
              
              <rect x="288" y="522" width="48" height="108" className="office-table" rx="8" />

              {/* Workspace Zones Container */}
              <rect x="416" y="378" width="1152" height="486" className="office-wall" />
              
              {/* Internal Partitions */}
              <line x1="800" y1="378" x2="800" y2="864" className="glass-wall" />
              <line x1="1184" y1="378" x2="1184" y2="864" className="glass-wall" />

              {/* Dynamic Department Labels */}
              <text x="608" y="828" textAnchor="middle" className="office-text">{zoneNames[0]}</text>
              <text x="992" y="828" textAnchor="middle" className="office-text">{zoneNames[1]}</text>
              <text x="1376" y="828" textAnchor="middle" className="office-text">{zoneNames[2]}</text>
              
              {/* Workstation Pods */}
              <WorkstationPod x={480} y={450} />
              <WorkstationPod x={480} y={675} />
              <WorkstationPod x={864} y={450} />
              <WorkstationPod x={864} y={675} />
              <WorkstationPod x={1248} y={450} />
              <WorkstationPod x={1248} y={675} />

            </svg>

            {/* Agents Overlay layer */}
            {agents.map(agent => {
              const pos = agentPositions[agent.id] || { x: 800, y: 450 };
              const isHovered = hoveredAgentId === agent.id;

              return (
                <motion.div
                  key={agent.id}
                  initial={false}
                  animate={{ left: `${(pos.x / 1600) * 100}%`, top: `${(pos.y / 900) * 100}%` }}
                  transition={{ type: "spring", damping: 25, stiffness: 80, mass: 1 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  onMouseEnter={() => setHoveredAgentId(agent.id)}
                  onMouseLeave={() => setHoveredAgentId(null)}
                >
                  <motion.div layout className="relative flex flex-col items-center cursor-pointer group">
                    {/* Ultra-Premium Agent Avatar */}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border shadow-xl transition-transform group-hover:scale-110 ${
                      agent.status === 'working' 
                        ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]' 
                        : 'bg-white/5 border-white/20 text-white/50'
                    }`}>
                      <span className="text-sm drop-shadow-md">{agent.avatar_emoji || agent.name.charAt(0).toUpperCase()}</span>
                      
                      {/* Status Dot */}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#070b14] ${
                        agent.status === 'working' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                    </div>
                    
                    {/* Permanent Premium Name Label */}
                    <div className={`mt-2 bg-[#020617]/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wider uppercase whitespace-nowrap shadow-xl transition-colors ${
                      agent.status === 'working' ? 'text-white' : 'text-white/40'
                    }`}>
                      {agent.name}
                    </div>

                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.9, transition: { duration: 0.1 } }}
                          className="absolute top-14 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap shadow-2xl z-20"
                        >
                          {agent.name}
                          <div className="text-[10px] text-black/50 uppercase mt-0.5 font-semibold">
                            {agent.status === 'working' ? agent.role : 'On Break'}
                          </div>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Sidebar restored to ultra-premium glassmorphism */}
      <div className="w-80 border-l border-white/5 bg-[#030305] flex flex-col relative z-20">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-5 pb-3">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
              <Lightning weight="fill" className="text-[#0ea5e9] text-sm" /> Campus Activity
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            <AnimatePresence initial={false}>
              {activities.length === 0 && (
                <div className="text-center text-white/20 text-xs py-10">Monitoring campus...</div>
              )}
              {activities.map((act) => (
                <motion.div key={act.id} initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-white/5 border border-white/10 p-3 rounded-2xl shadow-sm backdrop-blur-sm">
                  <p className="text-xs text-white/80 leading-relaxed mb-1.5">{act.text}</p>
                  <p className="text-[9px] font-bold text-[#0ea5e9] uppercase tracking-wider">{act.time}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
