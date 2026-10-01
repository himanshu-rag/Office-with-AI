'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PencilSimple, DotsSix, ArrowsOut, ArrowsLeftRight, CaretDown, Sun, Trash, Buildings, User, CheckCircle , MagnifyingGlass, Bell } from '@phosphor-icons/react';
import { AgentChatWindow } from '../components/AgentChatWindow';

interface DepartmentSlot {
  id: string;
  deptName: string | null;
  img: string;
  agent: { name: string; role: string; avatar: string; status: string } | null;
}


const PREDEFINED_DEPARTMENTS = [
  { name: 'Strategy',       img: '/rooms/strategy.jpg',    defaultRole: 'Strategy Specialist', avatar: '🧭' },
  { name: 'Engineering',   img: '/rooms/engineering.jpg', defaultRole: 'Software Engineer',    avatar: '💻' },
  { name: 'Marketing',     img: '/rooms/marketing.jpg',   defaultRole: 'Growth Marketer',     avatar: '📣' },
  { name: 'Design Studio',  img: '/rooms/design.jpg',      defaultRole: 'Product Designer',    avatar: '🎨' },
  { name: 'Data Analytics', img: '/rooms/analytics.jpg',   defaultRole: 'Data Scientist',      avatar: '📊' },
  { name: 'QA & Testing',   img: '/rooms/qa.jpg',          defaultRole: 'QA Specialist',       avatar: '🧪' },
  { name: 'Research & Dev', img: '/rooms/research.jpg',    defaultRole: 'R&D Researcher',      avatar: '🔬' },
  { name: 'Operations',     img: '/rooms/operations.jpg',  defaultRole: 'Ops Specialist',      avatar: '⚙️' },
  { name: 'Coffee Lounge',  img: '/rooms/coffee.jpg',      defaultRole: 'Community Lead',      avatar: '☕' },
];

const INITIAL_SLOTS: DepartmentSlot[] = [
  { id: 'slot-1', deptName: 'Strategy',       img: '/rooms/strategy.jpg',    agent: { name: 'Sam', role: 'Strategy Lead', avatar: '🧭', status: 'working' } },
  { id: 'slot-2', deptName: 'AI CEO Suite',   img: '/rooms/ceo.jpg',         agent: { name: 'CEO Alex', role: 'Chief Executive', avatar: '👑', status: 'working' } },
  { id: 'slot-3', deptName: 'Engineering',   img: '/rooms/engineering.jpg', agent: { name: 'Linus', role: 'Backend Lead', avatar: '💻', status: 'waiting' } },
  { id: 'slot-4', deptName: 'Marketing',     img: '/rooms/marketing.jpg',   agent: { name: 'Mia', role: 'Growth Marketer', avatar: '📣', status: 'working' } },
  { id: 'slot-5', deptName: 'Design Studio',  img: '/rooms/design.jpg',      agent: { name: 'Jony', role: 'Product Designer', avatar: '🎨', status: 'working' } },
  { id: 'slot-6', deptName: 'Data Analytics', img: '/rooms/analytics.jpg',   agent: { name: 'Sarah', role: 'Data Scientist', avatar: '📊', status: 'coffee' } },
  { id: 'slot-7', deptName: null,            img: '/rooms/empty_space.jpg', agent: null },
  { id: 'slot-8', deptName: 'QA & Testing',   img: '/rooms/qa.jpg',          agent: { name: 'Agent Q', role: 'QA Engineer', avatar: '🧪', status: 'working' } },
  { id: 'slot-9', deptName: null,            img: '/rooms/empty_space.jpg', agent: null },
];

export default function ModularOfficePage() {
  const [slots, setSlots] = useState<DepartmentSlot[]>(INITIAL_SLOTS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedForSwap, setSelectedForSwap] = useState<string | null>(null);
  const officeRef = useRef<HTMLDivElement>(null);

  // Agent Chat Windows
  const [realAgents, setRealAgents] = useState<any[]>([]);
  const [openChatWindows, setOpenChatWindows] = useState<any[]>([]);

  // Fetch real agents to map their IDs and real-time status
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/os/org');
        const data = await res.json();
        if (data.agents) {
          setRealAgents(data.agents);
        }
      } catch (e) { console.error(e); }
    };
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000); // Live poll
    return () => clearInterval(interval);
  }, []);

  const handleAgentClick = (e: React.MouseEvent, fakeAgent: any) => {
    e.stopPropagation();
    if (isEditMode) return;
    
    // Try to find the real agent in DB (match by name or just fallback to first available to ensure it works)
    let real = realAgents.find(a => a.name.includes(fakeAgent.name) || fakeAgent.name.includes(a.name));
    if (!real && realAgents.length > 0) real = realAgents[0]; // fallback
    if (!real) {
      alert("Real agent not found in database! Please sync organization.");
      return;
    }

    if (openChatWindows.find(w => w.id === real.id)) return; // already open
    setOpenChatWindows(prev => [...prev, real]);
  };


  // Filter active departments count
  const activeDepartmentsCount = slots.filter(s => s.deptName !== null).length;
  const activeAgentsCount = slots.filter(s => s.agent !== null).length;


  const handleSlotClick = (slotId: string) => {
    if (!isEditMode) return;
    
    if (!selectedForSwap) {
      setSelectedForSwap(slotId);
    } else {
      if (selectedForSwap === slotId) {
        setSelectedForSwap(null); // deselect
        return;
      }
      // Perform swap
      setSlots(prev => {
        const newSlots = [...prev];
        const sourceIdx = newSlots.findIndex(s => s.id === selectedForSwap);
        const targetIdx = newSlots.findIndex(s => s.id === slotId);
        
        const temp = newSlots[sourceIdx];
        newSlots[sourceIdx] = newSlots[targetIdx];
        newSlots[targetIdx] = temp;
        return newSlots;
      });
      setSelectedForSwap(null);
    }
  };

  const toggleFullScreen = () => {

    if (!document.fullscreenElement) {
      officeRef.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleOpenAddModal = (slotId?: string) => {
    // If a specific slot wasn't clicked, pick the first empty slot
    const targetSlot = slotId || slots.find(s => s.deptName === null)?.id || null;
    setSelectedSlotId(targetSlot);
    setNewDeptName('');
    setNewAgentName('');
    setShowAddModal(true);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDept = PREDEFINED_DEPARTMENTS.find(d => d.name === newDeptName) || PREDEFINED_DEPARTMENTS[0];

    const targetId = selectedSlotId || slots.find(s => s.deptName === null)?.id;
    if (!targetId) return;

    setSlots(prev => prev.map(slot => {
      if (slot.id === targetId) {
        return {
          ...slot,
          deptName: selectedDept.name,
          img: selectedDept.img,
          agent: {
            name: newAgentName.trim() || `Agent ${selectedDept.name.split(' ')[0]}`,
            role: selectedDept.defaultRole,
            avatar: selectedDept.avatar,
            status: 'working'
          }
        };
      }
      return slot;
    }));

    setShowAddModal(false);
  };

  const handleRemoveDepartment = (slotId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          deptName: null,
          img: '/rooms/empty_space.jpg',
          agent: null
        };
      }
      return slot;
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-y-auto custom-scrollbar font-serif">
      
      {/* TOP BAR */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border-main bg-surface shadow-xs shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-main">AI Company Office</h1>
          <p className="text-sm text-text-muted mt-0.5">Office Floor</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }))} className="text-text-muted hover:text-text-main transition-colors" title="Search (Cmd+K)"><MagnifyingGlass size={20} /></button>
          <Link href="/os/inbox" className="text-text-muted hover:text-text-main transition-colors" title="Inbox"><Bell size={20} /></Link>
          <Link href="/os/settings" className="w-8 h-8 rounded-full bg-surface-2 border border-border-main flex items-center justify-center text-xs font-bold text-text-main ml-2 hover:border-accent-main transition-colors" title="Settings">A</Link>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 p-8 flex gap-8 items-start justify-center">
        
        {/* MODULAR 3D FLOOR PLAN GRID CONTAINER */}
        <div 
          ref={officeRef} 
          className="flex-1 max-w-5xl bg-surface border-2 border-border-main rounded-2xl p-6 shadow-xl relative overflow-hidden"
        >
          {/* Header Indicator */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-soft font-sans">
            <div className="flex items-center gap-2">
              <Buildings size={20} className="text-accent-main" />
              <span className="font-bold text-sm text-text-main uppercase tracking-wider font-serif">Level 1 — Main Headquarters</span>
            </div>
            {isEditMode && (
              <span className="text-xs px-3 py-1 rounded-full bg-accent-main/10 text-accent-main font-semibold border border-accent-main/30 animate-pulse">
                &bull; Edit Mode: Click a room to select, then click another to Swap them!
              </span>
            )}
          </div>

          {/* 3X3 MODULAR GRID OF ROOM TILES */}
          <div className="grid grid-cols-3 gap-5">
            {slots.map((slot) => {
              const isActive = slot.deptName !== null;

              return (
                <div 
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                  style={{ height: "240px", minHeight: "240px" }} 
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${isEditMode ? 'cursor-pointer' : ''} ${selectedForSwap === slot.id ? 'ring-4 ring-blue-500 scale-[1.02] z-20 shadow-2xl' : ''} ${
                    isActive 
                      ? 'border-border-main shadow-md hover:shadow-xl hover:border-accent-main' 
                      : 'border-dashed border-border-main/60 bg-surface-2/50 hover:border-accent-main/60'
                  }`}
                >
                  {/* Background 3D Room Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${slot.img}')` }}
                  />

                  {/* Dark vignette overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                  {/* ACTIVE DEPARTMENT TILE */}
                  {isActive ? (
                    <div className="absolute inset-0 p-3 flex flex-col justify-between z-10">
                      {/* Top Header: Department Name + Remove Action */}
                      <div className="flex items-start justify-between">
                        <div className="bg-surface/90 backdrop-blur-xs border border-border-main px-3 py-1 rounded-md shadow-sm">
                          <span className="font-serif font-bold text-xs text-text-main tracking-wide">
                            {slot.deptName}
                          </span>
                        </div>

                        {isEditMode && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemoveDepartment(slot.id); }}
                            className="bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 shadow-md transition"
                            title="Remove Department"
                          >
                            <Trash size={14} />
                          </button>
                          </div>
                        )}
                      </div>

                      {/* Bottom Agent Status Pill */}
                      {slot.agent && (
                        <div 
                          className={`bg-surface/95 backdrop-blur-md border border-border-main p-2 rounded-lg shadow-md flex items-center gap-2.5 font-sans ${!isEditMode ? 'cursor-pointer hover:border-accent-main transition-colors group/pill' : ''}`}
                          onClick={(e) => handleAgentClick(e, slot.agent)}
                        >
                          <div className="w-7 h-7 rounded-full bg-accent-main/20 border border-accent-main flex items-center justify-center text-sm shrink-0">
                            {slot.agent.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-text-main truncate">{slot.agent.name}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            </div>
                            <span className="text-[10px] text-text-muted truncate block">{slot.agent.role}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* EMPTY SPACE TILE */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-surface/40 backdrop-blur-[2px]">
                      <div className="bg-surface/90 border border-border-main rounded-xl p-4 shadow-sm flex flex-col items-center max-w-[200px] w-full font-sans">
                        <span className="text-xs font-serif font-bold text-text-muted mb-1 uppercase tracking-wider">Available Slot</span>
                        <p className="text-[11px] text-text-muted mb-3">No department assigned</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenAddModal(slot.id); }}
                          className="w-full py-1.5 px-3 bg-accent-main hover:bg-accent-hover text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                        >
                          <Plus size={14} /> Add Dept
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL */}
        <aside className="w-80 flex flex-col gap-6 shrink-0 font-sans">
          
          {/* Quick Actions Panel */}
          <div className="bg-surface-2 border border-border-main rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-text-main mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleOpenAddModal()} 
                className="flex items-center justify-center gap-2 rounded-lg py-3 bg-accent-main text-white font-semibold text-sm shadow-sm hover:bg-accent-hover transition w-full font-serif"
              >
                <Plus size={16} /> Add Department
              </button>
              <button 
                onClick={() => { console.log("Toggling edit mode", !isEditMode); setIsEditMode(!isEditMode); }} 
                className={`flex items-center gap-3 rounded-lg px-4 py-3 border text-sm font-semibold transition w-full shadow-sm font-serif ${isEditMode ? 'bg-accent-main text-white border-accent-main' : 'bg-surface border-border-main text-text-main hover:bg-border-soft'}`}
              >
                <PencilSimple size={16} className={isEditMode ? "text-white" : "text-text-muted"} /> 
                {isEditMode ? 'Done Customizing' : 'Customize Layout'}
              </button>
              <button 
                onClick={() => { console.log("Toggling edit mode", !isEditMode); setIsEditMode(!isEditMode); }} 
                className="flex items-center gap-3 rounded-lg px-4 py-3 bg-surface border border-border-main text-text-main font-semibold text-sm hover:bg-border-soft transition w-full shadow-sm font-serif"
              >
                <ArrowsLeftRight size={16} className="text-text-muted" /> Rearrange Grid
              </button>
              <button 
                onClick={toggleFullScreen} 
                className="flex items-center gap-3 rounded-lg px-4 py-3 bg-surface border border-border-main text-text-main font-semibold text-sm hover:bg-border-soft transition w-full shadow-sm font-serif"
              >
                <ArrowsOut size={16} className="text-text-muted" /> View Full Screen
              </button>
            </div>
          </div>

          {/* Floor Overview Mini-map */}
          <div className="bg-surface-2 border border-border-main rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-text-main mb-4">Floor Overview</h2>
            <div className="grid grid-cols-3 gap-2 bg-surface p-3 rounded-lg border border-border-main">
              {slots.map((slot, i) => (
                <div 
                  key={i} 
                  className={`h-10 rounded-md border flex items-center justify-center transition ${
                    slot.deptName 
                      ? 'bg-accent-main/20 border-accent-main' 
                      : 'bg-transparent border-border-main border-dashed opacity-40'
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase ${slot.deptName ? 'text-accent-main' : 'text-text-muted'}`}>
                    {slot.deptName ? slot.deptName.slice(0, 4) : 'EMPTY'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* FLOATING AGENT CHAT WINDOWS */}
      <AnimatePresence>
        {openChatWindows.map((agent, i) => (
          <AgentChatWindow
            key={agent.id}
            agent={agent}
            initialPosition={{ x: 50 + (i * 20), y: 100 + (i * 20) }}
            zIndex={100 + i}
            onClose={() => setOpenChatWindows(prev => prev.filter(a => a.id !== agent.id))}
            bringToFront={() => {
              setOpenChatWindows(prev => {
                const filtered = prev.filter(a => a.id !== agent.id);
                return [...filtered, agent];
              });
            }}
          />
        ))}
      </AnimatePresence>

      {/* ADD DEPARTMENT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setShowAddModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-md bg-surface border border-border-main rounded-2xl shadow-2xl p-6"
            >
              <h2 className="text-2xl font-serif font-bold text-text-main mb-2">Add New Department</h2>
              <p className="text-sm text-text-muted mb-6">Create a custom department tile on your 3D floor plan.</p>
              
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Select Department</label>
                  <select 
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border-main bg-background text-text-main focus:outline-none focus:border-accent-main text-sm font-serif" 
                  >
                    <option value="" disabled>-- Choose a Department --</option>
                    {PREDEFINED_DEPARTMENTS.map((dept, idx) => (
                      <option key={idx} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Assign Lead Agent (Optional)</label>
                  <input 
                    type="text" 
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="e.g. Agent Carter" 
                    className="w-full px-4 py-2.5 rounded-lg border border-border-main bg-background text-text-main focus:outline-none focus:border-accent-main text-sm" 
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-soft">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)} 
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-text-muted hover:text-text-main hover:bg-surface-2 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-accent-main text-white font-semibold text-sm rounded-lg hover:bg-accent-hover shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle size={16} /> Deploy Department
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
