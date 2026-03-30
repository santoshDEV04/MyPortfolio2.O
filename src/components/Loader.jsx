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

    const TOTAL_MS = 3200;
    const progressObject = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Phase 1 — content vanishes
        gsap.to(contentRef.current, {
          opacity  : 0,
          y        : 8,
          duration : 0.22,
          ease     : 'power2.in',
          onComplete: () => {
            // Phase 2 — empty capsule zooms to fill screen
            gsap.to(capsuleRef.current, {
              scale    : 60,
              duration : 0.85,
              ease     : 'power3.in',
              delay    : 0.06,
              onComplete: () => {
                // Phase 3 — fade white shell out
                gsap.to(containerRef.current, {
                  opacity  : 0,
                  duration : 0.2,
                  ease     : 'power1.out',
                  onComplete: () => {
                    setLoaderDone(true);
                    setMounted(false);
                  },
                });
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
      {/* ── Outer shell: white with violet-tinted dot grid ── */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: '#ffffff' }}
        aria-label="Loading"
        role="status"
      >
        {/* Violet-tinted dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${V.ghost} 1px, transparent 1px)`,
            backgroundSize : '28px 28px',
          }}
        />

        {/* Soft violet radial bloom behind the capsule */}
        <div
          className="absolute pointer-events-none"
          style={{
            width     : '640px',
            height    : '640px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          }}
        />

        {/* ── Black capsule with violet inner wash ── */}
        <div
          ref={capsuleRef}
          className="relative flex flex-col items-center justify-center"
          style={{
            background     : '#09030f',   // near-black with violet undertone
            borderRadius   : '500px',
            width          : 'min(520px, 85vw)',
            paddingTop     : 'clamp(2.5rem, 5vw, 4rem)',
            paddingBottom  : 'clamp(2.5rem, 5vw, 4rem)',
            paddingLeft    : 'clamp(2rem, 4vw, 3rem)',
            paddingRight   : 'clamp(2rem, 4vw, 3rem)',
            transformOrigin: 'center center',
            willChange     : 'transform',
            // Violet border ring
            outline        : `1px solid rgba(124,58,237,0.22)`,
            outlineOffset  : '-1px',
          }}
        >
          {/* Subtle violet inner radial wash at top */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height    : '60%',
              borderRadius: '500px 500px 0 0',
              background: 'radial-gradient(ellipse at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Violet scan line */}
          <div
            className="absolute left-0 right-0 h-px pointer-events-none z-[3]"
            style={{
              background: `linear-gradient(90deg, transparent, ${V.bright}, transparent)`,
              animation : 'scanDown 2.4s linear infinite',
              opacity   : 0.6,
            }}
          />

          {/* Violet corner marks */}
          {[
            'top-[14px] left-[24px] border-t border-l',
            'top-[14px] right-[24px] border-t border-r',
            'bottom-[14px] left-[24px] border-b border-l',
            'bottom-[14px] right-[24px] border-b border-r',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 z-10 ${cls}`}
              style={{ borderColor: V.ghost, borderWidth: 1 }}
            />
          ))}

          {/* ── Inner content — fades out before capsule zooms ── */}
          <div
            ref={contentRef}
            className="flex flex-col items-center z-[5]"
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Giant counter — white base with violet % */}
            <div
              className="select-none text-center"
              style={{
                fontFamily   : "'Space Grotesk', sans-serif",
                fontSize     : 'clamp(5.5rem, 18vw, 9rem)',
                fontWeight   : 900,
                letterSpacing: '-0.06em',
                lineHeight   : 0.9,
                color        : '#ffffff',
              }}
            >
              <span ref={countRef}>00</span>
              <span
                style={{
                  fontSize     : '0.28em',
                  verticalAlign: 'super',
                  letterSpacing: 0,
                  color        : V.bright,
                  opacity      : 0.85,
                }}
              >
                %
              </span>
            </div>

            {/* Violet progress bar */}
            <div
              className="relative mt-8 overflow-hidden"
              style={{
                width     : 'min(320px, 65vw)',
                height    : 2,
                background: 'rgba(124,58,237,0.15)',
                borderRadius: 2,
              }}
            >
              <div
                ref={barFillRef}
                className="absolute inset-0 origin-left"
                style={{
                  background: `linear-gradient(90deg, ${V.mid}, ${V.bright})`,
                  boxShadow : V.barGlow,
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Status text — violet tint */}
            <div
              ref={textRef}
              className="uppercase mt-6"
              style={{
                fontFamily   : "'Space Mono', monospace",
                fontSize     : 'clamp(7px, 1.8vw, 9px)',
                letterSpacing: '0.45em',
                color        : 'rgba(167,139,250,0.55)',   // violet-300 at low opacity
                animation    : 'fadeSlideUp 0.25s ease forwards',
              }}
            >
              {TEXTS[0]}
            </div>
          </div>
        </div>

        {/* Version tag */}
        <div
          className="absolute bottom-5 z-10 uppercase"
          style={{
            fontFamily   : "'Space Mono', monospace",
            fontSize     : 8,
            letterSpacing: '0.3em',
            color        : 'rgba(124,58,237,0.25)',
          }}
        >
          v1.0.0 &nbsp;·&nbsp; Portfolio
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