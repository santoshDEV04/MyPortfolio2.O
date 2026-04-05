import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useLoader } from '../context/LoaderContext';
import { useSound } from '../context/SoundContext';

const TEXTS = [
  'INITIALIZING SYSTEM',
  'LOADING ASSETS',
  'ESTABLISHING CONNECTION',
  'DECRYPTING INTERFACE',
  'READY',
];

// Violet palette
const V = {
  bright  : '#7C3AED',   // vivid violet — bar, scan line, counter tint
  mid     : '#6D28D9',   // capsule inner glow ring
  soft    : '#EDE9FE',   // dot grid tint on white bg
  pale    : 'rgba(124,58,237,0.12)',  // subtle capsule inner bg wash
  ghost   : 'rgba(124,58,237,0.35)', // corner marks & scan line
  barGlow : '0 0 18px rgba(124,58,237,0.9), 0 0 48px rgba(109,40,217,0.5)',
};

export default function Loader() {
  const containerRef = useRef(null);
  const capsuleRef   = useRef(null);
  const contentRef   = useRef(null);
  const barFillRef   = useRef(null);
  const countRef     = useRef(null);
  const textRef      = useRef(null);

  const { loaderDone, setLoaderDone } = useLoader();
  const [mounted, setMounted]         = useState(true);
  const { playSound }                 = useSound();

  useEffect(() => {
    if (loaderDone) return;

    playSound('loading', 1.0);

    const TOTAL_MS = 1800;
    const progressObject = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Phase 1 — content zooms past the camera
        gsap.to(contentRef.current, {
          opacity  : 0,
          scale    : 8,
          duration : 0.45,
          ease     : 'power4.in',
          onComplete: () => {
            // Phase 2 — pure slit wipe out
            gsap.to(containerRef.current, {
              clipPath : 'inset(50% 0% 50% 0%)',
              duration : 0.5,
              ease     : 'expo.inOut',
              onComplete: () => {
                setLoaderDone(true);
                setMounted(false);
              },
            });
          },
        });
      },
    });

    tl.to(progressObject, {
      value: 100,
      duration: TOTAL_MS / 1000,
      ease: 'power1.inOut',
      onUpdate: () => {
        const val = Math.round(progressObject.value);
        if (countRef.current) {
          countRef.current.textContent = String(val).padStart(2, '0');
        }

        const p   = val / 100;
        const idx = p < 0.20 ? 0 : p < 0.45 ? 1 : p < 0.65 ? 2 : p < 0.85 ? 3 : 4;
        
        if (val === 100) {
          gsap.to('.brand-flash', { opacity: 1, duration: 0.2, yoyo: true, repeat: 1 });
        }

        if (textRef.current && textRef.current.innerText !== TEXTS[idx]) {
          textRef.current.innerText       = TEXTS[idx];
          textRef.current.style.animation = 'none';
          void textRef.current.offsetWidth;
          textRef.current.style.animation = 'fadeSlideUp 0.25s ease forwards';
        }
      },
    }, 0);

    tl.fromTo(
      barFillRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: TOTAL_MS / 1000, ease: 'power1.inOut', transformOrigin: 'left' },
      0
    );

    return () => { tl.kill(); };
  }, [loaderDone, setLoaderDone, playSound]);

  if (!mounted && loaderDone) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--bg)', clipPath: 'inset(0% 0% 0% 0%)' }}
        aria-label="Loading"
        role="status"
      >
        {/* Minimal Progress Bar at very top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--border)]">
          <div
            ref={barFillRef}
            className="h-full bg-[var(--fg)] origin-left"
            style={{ scaleX: 0 }}
          />
        </div>

        {/* ── Inner content ── */}
        <div
          ref={contentRef}
          className="flex flex-col items-center justify-center pointer-events-none"
          style={{ willChange: 'opacity, transform, scale' }}
        >
          {/* Giant counter */}
          <div
            className="select-none text-center font-heading"
            style={{
              fontSize     : 'clamp(5.5rem, 18vw, 15rem)',
              fontWeight   : 900,
              letterSpacing: '-0.02em',
              lineHeight   : 0.85,
              color        : 'var(--fg)',
            }}
          >
            <span ref={countRef}>00</span>
            <span style={{ fontSize: '0.3em', color: 'var(--vl)', verticalAlign: 'super' }}>%</span>
          </div>

          {/* Status text */}
          <div
            ref={textRef}
            className="uppercase mt-6"
            style={{
              fontFamily   : "'Space Mono', monospace",
              fontSize     : 'clamp(9px, 1.5vw, 11px)',
              letterSpacing: '0.4em',
              color        : 'var(--muted)',
              animation    : 'fadeSlideUp 0.25s ease forwards',
            }}
          >
            {TEXTS[0]}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanDown {
          0%   { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </>
  );
}