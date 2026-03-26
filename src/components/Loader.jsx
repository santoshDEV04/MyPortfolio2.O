import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useLoader } from '../context/LoaderContext';

const TEXTS = [
  'INITIALIZING SYSTEM',
  'LOADING ASSETS',
  'ESTABLISHING CONNECTION',
  'DECRYPTING INTERFACE',
  'READY',
];

export default function Loader() {
  const containerRef   = useRef(null);
  const overlayRef     = useRef(null);
  const countRef       = useRef(null);
  const textRef        = useRef(null);
  const barFillRef     = useRef(null);
  const glowRef        = useRef(null);
  const monogramRef    = useRef(null);
  const gridRef        = useRef(null);

  const { loaderDone, setLoaderDone } = useLoader();
  const [mounted, setMounted]         = useState(true);
  const [textIdx, setTextIdx]         = useState(0);
  const [count, setCount]             = useState(0);

  useEffect(() => {
    if (loaderDone) return;

    // ── Ticker: drive the counter 0 → 100 over ~2.8 s ──
    const totalMs = 2800;
    const start   = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / totalMs, 1);
      const v = Math.round(p * 100);
      setCount(v);

      // Swap status text at 4 breakpoints
      const idx = p < 0.2 ? 0 : p < 0.45 ? 1 : p < 0.65 ? 2 : p < 0.85 ? 3 : 4;
      setTextIdx(idx);

      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ── GSAP master timeline ──
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          cancelAnimationFrame(raf);
          setCount(100);
          setTextIdx(4);
          // Slide the whole loader up and out
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            delay: 0.35,
            onComplete: () => {
              setLoaderDone(true);
              setMounted(false);
            },
          });
        },
      });

      // 1. Grid lines fade in
      tl.fromTo(gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      // 2. Monogram path draws itself
      tl.fromTo('.loader-path',
        { strokeDasharray: 260, strokeDashoffset: 260 },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
        '-=0.2'
      );

      // 3. Monogram glow pulses in
      tl.fromTo(glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.8'
      );

      // 4. Progress bar fills (synced with counter duration)
      tl.fromTo(barFillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.8, ease: 'power1.inOut', transformOrigin: 'left' },
        0
      );

      // 5. Subtle flicker on monogram near end
      tl.to(monogramRef.current,
        { opacity: 0, duration: 0.04, yoyo: true, repeat: 5, ease: 'none' },
        2.5
      );

    }, containerRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
    };
  }, [loaderDone, setLoaderDone]);

  if (!mounted && loaderDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg text-fg overflow-hidden"
      aria-label="Loading"
      role="status"
    >
      {/* ── Subtle grid overlay ── */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Corner marks ── */}
      {[
        'top-6 left-6 border-t border-l',
        'top-6 right-6 border-t border-r',
        'bottom-6 left-6 border-b border-l',
        'bottom-6 right-6 border-b border-r',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-5 h-5 ${cls} border-white/20`} />
      ))}

      {/* ── Glow ── */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
        style={{
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.12,
        }}
      />

      {/* ── Monogram SVG ── */}
      <div ref={monogramRef} className="relative mb-10">
        <svg
          width="72"
          height="72"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* A / triangle mark */}
          <path
            className="loader-path"
            d="M18 82 L50 18 L82 82 M30 60 L70 60"
            stroke="var(--accent)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Accent dot */}
        <span
          className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent"
          style={{ boxShadow: '0 0 8px var(--accent)' }}
        />
      </div>

      {/* ── Counter ── */}
      <div
        ref={countRef}
        className="font-heading font-black leading-none mb-6 tabular-nums"
        style={{
          fontSize: 'clamp(4rem, 14vw, 8rem)',
          color: 'var(--fg)',
          letterSpacing: '-0.04em',
        }}
      >
        {String(count).padStart(2, '0')}
        <span className="text-accent" style={{ fontSize: '0.45em' }}>%</span>
      </div>

      {/* ── Progress bar ── */}
      <div className="relative w-[min(320px,70vw)] h-px bg-white/10 mb-6 overflow-visible">
        {/* Track glow */}
        <div className="absolute inset-0 bg-white/5 blur-sm" />
        {/* Fill */}
        <div
          ref={barFillRef}
          className="absolute inset-0 origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--accent), rgba(255,255,255,0.9))',
            boxShadow: '0 0 12px var(--accent), 0 0 30px var(--accent)',
          }}
        />
        {/* Tip dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
          style={{
            right: 0,
            boxShadow: '0 0 8px #fff',
            // follows bar fill via CSS — approximate with right:0 trick
          }}
        />
      </div>

      {/* ── Status text ── */}
      <div
        ref={textRef}
        key={textIdx}
        className="font-mono text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-white/40"
        style={{ animation: 'fadeSlideUp 0.25s ease forwards' }}
      >
        {TEXTS[textIdx]}
      </div>

      {/* ── Bottom version tag ── */}
      <div className="absolute bottom-7 font-mono text-[8px] tracking-[0.3em] text-white/15 uppercase">
        v1.0.0 &nbsp;·&nbsp; Portfolio
      </div>

      {/* Inline keyframe */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}