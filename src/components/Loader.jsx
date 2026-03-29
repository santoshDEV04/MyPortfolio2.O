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

export default function Loader() {
  const containerRef = useRef(null);
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
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          delay: 0.5,
          onComplete: () => {
            setLoaderDone(true);
            setMounted(false);
          },
        });
      }
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
        
        // Update text based on progress safely
        const p = val / 100;
        const idx = p < 0.20 ? 0 : p < 0.45 ? 1 : p < 0.65 ? 2 : p < 0.85 ? 3 : 4;
        if (textRef.current && textRef.current.innerText !== TEXTS[idx]) {
          textRef.current.innerText = TEXTS[idx];
          // re-trigger animation hack
          textRef.current.style.animation = 'none';
          void textRef.current.offsetWidth;
          textRef.current.style.animation = 'fadeSlideUp 0.25s ease forwards';
        }
      }
    }, 0);

    tl.fromTo(
      barFillRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: TOTAL_MS / 1000, ease: 'power1.inOut', transformOrigin: 'left' },
      0
    );

    return () => {
      tl.kill();
    };
  }, [loaderDone, setLoaderDone, playSound]);

  if (!mounted && loaderDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#000', color: '#fff' }}
      aria-label="Loading"
      role="status"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation : 'scanDown 2.4s linear infinite',
        }}
      />

      {/* Corner marks */}
      {[
        'top-[16px] left-[16px] border-t border-l',
        'top-[16px] right-[16px] border-t border-r',
        'bottom-[16px] left-[16px] border-b border-l',
        'bottom-[16px] right-[16px] border-b border-r',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-6 h-6 z-10 border-white/25 ${cls}`} style={{ borderWidth: 1.5 }} />
      ))}

      {/* Giant counter */}
      <div
        className="relative z-[5] select-none text-center"
        style={{
          fontFamily   : "'Space Grotesk', sans-serif",
          fontSize     : 'clamp(7rem, 22vw, 12rem)',
          fontWeight   : 900,
          letterSpacing: '-0.06em',
          lineHeight   : 0.9,
        }}
      >
        <span ref={countRef}>00</span>
        <span style={{ fontSize: '0.28em', verticalAlign: 'super', letterSpacing: 0, opacity: 0.5 }}>%</span>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-[5] mt-9 overflow-hidden"
        style={{ width: 'min(480px, 80vw)', height: 2, background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          ref={barFillRef}
          className="absolute inset-0 origin-left"
          style={{
            background: '#fff',
            boxShadow : '0 0 14px #fff, 0 0 36px rgba(255,255,255,0.45)',
          }}
        />
      </div>

      {/* Status text */}
      <div
        ref={textRef}
        className="relative z-[5] uppercase mt-7"
        style={{
          fontFamily   : "'Space Mono', monospace",
          fontSize     : 'clamp(8px, 2vw, 10px)',
          letterSpacing: '0.45em',
          color        : 'rgba(255,255,255,0.28)',
          animation    : 'fadeSlideUp 0.25s ease forwards',
        }}
      >
        {TEXTS[0]}
      </div>

      {/* Version */}
      <div
        className="absolute bottom-4 z-10 uppercase"
        style={{
          fontFamily   : "'Space Mono', monospace",
          fontSize     : 8,
          letterSpacing: '0.3em',
          color        : 'rgba(255,255,255,0.1)',
        }}
      >
        v1.0.0 &nbsp;·&nbsp; Portfolio
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
    </div>
  );
}