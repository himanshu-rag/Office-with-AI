'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, Lightning, ChartLineUp, Code } from '@phosphor-icons/react';
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('./components/Hero3D'), { ssr: false });

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, to);
      setVal(cur);
      if (cur >= to) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [to]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* FLOATING GLASS NAV */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 pt-5">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-between px-5 py-3 rounded-full glass-panel"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'var(--accent)' }}>A</div>
              <span className="font-semibold text-[15px]" style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Ai Office</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {['Product', 'Pricing', 'Docs'].map(t => (
                <button key={t} className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-1)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-2)'; }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="hidden sm:block text-sm font-medium px-4 py-2 rounded-full transition-colors"
                style={{ color: 'var(--text-2)' }}>Sign In</Link>
              <Link href="/sign-up" className="btn-primary text-sm px-5 py-2.5">
                Get started
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <ArrowRight size={12} weight="bold" />
                </span>
              </Link>
            </div>
          </motion.nav>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-28 pb-24">
        <Hero3D />

        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">

            <motion.div variants={fadeUp}
              className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em]"
              style={{ background: 'var(--accent-bg)', border: '1px solid rgba(10,132,255,0.25)', color: 'var(--accent-2)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--accent)' }} />
              Agent Engine v2.0 · Live
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-7xl md:text-9xl font-bold mb-6"
              style={{ color: 'var(--text-1)', letterSpacing: '-0.04em', lineHeight: 1.0 }}>
              Your AI<br /><span style={{ color: 'var(--text-3)' }}>workforce.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
              style={{ color: 'var(--text-2)', letterSpacing: '-0.01em' }}>
              Deploy specialized AI agents. Set objectives. Watch an autonomous CEO orchestrate your entire operation — in real time.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/sign-up" className="btn-primary text-base px-8 py-4">
                Deploy Workforce
                <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <ArrowRight size={14} weight="bold" />
                </span>
              </Link>
              <Link href="#features" className="btn-ghost text-base px-8 py-4">View Architecture</Link>
            </motion.div>
          </motion.div>

          {/* Stat strip */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 grid grid-cols-3 gap-px max-w-lg mx-auto overflow-hidden rounded-2xl"
            style={{ background: 'var(--border)' }}>
            {[{ val: 14000, suffix: '+', label: 'Missions Run' }, { val: 99, suffix: '%', label: 'Uptime' }, { val: 3, suffix: 'x', label: 'Faster' }].map(({ val, suffix, label }) => (
              <div key={label} className="flex flex-col items-center py-5 gap-1" style={{ background: 'var(--bg)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                  <Counter to={val} suffix={suffix} />
                </div>
                <div className="text-xs" style={{ color: 'var(--text-3)' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg), transparent)' }} />
      </section>

      {/* BENTO FEATURES */}
      <section id="features" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-12 gap-4">

          <motion.div variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}
            className="md:col-span-8 card p-10 flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 80% 20%, var(--accent-bg) 0%, transparent 60%)' }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-auto"
              style={{ background: 'var(--accent-bg)', border: '1px solid rgba(10,132,255,0.2)' }}>
              <Brain className="w-7 h-7" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Autonomous CEO</h3>
              <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-2)' }}>
                Give a high-level objective. The AI CEO decomposes it into missions, assigns specialists, and monitors every task until done.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}
            className="md:col-span-4 card p-8 flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-auto"
              style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.2)' }}>
              <Lightning className="w-7 h-7" style={{ color: '#30D158' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Live Activity</h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-2)' }}>No black boxes. Every agent's actions, visible in real time.</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}
            className="md:col-span-4 card p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-auto"
              style={{ background: 'rgba(255,159,10,0.1)', border: '1px solid rgba(255,159,10,0.2)' }}>
              <ChartLineUp className="w-7 h-7" style={{ color: '#FF9F0A' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Cost Control</h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-2)' }}>Per-token, per-agent, per-mission billing transparency.</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}
            className="md:col-span-8 card p-10 flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(167,139,250,0.08) 0%, transparent 60%)' }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-auto"
              style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <Code className="w-7 h-7" style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Custom Agents & Tools</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Build bespoke agents, arm them with APIs and tools, and plug them into the orchestration graph immediately.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="w-full px-6 py-32">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto card p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent-bg) 0%, transparent 70%)' }} />
          <h2 className="text-5xl md:text-6xl font-bold mb-6 relative z-10"
            style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
            Ready to hire<br />your first agent?
          </h2>
          <p className="text-xl mb-12 relative z-10" style={{ color: 'var(--text-2)' }}>
            Join engineers and founders running their operations on Ai Office.
          </p>
          <Link href="/sign-up" className="btn-primary text-base px-10 py-4 relative z-10">
            Initialize Workspace
            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
              <ArrowRight size={14} weight="bold" />
            </span>
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-6 py-12" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'var(--accent)' }}>A</div>
            <span className="text-sm" style={{ color: 'var(--text-3)' }}>© 2026 Ai Office, Inc.</span>
          </div>
          <div className="flex items-center gap-6">
            {['Documentation', 'Privacy', 'Terms', 'Status'].map(t => (
              <span key={t} className="text-sm cursor-pointer transition-colors" style={{ color: 'var(--text-3)' }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
