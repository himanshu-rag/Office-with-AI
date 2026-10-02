'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, Buildings, Users, Target } from '@phosphor-icons/react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Floating transforms for background elements
  const floatX1 = useTransform(smoothX, [-1, 1], [-40, 40]);
  const floatY1 = useTransform(smoothY, [-1, 1], [-40, 40]);
  
  const floatX2 = useTransform(smoothX, [-1, 1], [30, -30]);
  const floatY2 = useTransform(smoothY, [-1, 1], [30, -30]);

  // 3D Tilt for cards
  

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-background text-text-main selection:bg-accent-main selection:text-white pb-24 relative overflow-hidden"
    >
      {mounted && (
        <>
          {/* Floating Background Architectural Elements */}
          <motion.div 
            style={{ x: floatX1, y: floatY1 }}
            className="absolute top-[15%] left-[5%] w-64 h-64 border-[1px] border-text-muted/10 rounded-full pointer-events-none"
          />
          <motion.div 
            style={{ x: floatX2, y: floatY2 }}
            className="absolute top-[40%] right-[10%] w-96 h-96 border-[1px] border-text-muted/10 rotate-45 pointer-events-none"
          />
          <motion.div 
            style={{ x: floatX1, y: floatY2 }}
            className="absolute bottom-[10%] left-[20%] w-32 h-32 border-[2px] border-accent-main/5 pointer-events-none"
          />
        </>
      )}
      
      {/* FLOATING HEADER */}
      <nav style={{ width: '90%', maxWidth: '1200px' }} className="fixed top-6 left-1/2 -translate-x-1/2 border-2 border-border-main bg-surface/95 backdrop-blur-md shadow-xl px-8 py-4 flex flex-row items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-text-main flex items-center justify-center font-serif font-bold text-lg bg-background text-text-main">
            A
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl tracking-tight uppercase leading-none">Office-with-AI</h1>
            <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">HQ Terminal &bull; v2.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 font-serif text-sm font-bold uppercase tracking-wider">
          <a href="#manifesto" className="text-text-muted hover:text-text-main transition-colors">Manifesto</a>
          <a href="#architecture" className="text-text-muted hover:text-text-main transition-colors">Architecture</a>
          <a href="/os/office" className="bg-text-main text-surface px-5 py-2 border-2 border-transparent hover:bg-background hover:text-text-main hover:border-text-main transition-all whitespace-nowrap">
            Open Terminal
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main id="manifesto" style={{ paddingTop: '240px' }} className="max-w-6xl mx-auto px-6 pb-20 relative z-10">
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          style={{ x: useTransform(smoothX, [-1, 1], [-10, 10]), y: useTransform(smoothY, [-1, 1], [-10, 10]) }}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="inline-block border border-border-main bg-surface px-3 py-1 font-mono text-xs uppercase tracking-widest text-text-muted shadow-sm">
              Vol. I &mdash; The Autonomous Enterprise
            </span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 text-text-main">
            Build Your <br/><span className="text-accent-main italic">Autonomous</span> Empire.
          </motion.h2>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-12 font-serif">
            A vintage-inspired operating system for the modern AI workforce. Assemble departments, assign missions, and watch your digital campus thrive.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/os/office" className="group flex items-center justify-between gap-4 bg-accent-main text-white px-8 py-4 font-serif font-bold text-lg hover:bg-accent-hover transition-colors shadow-lg border border-accent-main w-full sm:w-auto">
              <span>Initialize Workspace</span>
              <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#architecture" className="flex items-center gap-2 bg-surface text-text-main px-8 py-4 border-2 border-border-main font-serif font-bold text-lg hover:bg-border-soft transition-colors w-full sm:w-auto">
              Read the Docs
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* THREE PILLARS (Vintage Cards) */}
      <section id="architecture" className="max-w-6xl mx-auto px-6 py-20 border-t border-dashed border-border-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
          {[
            { 
              title: "The Campus", 
              desc: "A modular, visual floor plan. Assign agents to distinct physical departments like Strategy, Engineering, and Marketing.", 
              icon: Buildings 
            },
            { 
              title: "The Hierarchy", 
              desc: "Agents don't just chat. They report, delegate, and collaborate across departments under the strict guidance of the AI CEO.", 
              icon: Users 
            },
            { 
              title: "The Missions", 
              desc: "Stop micromanaging prompts. Define a high-level mission objective and let the organization break it down into executable tasks.", 
              icon: Target 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.3, ease: "easeOut" }}
              className="bg-surface border-2 border-border-main p-8 shadow-md hover:shadow-[0_20px_40px_-10px_rgba(41,74,56,0.15)] transition-all cursor-pointer relative z-10"
            >
              <item.icon size={32} className="text-accent-main mb-6" />
              <h3 className="font-serif font-bold text-2xl mb-3 text-text-main">{item.title}</h3>
              <p className="text-text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="border-4 border-double border-border-main p-16 bg-surface shadow-lg relative">
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-border-main" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-border-main" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-border-main" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-border-main" />
          
          <h2 className="font-serif text-4xl font-bold mb-6 text-text-main">The future of work is automated.</h2>
          <p className="text-lg text-text-muted mb-10 max-w-lg mx-auto">
            Step into the command center. No more scattered tabs—just a cohesive organization working for you.
          </p>
          <a href="/os/office" className="inline-block bg-text-main text-surface px-10 py-4 font-serif font-bold uppercase tracking-widest text-sm hover:bg-accent-main hover:text-white transition-colors border-2 border-transparent">
            Establish Company
          </a>
        </div>
      </section>
      
    </div>
  );
}
