/**
 * Home.jsx — VOID-LUXURY REDESIGN
 * Theme: Black · White · Electric Violet
 *
 * Fonts (add to index.html / layout.jsx):
 *   <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
 *
 * Dependencies: gsap, gsap/TextPlugin, gsap/ScrollTrigger
 *
 * NAVBAR FIX: The hero section uses paddingTop: '80px' to clear a fixed
 * navbar. Change that value to match your actual navbar height (e.g. 64px).
 */

'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useEffect, useRef, useState } from 'react';
import MagneticButton from '../components/MagneticButton';
import PageTransition from '../components/PageTransition';
import GhostText from '../components/GhostText';
import { useLoader } from '../context/LoaderContext';
import { useSound } from '../context/SoundContext';
import Footer from '../components/Footer';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// ─── Data ───────────────────────────────────────────────────────────────────
const hackathons = [
  {
    id: 'TRITHON-2026',
    title: 'Trithon 2026',
    desc: 'Secured 5th Runner Up position among 429 applicant teams and 50 finalists. Developed under intense 48-hour pressure.',
    stack: ['Innovation', 'System Design', 'Rapid Prototyping'],
    badge: '5TH RUNNER UP',
  }
];

const plans = [
  { num: '01', title: 'Open Source',        tag: 'Q1 2026', desc: 'Releasing a heavily optimised minimal state-management library for React 19.', icon: '⬡' },
  { num: '02', title: '3D Web Experiences', tag: 'Q2 2026', desc: 'Diving deep into Three.js and WebGL shaders to build interactive cinematic web environments.', icon: '◈' },
  { num: '03', title: 'Tech Blog',          tag: 'Q3 2026', desc: 'Documenting advanced frontend architectures, GSAP animation breakdowns, and engineering logs.', icon: '▣' },
];

const roles = ['Software Developer', 'UI Engineer', 'Problem Solver', 'Code Architect'];

// ─── Global CSS ──────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

:root {
  --bg:        #07060d;
  --bg2:       #0d0b18;
  --surface:   rgba(255,255,255,0.025);
  --border:    rgba(255,255,255,0.07);
  --border-v:  rgba(147,51,234,0.32);
  --fg:        #f4f0ff;
  --muted:     rgba(244,240,255,0.4);
  --dim:       rgba(244,240,255,0.18);
  --v:         #9333ea;
  --vl:        #a855f7;
  --vll:       #c084fc;
  --vg:        rgba(147,51,234,0.12);
  --font-d:    'Syne', sans-serif;
  --font-m:    'JetBrains Mono', monospace;
}

:root[data-theme='light'] {
  --bg:        #f4ebfa;
  --bg2:       #eae0f4;
  --surface:   rgba(0,0,0,0.035);
  --border:    rgba(0,0,0,0.1);
  --border-v:  rgba(147,51,234,0.4);
  --fg:        #07060d;
  --muted:     rgba(7,6,13,0.6);
  --dim:       rgba(7,6,13,0.35);
  --v:         #9333ea;
  --vl:        #7e22ce;
  --vll:       #6b21a8;
  --vg:        rgba(147,51,234,0.15);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font-m);-webkit-font-smoothing:antialiased}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--v);border-radius:2px}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.cur{animation:blink 1s step-end infinite;color:var(--vl)}

/* ── Glitch on name ── */
.glitch{position:relative;display:inline-block}
.glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
.glitch::before{color:var(--vll);clip-path:polygon(0 15%,100% 15%,100% 32%,0 32%);animation:gb 6s infinite linear alternate-reverse}
.glitch::after{color:rgba(255,255,255,0.55);clip-path:polygon(0 65%,100% 65%,100% 80%,0 80%);animation:ga 5s infinite linear alternate-reverse}
@keyframes gb{0%,88%{opacity:0;transform:none}90%{opacity:1;transform:translateX(-3px) skewX(6deg)}92%{opacity:0}94%{opacity:1;transform:translateX(2px)}100%{opacity:0}}
@keyframes ga{0%,83%{opacity:0;transform:none}85%{opacity:1;transform:translateX(3px) skewX(-4deg)}87%{opacity:0}100%{opacity:0}}

/* ── Dot-grid bg ── */
.dot-grid{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:radial-gradient(rgba(147,51,234,0.2) 1px,transparent 1px);
  background-size:38px 38px;opacity:0.3}

/* ── Scanlines ── */
.scanlines{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(147,51,234,0.012) 3px,rgba(147,51,234,0.012) 4px)}

/* ── Chip / tag ── */
.chip{font-family:var(--font-m);font-size:.58rem;letter-spacing:.18em;
  border:1px solid var(--border-v);color:var(--vll);padding:2px 10px;border-radius:2px;
  background:rgba(147,51,234,.06);white-space:nowrap}
.stag{font-family:var(--font-m);font-size:.58rem;letter-spacing:.12em;
  color:var(--dim);background:rgba(255,255,255,.04);padding:2px 8px;
  border-radius:2px;border:1px solid var(--border)}

/* ── Outline heading trick ── */
.outline-word{color:transparent;-webkit-text-stroke:1.5px var(--vl);
  text-shadow:0 0 38px rgba(168,85,247,.2)}

/* ── Hero Grid ── */
.hero-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
  max-width: 82.5rem;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0 5vw;
}
@media (min-width: 1024px) {
  .hero-grid {
    flex-direction: row;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 5rem;
  }
}
.hero-text-side {
  flex: 1.25;
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 1024px) {
  .hero-text-side {
    text-align: left;
    align-items: flex-start;
  }
}
.hero-image-side {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  bottom: -10px;
  align-items: center;
  height: 100%;
  z-index: 5;
}
@media (max-width: 1023px) {
  .hero-image-side {
    opacity: 0.3 !important;
    position: absolute;
    top: 55%; left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    pointer-events: none;
  }
}

@keyframes scanning {
  0% { top: 15%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 85%; opacity: 0; }
}
`;

// ─── Particle canvas ─────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    let raf, w, h;
    const pts = Array.from({ length: 65 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - .5) * .17, vy: (Math.random() - .5) * .17,
      r: Math.random() * 1.1 + .25, a: Math.random() * .38 + .05,
    }));
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7'; ctx.globalAlpha = p.a; ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 105) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = '#9333ea'; ctx.globalAlpha = (1-d/105)*.08; ctx.lineWidth = .5; ctx.stroke();
        }
      }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} aria-hidden style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:.55 }} />;
}

// ─── HUD bracket corners ─────────────────────────────────────────────────────
function Corners({ sz = 11, clr = 'rgba(168,85,247,0.45)' }) {
  const b = { position:'absolute', width:sz, height:sz };
  const s = `1px solid ${clr}`;
  return (<>
    <span aria-hidden style={{ ...b, top:0,    left:0,  borderTop:s, borderLeft:s }} />
    <span aria-hidden style={{ ...b, top:0,    right:0, borderTop:s, borderRight:s }} />
    <span aria-hidden style={{ ...b, bottom:0, left:0,  borderBottom:s, borderLeft:s }} />
    <span aria-hidden style={{ ...b, bottom:0, right:0, borderBottom:s, borderRight:s }} />
  </>);
}

// ─── Hack row ────────────────────────────────────────────────────────────────
function HackRow({ h, idx }) {
  const rowRef = useRef(null), barRef = useRef(null);
  return (
    <div ref={rowRef} className="hack-item"
      onMouseEnter={() => { gsap.to(rowRef.current, { backgroundColor:'rgba(147,51,234,0.05)', duration:.25 }); gsap.to(barRef.current, { scaleY:1, duration:.35, ease:'power2.out' }); }}
      onMouseLeave={() => { gsap.to(rowRef.current, { backgroundColor:'transparent', duration:.25 }); gsap.to(barRef.current, { scaleY:0, duration:.25, ease:'power2.in' }); }}
      style={{ position:'relative', display:'grid', gridTemplateColumns:'2.5rem 1fr auto', gap:'1.5rem 2rem', alignItems:'center', padding:'1.75rem 1.5rem', borderBottom:'1px solid var(--border)', opacity:0, cursor:'default' }}
    >
      <div ref={barRef} style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:'linear-gradient(180deg,var(--vl),var(--v))', transformOrigin:'top', transform:'scaleY(0)' }} />
      <span style={{ fontFamily:'var(--font-m)', fontSize:'.6rem', color:'var(--dim)', letterSpacing:'.2em' }}>{String(idx+1).padStart(2,'0')}</span>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.4rem', flexWrap:'wrap' }}>
          <h3 style={{ fontFamily:'var(--font-d)', fontWeight:700, fontSize:'clamp(.9rem,2vw,1.1rem)', color:'var(--fg)', letterSpacing:'.02em' }}>{h.title}</h3>
          <span className="chip">{h.badge}</span>
        </div>
        <p style={{ color:'var(--muted)', fontSize:'.82rem', lineHeight:1.7, marginBottom:'.6rem', maxWidth:'50ch' }}>{h.desc}</p>
        <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>{h.stack.map(s => <span key={s} className="stag">{s}</span>)}</div>
      </div>
      <span style={{ color:'var(--dim)', fontSize:'1rem' }}>→</span>
    </div>
  );
}

// ─── Plan card ───────────────────────────────────────────────────────────────
function PlanCard({ p }) {
  const cardRef = useRef(null), glowRef = useRef(null);
  return (
    <div ref={cardRef} className="plan-card"
      onMouseMove={e => { const r = cardRef.current.getBoundingClientRect(); gsap.to(glowRef.current, { x:e.clientX-r.left-100, y:e.clientY-r.top-100, opacity:1, duration:.35, ease:'power2.out' }); }}
      onMouseLeave={() => gsap.to(glowRef.current, { opacity:0, duration:.4 })}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.45)'; }}
      onMouseLeaveCapture={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      style={{ position:'relative', overflow:'hidden', padding:'2rem 1.75rem', border:'1px solid var(--border)', background:'var(--surface)', opacity:0, cursor:'default', transition:'border-color .3s' }}
    >
      <div ref={glowRef} aria-hidden style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(147,51,234,0.16) 0%,transparent 70%)', opacity:0, pointerEvents:'none', zIndex:0 }} />
      <Corners />
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.2rem' }}>
          <span style={{ fontFamily:'var(--font-d)', fontSize:'2.8rem', fontWeight:800, color:'rgba(168,85,247,0.09)', lineHeight:1 }}>{p.num}</span>
          <span className="chip">{p.tag}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.45rem', marginBottom:'.55rem' }}>
          <span style={{ color:'var(--vl)', fontSize:'.85rem' }}>{p.icon}</span>
          <h3 style={{ fontFamily:'var(--font-d)', fontWeight:700, fontSize:'1.05rem', color:'var(--fg)', letterSpacing:'.03em' }}>{p.title}</h3>
        </div>
        <p style={{ color:'var(--muted)', fontSize:'.82rem', lineHeight:1.7 }}>{p.desc}</p>
      </div>
    </div>
  );
}

// ─── Section wrapper helpers ──────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="reveal-line" style={{
      height:1, margin:'0 clamp(1.5rem,5vw,5rem)', marginBottom:'clamp(3rem,5vw,4.5rem)',
      transformOrigin:'left', scaleX:0,
      background:'linear-gradient(90deg,transparent,rgba(147,51,234,0.45),transparent)',
    }} />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const { loaderDone } = useLoader();
  const { playSound } = useSound();
  const roleRef = useRef(null);
  const [clock, setClock] = useState('');

  /* live clock */
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`);
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  /* GSAP */
  useEffect(() => {
    if (!loaderDone) return;
    const ctx = gsap.context(() => {

      /* ── Hero ── */
      gsap.fromTo('.fade-up-hero',
        { y:65, opacity:0, filter:'blur(12px)' },
        { y:0, opacity:1, filter:'blur(0px)', duration:2.6, ease:'power3.out', delay:.15 }
      );
      gsap.fromTo('.hero-hud',   { opacity:0 }, { opacity:0.6, duration:.8, stagger:.06, delay:.4 });
      gsap.fromTo('.hero-eyebrow', { opacity:0, x:-15 }, { opacity:1, x:0, duration:.7, ease:'power3.out', delay:.45 });
      gsap.fromTo('.name-char',
        { yPercent:125, opacity:0, rotateX:-45 },
        { yPercent:0, opacity:1, rotateX:0, duration:1, stagger:0.04, ease:'power4.out', delay:.6, transformOrigin:'50% 100%' }
      );
      gsap.delayedCall(1.75, () => gsap.to('.glitch', { skewX:10, duration:.04, yoyo:true, repeat:3, ease:'none' }));

      /* typing */
      const tl = gsap.timeline({ repeat:-1, delay:1.5 });
      roles.forEach(r => {
        tl.to(roleRef.current, { text:r, duration:.85, ease:'none' })
          .to(roleRef.current, { opacity:0, duration:.12, yoyo:true, repeat:1, delay:1 })
          .set(roleRef.current, { text:'', opacity:1 });
      });

      gsap.fromTo('.hero-tagline', { opacity:0, y:14, filter:'blur(3px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:.85, ease:'power3.out', delay:1.18 });
      gsap.fromTo('.hero-cta',     { opacity:0, y:14 }, { opacity:1, y:0, duration:.8, ease:'power3.out', delay:1.38 });
      gsap.fromTo('.scroll-indicator', { opacity:0 }, { opacity:1, duration:1.2, delay:2.3 });
      gsap.to('.scroll-indicator', { y:-7, duration:1.4, repeat:-1, yoyo:true, ease:'sine.inOut', delay:2.3 });

      /* ── Reveal lines ── */
      gsap.utils.toArray('.reveal-line').forEach(el =>
        gsap.fromTo(el, { scaleX:0 }, { scaleX:1, duration:1.6, ease:'power3.inOut', scrollTrigger:{ trigger:el, start:'top 92%' } })
      );

      /* ── Hackathons ── */
      gsap.fromTo('.hack-eyebrow', { opacity:0, x:-10 }, { opacity:1, x:0, duration:.6, scrollTrigger:{ trigger:'.hackathon-section', start:'top 84%' } });
      gsap.fromTo('.hack-heading', { opacity:0, y:36 },  { opacity:1, y:0, duration:.88, ease:'power3.out', scrollTrigger:{ trigger:'.hackathon-section', start:'top 80%' } });
      gsap.fromTo('.hack-sub',     { opacity:0, y:14 },  { opacity:1, y:0, duration:.7,  ease:'power3.out', scrollTrigger:{ trigger:'.hackathon-section', start:'top 78%' } });
      gsap.fromTo('.hack-item',    { x:-28, opacity:0 }, { x:0, opacity:1, stagger:.11, duration:.7, ease:'power3.out', scrollTrigger:{ trigger:'.hack-list', start:'top 87%' } });

      /* ── Plans ── */
      gsap.fromTo('.plans-eyebrow', { opacity:0 },      { opacity:1, duration:.6, scrollTrigger:{ trigger:'.plans-section', start:'top 87%' } });
      gsap.fromTo('.plans-heading', { opacity:0, y:36 }, { opacity:1, y:0, duration:.88, ease:'power3.out', scrollTrigger:{ trigger:'.plans-section', start:'top 83%' } });
      gsap.fromTo('.plan-card', { y:45, opacity:0, rotateX:-10 }, {
        y:0, opacity:1, rotateX:0, stagger:.1, duration:.8, ease:'power3.out',
        scrollTrigger:{ trigger:'.plans-grid', start:'top 87%' }, transformOrigin:'50% 0',
      });
    });
    return () => ctx.revert();
  }, [loaderDone]);

  /* ─────────────────── JSX ─────────────────── */
  return (
    <PageTransition>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bg-transparent" style={{ position:'relative', width:'100%', overflowX:'hidden'}}>

        {/* bg layers */}
        <Particles />
        <div className="dot-grid" />
        <div className="scanlines" />

        {/* ── Ghost Word Background ── */}
        <GhostText 
          words={['DEVELOPER','ARCHITECT','INNOVATOR','CREATOR','ENGINEER','BUILDER']} 
          row2={['DESIGN','SYSTEM','REACT','NODE','GSAP','MOTION','BRUTALIST']}
        />

        {/* ══════════════ HERO ══════════════ */}
        {/*
          paddingTop: '80px' clears a 64–80px fixed navbar.
          Adjust if your navbar is taller/shorter.
        */}
        <section style={{
          position:'relative', minHeight:'100dvh',
          display:'flex',
          overflow:'hidden',
          padding:'120px 0 4rem',
          zIndex:2,
        }}>

          {/* purple radial glow behind content */}
          <div aria-hidden style={{
            position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:'min(1000px,120vw)', height:'min(800px,100vh)', borderRadius:'50%',
            background:'radial-gradient(ellipse,rgba(147,51,234,0.08) 0%,transparent 70%)',
            pointerEvents:'none', zIndex:0,
          }} />

          {/* HUD elements */}
          <div className="hero-hud" style={{
            position:'absolute', top:'6rem', left:'2rem',
            fontFamily:'var(--font-m)', fontSize:'.55rem',
            color:'var(--dim)', letterSpacing:'.2em', lineHeight:1.9, zIndex:10,
          }}>
            <div style={{ opacity: 0.5 }}>TERMINAL // RX-2.0</div>
            <div style={{ color:'var(--vll)' }}>{clock} <span style={{ marginLeft: 8, opacity: 0.35 }}>// EST. 2024</span></div>
          </div>

          <div className="hero-hud" style={{
            position:'absolute', top:'6rem', right:'2rem',
            fontFamily:'var(--font-m)', fontSize:'.55rem',
            color:'var(--dim)', letterSpacing:'.2em', textAlign:'right', lineHeight:1.9, zIndex:10,
          }}>
            <div>SANTOSH <span style={{ color:'var(--vl)' }}>//</span> PORTFOLIO</div>
            <div style={{ opacity: 0.5 }}>STATUS: ACTIVE</div>
          </div>

          <div className="hero-grid">
            {/* Left Side: Text Content */}
            <div className="hero-text-side">
              {/* Personal Greeting with wave.gif */}
              <div className="hero-eyebrow" style={{
                opacity:0, display:'flex', alignItems:'center', gap:'.5rem',
                fontFamily:'var(--font-m)', fontSize:'clamp(.9rem, 1.8vw, 1.15rem)',
                letterSpacing:'.1em', color:'var(--fg)',
                marginBottom:'0.6rem', fontWeight: 400
              }}>
                hey <img src="/wave.gif" alt="👋" style={{ width:32, height:32 }} /> , I' m
              </div>

              {/* NAME with glitch */}
              <h1 className="glitch" data-text="SANTOSH" style={{
                fontFamily:'var(--font-d)', fontWeight:800,
                fontSize:'clamp(2.5rem, 8.5vw, 3.5rem)',
                letterSpacing:'-0.035em', lineHeight:1.05,
                perspective:'1000px', color:'var(--fg)',
                marginBottom: '0.5rem',
              }}>
                {'SANTOSH'.split('').map((ch, i) => (
                  <span key={i} className="name-char" style={{
                    display:'inline-block', willChange:'transform', opacity:0,
                    color: i % 3 === 1 ? 'var(--vl)' : 'var(--fg)',
                    textShadow: i % 3 === 1 ? '0 0 45px rgba(168,85,247,0.35)' : 'none',
                  }}>{ch}</span>
                ))}
              </h1>

              {/* typing role */}
              <div style={{ height:'1.5rem', display:'flex', alignItems:'center', opacity: 0.85 }}>
                <span style={{ fontFamily:'var(--font-m)', fontSize:'clamp(.75rem,2vw,.95rem)', color:'var(--muted)', letterSpacing:'.15em' }}>
                  $ <span ref={roleRef} /><span className="cur">_</span>
                </span>
              </div>

              {/* status badges */}
              <div style={{ display:'flex', gap:'1.2rem', marginTop:'1.8rem', fontFamily:'var(--font-m)', fontSize:'.55rem', letterSpacing:'.25em', color:'var(--dim)', flexWrap:'wrap' }}>
                {[
                  { label:'STATUS: OPEN FOR NEW PROJECTS', clr:'var(--vl)' },
                  { label:'LOC: REMOTE / GLOBE', clr:'rgba(168,85,247,.4)' },
                ].map(({ label, clr }) => (
                  <span key={label} style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:clr, boxShadow:`0 0 10px ${clr}`, display:'inline-block' }} />
                    {label}
                  </span>
                ))}
              </div>

              {/* tagline */}
              <p className="hero-tagline" style={{
                opacity:0, marginTop:'2.2rem',
                fontFamily:'var(--font-m)', fontSize:'clamp(.85rem,2vw,1rem)',
                color:'var(--muted)', lineHeight:1.85, maxWidth:'42ch', letterSpacing:'.03em',
              }}>
                Building exceptionally high-performance and cinematically interactive web experiences with a focus on brutalist minimalism.
              </p>

              {/* CTAs */}
              <div className="hero-cta" style={{ opacity:0, marginTop:'2.8rem', display:'flex', flexWrap:'wrap', gap:'1.2rem' }}>
                <MagneticButton href="/#/projects">PROJECTS_LOG</MagneticButton>
                <MagneticButton
                  onClick={() => {
                    playSound('resumeDownload', 1.0);
                    const a = document.createElement('a');
                    a.href = '/resume.pdf';
                    a.download = 'Santosh_Resume.pdf';
                    a.click();
                  }}
                  style="outline"
                >
                  DOWNLOAD_CV ↓
                </MagneticButton>
              </div>
            </div>

            {/* Right Side: Enhanced Profile Portrait */}
            <div className="hero-image-side">
              <div className="fade-up-hero" style={{
                position: 'relative',
                width: 'min(460px, 34vw)',
                aspectRatio: '5/6',
                zIndex: 1,
                opacity: 0,
              }}>

                {/* Image noise/grain overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', opacity: 0.12, mixBlendMode: 'overlay',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px 150px',
                }} />

                {/* Cyber Brackets / corners for image */}
                <Corners sz={22} clr="var(--vl)" />

                {/* Masks for futuristic integration */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%), linear-gradient(to bottom, transparent 70%, var(--bg) 100%)',
                  zIndex: 5,
                }} />

                <img
                  src="/profile.png"
                  alt="Santosh"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(1) contrast(1.1) brightness(0.8)',
                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    display: 'block',
                  }}
                />

                {/* Pulse Tech Scanline */}
                <div style={{
                  position: 'absolute', top: '15%', left: '-5%', width: '110%', height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--vll), transparent)',
                  boxShadow: '0 0 15px var(--vl)',
                  animation: 'scanning 4s ease-in-out infinite',
                  zIndex: 15,
                }} />
                <style>{`
                  @keyframes scanning {
                    0% { top: 15%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 85%; opacity: 0; }
                  }
                `}</style>
              </div>
            </div>
          </div>

          {/* scroll hint */}
          <div className="scroll-indicator" style={{ opacity:0, position:'absolute', bottom:'2rem', left: '50%', transform: 'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem', pointerEvents:'none', zIndex:10 }}>
            <span style={{ fontFamily:'var(--font-m)', fontSize:'.52rem', letterSpacing:'.4em', color:'var(--dim)', textTransform:'uppercase' }}>Explore</span>
            <span style={{ color:'var(--vl)', fontSize:'.8rem' }}>↓</span>
          </div>
        </section>

        {/* ══════════════ HACKATHONS ══════════════ */}
        <section className="hackathon-section" style={{ position:'relative', zIndex:2, padding:'clamp(4rem,8vw,7rem) 0' }}>
          <SectionDivider />
          <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'0 clamp(1.5rem,4vw,4rem)' }}>

            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:'1rem', marginBottom:'clamp(2rem,4vw,3rem)' }}>
              <div>
                <span className="hack-eyebrow" style={{ opacity:0, display:'block', fontFamily:'var(--font-m)', fontSize:'.6rem', letterSpacing:'.4em', color:'var(--vl)', textTransform:'uppercase', marginBottom:'.6rem' }}>
                  // COMPETITION_LOG
                </span>
                <h2 className="hack-heading" style={{
                  opacity:0, fontFamily:'var(--font-d)', fontWeight:800,
                  fontSize:'clamp(2.2rem,6vw,4.8rem)', letterSpacing:'-.02em', lineHeight:.92,
                  borderBottom:'2px solid', borderImage:'linear-gradient(90deg,var(--v),transparent) 1',
                  paddingBottom:'.3rem',
                }}>HACKATHONS</h2>
              </div>
              <p className="hack-sub" style={{ opacity:0, color:'var(--muted)', fontSize:'.82rem', maxWidth:'28ch', lineHeight:1.75, fontFamily:'var(--font-m)', letterSpacing:'.04em' }}>
                Building fast, failing fast —<br />creating under immense pressure.
              </p>
            </div>

            <div className="hack-list" style={{ border:'1px solid var(--border)' }}>
              {hackathons.map((h, i) => <HackRow key={h.id} h={h} idx={i} />)}
            </div>
          </div>
        </section>

        {/* ══════════════ NEXT PLANS ══════════════ */}
        <section className="plans-section" style={{ position:'relative', zIndex:2, padding:'clamp(4rem,8vw,7rem) 0' }}>
          <SectionDivider />
          <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'0 clamp(1.5rem,4vw,4rem)' }}>

            <div style={{ textAlign:'center', marginBottom:'clamp(2.5rem,5vw,4rem)' }}>
              <span className="plans-eyebrow" style={{ opacity:0, display:'block', fontFamily:'var(--font-m)', fontSize:'.6rem', letterSpacing:'.4em', color:'var(--vl)', textTransform:'uppercase', marginBottom:'.65rem' }}>
                // ROADMAP_2026
              </span>
              <h2 className="plans-heading" style={{ opacity:0, fontFamily:'var(--font-d)', fontWeight:800, fontSize:'clamp(2.2rem,6.5vw,5.2rem)', letterSpacing:'-.02em', lineHeight:.92 }}>
                NEXT{' '}<span className="outline-word">PLANS</span>
              </h2>
            </div>

            <div className="plans-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',
              gap:'1px', background:'var(--border)',
            }}>
              {plans.map(p => <PlanCard key={p.num} p={p} />)}
            </div>

            {/* CTA */}
            <div style={{ marginTop:'clamp(3rem,6vw,5rem)', display:'flex', flexDirection:'column', alignItems:'center', gap:'.85rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.85rem' }}>
                <div style={{ width:36, height:1, background:'rgba(147,51,234,0.3)' }} />
                <span style={{ fontFamily:'var(--font-m)', fontSize:'.58rem', letterSpacing:'.3em', color:'var(--dim)' }}>LET'S BUILD TOGETHER</span>
                <div style={{ width:36, height:1, background:'rgba(147,51,234,0.3)' }} />
              </div>
              <MagneticButton href="/#/contact" style="outline">INITIATE_CONTACT →</MagneticButton>
            </div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer style={{
          position:'relative', zIndex:2,
          borderTop:'1px solid var(--border)',
          padding:'1.2rem clamp(1.5rem,4vw,4rem)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexWrap:'wrap', gap:'.5rem',
        }}>
          <span style={{ fontFamily:'var(--font-m)', fontSize:'.56rem', color:'var(--dim)', letterSpacing:'.18em' }}>
            © {new Date().getFullYear()} SANTOSH
          </span>
          <span style={{ fontFamily:'var(--font-m)', fontSize:'.56rem', color:'var(--dim)', letterSpacing:'.18em' }}>
            BUILD <span style={{ color:'var(--vl)' }}>v3.0.1</span>
          </span>
        </footer>

      </div>
    </PageTransition>
  );
}