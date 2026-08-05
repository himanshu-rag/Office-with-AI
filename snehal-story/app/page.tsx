"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Star, Sparkles, Moon, Anchor, Diamond } from "lucide-react";
import Image from "next/image";

// Customization
const girlfriendName = "Snehal";
const yourName = "Himanshu Sharma";
const startDate = new Date("2026-04-24T00:31:00").getTime();

export default function StoryPage() {
  const [started, setStarted] = useState(false);
  const [timeSince, setTimeSince] = useState({ y: 0, m: 0, d: 0, h: 0, min: 0, s: 0 });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let diff = now - startDate;
      if (diff < 0) diff = 0;
      
      const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
      const month = day * 30.436875, year = day * 365.25;
      
      setTimeSince({
        y: Math.floor(diff / year),
        m: Math.floor((diff % year) / month),
        d: Math.floor((diff % month) / day),
        h: Math.floor((diff % day) / hour),
        min: Math.floor((diff % hour) / minute),
        s: Math.floor((diff % minute) / second)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1E5EFF', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1E5EFF', '#ffffff']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  if (!started) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_5px_rgba(77,168,255,0.6)] mb-16"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="text-2xl font-light mb-4 text-center px-4"
        >
          Someone has been waiting to tell you something...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 2 }}
          className="text-2xl font-light mb-12"
        >
          Just for you.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5, duration: 1 }}
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-full border border-blue-400 text-white tracking-widest uppercase hover:bg-blue-500/20 hover:shadow-[0_0_30px_rgba(77,168,255,0.6)] transition-all duration-500"
        >
          Begin
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative">
      
      {/* CHAPTER 2: Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <motion.div 
          style={{ y: yParallax }}
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full mb-8 p-2 bg-gradient-to-br from-blue-400 to-blue-700 shadow-[0_0_40px_rgba(77,168,255,0.6)]"
        >
          <img src="/images/photo1.jpg" alt="Hero" className="w-full h-full object-cover rounded-full border-4 border-[#07111F]" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.5 }}
          className="heading-font text-5xl md:text-7xl text-center text-glow mb-4"
        >
          Happy Girlfriend's Day
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }}
          className="text-xl md:text-2xl font-light text-blue-200 text-center"
        >
          To the most beautiful soul in my universe.
        </motion.p>
      </section>

      {/* CHAPTER 3: Our Story */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="heading-font text-4xl md:text-5xl text-center mb-16 text-glow"
        >
          Our Story
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {[2, 3, 4, 5].map((num, i) => (
            <motion.div 
              key={num}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
              className={`glass-card p-6 rounded-2xl ${i % 2 === 0 ? 'md:mt-0' : 'md:mt-32'}`}
            >
              <img src={`/images/photo${num}.jpg`} className="w-full h-auto max-h-[600px] object-cover rounded-xl mb-6 shadow-[0_0_20px_rgba(77,168,255,0.2)]" alt={`Story ${num}`} />
              <h3 className="heading-font text-2xl mb-2">Beautiful Moments</h3>
              <p className="text-blue-200 font-light">Every moment with you is a treasure I want to keep forever.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* THE PROPOSAL HIGHLIGHT */}
      <section className="py-24 px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl w-full"
        >
          <h2 className="heading-font text-5xl text-center text-blue-300 mb-12 text-glow">The Night Everything Changed</h2>
          <div className="glass-card p-6 rounded-3xl relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-3xl" />
            <img src="/images/proposal.jpg" alt="Proposal" className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(77,168,255,0.4)]" />
            <p className="handwritten text-4xl text-center mt-8 mb-4 text-glow">The most perfect "Yes".</p>
          </div>
        </motion.div>
      </section>

      {/* CHAPTER 4: Gallery */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="heading-font text-4xl text-center mb-16 text-glow">Memories We've Built</h2>
        <div className="columns-1 md:columns-3 gap-6 space-y-6">
          {[6, 7, 8, 9, 10, 11, 12, 13, 14].map((num, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.2 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden"
            >
              <img src={`/images/photo${num}.jpg`} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" alt={`Gallery ${num}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CHAPTER 5: Reasons */}
      <section className="py-32 px-4 max-w-6xl mx-auto text-center">
        <h2 className="heading-font text-4xl mb-16 text-glow">Reasons I Love You</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: Heart, text: "Your beautiful smile" },
            { icon: Star, text: "Your kind heart" },
            { icon: Sparkles, text: "Your wonderful laugh" },
            { icon: Moon, text: "Your gentle soul" },
            { icon: Anchor, text: "Your endless support" },
            { icon: Diamond, text: "Everything about you" },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              className="glass-card w-64 p-8 rounded-2xl flex flex-col items-center"
            >
              <item.icon className="w-12 h-12 text-blue-300 mb-6" />
              <h3 className="heading-font text-xl">{item.text}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CHAPTER 6: Envelope */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative w-80 h-56 cursor-pointer group" onClick={() => setEnvelopeOpen(true)}>
          <motion.div 
            animate={envelopeOpen ? { y: 150, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 glass-card bg-blue-900/50 rounded-lg shadow-2xl flex items-center justify-center"
          >
            {!envelopeOpen && <div className="w-12 h-12 rounded-full bg-red-800 flex items-center justify-center heading-font text-2xl font-bold shadow-lg z-20">S</div>}
            
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={envelopeOpen ? { height: "auto", y: -250, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute bg-[#fcf9f2] w-[110%] -left-[5%] md:w-[140%] md:-left-[20%] top-[10%] rounded p-6 shadow-xl text-black z-30"
            >
              <p className="handwritten text-xl md:text-2xl leading-relaxed whitespace-pre-line break-words text-center">
                Kya bolo mei tujhe 
                tum khawab thi mera ek samay pr 
                or Ajj vo kawabo ki Rani meri hai
                Mujhe Yakeen nhi hota 
                I am sorry Mene tumhe bohoot baar rulaya hai
                But tum mujhe chhod kr nhi gyii mujhe smjhaya tumne 

                I REEEAAALLYYYYYYYY LOVE YOUUUUUUUUUUU SOOOOOOOOO MUCHHHHHHHH
              </p>
            </motion.div>
          </motion.div>
          {!envelopeOpen && <p className="absolute -bottom-12 w-full text-center text-blue-300 animate-pulse">Tap to open</p>}
        </div>
      </section>

      {/* CHAPTER 7: Timer */}
      <section className="py-32 px-4 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card p-12 rounded-3xl text-center"
        >
          <h2 className="heading-font text-4xl mb-12 text-glow">Time Since Our Forever Began</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { v: timeSince.y, l: 'Years' },
              { v: timeSince.m, l: 'Months' },
              { v: timeSince.d, l: 'Days' },
              { v: timeSince.h, l: 'Hours' },
              { v: timeSince.min, l: 'Minutes' },
              { v: timeSince.s, l: 'Seconds' },
            ].map((t, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-5xl md:text-6xl font-light text-blue-300 text-glow tabular-nums">{t.v}</span>
                <span className="text-sm tracking-widest uppercase text-blue-200 mt-2">{t.l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CHAPTER 10: Finale */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-200px" }}
          onViewportEnter={triggerConfetti}
          transition={{ duration: 1.5 }}
        >
          <h1 className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12">
            <span className="heading-font text-5xl md:text-6xl text-white text-glow">Happy</span>
            <span className="handwritten text-7xl md:text-8xl bg-gradient-to-r from-blue-300 via-blue-100 to-white text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(77,168,255,0.8)] -rotate-2 transform translate-y-2">Girlfriend's</span>
            <span className="heading-font text-5xl md:text-6xl text-white text-glow flex items-center gap-4">
              Day 
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }} 
                className="inline-block"
              >💙</motion.span>
            </span>
          </h1>
          <p className="text-2xl font-light text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Thank you for being my safe place,<br/>
            my happiness,<br/>
            and my favorite person.
          </p>
          <p className="handwritten text-5xl">Forever Yours,<br/>{yourName}</p>
        </motion.div>
      </section>
      
      {/* Footer Space */}
      <div className="h-32" />
    </div>
  );
}
